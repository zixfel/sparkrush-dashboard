// SparkRush Token Scanner - AI-Powered Analysis
class TokenScanner {
    constructor() {
        this.isScanning = false;
        this.scanHistory = [];
        this.initializeScanner();
    }

    initializeScanner() {
        const scanBtn = document.getElementById('scan-btn');
        const scannerInput = document.getElementById('scanner-input');

        if (scanBtn) {
            scanBtn.addEventListener('click', () => {
                const query = scannerInput.value.trim();
                if (query) {
                    this.scanToken(query);
                }
            });
        }

        if (scannerInput) {
            scannerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.scanToken(query);
                    }
                }
            });

            // Add autocomplete functionality
            scannerInput.addEventListener('input', (e) => {
                this.showSuggestions(e.target.value);
            });
        }
    }

    async scanToken(query) {
        if (this.isScanning) return;
        
        this.isScanning = true;
        this.showScanningState();

        try {
            // Determine if query is contract address or token name
            const isAddress = query.startsWith('0x') && query.length === 42;
            const tokenData = await this.fetchTokenData(query, isAddress);
            
            // Run AI analysis based on scan type
            const aiAnalysis = isAdvanced && window.aiEngine ? 
                window.aiEngine.analyzeToken(tokenData) :
                await this.performComprehensiveAnalysis(tokenData);
            
            // Get community data for advanced scan
            const communityData = isAdvanced ? await this.getCommunityData(tokenData.contract) : null;
            
            // Display results
            if (isAdvanced) {
                this.displayScanResults({
                    ...tokenData,
                    aiAnalysis,
                    communityData,
                    scanTimestamp: new Date().toISOString()
                });
            } else {
                this.displayResults(tokenData, aiAnalysis);
            }

            // Add to scan history
            this.addToHistory(query, tokenData, aiAnalysis);

        } catch (error) {
            console.error('Scan error:', error);
            this.showScanError(error.message);
        } finally {
            this.isScanning = false;
            this.hideScanningState();
        }
    }

    async fetchTokenData(query, isAddress) {
        // Simulate API call with realistic data
        await this.simulateDelay(2000);

        const mockChains = ['ETH', 'BSC', 'SOL', 'POLY'];
        const chain = mockChains[Math.floor(Math.random() * mockChains.length)];
        
        // Generate realistic token data
        const tokenData = {
            name: isAddress ? this.generateRandomName() : query.toUpperCase(),
            symbol: isAddress ? this.generateRandomSymbol() : query.toUpperCase(),
            contract: isAddress ? query : this.generateRandomAddress(),
            chain: chain,
            price: (Math.random() * 10).toFixed(8),
            marketCap: Math.floor(Math.random() * 10000000),
            volume24h: Math.floor(Math.random() * 1000000),
            liquidity: Math.floor(Math.random() * 500000),
            holders: Math.floor(Math.random() * 50000) + 100,
            age: Math.floor(Math.random() * 365) + 1, // days
            verified: Math.random() > 0.3,
            audit: Math.random() > 0.6,
            rugPulled: Math.random() > 0.9,
            honeypot: Math.random() > 0.85,
            
            // Technical data
            totalSupply: Math.floor(Math.random() * 1000000000000),
            circulatingSupply: Math.floor(Math.random() * 1000000000000),
            burnedTokens: Math.floor(Math.random() * 100000000),
            lockedLiquidity: Math.random() * 100,
            ownershipRenounced: Math.random() > 0.5,
            
            // Social data
            website: Math.random() > 0.4 ? 'https://example.com' : null,
            telegram: Math.random() > 0.3 ? '@example_token' : null,
            twitter: Math.random() > 0.4 ? '@example_token' : null,
            
            // Price history (mock)
            priceHistory: this.generatePriceHistory()
        };

        return tokenData;
    }

    async getCommunityData(contract) {
        await this.simulateDelay(1000);

        return {
            votes: {
                legitimate: Math.floor(Math.random() * 1000),
                scam: Math.floor(Math.random() * 100),
                uncertain: Math.floor(Math.random() * 50)
            },
            reports: Math.floor(Math.random() * 20),
            verifiedBy: Math.floor(Math.random() * 5),
            lastUpdate: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            sparkRushId: Math.random() > 0.5 ? `${contract.slice(0,6)}.spark` : null,
            communityRating: (Math.random() * 5).toFixed(1)
        };
    }

    displayScanResults(results) {
        const resultsContainer = document.getElementById('scanner-results');
        if (!resultsContainer) return;

        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = this.generateResultsHTML(results);
        
        // Initialize charts in results
        setTimeout(() => {
            this.initializeResultCharts(results);
        }, 100);
    }

    generateResultsHTML(results) {
        const riskColor = this.getRiskColor(results.aiAnalysis.riskLevel);
        const riskIcon = this.getRiskIcon(results.aiAnalysis.riskLevel);
        
        return `
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Token Overview -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Header -->
                    <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                    ${results.symbol.charAt(0)}
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold">${results.name} (${results.symbol})</h3>
                                    <p class="text-gray-400 text-sm">${results.chain} • ${results.contract}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="flex items-center space-x-2 mb-2">
                                    <i class="fas ${riskIcon} ${riskColor}"></i>
                                    <span class="px-3 py-1 rounded-full text-sm font-medium border ${riskColor}">${results.aiAnalysis.riskLevel.toUpperCase()}</span>
                                </div>
                                <div class="text-sm text-gray-400">Risk Score: ${results.aiAnalysis.riskScore}/100</div>
                            </div>
                        </div>
                        
                        <!-- Key Metrics -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="bg-gray-700/30 rounded-lg p-3">
                                <div class="text-sm text-gray-400">Price</div>
                                <div class="font-semibold">$${results.price}</div>
                            </div>
                            <div class="bg-gray-700/30 rounded-lg p-3">
                                <div class="text-sm text-gray-400">Market Cap</div>
                                <div class="font-semibold">$${results.marketCap.toLocaleString()}</div>
                            </div>
                            <div class="bg-gray-700/30 rounded-lg p-3">
                                <div class="text-sm text-gray-400">24h Volume</div>
                                <div class="font-semibold">$${results.volume24h.toLocaleString()}</div>
                            </div>
                            <div class="bg-gray-700/30 rounded-lg p-3">
                                <div class="text-sm text-gray-400">Holders</div>
                                <div class="font-semibold">${results.holders.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    <!-- AI Analysis -->
                    <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                        <h4 class="text-lg font-semibold mb-4 flex items-center">
                            <i class="fas fa-robot text-primary mr-2"></i>
                            AI Security Analysis
                        </h4>
                        
                        <div class="mb-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-400">Risk Assessment</span>
                                <span class="text-sm font-medium">${results.aiAnalysis.riskScore}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${results.aiAnalysis.riskScore}%"></div>
                            </div>
                        </div>

                        <div class="bg-gray-700/30 rounded-lg p-4 mb-4">
                            <p class="text-sm">${results.aiAnalysis.analysis}</p>
                        </div>

                        <!-- Security Checks -->
                        <div class="grid grid-cols-2 gap-4">
                            ${this.generateSecurityChecks(results).map(check => `
                                <div class="flex items-center justify-between py-2">
                                    <span class="text-sm text-gray-400">${check.name}</span>
                                    <i class="fas ${check.icon} ${check.color}"></i>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Technical Details -->
                    <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                        <h4 class="text-lg font-semibold mb-4">Technical Analysis</h4>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <div class="text-sm text-gray-400 mb-1">Total Supply</div>
                                <div class="font-medium">${results.totalSupply.toLocaleString()}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 mb-1">Circulating Supply</div>
                                <div class="font-medium">${results.circulatingSupply.toLocaleString()}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 mb-1">Burned Tokens</div>
                                <div class="font-medium">${results.burnedTokens.toLocaleString()}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-400 mb-1">Locked Liquidity</div>
                                <div class="font-medium">${results.lockedLiquidity.toFixed(1)}%</div>
                            </div>
                        </div>

                        <!-- Price Chart -->
                        <div class="mt-6">
                            <h5 class="font-medium mb-3">Price History (7 days)</h5>
                            <div style="height: 200px;">
                                <canvas id="price-history-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Community & Verification -->
                <div class="space-y-6">
                    <!-- Community Consensus -->
                    <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                        <h4 class="text-lg font-semibold mb-4">Community Verification</h4>
                        
                        ${results.communityData.sparkRushId ? `
                            <div class="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-4">
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-check-circle text-green-400"></i>
                                    <span class="text-sm font-medium">Verified Token</span>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">ID: ${results.communityData.sparkRushId}</div>
                            </div>
                        ` : ''}
                        
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-400">Community Rating</span>
                                <div class="flex items-center space-x-1">
                                    ${this.generateStarRating(results.communityData.communityRating)}
                                    <span class="text-sm ml-2">${results.communityData.communityRating}/5</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-400">Legitimate Votes</span>
                                <span class="text-green-400 font-medium">${results.communityData.votes.legitimate}</span>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-400">Scam Reports</span>
                                <span class="text-red-400 font-medium">${results.communityData.votes.scam}</span>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-400">Verified By</span>
                                <span class="font-medium">${results.communityData.verifiedBy} users</span>
                            </div>
                        </div>

                        <!-- Voting -->
                        <div class="mt-6 pt-4 border-t border-gray-700">
                            <div class="text-sm text-gray-400 mb-3">Cast Your Vote</div>
                            <div class="flex space-x-2">
                                <button class="vote-button vote-yes flex-1 text-xs">
                                    <i class="fas fa-thumbs-up mr-1"></i>Legitimate
                                </button>
                                <button class="vote-button vote-no flex-1 text-xs">
                                    <i class="fas fa-thumbs-down mr-1"></i>Scam
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                        <h4 class="text-lg font-semibold mb-4">Quick Actions</h4>
                        
                        <div class="space-y-3">
                            <button class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                                Add to Watchlist
                            </button>
                            
                            <button class="w-full border border-gray-600 hover:border-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                                View on Explorer
                            </button>
                            
                            <button class="w-full border border-gray-600 hover:border-yellow-500 text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                                Report Scam
                            </button>
                            
                            <button class="w-full border border-gray-600 hover:border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                                Share Analysis
                            </button>
                        </div>
                    </div>

                    <!-- Social Links -->
                    ${results.website || results.telegram || results.twitter ? `
                        <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <h4 class="text-lg font-semibold mb-4">Official Links</h4>
                            
                            <div class="space-y-2">
                                ${results.website ? `
                                    <a href="${results.website}" target="_blank" class="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300">
                                        <i class="fas fa-globe"></i>
                                        <span>Website</span>
                                    </a>
                                ` : ''}
                                
                                ${results.telegram ? `
                                    <a href="https://t.me/${results.telegram.replace('@', '')}" target="_blank" class="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300">
                                        <i class="fab fa-telegram"></i>
                                        <span>${results.telegram}</span>
                                    </a>
                                ` : ''}
                                
                                ${results.twitter ? `
                                    <a href="https://twitter.com/${results.twitter.replace('@', '')}" target="_blank" class="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300">
                                        <i class="fab fa-twitter"></i>
                                        <span>${results.twitter}</span>
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateSecurityChecks(results) {
        return [
            {
                name: 'Contract Verified',
                icon: results.verified ? 'fa-check' : 'fa-times',
                color: results.verified ? 'text-green-400' : 'text-red-400'
            },
            {
                name: 'Audit Completed',
                icon: results.audit ? 'fa-check' : 'fa-times',
                color: results.audit ? 'text-green-400' : 'text-red-400'
            },
            {
                name: 'Honeypot Check',
                icon: results.honeypot ? 'fa-times' : 'fa-check',
                color: results.honeypot ? 'text-red-400' : 'text-green-400'
            },
            {
                name: 'Ownership Renounced',
                icon: results.ownershipRenounced ? 'fa-check' : 'fa-times',
                color: results.ownershipRenounced ? 'text-green-400' : 'text-yellow-400'
            },
            {
                name: 'Liquidity Locked',
                icon: results.lockedLiquidity > 50 ? 'fa-check' : 'fa-times',
                color: results.lockedLiquidity > 50 ? 'text-green-400' : 'text-red-400'
            },
            {
                name: 'No Rug Pull History',
                icon: results.rugPulled ? 'fa-times' : 'fa-check',
                color: results.rugPulled ? 'text-red-400' : 'text-green-400'
            }
        ];
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-yellow-400"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-gray-400"></i>';
        }
        
        return stars;
    }

    initializeResultCharts(results) {
        const ctx = document.getElementById('price-history-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: results.priceHistory.labels,
                datasets: [{
                    label: 'Price',
                    data: results.priceHistory.data,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
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
                scales: {
                    x: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    },
                    y: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    generatePriceHistory() {
        const labels = [];
        const data = [];
        const basePrice = Math.random() * 0.01;
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString());
            
            const volatility = (Math.random() - 0.5) * 0.3;
            const price = basePrice * (1 + volatility);
            data.push(price.toFixed(8));
        }
        
        return { labels, data };
    }

    showSuggestions(query) {
        if (query.length < 2) return;

        const suggestions = [
            'PEPE', 'SHIB', 'DOGE', 'FLOKI', 'GOAT', 'MEME', 'WOJAK', 'BONK',
            '0x1234567890123456789012345678901234567890',
            '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
        ].filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        // Implementation for suggestion dropdown would go here
    }

    showScanningState() {
        const scanBtn = document.getElementById('scan-btn');
        const scannerInput = document.getElementById('scanner-input');
        
        if (scanBtn) {
            scanBtn.disabled = true;
            scanBtn.innerHTML = '<div class="pulse-loader mr-2"></div>Analyzing...';
        }
        
        if (scannerInput) {
            scannerInput.disabled = true;
        }
    }

    hideScanningState() {
        const scanBtn = document.getElementById('scan-btn');
        const scannerInput = document.getElementById('scanner-input');
        
        if (scanBtn) {
            scanBtn.disabled = false;
            scanBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Deep Scan';
        }
        
        if (scannerInput) {
            scannerInput.disabled = false;
        }
    }

    showScanError(message) {
        const resultsContainer = document.getElementById('scanner-results');
        if (!resultsContainer) return;

        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
                <i class="fas fa-exclamation-triangle text-red-400 text-2xl mb-3"></i>
                <h3 class="text-lg font-semibold text-red-400 mb-2">Deep Scan Failed</h3>
                <p class="text-gray-400">${message}</p>
                <button onclick="document.getElementById('scanner-results').classList.add('hidden')" class="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm">
                    Dismiss
                </button>
            </div>
        `;
    }

    addToHistory(query, tokenData, aiAnalysis) {
        const historyItem = {
            query,
            timestamp: new Date().toISOString(),
            token: {
                name: tokenData.name,
                symbol: tokenData.symbol,
                contract: tokenData.contract,
                chain: tokenData.chain
            },
            riskLevel: aiAnalysis.riskLevel,
            riskScore: aiAnalysis.riskScore
        };

        this.scanHistory.unshift(historyItem);
        
        // Keep only last 50 scans
        if (this.scanHistory.length > 50) {
            this.scanHistory = this.scanHistory.slice(0, 50);
        }

        // Save to localStorage
        localStorage.setItem('sparkrush_scan_history', JSON.stringify(this.scanHistory));
    }

    getRiskColor(riskLevel) {
        const colors = {
            high: 'text-red-400 border-red-500',
            medium: 'text-yellow-400 border-yellow-500',
            low: 'text-green-400 border-green-500'
        };
        return colors[riskLevel] || colors.medium;
    }

    getRiskIcon(riskLevel) {
        const icons = {
            high: 'fa-exclamation-triangle',
            medium: 'fa-exclamation-circle',
            low: 'fa-check-circle'
        };
        return icons[riskLevel] || icons.medium;
    }

    generateRandomName() {
        const prefixes = ['Safe', 'Moon', 'Rocket', 'Diamond', 'Gold', 'Silver', 'Super', 'Ultra'];
        const suffixes = ['Coin', 'Token', 'Cash', 'Finance', 'Protocol', 'Network', 'Chain'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        return `${prefix}${suffix}`;
    }

    generateRandomSymbol() {
        const symbols = ['SAFE', 'MOON', 'RKT', 'DIA', 'GOLD', 'SILV', 'SUPR', 'ULTR'];
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    generateRandomAddress() {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
            address += chars[Math.floor(Math.random() * chars.length)];
        }
        return address;
    }

    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getScanHistory() {
        return this.scanHistory;
    }

    clearHistory() {
        this.scanHistory = [];
        localStorage.removeItem('sparkrush_scan_history');
    }
}

// Initialize scanner when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tokenScanner = new TokenScanner();
});