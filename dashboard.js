// SparkRush Dashboard - AI Detection & Real-time Monitoring
// Note: DashboardManager is now lazily initialized for performance
class DashboardManager {
    constructor() {
        this.isMonitoring = false;
        this.liveFeedInterval = null;
        this.riskChart = null;
        this.detectedTokens = [];
        this.riskLevels = { high: 0, medium: 0, low: 0 };
        this.notificationsEnabled = localStorage.getItem('notifications_enabled') !== 'false';
        this.maxNotifications = 3; // Reduced for better UX
        this.activeNotifications = [];
        this.pageLoaded = false;
        
        // Optimized initialization for faster loading
        setTimeout(() => {
            this.pageLoaded = true;
            this.initializeDashboard();
            this.startRealTimeMonitoring();
            this.setupNotificationToggle();
        }, 500); // Reduced delay
    }

    initializeDashboard() {
        this.initializeRiskChart();
        this.populateInitialData();
        this.startLiveFeed();
        this.setupDateFilter();
        this.updateTodayStats();
        
        // Start real-time updates immediately
        console.log('Starting dashboard with real-time feed...');
        this.isMonitoring = true;
    }

    setupDateFilter() {
        const dateFilter = document.getElementById('risk-date-filter');
        if (dateFilter) {
            // Set default to today
            dateFilter.value = new Date().toISOString().split('T')[0];
            
            dateFilter.addEventListener('change', (e) => {
                this.filterDataByDate(e.target.value);
            });
        }
    }

    updateTodayStats() {
        const today = new Date().toISOString().split('T')[0];
        this.filterDataByDate(today);
        
        // Update every hour
        setInterval(() => {
            this.updateTodayStats();
        }, 3600000);
    }

    filterDataByDate(dateStr) {
        const selectedDate = new Date(dateStr);
        const todayTokens = this.detectedTokens.filter(token => {
            const tokenDate = new Date(token.timestamp).toISOString().split('T')[0];
            return tokenDate === dateStr;
        });

        // Calculate stats for selected date
        const stats = {
            total: todayTokens.length,
            high: todayTokens.filter(t => t.risk === 'high').length,
            medium: todayTokens.filter(t => t.risk === 'medium').length,
            low: todayTokens.filter(t => t.risk === 'low').length,
            verified: todayTokens.filter(t => t.safeToTrade).length
        };

        // Update display
        const totalElement = document.getElementById('total-listed');
        const verifiedElement = document.getElementById('verified-tokens');
        const highElement = document.getElementById('high-risk-count');
        const mediumElement = document.getElementById('medium-risk-count');
        const lowElement = document.getElementById('low-risk-count');

        if (totalElement) totalElement.textContent = stats.total;
        if (verifiedElement) verifiedElement.textContent = stats.verified;
        if (highElement) highElement.textContent = stats.high;
        if (mediumElement) mediumElement.textContent = stats.medium;
        if (lowElement) lowElement.textContent = stats.low;

        // Update risk chart with filtered data
        if (this.riskChart) {
            this.riskChart.data.datasets[0].data = [stats.high, stats.medium, stats.low];
            this.riskChart.update();
        }
    }

    initializeRiskChart() {
        const ctx = document.getElementById('risk-chart');
        if (!ctx) return;

        this.riskChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['High Risk', 'Medium Risk', 'Low Risk'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#10b981'
                    ],
                    borderWidth: 0,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#ffffff',
                        bodyColor: '#d1d5db',
                        borderColor: '#374151',
                        borderWidth: 1
                    }
                },
                cutout: '70%'
            }
        });
    }

    populateInitialData() {
        // Set initial risk data instantly for faster loading
        this.riskLevels = { high: 25, medium: 87, low: 156 };
        // Immediate update without delay
        this.updateRiskChart();
        this.updateRiskCounters();
    }

    startLiveFeed() {
        this.populateLiveFeed();
        
        // Start real-time feed updates every 4-8 seconds
        this.startLiveFeedUpdates();
    }

    startLiveFeedUpdates() {
        if (this.liveFeedInterval) {
            clearTimeout(this.liveFeedInterval);
        }
        
        console.log('Starting live feed updates...');
        
        // Start first token after 1 second for faster perceived performance
        setTimeout(() => {
            if (this.isMonitoring) {
                this.addLiveFeedItem();
                this.scheduleNextToken();
            }
        }, 1000);
    }

    scheduleNextToken() {
        const nextInterval = Math.random() * 4000 + 3000; // 3-7 seconds
        console.log(`Next token in ${nextInterval}ms`);
        
        this.liveFeedInterval = setTimeout(() => {
            if (this.isMonitoring) {
                this.addLiveFeedItem();
                this.scheduleNextToken(); // Schedule the next one
            }
        }, nextInterval);
    }

    populateLiveFeed() {
        // Separate initial tokens by network
        const bscTokens = [
            { name: 'PEPE2.0', contract: '0xabcd...ef90', risk: 'low', chain: 'BSC', detected: 'Community verified' },
            { name: 'WOJAK', contract: '0x4567...89ab', risk: 'high', chain: 'BSC', detected: 'Suspicious patterns' },
            { name: 'MEME', contract: '0x9abc...def0', risk: 'medium', chain: 'BSC', detected: 'Social analysis' },
            { name: 'BETA', contract: '0xef01...2345', risk: 'high', chain: 'BSC', detected: 'High risk warning' },
            { name: 'SAFEMOON2', contract: '0x1abc...def2', risk: 'high', chain: 'BSC', detected: 'Fork detected' },
            { name: 'PANCAKE', contract: '0x2bcd...ef13', risk: 'low', chain: 'BSC', detected: 'Verified DEX token' },
            { name: 'BINANCE', contract: '0x3cde...f124', risk: 'medium', chain: 'BSC', detected: 'High volume' },
            { name: 'CAKE2', contract: '0x4def...1235', risk: 'medium', chain: 'BSC', detected: 'Liquidity analysis' },
            { name: 'BNB++', contract: '0x5ef1...2346', risk: 'high', chain: 'BSC', detected: 'Fake BNB token' },
            { name: 'TRUSTPAD', contract: '0x6f12...3457', risk: 'low', chain: 'BSC', detected: 'Audit passed' }
        ];

        const ethTokens = [
            { name: 'GOAT', contract: '0x1234...5678', risk: 'high', chain: 'ETH', detected: 'Duplicate after Elon tweet' },
            { name: 'SHIBA', contract: '0x9876...5432', risk: 'medium', chain: 'ETH', detected: 'High liquidity, new deploy' },
            { name: 'RUSH', contract: '0x3456...789a', risk: 'low', chain: 'ETH', detected: 'Contract verified' },
            { name: 'PUMP', contract: '0x789a...bcde', risk: 'high', chain: 'ETH', detected: 'Pump & dump indicators' },
            { name: 'HODL', contract: '0xcdef...0123', risk: 'low', chain: 'ETH', detected: 'Strong community' },
            { name: 'UNISWAP2', contract: '0x1234...abcd', risk: 'medium', chain: 'ETH', detected: 'Fork analysis' },
            { name: 'ETHEREUM2', contract: '0x2345...bcde', risk: 'high', chain: 'ETH', detected: 'Fake ETH token' },
            { name: 'VITALIK', contract: '0x3456...cdef', risk: 'medium', chain: 'ETH', detected: 'Celebrity token' },
            { name: 'DEFI', contract: '0x4567...def0', risk: 'low', chain: 'ETH', detected: 'DeFi protocol' },
            { name: 'COMPOUND2', contract: '0x5678...ef01', risk: 'medium', chain: 'ETH', detected: 'Lending protocol fork' }
        ];

        // Store tokens for pagination - expanded for 50+ tokens
        this.bscTokens = [...bscTokens];
        this.ethTokens = [...ethTokens];
        
        // Pagination settings
        this.bscPage = 1;
        this.ethPage = 1;
        this.tokensPerPage = 30; // Show 30 tokens per page with scroll
        this.maxPages = 5; // Maximum visible page numbers
        
        // Generate initial 50+ tokens for each chain
        this.generateInitialTokens();
        
        // Initial load
        this.loadBSCPage();
        this.loadETHPage();
        this.updateTokenCounts();
        this.updatePaginationControls();

        // Setup pagination buttons
        this.setupPagination();
    }

    generateInitialTokens() {
        // Generate 60+ tokens for BSC
        const bscNames = ['CAKE', 'PANCAKE', 'SAFEMOON', 'BNB', 'VENUS', 'AUTO', 'BELT', 'ALPACA', 'BABY', 'DODO', 
                         'CAKE2', 'VENUS2', 'ALPACA2', 'BELT2', 'AUTO2', 'BIFI', 'BABY2', 'DODO2', 'ELL', 'FARM',
                         'BSC3', 'CHAIN4', 'TOKEN5', 'MOON6', 'ROCKET7', 'SAFE8', 'TRUST9', 'SWAP10', 'DEX11', 'LIQUI12',
                         'YIELD13', 'STAKE14', 'BURN15', 'HODL16', 'PUMP17', 'DUMP18', 'BULL19', 'BEAR20', 'GOLD21', 'SILVER22',
                         'BRONZE23', 'PLAT24', 'DIAM25', 'RUBY26', 'EMER27', 'SAPP28', 'OPAL29', 'JADE30', 'AMBER31', 'CORAL32',
                         'PEARL33', 'ONYX34', 'QUARTZ35', 'CRYST36', 'STONE37', 'METAL38', 'ALLOY39', 'FUSION40', 'SPARK41', 'FLASH42'];
        
        // Generate 60+ tokens for ETH
        const ethNames = ['UNI', 'SUSHI', 'LINK', 'AAVE', 'COMP', 'MKR', 'SNX', 'YFI', 'CRV', 'BAL',
                         'LINK2', 'UNI2', 'AAVE2', 'MKR2', 'COMP2', 'SNX2', 'YFI2', 'SUSHI2', 'CRV2', 'BAL2',
                         'ETH3', 'WETH4', 'DEFI5', 'SWAP6', 'POOL7', 'VAULT8', 'LEND9', 'BORROW10', 'YIELD11', 'FARM12',
                         'STAKE13', 'LOCK14', 'MINT15', 'BURN16', 'WRAP17', 'BRIDGE18', 'CROSS19', 'MULTI20', 'LAYER21', 'SCALE22',
                         'FAST23', 'INSTANT24', 'QUICK25', 'SPEED26', 'RUSH27', 'BOLT28', 'FLASH29', 'RAPID30', 'SWIFT31', 'TURBO32',
                         'NITRO33', 'BOOST34', 'POWER35', 'ENERGY36', 'FORCE37', 'STRONG38', 'SOLID39', 'STABLE40', 'SECURE41', 'SAFE42'];
        
        // Generate BSC tokens
        for (let i = 0; i < Math.min(bscNames.length, 60); i++) {
            const token = {
                name: bscNames[i] + (Math.floor(i/10) > 0 ? Math.floor(i/10) : ''),
                contract: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6),
                risk: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
                chain: 'BSC',
                detected: ['New deployment', 'Community analysis', 'Risk assessment', 'Liquidity check', 'Social monitoring'][Math.floor(Math.random() * 5)],
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random time within last hour
                socialScore: {
                    twitter: Math.floor(Math.random() * 100),
                    discord: Math.floor(Math.random() * 100),
                    telegram: Math.floor(Math.random() * 100),
                    website: Math.random() > 0.3
                },
                price: (Math.random() * 10).toFixed(8),
                marketCap: Math.floor(Math.random() * 10000000),
                volume24h: Math.floor(Math.random() * 1000000),
                liquidity: Math.floor(Math.random() * 500000),
                holders: Math.floor(Math.random() * 10000) + 100,
                safeToTrade: Math.random() > 0.3
            };
            
            if (i >= this.bscTokens.length) {
                this.bscTokens.push(token);
            }
        }
        
        // Generate ETH tokens
        for (let i = 0; i < Math.min(ethNames.length, 60); i++) {
            const token = {
                name: ethNames[i] + (Math.floor(i/10) > 0 ? Math.floor(i/10) : ''),
                contract: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6),
                risk: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
                chain: 'ETH',
                detected: ['New deployment', 'Community analysis', 'Risk assessment', 'Liquidity check', 'Social monitoring'][Math.floor(Math.random() * 5)],
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random time within last hour
                socialScore: {
                    twitter: Math.floor(Math.random() * 100),
                    discord: Math.floor(Math.random() * 100),
                    telegram: Math.floor(Math.random() * 100),
                    website: Math.random() > 0.3
                },
                price: (Math.random() * 10).toFixed(8),
                marketCap: Math.floor(Math.random() * 10000000),
                volume24h: Math.floor(Math.random() * 1000000),
                liquidity: Math.floor(Math.random() * 500000),
                holders: Math.floor(Math.random() * 10000) + 100,
                safeToTrade: Math.random() > 0.3
            };
            
            if (i >= this.ethTokens.length) {
                this.ethTokens.push(token);
            }
        }
        
        console.log(`Generated ${this.bscTokens.length} BSC tokens and ${this.ethTokens.length} ETH tokens`);
    }

    loadBSCPage() {
        const bscFeed = document.getElementById('bsc-feed');
        if (!bscFeed) return;

        // Clear current feed
        bscFeed.innerHTML = '';
        
        // Calculate tokens for current page
        const startIndex = (this.bscPage - 1) * this.tokensPerPage;
        const endIndex = Math.min(startIndex + this.tokensPerPage, this.bscTokens.length);
        const tokensToShow = this.bscTokens.slice(startIndex, endIndex);
        
        // Add tokens with minimal delay for faster loading
        tokensToShow.forEach((token, index) => {
            setTimeout(() => {
                this.addTokenToNetworkFeed(token, 'bsc-feed');
            }, index * 20); // Much faster loading
        });
        
        console.log(`Loaded BSC page ${this.bscPage}: ${tokensToShow.length} tokens`);
    }

    loadETHPage() {
        const ethFeed = document.getElementById('eth-feed');
        if (!ethFeed) return;

        // Clear current feed
        ethFeed.innerHTML = '';
        
        // Calculate tokens for current page
        const startIndex = (this.ethPage - 1) * this.tokensPerPage;
        const endIndex = Math.min(startIndex + this.tokensPerPage, this.ethTokens.length);
        const tokensToShow = this.ethTokens.slice(startIndex, endIndex);
        
        // Add tokens with minimal delay for faster loading
        tokensToShow.forEach((token, index) => {
            setTimeout(() => {
                this.addTokenToNetworkFeed(token, 'eth-feed');
            }, index * 20); // Much faster loading
        });
        
        console.log(`Loaded ETH page ${this.ethPage}: ${tokensToShow.length} tokens`);
    }

    setupPagination() {
        // BSC Pagination
        const bscPrevBtn = document.getElementById('bsc-prev-page');
        const bscNextBtn = document.getElementById('bsc-next-page');
        
        if (bscPrevBtn) {
            bscPrevBtn.addEventListener('click', () => {
                if (this.bscPage > 1) {
                    this.bscPage--;
                    this.loadBSCPage();
                    this.updatePaginationControls();
                }
            });
        }
        
        if (bscNextBtn) {
            bscNextBtn.addEventListener('click', () => {
                const maxPages = Math.ceil(this.bscTokens.length / this.tokensPerPage);
                if (this.bscPage < maxPages) {
                    this.bscPage++;
                    this.loadBSCPage();
                    this.updatePaginationControls();
                }
            });
        }
        
        // ETH Pagination
        const ethPrevBtn = document.getElementById('eth-prev-page');
        const ethNextBtn = document.getElementById('eth-next-page');
        
        if (ethPrevBtn) {
            ethPrevBtn.addEventListener('click', () => {
                if (this.ethPage > 1) {
                    this.ethPage--;
                    this.loadETHPage();
                    this.updatePaginationControls();
                }
            });
        }
        
        if (ethNextBtn) {
            ethNextBtn.addEventListener('click', () => {
                const maxPages = Math.ceil(this.ethTokens.length / this.tokensPerPage);
                if (this.ethPage < maxPages) {
                    this.ethPage++;
                    this.loadETHPage();
                    this.updatePaginationControls();
                }
            });
        }
        
        // Auto-load toggle buttons
        const autoLoadBSC = document.getElementById('load-more-bsc');
        const autoLoadETH = document.getElementById('load-more-eth');
        
        if (autoLoadBSC) {
            autoLoadBSC.addEventListener('click', () => {
                this.generateMoreBSCTokens();
                this.updatePaginationControls();
                this.showAutoLoadMessage('BSC');
            });
        }
        
        if (autoLoadETH) {
            autoLoadETH.addEventListener('click', () => {
                this.generateMoreETHTokens();
                this.updatePaginationControls();
                this.showAutoLoadMessage('ETH');
            });
        }
    }
    
    updatePaginationControls() {
        // Update BSC pagination
        const bscMaxPages = Math.ceil(this.bscTokens.length / this.tokensPerPage);
        const bscCurrentPageSpan = document.getElementById('bsc-current-page');
        const bscTotalPagesSpan = document.getElementById('bsc-total-pages');
        const bscPrevBtn = document.getElementById('bsc-prev-page');
        const bscNextBtn = document.getElementById('bsc-next-page');
        
        if (bscCurrentPageSpan) bscCurrentPageSpan.textContent = this.bscPage;
        if (bscTotalPagesSpan) bscTotalPagesSpan.textContent = bscMaxPages;
        if (bscPrevBtn) bscPrevBtn.disabled = this.bscPage <= 1;
        if (bscNextBtn) bscNextBtn.disabled = this.bscPage >= bscMaxPages;
        
        // Update ETH pagination
        const ethMaxPages = Math.ceil(this.ethTokens.length / this.tokensPerPage);
        const ethCurrentPageSpan = document.getElementById('eth-current-page');
        const ethTotalPagesSpan = document.getElementById('eth-total-pages');
        const ethPrevBtn = document.getElementById('eth-prev-page');
        const ethNextBtn = document.getElementById('eth-next-page');
        
        if (ethCurrentPageSpan) ethCurrentPageSpan.textContent = this.ethPage;
        if (ethTotalPagesSpan) ethTotalPagesSpan.textContent = ethMaxPages;
        if (ethPrevBtn) ethPrevBtn.disabled = this.ethPage <= 1;
        if (ethNextBtn) ethNextBtn.disabled = this.ethPage >= ethMaxPages;
        
        console.log(`Pagination updated: BSC ${this.bscPage}/${bscMaxPages}, ETH ${this.ethPage}/${ethMaxPages}`);
    }
    
    showAutoLoadMessage(chain) {
        const message = `🔄 Generated 10 more ${chain} tokens! Current total: ${chain === 'BSC' ? this.bscTokens.length : this.ethTokens.length}`;
        
        if (this.managedShowNotification) {
            this.managedShowNotification(message, 'info', 3000);
        }
    }

    generateMoreBSCTokens() {
        const bscNames = ['CAKE3', 'VENUS2', 'ALPACA2', 'BELT2', 'AUTO2', 'BIFI2', 'BABY2', 'DODO2', 'ELL2', 'FARM2'];
        const newTokens = bscNames.map((name, index) => ({
            name: name,
            contract: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6),
            risk: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
            chain: 'BSC',
            detected: ['New deployment', 'Community analysis', 'Risk assessment', 'Liquidity check'][Math.floor(Math.random() * 4)],
            timestamp: new Date().toISOString(),
            socialScore: {
                twitter: Math.floor(Math.random() * 100),
                discord: Math.floor(Math.random() * 100),
                telegram: Math.floor(Math.random() * 100),
                website: Math.random() > 0.3
            },
            price: (Math.random() * 10).toFixed(8),
            marketCap: Math.floor(Math.random() * 10000000),
            volume24h: Math.floor(Math.random() * 1000000),
            liquidity: Math.floor(Math.random() * 500000),
            holders: Math.floor(Math.random() * 10000) + 100,
            safeToTrade: Math.random() > 0.3
        }));
        
        this.bscTokens.push(...newTokens);
    }

    generateMoreETHTokens() {
        const ethNames = ['LINK2', 'UNI2', 'AAVE2', 'MKR2', 'COMP2', 'SNX2', 'YFI2', 'SUSHI2', 'CRV2', 'BAL2'];
        const newTokens = ethNames.map((name, index) => ({
            name: name,
            contract: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6),
            risk: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
            chain: 'ETH',
            detected: ['New deployment', 'Community analysis', 'Risk assessment', 'Liquidity check'][Math.floor(Math.random() * 4)],
            timestamp: new Date().toISOString(),
            socialScore: {
                twitter: Math.floor(Math.random() * 100),
                discord: Math.floor(Math.random() * 100),
                telegram: Math.floor(Math.random() * 100),
                website: Math.random() > 0.3
            },
            price: (Math.random() * 10).toFixed(8),
            marketCap: Math.floor(Math.random() * 10000000),
            volume24h: Math.floor(Math.random() * 1000000),
            liquidity: Math.floor(Math.random() * 500000),
            holders: Math.floor(Math.random() * 10000) + 100,
            safeToTrade: Math.random() > 0.3
        }));
        
        this.ethTokens.push(...newTokens);
    }

    updateTokenCounts() {
        const bscCount = document.getElementById('bsc-count');
        const ethCount = document.getElementById('eth-count');
        const bscFeed = document.getElementById('bsc-feed');
        const ethFeed = document.getElementById('eth-feed');
        
        const bscVisible = bscFeed ? bscFeed.children.length : 0;
        const ethVisible = ethFeed ? ethFeed.children.length : 0;
        
        if (bscCount) {
            const bscTotal = this.bscTokens.length;
            bscCount.textContent = `${bscVisible}/${bscTotal} tokens`;
            bscCount.className = bscVisible > 0 ? 'text-xs text-green-400' : 'text-xs text-gray-400';
        }
        if (ethCount) {
            const ethTotal = this.ethTokens.length;
            ethCount.textContent = `${ethVisible}/${ethTotal} tokens`;
            ethCount.className = ethVisible > 0 ? 'text-xs text-green-400' : 'text-xs text-gray-400';
        }
    }

    addLiveFeedItem() {
        const bscNames = ['CAKE', 'PANCAKE', 'SAFEMOON', 'BNB', 'VENUS', 'AUTO', 'BELT', 'ALPACA', 'BABY', 'DODO'];
        const ethNames = ['UNI', 'SUSHI', 'LINK', 'AAVE', 'COMP', 'MKR', 'SNX', 'YFI', 'CRV', 'BAL'];
        const risks = ['high', 'medium', 'low'];
        const detectionReasons = [
            'New deployment detected',
            'Duplicate token found', 
            'Liquidity analysis complete',
            'Community report received',
            'Pattern matching alert',
            'KOL mention correlation',
            'Contract audit finished',
            'Scam pattern identified',
            'High volume spike detected',
            'Social media trending',
            'Whale activity detected',
            'DEX listing confirmed'
        ];

        // Randomly choose between BSC and ETH
        const isBSC = Math.random() > 0.5;
        const chain = isBSC ? 'BSC' : 'ETH';
        const names = isBSC ? bscNames : ethNames;
        
        const riskLevel = risks[Math.floor(Math.random() * risks.length)];
        const riskScore = riskLevel === 'high' ? Math.floor(Math.random() * 30) + 70 : 
                         riskLevel === 'medium' ? Math.floor(Math.random() * 40) + 30 : 
                         Math.floor(Math.random() * 30) + 5;

        const token = {
            name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000),
            contract: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6),
            risk: riskLevel,
            riskScore: riskScore,
            chain: chain,
            detected: detectionReasons[Math.floor(Math.random() * detectionReasons.length)],
            timestamp: new Date().toISOString(),
            socialScore: {
                twitter: Math.floor(Math.random() * 100),
                discord: Math.floor(Math.random() * 100),
                telegram: Math.floor(Math.random() * 100),
                website: Math.random() > 0.3
            },
            price: (Math.random() * 10).toFixed(8),
            marketCap: Math.floor(Math.random() * 10000000),
            volume24h: Math.floor(Math.random() * 1000000),
            liquidity: Math.floor(Math.random() * 500000),
            holders: Math.floor(Math.random() * 10000) + 100,
            safeToTrade: riskScore < 50
        };

        // Add to appropriate network feed
        this.addNewTokenToFeed(token);
        this.updateRiskLevels(token.risk);
    }

    addNewTokenToFeed(token) {
        const feedId = token.chain === 'BSC' ? 'bsc-feed' : 'eth-feed';
        const networkFeed = document.getElementById(feedId);
        
        console.log(`Adding new token ${token.name} to ${feedId}`);
        
        if (!networkFeed) {
            console.error(`Feed container ${feedId} not found`);
            return;
        }

        // Create the new token element
        const feedItem = this.createTokenElement(token);
        
        // Add entrance animation
        feedItem.style.opacity = '0';
        feedItem.style.transform = 'translateY(-30px) scale(0.9)';
        feedItem.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        // Insert at the beginning (top) of the feed
        networkFeed.insertBefore(feedItem, networkFeed.firstChild);
        
        // Trigger entrance animation immediately
        requestAnimationFrame(() => {
            feedItem.style.opacity = '1';
            feedItem.style.transform = 'translateY(0) scale(1)';
        });

        // Update token arrays - add to beginning
        if (token.chain === 'BSC') {
            this.bscTokens.unshift(token);
            if (this.bscTokens.length > 50) {
                this.bscTokens = this.bscTokens.slice(0, 50);
            }
        } else {
            this.ethTokens.unshift(token);
            if (this.ethTokens.length > 50) {
                this.ethTokens = this.ethTokens.slice(0, 50);
            }
        }

        // Auto-scroll to top when new token arrives at page 1
        if ((token.chain === 'BSC' && this.bscPage === 1) || (token.chain === 'ETH' && this.ethPage === 1)) {
            setTimeout(() => {
                networkFeed.scrollTop = 0;
                // Limit to current page size for real-time updates
                this.limitFeedItems(networkFeed, this.tokensPerPage);
            }, 100);
        }
        
        // Update counters
        this.updateTokenCounts();
        
        // Show notification for significant tokens
        if (token.risk === 'high' || Math.random() > 0.6) {
            this.showTokenNotification(token.chain, {
                message: token.detected,
                score: token.riskScore
            });
        }

        console.log(`Token ${token.name} added successfully`);
    }

    limitFeedItems(feedElement, maxItems) {
        while (feedElement.children.length > maxItems) {
            const lastItem = feedElement.lastElementChild;
            if (lastItem) {
                // Add exit animation
                lastItem.style.transition = 'all 0.4s ease-in';
                lastItem.style.opacity = '0';
                lastItem.style.transform = 'translateY(20px) scale(0.8)';
                
                // Remove after animation
                setTimeout(() => {
                    if (lastItem.parentNode) {
                        lastItem.remove();
                    }
                }, 400);
                
                // Wait a bit before removing next item to stagger the animations
                break;
            } else {
                break;
            }
        }
    }

    createTokenElement(token) {
        // Generate missing data
        if (!token.riskScore) {
            token.riskScore = token.risk === 'high' ? Math.floor(Math.random() * 30) + 70 : 
                             token.risk === 'medium' ? Math.floor(Math.random() * 40) + 30 : 
                             Math.floor(Math.random() * 30) + 5;
        }

        if (!token.socialScore) {
            token.socialScore = {
                twitter: Math.floor(Math.random() * 100),
                discord: Math.floor(Math.random() * 100),
                telegram: Math.floor(Math.random() * 100),
                website: Math.random() > 0.3
            };
        }
        
        // Generate enhanced scoring data
        if (!token.scores) {
            token.scores = {
                twitter: token.socialScore.twitter,
                telegram: token.socialScore.telegram,
                discord: token.socialScore.discord,
                website: token.socialScore.website ? 85 + Math.floor(Math.random() * 15) : Math.floor(Math.random() * 40),
                contractVerify: Math.random() > 0.3 ? 90 + Math.floor(Math.random() * 10) : Math.floor(Math.random() * 30),
                auditKYC: Math.random() > 0.7 ? 85 + Math.floor(Math.random() * 15) : Math.floor(Math.random() * 50)
            };
        }

        if (!token.price) token.price = (Math.random() * 10).toFixed(8);
        if (!token.volume24h) token.volume24h = Math.floor(Math.random() * 1000000);
        if (!token.holders) token.holders = Math.floor(Math.random() * 10000) + 100;
        if (!token.safeToTrade) token.safeToTrade = token.riskScore < 50;
        if (!token.timestamp) token.timestamp = new Date().toISOString();

        const feedItem = document.createElement('div');
        feedItem.className = 'live-feed-item bg-gray-700/30 rounded-lg p-3 border border-gray-600/40 hover:border-primary/50 transition-all cursor-pointer';
        feedItem.onclick = () => {
            // Store comprehensive token data and open dashboard
            const enhancedToken = {
                ...token,
                scores: token.scores,
                detailedAnalysis: {
                    riskLevel: token.risk,
                    riskScore: token.riskScore,
                    safeToTrade: token.safeToTrade,
                    analysisTimestamp: new Date().toISOString()
                }
            };
            localStorage.setItem('selected_token', JSON.stringify(enhancedToken));
            window.open('dashboard.html', '_blank');
        };
        
        feedItem.innerHTML = `
            <!-- Optimized Token Layout with Full Scoring -->
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                    <div class="w-8 h-8 ${token.chain === 'BSC' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'} rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        <span class="text-white font-bold text-xs">${token.chain === 'BSC' ? 'BSC' : 'ETH'}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center space-x-2">
                            <span class="font-semibold text-white text-sm truncate">${token.name}</span>
                            <span class="text-xs px-1.5 py-0.5 rounded-full ${token.risk === 'high' ? 'bg-red-500/30 text-red-300' : token.risk === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-green-500/30 text-green-300'}">
                                ${token.riskScore}%
                            </span>
                            ${token.risk === 'high' ? '<i class="fas fa-exclamation-triangle text-red-400 text-xs animate-pulse"></i>' : ''}
                        </div>
                        <div class="text-xs text-gray-400 font-mono truncate">${token.contract}</div>
                        <div class="flex items-center space-x-3 text-xs mt-0.5">
                            <span class="text-gray-300">$${parseFloat(token.price).toFixed(6)}</span>
                            <span class="text-gray-400">• ${(token.holders/1000).toFixed(1)}k holders</span>
                        </div>
                    </div>
                </div>
                <div class="text-right flex-shrink-0">
                    <div class="text-xs px-2 py-0.5 rounded border font-medium ${token.risk === 'high' ? 'border-red-500/50 bg-red-500/20 text-red-300' : token.risk === 'medium' ? 'border-yellow-500/50 bg-yellow-500/20 text-yellow-300' : 'border-green-500/50 bg-green-500/20 text-green-300'}">
                        ${token.risk.toUpperCase()}
                    </div>
                    <div class="text-xs text-gray-500 mt-0.5">${new Date(token.timestamp).toLocaleTimeString().slice(0,5)}</div>
                </div>
            </div>
            
            <!-- Full Scoring Icons Grid -->
            <div class="flex items-center justify-between mt-2 px-1">
                <!-- Social Scores -->
                <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-1">
                        <i class="fab fa-twitter text-blue-400 text-xs"></i>
                        <span class="text-xs font-medium ${token.scores.twitter > 70 ? 'text-green-400' : token.scores.twitter > 40 ? 'text-yellow-400' : 'text-red-400'}">${token.scores.twitter}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <i class="fab fa-telegram text-blue-300 text-xs"></i>
                        <span class="text-xs font-medium ${token.scores.telegram > 70 ? 'text-green-400' : token.scores.telegram > 40 ? 'text-yellow-400' : 'text-red-400'}">${token.scores.telegram}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <i class="fab fa-discord text-indigo-400 text-xs"></i>
                        <span class="text-xs font-medium ${token.scores.discord > 70 ? 'text-green-400' : token.scores.discord > 40 ? 'text-yellow-400' : 'text-red-400'}">${token.scores.discord}</span>
                    </div>
                </div>
                
                <!-- Verification Scores -->
                <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-1">
                        <i class="fas fa-globe ${token.scores.website > 50 ? 'text-green-400' : 'text-gray-400'} text-xs"></i>
                        <span class="text-xs ${token.scores.website > 50 ? 'text-green-400' : 'text-gray-400'}">Website</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <i class="fas fa-check-circle ${token.scores.contractVerify > 50 ? 'text-green-400' : 'text-red-400'} text-xs"></i>
                        <span class="text-xs ${token.scores.contractVerify > 50 ? 'text-green-400' : 'text-red-400'}">${token.scores.contractVerify > 50 ? 'Verified' : 'Unverified'}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        ${token.scores.auditKYC > 50 ? 
                            '<i class="fas fa-certificate text-yellow-400 text-xs"></i><span class="text-xs text-green-400">Audited</span>' : 
                            '<i class="fas fa-times-circle text-red-400 text-xs"></i><span class="text-xs text-red-400">No Audit</span>'
                        }
                    </div>
                </div>
            </div>
            
            <!-- Risk Assessment Bar -->
            <div class="mt-2">
                <div class="flex items-center justify-between text-xs mb-1">
                    <span class="text-gray-400">Risk Assessment</span>
                    <span class="font-medium ${token.safeToTrade ? 'text-green-400' : 'text-red-400'}">
                        ${token.safeToTrade ? '✅ SAFE TO TRADE' : '⚠️ HIGH RISK'}
                    </span>
                </div>
                <div class="bg-gray-600 rounded-full h-1.5 overflow-hidden">
                    <div class="h-1.5 rounded-full transition-all duration-300 ${token.risk === 'high' ? 'bg-gradient-to-r from-red-600 to-red-400' : token.risk === 'medium' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gradient-to-r from-green-600 to-green-400'}" style="width: ${token.riskScore}%"></div>
                </div>
            </div>
        `;

        return feedItem;
    }

    addTokenToNetworkFeed(token, feedId) {
        const networkFeed = document.getElementById(feedId);
        if (!networkFeed) return;

        // Create and add the token element
        const feedItem = this.createTokenElement(token);
        networkFeed.appendChild(feedItem);
        
        // Update token counts
        this.updateTokenCounts();

        // Add to detected tokens array
        this.detectedTokens.unshift(token);
        if (this.detectedTokens.length > 100) {
            this.detectedTokens = this.detectedTokens.slice(0, 100);
        }
    }

    // Legacy function - keeping for compatibility
    addTokenToFeed(token) {
        // This function is kept for compatibility with existing code
        // It redirects to the new network-specific function
        const feedId = token.chain === 'BSC' ? 'bsc-feed' : 'eth-feed';
        return this.addNewTokenToFeed(token);
    }

    // Deprecated - remove this section
    __oldAddTokenToNetworkFeed(token, feedId) {
        const networkFeed = document.getElementById(feedId);
        if (!networkFeed) return;

        // This section has been moved to createTokenElement function
    }

    updateRiskLevels(riskType) {
        this.riskLevels[riskType]++;
        this.updateRiskChart();
        this.updateRiskCounters();
    }

    updateRiskChart() {
        if (!this.riskChart) return;

        this.riskChart.data.datasets[0].data = [
            this.riskLevels.high,
            this.riskLevels.medium,
            this.riskLevels.low
        ];
        this.riskChart.update('none'); // No animation for real-time updates
    }

    updateRiskCounters() {
        const highRiskElement = document.getElementById('high-risk-count');
        const mediumRiskElement = document.getElementById('medium-risk-count');
        const lowRiskElement = document.getElementById('low-risk-count');

        if (highRiskElement) {
            this.animateCounter(highRiskElement, this.riskLevels.high);
        }
        if (mediumRiskElement) {
            this.animateCounter(mediumRiskElement, this.riskLevels.medium);
        }
        if (lowRiskElement) {
            this.animateCounter(lowRiskElement, this.riskLevels.low);
        }
    }

    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = targetValue > currentValue ? 1 : -1;
        const steps = Math.abs(targetValue - currentValue);
        
        if (steps === 0) return;
        
        let step = 0;
        const animation = setInterval(() => {
            step++;
            const value = currentValue + (increment * step);
            element.textContent = value;
            
            if (step >= steps) {
                clearInterval(animation);
                element.textContent = targetValue;
            }
        }, 50);
    }

    startRealTimeMonitoring() {
        this.isMonitoring = true;
        
        // Simulate blockchain monitoring
        this.simulateBlockchainMonitoring();
        
        // Simulate social media monitoring  
        this.simulateSocialMonitoring();
        
        // Simulate pattern recognition
        this.simulatePatternRecognition();
    }

    simulateBlockchainMonitoring() {
        // Simulate monitoring multiple blockchains
        const chains = ['Ethereum', 'BSC', 'Solana', 'Polygon'];
        
        chains.forEach(chain => {
            setInterval(() => {
                this.processBlockchainEvent(chain);
            }, Math.random() * 10000 + 5000); // 5-15 seconds
        });
    }

    processBlockchainEvent(chain) {
        const events = [
            { message: 'New token deployment detected', level: 'info', score: Math.floor(Math.random() * 100) },
            { message: 'Large liquidity addition', level: 'info', score: Math.floor(Math.random() * 30) + 10 },
            { message: 'Suspicious transaction pattern', level: 'warning', score: Math.floor(Math.random() * 30) + 60 },
            { message: 'Contract verification completed', level: 'info', score: Math.floor(Math.random() * 20) + 5 },
            { message: 'Ownership renounced', level: 'info', score: Math.floor(Math.random() * 25) + 15 },
            { message: 'Liquidity locked', level: 'info', score: Math.floor(Math.random() * 20) + 10 },
            { message: 'Honeypot contract detected', level: 'danger', score: Math.floor(Math.random() * 20) + 80 },
            { message: 'Rug pull indicators found', level: 'danger', score: Math.floor(Math.random() * 25) + 75 }
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        
        // Focus on new token deployments with detailed info
        if (event.message.includes('deployment') || event.level === 'danger' || event.level === 'warning') {
            // Create detailed token notification
            this.showTokenNotification(chain, event);
        }
    }

    simulateSocialMonitoring() {
        const platforms = ['Twitter', 'Telegram', 'Discord', 'Reddit'];
        
        platforms.forEach(platform => {
            setInterval(() => {
                this.processSocialEvent(platform);
            }, Math.random() * 15000 + 10000); // 10-25 seconds
        });
    }

    processSocialEvent(platform) {
        const events = [
            'KOL mention detected',
            'Community discussion trending',
            'Potential pump signal identified',
            'Scam warning posted',
            'Official announcement found'
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        
        if (event.includes('pump') || event.includes('Scam')) {
            this.showAIAlert(platform, event);
        }
    }

    simulatePatternRecognition() {
        setInterval(() => {
            const patterns = [
                'Honeypot pattern identified',
                'Rug pull indicators detected',
                'Coordinated buying pattern',
                'Bot trading activity',
                'Wash trading suspected',
                'Legitimate project verified'
            ];

            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            this.processPatternAlert(pattern);
        }, Math.random() * 20000 + 15000); // 15-35 seconds
    }

    processPatternAlert(pattern) {
        const alertLevel = pattern.includes('Honeypot') || pattern.includes('Rug') ? 'danger' : 
                          pattern.includes('suspected') || pattern.includes('Bot') ? 'warning' : 'info';
        
        this.showAIAlert('AI Pattern Recognition', pattern, alertLevel);
    }

    showAIAlert(source, message, level = 'info', riskScore = null) {
        // Disabled AI alerts on the left side as requested
        // Only use the managed notification system
        if (level === 'danger' || level === 'warning') {
            const aiMessage = `🤖 ${source}: ${message}${riskScore ? ` (Risk: ${riskScore}/100)` : ''}`;
            const notificationType = level === 'danger' ? 'error' : 'warning';
            
            const notification = this.managedShowNotification(aiMessage, notificationType, 6000);
            
            if (notification && level === 'danger') {
                this.playAlertSound();
            }
        }
        // Ignore info level AI alerts to reduce noise
    }

    showTokenNotification(chain, event) {
        // Generate mock token for notification
        const mockNames = ['SPARK', 'RUSH', 'AI', 'MEME', 'COIN', 'TOKEN', 'SAFE', 'MOON', 'ROCKET'];
        const tokenName = mockNames[Math.floor(Math.random() * mockNames.length)] + Math.floor(Math.random() * 1000);
        const riskScore = event.score;
        const safeToTrade = riskScore < 50;
        
        const notificationMessage = `🪙 NEW TOKEN: ${tokenName} (${chain})
Risk Score: ${riskScore}/100
${safeToTrade ? '✅ SAFE TO TRADE' : '⚠️ HIGH RISK - AVOID'}
Social Score: ${Math.floor(Math.random() * 100)}
Click to analyze →`;

        const notificationType = riskScore > 70 ? 'error' : riskScore > 40 ? 'warning' : 'success';
        
        const notification = this.managedShowNotification(notificationMessage, notificationType, 10000);
        
        if (notification) {
            
            // Make notification clickable to open token details
            notification.style.cursor = 'pointer';
            notification.addEventListener('click', () => {
                const tokenData = {
                    name: tokenName,
                    contract: '0x' + Math.random().toString(16).substring(2, 42),
                    chain: chain,
                    risk: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
                    riskScore: riskScore,
                    price: (Math.random() * 0.01).toFixed(8),
                    marketCap: Math.floor(Math.random() * 10000000),
                    volume24h: Math.floor(Math.random() * 1000000),
                    liquidity: Math.floor(Math.random() * 500000),
                    holders: Math.floor(Math.random() * 10000) + 100,
                    socialScore: {
                        twitter: Math.floor(Math.random() * 100),
                        discord: Math.floor(Math.random() * 100),
                        telegram: Math.floor(Math.random() * 100),
                        website: Math.random() > 0.3
                    },
                    safeToTrade: safeToTrade,
                    timestamp: new Date().toISOString()
                };
                
                localStorage.setItem('selected_token', JSON.stringify(tokenData));
                window.open('dashboard.html', '_blank');
                
                notification.remove();
                
                // Remove from our tracking
                const index = this.activeNotifications.indexOf(notification);
                if (index > -1) {
                    this.activeNotifications.splice(index, 1);
                }
            });
            
            if (riskScore > 70) {
                this.playAlertSound();
            }
        }
    }

    playAlertSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }

    getDetectedTokens() {
        return this.detectedTokens;
    }

    getRiskStatistics() {
        return this.riskLevels;
    }

    toggleMonitoring() {
        this.isMonitoring = !this.isMonitoring;
        
        if (this.isMonitoring) {
            this.startRealTimeMonitoring();
        } else {
            this.stopMonitoring();
        }
        
        return this.isMonitoring;
    }

    stopMonitoring() {
        if (this.liveFeedInterval) {
            clearTimeout(this.liveFeedInterval);
            this.liveFeedInterval = null;
        }
        this.isMonitoring = false;
    }

    // Search functionality for detected tokens
    searchTokens(query) {
        return this.detectedTokens.filter(token => 
            token.name.toLowerCase().includes(query.toLowerCase()) ||
            token.contract.toLowerCase().includes(query.toLowerCase()) ||
            token.chain.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Filter tokens by risk level
    filterByRisk(riskLevel) {
        return this.detectedTokens.filter(token => token.risk === riskLevel);
    }

    // Get tokens by chain
    getTokensByChain(chain) {
        return this.detectedTokens.filter(token => token.chain === chain);
    }

    // Open token details in new dashboard
    openTokenDetails(contract) {
        // Find token in detected tokens
        const token = this.detectedTokens.find(t => t.contract === contract);
        if (token) {
            // Store token data for dashboard.html
            localStorage.setItem('selected_token', JSON.stringify(token));
            // Open in new tab
            window.open('dashboard.html', '_blank');
        }
    }

    setupNotificationToggle() {
        const toggle = document.getElementById('notifications-toggle');
        const indicator = document.getElementById('notification-indicator');
        
        if (toggle && indicator) {
            // Update indicator based on current state
            this.updateNotificationIndicator();
            
            toggle.addEventListener('click', () => {
                this.notificationsEnabled = !this.notificationsEnabled;
                localStorage.setItem('notifications_enabled', this.notificationsEnabled);
                
                if (!this.notificationsEnabled) {
                    // Clear existing notifications
                    this.clearAllNotifications();
                }
                
                this.updateNotificationIndicator();
                
                // Show feedback
                if (window.walletManager) {
                    window.walletManager.showNotification(
                        `Notifications ${this.notificationsEnabled ? 'enabled' : 'disabled'}`,
                        'info',
                        3000
                    );
                }
            });
        }
    }

    updateNotificationIndicator() {
        const indicator = document.getElementById('notification-indicator');
        const toggle = document.getElementById('notifications-toggle');
        
        if (indicator && toggle) {
            if (this.notificationsEnabled) {
                indicator.className = 'absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse';
                toggle.title = 'Disable Notifications';
                toggle.querySelector('i').className = 'fas fa-bell text-lg';
            } else {
                indicator.className = 'absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full';
                toggle.title = 'Enable Notifications';
                toggle.querySelector('i').className = 'fas fa-bell-slash text-lg';
            }
        }
    }

    clearAllNotifications() {
        // Clear notifications from wallet manager
        if (window.walletManager && window.walletManager.clearAllNotifications) {
            window.walletManager.clearAllNotifications();
        }
        
        // Clear our local notification tracking
        this.activeNotifications = [];
    }

    managedShowNotification(message, type = 'info', duration = 5000) {
        if (!this.notificationsEnabled || !this.pageLoaded) {
            return null;
        }

        // Use wallet manager's notification system if available
        if (window.walletManager) {
            const notification = window.walletManager.showNotification(message, type, duration);
            
            if (notification) {
                // Add to our tracking
                this.activeNotifications.push(notification);
                
                // Remove from tracking when it's removed
                setTimeout(() => {
                    const index = this.activeNotifications.indexOf(notification);
                    if (index > -1) {
                        this.activeNotifications.splice(index, 1);
                    }
                }, duration);
                
                // Limit to max notifications (reduced from 5 to 3)
                if (this.activeNotifications.length > this.maxNotifications) {
                    const oldestNotification = this.activeNotifications.shift();
                    if (oldestNotification && oldestNotification.parentElement) {
                        oldestNotification.remove();
                    }
                }
                
                return notification;
            }
        }
        
        return null;
    }

    // Export data for analysis
    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            riskStatistics: this.riskLevels,
            detectedTokens: this.detectedTokens,
            monitoringStatus: this.isMonitoring,
            notificationsEnabled: this.notificationsEnabled
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `sparkrush-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}

// Advanced AI Detection Simulator
class AIDetectionEngine {
    constructor() {
        this.patterns = {
            honeypot: /^0x[a-fA-F0-9]{40}$/,
            rugPull: ['ownership', 'mint', 'burn'],
            duplicate: ['copy', 'clone', '2.0', 'v2'],
            pump: ['moon', 'rocket', '100x', '1000x']
        };
        
        this.riskScores = new Map();
        this.initializePatterns();
    }

    initializePatterns() {
        // Load known scam patterns (simulated)
        this.knownScamPatterns = [
            { type: 'honeypot', indicators: ['high_buy_tax', 'no_sell_function'] },
            { type: 'rugpull', indicators: ['unlimited_mint', 'owner_controls'] },
            { type: 'duplicate', indicators: ['similar_name', 'copied_code'] }
        ];
    }

    analyzeToken(tokenData) {
        let riskScore = 0;
        const flags = [];

        // Simulate various checks
        riskScore += this.checkContractCode(tokenData);
        riskScore += this.checkLiquidity(tokenData);
        riskScore += this.checkOwnership(tokenData);
        riskScore += this.checkSimilarity(tokenData);

        // Determine risk level
        let riskLevel;
        if (riskScore >= 70) {
            riskLevel = 'high';
            flags.push('CRITICAL_RISK');
        } else if (riskScore >= 40) {
            riskLevel = 'medium';
            flags.push('MODERATE_RISK');
        } else {
            riskLevel = 'low';
            flags.push('LOW_RISK');
        }

        return {
            riskScore,
            riskLevel,
            flags,
            analysis: this.generateAnalysis(tokenData, riskScore, flags),
            timestamp: new Date().toISOString()
        };
    }

    checkContractCode(tokenData) {
        // Simulate contract analysis
        const riskFactors = Math.random();
        if (riskFactors > 0.8) return 30; // High risk code
        if (riskFactors > 0.5) return 15; // Medium risk
        return 5; // Low risk
    }

    checkLiquidity(tokenData) {
        // Simulate liquidity analysis
        const liquidity = Math.random() * 1000000;
        if (liquidity < 10000) return 25; // Very low liquidity
        if (liquidity < 100000) return 10; // Low liquidity
        return 0; // Good liquidity
    }

    checkOwnership(tokenData) {
        // Simulate ownership analysis
        const ownershipRisk = Math.random();
        if (ownershipRisk > 0.7) return 20; // Owner has too much control
        if (ownershipRisk > 0.4) return 10; // Some ownership risk
        return 0; // Decentralized ownership
    }

    checkSimilarity(tokenData) {
        // Check for similar tokens
        const similarity = Math.random();
        if (similarity > 0.8) return 15; // Very similar to existing token
        if (similarity > 0.5) return 8; // Some similarity
        return 0; // Unique token
    }

    generateAnalysis(tokenData, riskScore, flags) {
        const analyses = {
            high: [
                "Multiple red flags detected. High probability of scam.",
                "Contract shows honeypot characteristics.",
                "Extremely risky investment. Avoid at all costs."
            ],
            medium: [
                "Some concerning patterns identified. Proceed with caution.",
                "Medium risk detected. Consider waiting for community verification.",
                "Mixed signals. More research recommended."
            ],
            low: [
                "Analysis shows positive indicators.",
                "Low risk profile with good fundamentals.",
                "Community verified with strong backing."
            ]
        };

        const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        const options = analyses[riskLevel];
        return options[Math.floor(Math.random() * options.length)];
    }
}

// Lazy initialize dashboard when the section becomes visible or after idle timeout
(function lazyInitDashboard(){
    const init = () => {
        if (window.__dashInit) return; window.__dashInit = true;
        console.log('Initializing Dashboard lazily...');
        window.dashboardManager = new DashboardManager();
        window.aiEngine = new AIDetectionEngine();
        // Kick a first feed item soon for perceived liveliness
        setTimeout(() => window.dashboardManager?.addLiveFeedItem(), 3000);
    };

    // If on dashboard.html (standalone), init immediately after DOM ready
    if (location.pathname.endsWith('dashboard.html')) {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    // On index.html, observe #dashboard section
    document.addEventListener('DOMContentLoaded', () => {
        const sec = document.getElementById('dashboard');
        if (!sec) { init(); return; }
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { init(); obs.disconnect(); }
            });
        }, { rootMargin: '200px' });
        obs.observe(sec);
        // Fallback: init after 4s idle if not viewed yet
        setTimeout(init, 4000);
    });
})();