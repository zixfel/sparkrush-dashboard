// Token Dashboard Manager
class TokenDashboard {
    constructor() {
        this.tokenData = null;
        this.priceChart = null;
        this.init();
    }

    init() {
        // Load token data from localStorage
        const storedToken = localStorage.getItem('selected_token');
        if (storedToken) {
            this.tokenData = JSON.parse(storedToken);
            this.loadTokenData();
        } else {
            // Generate sample data if no token selected
            this.generateSampleToken();
        }

        this.setupEventListeners();
        this.initializeSwap();
    }

    generateSampleToken() {
        this.tokenData = {
            name: 'SPARKDEMO',
            contract: '0x1234567890123456789012345678901234567890',
            chain: 'ETH',
            risk: 'low',
            riskScore: 25,
            price: '0.00000543',
            marketCap: 2450000,
            volume24h: 156000,
            liquidity: 89000,
            holders: 1847,
            socialScore: {
                twitter: 75,
                discord: 82,
                telegram: 68,
                website: true
            },
            safeToTrade: true,
            timestamp: new Date().toISOString()
        };
    }

    loadTokenData() {
        this.renderTokenHeader();
        this.renderQuickStats();
        this.renderSecurityAnalysis();
        this.renderSocialSentiment();
        this.renderContractInfo();
        this.renderRiskAssessment();
        this.initializePriceChart();
        this.updateSwapInterface();
    }

    renderTokenHeader() {
        const header = document.getElementById('token-header');
        const riskColor = this.tokenData.risk === 'high' ? 'text-red-400' : 
                         this.tokenData.risk === 'medium' ? 'text-yellow-400' : 'text-green-400';
        
        header.innerHTML = `
            <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                            <span class="text-white font-bold text-xl">${this.tokenData.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold">${this.tokenData.name}</h1>
                            <p class="text-gray-400 font-mono">${this.tokenData.contract}</p>
                            <div class="flex items-center space-x-3 mt-2">
                                <span class="px-2 py-1 bg-gray-700 rounded text-sm">${this.tokenData.chain}</span>
                                <span class="px-3 py-1 rounded-full border ${this.tokenData.risk === 'high' ? 'border-red-500 text-red-400' : this.tokenData.risk === 'medium' ? 'border-yellow-500 text-yellow-400' : 'border-green-500 text-green-400'}">
                                    Risk Score: ${this.tokenData.riskScore}/100
                                </span>
                                ${this.tokenData.safeToTrade ? '<span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">✅ Safe to Trade</span>' : '<span class="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">⚠️ High Risk</span>'}
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold">${this.tokenData.price}</div>
                        <div class="text-gray-400">USD</div>
                        <div class="flex items-center space-x-2 mt-2">
                            <span class="text-green-400 text-sm">
                                <i class="fas fa-arrow-up"></i> +12.5%
                            </span>
                            <span class="text-gray-400 text-sm">24h</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderQuickStats() {
        const stats = document.getElementById('quick-stats');
        stats.innerHTML = `
            <div class="flex justify-between">
                <span class="text-gray-400">Market Cap</span>
                <span class="font-semibold">$${this.formatNumber(this.tokenData.marketCap)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">24h Volume</span>
                <span class="font-semibold">$${this.formatNumber(this.tokenData.volume24h)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Liquidity</span>
                <span class="font-semibold">$${this.formatNumber(this.tokenData.liquidity)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Holders</span>
                <span class="font-semibold">${this.tokenData.holders.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Chain</span>
                <span class="font-semibold">${this.tokenData.chain}</span>
            </div>
            <div class="border-t border-gray-700 pt-3 mt-3">
                <div class="text-center">
                    <div class="text-2xl font-bold ${this.tokenData.risk === 'high' ? 'text-red-400' : this.tokenData.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'}">${this.tokenData.riskScore}/100</div>
                    <div class="text-sm text-gray-400">Risk Score</div>
                </div>
            </div>
        `;
    }

    renderSecurityAnalysis() {
        const analysis = document.getElementById('security-analysis');
        const checks = [
            { name: 'Contract Verified', status: this.tokenData.riskScore < 70, icon: 'fa-shield-alt' },
            { name: 'Liquidity Locked', status: this.tokenData.riskScore < 50, icon: 'fa-lock' },
            { name: 'No Honeypot', status: this.tokenData.riskScore < 40, icon: 'fa-bee' },
            { name: 'Ownership Renounced', status: this.tokenData.riskScore < 60, icon: 'fa-user-slash' },
            { name: 'No Mint Function', status: this.tokenData.riskScore < 35, icon: 'fa-ban' },
            { name: 'Trading Enabled', status: this.tokenData.riskScore < 80, icon: 'fa-exchange-alt' }
        ];

        analysis.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                ${checks.map(check => `
                    <div class="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                        <i class="fas ${check.icon} ${check.status ? 'text-green-400' : 'text-red-400'}"></i>
                        <div>
                            <div class="text-sm font-medium">${check.name}</div>
                            <div class="text-xs ${check.status ? 'text-green-400' : 'text-red-400'}">
                                ${check.status ? 'Passed' : 'Failed'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-4 p-4 bg-gray-700/30 rounded-lg">
                <h4 class="font-medium mb-2">AI Analysis Summary</h4>
                <p class="text-sm text-gray-300">
                    ${this.generateAnalysisSummary()}
                </p>
            </div>
        `;
    }

    generateAnalysisSummary() {
        if (this.tokenData.riskScore < 30) {
            return "This token shows strong security fundamentals with verified contract, locked liquidity, and renounced ownership. Risk level is considered low for trading.";
        } else if (this.tokenData.riskScore < 70) {
            return "Token shows mixed security indicators. Some concerning patterns detected but overall risk is manageable. Proceed with caution.";
        } else {
            return "High risk token detected. Multiple red flags including potential honeypot characteristics and suspicious contract patterns. Avoid trading.";
        }
    }

    renderSocialSentiment() {
        const sentiment = document.getElementById('social-sentiment');
        sentiment.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-2">
                            <i class="fab fa-twitter text-blue-400"></i>
                            <span class="font-medium">Twitter</span>
                        </div>
                        <span class="text-lg font-bold ${this.getScoreColor(this.tokenData.socialScore.twitter)}">${this.tokenData.socialScore.twitter}</span>
                    </div>
                    <div class="w-full bg-gray-600 rounded-full h-2">
                        <div class="h-2 rounded-full bg-blue-400 transition-all duration-500" style="width: ${this.tokenData.socialScore.twitter}%"></div>
                    </div>
                </div>
                
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-2">
                            <i class="fab fa-discord text-purple-400"></i>
                            <span class="font-medium">Discord</span>
                        </div>
                        <span class="text-lg font-bold ${this.getScoreColor(this.tokenData.socialScore.discord)}">${this.tokenData.socialScore.discord}</span>
                    </div>
                    <div class="w-full bg-gray-600 rounded-full h-2">
                        <div class="h-2 rounded-full bg-purple-400 transition-all duration-500" style="width: ${this.tokenData.socialScore.discord}%"></div>
                    </div>
                </div>
                
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-2">
                            <i class="fab fa-telegram text-blue-300"></i>
                            <span class="font-medium">Telegram</span>
                        </div>
                        <span class="text-lg font-bold ${this.getScoreColor(this.tokenData.socialScore.telegram)}">${this.tokenData.socialScore.telegram}</span>
                    </div>
                    <div class="w-full bg-gray-600 rounded-full h-2">
                        <div class="h-2 rounded-full bg-blue-300 transition-all duration-500" style="width: ${this.tokenData.socialScore.telegram}%"></div>
                    </div>
                </div>
                
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-globe text-green-400"></i>
                            <span class="font-medium">Website</span>
                        </div>
                        <i class="fas ${this.tokenData.socialScore.website ? 'fa-check text-green-400' : 'fa-times text-red-400'}"></i>
                    </div>
                    <div class="text-sm ${this.tokenData.socialScore.website ? 'text-green-400' : 'text-red-400'}">
                        ${this.tokenData.socialScore.website ? 'Official Website Available' : 'No Official Website'}
                    </div>
                </div>
            </div>
            
            <div class="mt-4 p-4 bg-gray-700/30 rounded-lg">
                <h4 class="font-medium mb-2">Social Summary</h4>
                <p class="text-sm text-gray-300">${this.generateSocialSummary()}</p>
            </div>
        `;
    }

    generateSocialSummary() {
        const avgScore = (this.tokenData.socialScore.twitter + this.tokenData.socialScore.discord + this.tokenData.socialScore.telegram) / 3;
        
        if (avgScore > 70) {
            return "Strong social presence across all platforms. Active community engagement and positive sentiment indicators.";
        } else if (avgScore > 40) {
            return "Moderate social activity with mixed engagement levels. Some platforms show stronger presence than others.";
        } else {
            return "Limited social presence. Low engagement levels may indicate lack of genuine community interest.";
        }
    }

    renderContractInfo() {
        const info = document.getElementById('contract-info');
        info.innerHTML = `
            <div class="flex justify-between">
                <span class="text-gray-400">Contract Address</span>
                <div class="flex items-center space-x-2">
                    <span class="font-mono text-sm">${this.tokenData.contract.slice(0, 8)}...${this.tokenData.contract.slice(-6)}</span>
                    <button onclick="navigator.clipboard.writeText('${this.tokenData.contract}')" class="text-gray-400 hover:text-white">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Token Standard</span>
                <span>ERC-20</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Decimals</span>
                <span>18</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Total Supply</span>
                <span>1,000,000,000</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Creator</span>
                <span class="font-mono text-sm">0x742d...32c1</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Creation Date</span>
                <span>${new Date(this.tokenData.timestamp).toLocaleDateString()}</span>
            </div>
        `;
    }

    renderRiskAssessment() {
        const assessment = document.getElementById('risk-assessment');
        const riskLevel = this.tokenData.risk;
        const riskScore = this.tokenData.riskScore;
        
        assessment.innerHTML = `
            <div class="text-center mb-4">
                <div class="text-4xl font-bold ${riskLevel === 'high' ? 'text-red-400' : riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'}">${riskScore}</div>
                <div class="text-sm text-gray-400">Risk Score (0-100)</div>
            </div>
            
            <div class="w-full bg-gray-700 rounded-full h-4 mb-4">
                <div class="h-4 rounded-full transition-all duration-1000 ${riskLevel === 'high' ? 'bg-red-500' : riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}" style="width: ${riskScore}%"></div>
            </div>
            
            <div class="space-y-2">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 ${riskScore < 30 ? 'bg-green-500' : 'bg-gray-600'} rounded-full"></div>
                    <span class="text-sm ${riskScore < 30 ? 'text-green-400' : 'text-gray-400'}">Low Risk (0-30)</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 ${riskScore >= 30 && riskScore < 70 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full"></div>
                    <span class="text-sm ${riskScore >= 30 && riskScore < 70 ? 'text-yellow-400' : 'text-gray-400'}">Medium Risk (30-70)</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 ${riskScore >= 70 ? 'bg-red-500' : 'bg-gray-600'} rounded-full"></div>
                    <span class="text-sm ${riskScore >= 70 ? 'text-red-400' : 'text-gray-400'}">High Risk (70-100)</span>
                </div>
            </div>
            
            <div class="mt-4 p-3 ${riskLevel === 'high' ? 'bg-red-500/10 border border-red-500/50' : riskLevel === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/50' : 'bg-green-500/10 border border-green-500/50'} rounded-lg">
                <div class="font-medium ${riskLevel === 'high' ? 'text-red-400' : riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'} mb-1">
                    ${riskLevel === 'high' ? 'HIGH RISK - AVOID TRADING' : riskLevel === 'medium' ? 'MEDIUM RISK - TRADE WITH CAUTION' : 'LOW RISK - SAFE TO TRADE'}
                </div>
                <p class="text-xs ${riskLevel === 'high' ? 'text-red-300' : riskLevel === 'medium' ? 'text-yellow-300' : 'text-green-300'}">
                    ${this.getRiskMessage()}
                </p>
            </div>
        `;
    }

    getRiskMessage() {
        if (this.tokenData.riskScore < 30) {
            return "This token has passed all security checks and shows strong fundamentals. Safe for trading.";
        } else if (this.tokenData.riskScore < 70) {
            return "Some security concerns detected. Recommend additional research before trading.";
        } else {
            return "Multiple red flags detected. High probability of scam or malicious contract.";
        }
    }

    initializePriceChart() {
        const ctx = document.getElementById('price-chart');
        if (!ctx) return;

        // Generate sample price data
        const labels = [];
        const prices = [];
        const basePrice = parseFloat(this.tokenData.price);
        
        for (let i = 23; i >= 0; i--) {
            const date = new Date();
            date.setHours(date.getHours() - i);
            labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
            
            const volatility = (Math.random() - 0.5) * 0.2;
            const price = basePrice * (1 + volatility);
            prices.push(price);
        }

        this.priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price (USD)',
                    data: prices,
                    borderColor: '#9333ea',
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
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
                            color: '#9ca3af',
                            callback: function(value) {
                                return '$' + value.toFixed(8);
                            }
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

    initializeSwap() {
        const fromAmount = document.getElementById('from-amount');
        const toAmount = document.getElementById('to-amount');
        const swapRate = document.getElementById('swap-rate');
        const rateSymbol = document.getElementById('rate-symbol');
        const tokenSymbol = document.getElementById('token-symbol');
        const tokenName = document.getElementById('token-name');
        const riskWarning = document.getElementById('risk-warning');
        const swapBtn = document.getElementById('swap-btn');

        // Update token info in swap
        tokenSymbol.textContent = this.tokenData.name.substring(0, 3);
        tokenName.textContent = this.tokenData.name;
        rateSymbol.textContent = this.tokenData.name;
        
        // Calculate exchange rate
        const rate = (1 / parseFloat(this.tokenData.price)).toFixed(0);
        swapRate.textContent = parseInt(rate).toLocaleString();

        // Show risk warning if high risk
        if (this.tokenData.riskScore > 50) {
            riskWarning.classList.remove('hidden');
        }

        // Handle amount changes
        fromAmount.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value) || 0;
            const outputAmount = amount * parseFloat(rate);
            toAmount.value = outputAmount.toLocaleString();
        });

        // Handle swap button
        swapBtn.addEventListener('click', () => {
            if (this.tokenData.riskScore > 50) {
                alert('WARNING: This is a high-risk token. Trading is not recommended.');
                return;
            }
            alert('Swap functionality is in demo mode. Connect a real wallet to trade.');
        });
    }

    updateSwapInterface() {
        // Update swap interface based on wallet connection
        const swapBtn = document.getElementById('swap-btn');
        
        // Check if wallet is connected (from main app)
        const walletConnected = localStorage.getItem('sparkrush_wallet');
        
        if (walletConnected) {
            swapBtn.textContent = this.tokenData.riskScore > 50 ? 'High Risk - Trade Anyway' : 'Swap Tokens';
            swapBtn.className = `w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                this.tokenData.riskScore > 50 ? 
                'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
                'bg-gradient-to-r from-accent to-secondary hover:from-accent/80 hover:to-secondary/80'
            }`;
        }
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            location.reload();
        });

        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.updatePriceData();
        }, 30000);
    }

    updatePriceData() {
        // Simulate price updates
        const priceChange = (Math.random() - 0.5) * 0.1;
        const newPrice = parseFloat(this.tokenData.price) * (1 + priceChange);
        this.tokenData.price = newPrice.toFixed(8);
        
        // Update price display
        const priceElement = document.querySelector('#token-header .text-3xl.font-bold');
        if (priceElement) {
            priceElement.textContent = this.tokenData.price;
        }
        
        // Update chart if exists
        if (this.priceChart) {
            this.priceChart.data.datasets[0].data.push(newPrice);
            this.priceChart.data.datasets[0].data.shift();
            
            const now = new Date();
            this.priceChart.data.labels.push(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
            this.priceChart.data.labels.shift();
            
            this.priceChart.update('none');
        }
    }

    getScoreColor(score) {
        if (score > 70) return 'text-green-400';
        if (score > 40) return 'text-yellow-400';
        return 'text-red-400';
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TokenDashboard();
});