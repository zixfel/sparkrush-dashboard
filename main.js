// SparkRush Main Application Controller
class SparkRushApp {
    constructor() {
        this.initialized = false;
        this.components = {};
        this.init();
    }

    async init() {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup navigation
            this.setupNavigation();
            
            // Setup smooth scrolling
            this.setupSmoothScrolling();
            
            // Setup mobile menu
            this.setupMobileMenu();
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Initialize app state
            this.initializeAppState();
            
            // Hide loading state
            this.hideLoadingState();
            
            this.initialized = true;
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('Failed to initialize SparkRush:', error);
            this.showErrorState(error.message);
        }
    }

    async initializeComponents() {
        // Wait for all component managers to be available
        const componentsLoaded = await this.waitForComponents([
            'walletManager',
            'dashboardManager', 
            'tokenScanner',
            'governanceManager',
            'scenarioManager',
            'analyticsManager'
        ]);

        // Store references (use fallback if component not loaded)
        this.components = {
            wallet: window.walletManager || null,
            dashboard: window.dashboardManager || null,
            scanner: window.tokenScanner || null,
            governance: window.governanceManager || null,
            scenarios: window.scenarioManager || null,
            analytics: window.analyticsManager || null
        };

        // Filter out null components
        this.components = Object.fromEntries(
            Object.entries(this.components).filter(([key, value]) => value !== null)
        );

        console.log('Initialized components:', Object.keys(this.components));

        // Setup inter-component communication
        this.setupComponentCommunication();
    }

    async waitForComponents(componentNames, maxWait = 15000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWait) {
            const allAvailable = componentNames.every(name => window[name]);
            if (allAvailable) {
                console.log('Components loaded:', componentNames);
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100)); // Faster polling
        }
        
        console.warn('Some components took longer to load, continuing anyway');
        return false; // Don't throw error, just continue
    }

    setupComponentCommunication() {
        // Wallet connection events
        if (this.components.wallet) {
            this.components.wallet.onWalletConnected = (address, walletType) => {
                this.handleWalletConnected(address, walletType);
            };
            
            this.components.wallet.onWalletDisconnected = () => {
                this.handleWalletDisconnected();
            };
        }

        // Scanner events
        if (this.components.scanner) {
            this.components.scanner.onTokenAnalyzed = (tokenData) => {
                this.handleTokenAnalyzed(tokenData);
            };
        }

        // Governance events
        if (this.components.governance) {
            this.components.governance.onVoteCast = (proposalId, vote) => {
                this.handleVoteCast(proposalId, vote);
            };
        }
    }

    setupNavigation() {
        // Navigation link clicks
        document.querySelectorAll('.nav-link, a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });

        // Update active navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = 80; // Account for fixed navigation
            const elementPosition = section.offsetTop;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL without page reload
            history.pushState(null, null, `#${sectionId}`);
        }
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-white', 'active');
            link.classList.add('text-gray-300');
            
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.remove('text-gray-300');
                link.classList.add('text-white', 'active');
            }
        });
    }

    setupSmoothScrolling() {
        // Handle hash navigation on page load
        if (window.location.hash) {
            setTimeout(() => {
                const targetId = window.location.hash.substring(1);
                this.navigateToSection(targetId);
            }, 500);
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });

            // Close mobile menu when clicking nav links
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusTokenScanner();
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }

            // Number keys for quick navigation (1-6 for sections)
            if (e.altKey && e.key >= '1' && e.key <= '6') {
                e.preventDefault();
                const sections = ['dashboard', 'scanner', 'scenarios', 'governance', 'analytics'];
                const sectionIndex = parseInt(e.key) - 1;
                if (sections[sectionIndex]) {
                    this.navigateToSection(sections[sectionIndex]);
                }
            }
        });
    }

    focusTokenScanner() {
        const scannerInput = document.getElementById('scanner-input');
        if (scannerInput) {
            this.navigateToSection('scanner');
            setTimeout(() => {
                scannerInput.focus();
            }, 500);
        }
    }

    closeAllModals() {
        // Close wallet modal
        const walletModal = document.getElementById('wallet-modal');
        if (walletModal && !walletModal.classList.contains('hidden')) {
            this.components.wallet?.hideWalletModal();
        }

        // Close scenario modal
        const scenarioModal = document.getElementById('scenario-modal');
        if (scenarioModal && !scenarioModal.classList.contains('hidden')) {
            this.components.scenarios?.hideScenario();
        }

        // Close any other modals
        document.querySelectorAll('.fixed.inset-0').forEach(modal => {
            if (modal.id !== 'background-animation' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }

    initializeAppState() {
        // Load user preferences
        this.loadUserPreferences();
        
        // Initialize tour state
        this.checkFirstVisit();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Initialize search functionality
        this.setupGlobalSearch();
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('sparkrush_preferences') || '{}');
        
        // Apply dark mode preference (already default)
        if (preferences.theme) {
            document.body.setAttribute('data-theme', preferences.theme);
        }
        
        // Apply other preferences
        if (preferences.animations === false) {
            document.body.classList.add('no-animations');
        }
    }

    checkFirstVisit() {
        const hasVisited = localStorage.getItem('sparkrush_visited');
        if (!hasVisited) {
            localStorage.setItem('sparkrush_visited', 'true');
            setTimeout(() => {
                this.showOnboardingTour();
            }, 2000);
        }
    }

    showOnboardingTour() {
        const tourSteps = [
            {
                element: '#connect-wallet-btn',
                title: 'Connect Your Wallet',
                content: 'Start by connecting your crypto wallet to access all features'
            },
            {
                element: '#scanner',
                title: 'Token Scanner',
                content: 'Analyze any token contract for security risks and community verification'
            },
            {
                element: '#scenarios',
                title: 'Interactive Scenarios',
                content: 'Experience real-world scam situations and learn how SparkRush protects you'
            },
            {
                element: '#governance',
                title: 'Community Governance',
                content: 'Participate in decentralized governance by voting on proposals'
            }
        ];

        this.showTourStep(tourSteps, 0);
    }

    showTourStep(steps, currentIndex) {
        if (currentIndex >= steps.length) return;
        
        const step = steps[currentIndex];
        const element = document.querySelector(step.element);
        
        if (element) {
            const tooltip = this.createTooltip(step.title, step.content, currentIndex, steps.length);
            this.positionTooltip(tooltip, element);
            
            // Highlight element
            element.classList.add('tour-highlight');
            
            // Setup next/close handlers
            tooltip.querySelector('.tour-next').onclick = () => {
                element.classList.remove('tour-highlight');
                tooltip.remove();
                this.showTourStep(steps, currentIndex + 1);
            };
            
            tooltip.querySelector('.tour-close').onclick = () => {
                element.classList.remove('tour-highlight');
                tooltip.remove();
            };
        }
    }

    createTooltip(title, content, current, total) {
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-sm shadow-xl';
        tooltip.innerHTML = `
            <div class="mb-2">
                <h4 class="font-semibold text-white">${title}</h4>
                <p class="text-sm text-gray-300 mt-1">${content}</p>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">${current + 1} of ${total}</span>
                <div class="space-x-2">
                    <button class="tour-close text-xs text-gray-400 hover:text-white">Skip</button>
                    <button class="tour-next px-3 py-1 bg-primary rounded text-xs text-white hover:bg-primary/80">
                        ${current === total - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        return tooltip;
    }

    positionTooltip(tooltip, element) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Position below element by default
        let top = rect.bottom + 10;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        
        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top + tooltipRect.height > window.innerHeight - 10) {
            top = rect.top - tooltipRect.height - 10;
        }
        
        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
    }

    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('SparkRush Performance:', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }
        });

        // Monitor component initialization times
        this.componentInitTimes = {};
        Object.keys(this.components).forEach(name => {
            if (this.components[name]) {
                this.componentInitTimes[name] = performance.now();
            }
        });
    }

    setupGlobalSearch() {
        // Create global search functionality
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showGlobalSearch();
            }
        });
    }

    showGlobalSearch() {
        // Implementation for global search across all features
        const searchModal = document.createElement('div');
        searchModal.className = 'fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm';
        searchModal.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700">
                <div class="mb-4">
                    <input type="text" id="global-search-input" placeholder="Search tokens, scenarios, proposals..." 
                           class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary">
                </div>
                <div id="global-search-results" class="max-h-96 overflow-y-auto">
                    <div class="text-center text-gray-400 py-8">
                        Start typing to search...
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(searchModal);
        
        const searchInput = searchModal.querySelector('#global-search-input');
        searchInput.focus();

        // Close on escape or click outside
        const closeSearch = () => searchModal.remove();
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) closeSearch();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
        });

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performGlobalSearch(e.target.value);
            }, 300);
        });
    }

    performGlobalSearch(query) {
        if (!query.trim()) {
            document.getElementById('global-search-results').innerHTML = `
                <div class="text-center text-gray-400 py-8">Start typing to search...</div>
            `;
            return;
        }

        // Search across different components
        const results = {
            tokens: this.searchTokens(query),
            scenarios: this.searchScenarios(query),
            proposals: this.searchProposals(query)
        };

        this.displaySearchResults(results);
    }

    searchTokens(query) {
        // Search in scanner history and detected tokens
        const scanHistory = this.components.scanner?.getScanHistory() || [];
        const detectedTokens = this.components.dashboard?.getDetectedTokens() || [];
        
        return [...scanHistory, ...detectedTokens].filter(token => 
            token.name?.toLowerCase().includes(query.toLowerCase()) ||
            token.symbol?.toLowerCase().includes(query.toLowerCase()) ||
            token.contract?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    searchScenarios(query) {
        // Search scenarios
        return Object.values(this.components.scenarios?.scenarios || {}).filter(scenario =>
            scenario.title.toLowerCase().includes(query.toLowerCase()) ||
            scenario.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);
    }

    searchProposals(query) {
        // Search governance proposals
        return (this.components.governance?.proposals || []).filter(proposal =>
            proposal.title.toLowerCase().includes(query.toLowerCase()) ||
            proposal.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('global-search-results');
        const hasResults = Object.values(results).some(arr => arr.length > 0);
        
        if (!hasResults) {
            resultsContainer.innerHTML = `
                <div class="text-center text-gray-400 py-8">No results found</div>
            `;
            return;
        }

        let html = '';
        
        if (results.tokens.length > 0) {
            html += `
                <div class="mb-4">
                    <h4 class="font-medium text-gray-300 mb-2">Tokens</h4>
                    ${results.tokens.map(token => `
                        <div class="p-3 bg-gray-700/30 rounded-lg mb-2 hover:bg-gray-700/50 cursor-pointer">
                            <div class="font-medium">${token.name || token.symbol}</div>
                            <div class="text-sm text-gray-400 font-mono">${token.contract}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        if (results.scenarios.length > 0) {
            html += `
                <div class="mb-4">
                    <h4 class="font-medium text-gray-300 mb-2">Scenarios</h4>
                    ${results.scenarios.map(scenario => `
                        <div class="p-3 bg-gray-700/30 rounded-lg mb-2 hover:bg-gray-700/50 cursor-pointer" onclick="window.scenarioManager.showScenario('${scenario.id}')">
                            <div class="font-medium">${scenario.title}</div>
                            <div class="text-sm text-gray-400">${scenario.description}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        if (results.proposals.length > 0) {
            html += `
                <div class="mb-4">
                    <h4 class="font-medium text-gray-300 mb-2">Proposals</h4>
                    ${results.proposals.map(proposal => `
                        <div class="p-3 bg-gray-700/30 rounded-lg mb-2 hover:bg-gray-700/50 cursor-pointer" onclick="document.querySelector('#global-search-results').closest('.fixed').remove(); window.location.hash = 'governance'">
                            <div class="font-medium">${proposal.title}</div>
                            <div class="text-sm text-gray-400">${proposal.type}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        resultsContainer.innerHTML = html;
    }

    // Event handlers for component communication
    handleWalletConnected(address, walletType) {
        console.log(`Wallet connected: ${walletType} - ${address}`);
        
        // Update governance voting power
        if (this.components.governance) {
            this.components.governance.updateVotingPowerDisplay();
        }
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('walletConnected', {
            detail: { address, walletType }
        }));
    }

    handleWalletDisconnected() {
        console.log('Wallet disconnected');
        
        // Reset governance state
        if (this.components.governance) {
            this.components.governance.updateVotingPowerDisplay();
        }
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('walletDisconnected'));
    }

    handleTokenAnalyzed(tokenData) {
        console.log('Token analyzed:', tokenData);
        
        // Could trigger dashboard updates or notifications
        if (tokenData.aiAnalysis.riskLevel === 'high') {
            this.components.wallet?.showNotification(
                `High risk token detected: ${tokenData.name}`, 
                'warning'
            );
        }
    }

    handleVoteCast(proposalId, vote) {
        console.log(`Vote cast: ${proposalId} - ${vote}`);
        
        // Could trigger analytics updates or achievements
        this.components.wallet?.showNotification(
            `Vote "${vote}" cast successfully!`, 
            'success'
        );
    }

    showLoadingState() {
        // Minimal loading state for faster perceived performance
        const loader = document.createElement('div');
        loader.id = 'app-loader';
        loader.className = 'fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm';
        loader.innerHTML = `
            <div class="text-center">
                <div class="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-3 animate-spin">
                    <i class="fas fa-bolt text-white text-lg"></i>
                </div>
                <div class="text-lg font-semibold">SparkRush</div>
                <div class="text-gray-400 text-sm">Initializing...</div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoadingState() {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => {
                loader.remove();
            }, 300); // Faster fade out
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.components.wallet?.showNotification(
                'Welcome to SparkRush! Your AI-powered meme coin protection is now active.',
                'success'
            );
        }, 1000);
    }

    showErrorState(errorMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-dark p-4';
        errorDiv.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-center max-w-md">
                <i class="fas fa-exclamation-triangle text-red-400 text-3xl mb-4"></i>
                <h3 class="text-xl font-semibold text-red-400 mb-2">Initialization Failed</h3>
                <p class="text-gray-300 mb-4">${errorMessage}</p>
                <button onclick="location.reload()" class="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg text-white">
                    Retry
                </button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    // Public API methods
    getAppState() {
        return {
            initialized: this.initialized,
            components: Object.keys(this.components),
            walletConnected: !!this.components.wallet?.userAddress,
            currentSection: window.location.hash.substring(1) || 'dashboard'
        };
    }

    exportAppData() {
        const data = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            walletInfo: this.components.wallet?.userAddress ? {
                address: this.components.wallet.userAddress,
                type: this.components.wallet.connectedWallet
            } : null,
            scanHistory: this.components.scanner?.getScanHistory() || [],
            votingHistory: this.components.governance?.getVotingHistory() || [],
            scenarioStats: this.components.scenarios?.getScenarioStats() || {},
            analytics: this.components.analytics?.generateAnalyticsSummary() || {}
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `sparkrush-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}

// Initialize SparkRush App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sparkRushApp = new SparkRushApp();
});

// Global utility functions
window.SparkRushUtils = {
    formatAddress: (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
    
    formatNumber: (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    getTimeAgo: (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        if (diffMins > 0) return `${diffMins}m ago`;
        return 'Just now';
    },
    
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            window.walletManager?.showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            window.walletManager?.showNotification('Failed to copy to clipboard', 'error');
        }
    }
};