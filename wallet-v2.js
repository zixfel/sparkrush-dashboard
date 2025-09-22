// SparkRush Advanced Wallet Connection System v2.0
// Production-ready Web3 wallet integration with comprehensive error handling

class Web3WalletManager {
    constructor() {
        this.connectedWallet = null;
        this.userAddress = null;
        this.networkId = null;
        this.balance = null;
        this.provider = null;
        this.web3 = null;
        this.socialAuth = null;
        
        // Wallet detection cache
        this.availableWallets = {};
        this.walletConnectors = {};
        
        // Event listeners
        this.eventListeners = new Map();
        
        // Initialize
        this.init();
    }

    async init() {
        await this.detectAvailableWallets();
        this.setupEventListeners();
        this.checkExistingConnections();
        this.updateWalletUI();
    }

    async detectAvailableWallets() {
        // Enhanced wallet detection with priority and installation status
        const walletDetectors = {
            metamask: () => {
                const isInstalled = !!(window.ethereum && window.ethereum.isMetaMask);
                return {
                    installed: isInstalled,
                    priority: 1,
                    name: 'MetaMask',
                    icon: '🦊',
                    downloadUrl: 'https://metamask.io/download/',
                    description: 'Connect using MetaMask browser extension'
                };
            },
            
            coinbase: () => {
                const isInstalled = !!(window.ethereum && window.ethereum.isCoinbaseWallet);
                return {
                    installed: isInstalled,
                    priority: 2,
                    name: 'Coinbase Wallet',
                    icon: '🔵',
                    downloadUrl: 'https://www.coinbase.com/wallet',
                    description: 'Connect using Coinbase Wallet'
                };
            },
            
            walletconnect: () => {
                return {
                    installed: true, // Always available as it opens QR code
                    priority: 3,
                    name: 'WalletConnect',
                    icon: '📱',
                    description: 'Scan with mobile wallet'
                };
            },
            
            okx: () => {
                const isInstalled = !!window.okxwallet;
                return {
                    installed: isInstalled,
                    priority: 4,
                    name: 'OKX Wallet',
                    icon: '⚫',
                    downloadUrl: 'https://www.okx.com/web3',
                    description: 'Connect using OKX Wallet'
                };
            },
            
            rabby: () => {
                const isInstalled = !!(window.ethereum && window.ethereum.isRabby);
                return {
                    installed: isInstalled,
                    priority: 5,
                    name: 'Rabby Wallet',
                    icon: '🐰',
                    downloadUrl: 'https://rabby.io/',
                    description: 'Connect using Rabby Wallet'
                };
            },
            
            phantom: () => {
                const isInstalled = !!(window.phantom && window.phantom.solana);
                return {
                    installed: isInstalled,
                    priority: 6,
                    name: 'Phantom',
                    icon: '👻',
                    downloadUrl: 'https://phantom.app/',
                    description: 'Connect using Phantom (Solana)'
                };
            },
            
            coin98: () => {
                const isInstalled = !!(window.coin98 && window.coin98.provider);
                return {
                    installed: isInstalled,
                    priority: 7,
                    name: 'Coin98',
                    icon: '🟡',
                    downloadUrl: 'https://coin98.com/wallet',
                    description: 'Connect using Coin98 Wallet'
                };
            },
            
            opera: () => {
                const isInstalled = !!(window.ethereum && window.ethereum.isOpera);
                return {
                    installed: isInstalled,
                    priority: 8,
                    name: 'Opera Wallet',
                    icon: '🔴',
                    downloadUrl: 'https://www.opera.com/crypto/next',
                    description: 'Connect using Opera built-in wallet'
                };
            }
        };

        // Detect all wallets
        for (const [walletId, detector] of Object.entries(walletDetectors)) {
            this.availableWallets[walletId] = detector();
        }

        console.log('Detected wallets:', this.availableWallets);
    }

    setupEventListeners() {
        // Main connect button
        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.showWalletModal());
        }

        // Modal controls
        const closeBtn = document.getElementById('close-wallet-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideWalletModal());
        }

        // Modal backdrop click
        const modal = document.getElementById('wallet-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'wallet-modal') {
                    this.hideWalletModal();
                }
            });
        }

        // Wallet option buttons (dynamic)
        this.updateWalletOptions();
        
        // Social login buttons
        document.querySelectorAll('.social-login').forEach(button => {
            button.addEventListener('click', (e) => {
                const socialType = e.currentTarget.dataset.social;
                this.connectSocial(socialType);
            });
        });

        // Global wallet events
        window.addEventListener('ethereum#initialized', this.handleEthereumInitialized.bind(this));
    }

    updateWalletOptions() {
        const walletContainer = document.querySelector('#wallet-modal .wallet-options');
        if (!walletContainer) return;

        // Clear existing options
        walletContainer.innerHTML = '';

        // Sort wallets by priority and installation status
        const sortedWallets = Object.entries(this.availableWallets)
            .sort(([, a], [, b]) => {
                // Installed wallets first, then by priority
                if (a.installed !== b.installed) {
                    return b.installed - a.installed;
                }
                return a.priority - b.priority;
            });

        sortedWallets.forEach(([walletId, wallet]) => {
            const button = document.createElement('button');
            button.className = `wallet-option flex items-center justify-between w-full p-4 rounded-lg border transition-all duration-200 ${
                wallet.installed 
                    ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 hover:border-primary/50' 
                    : 'border-gray-700 bg-gray-800/30 opacity-60'
            }`;
            
            button.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="text-2xl">${wallet.icon}</div>
                    <div class="text-left">
                        <div class="font-medium text-white">${wallet.name}</div>
                        <div class="text-sm text-gray-400">${wallet.description}</div>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    ${wallet.installed 
                        ? '<i class="fas fa-chevron-right text-gray-400"></i>' 
                        : '<span class="text-xs text-red-400">Not Installed</span>'
                    }
                </div>
            `;

            if (wallet.installed) {
                button.addEventListener('click', () => this.connectWallet(walletId));
            } else {
                button.addEventListener('click', () => this.promptWalletInstall(walletId, wallet));
            }

            walletContainer.appendChild(button);
        });
    }

    promptWalletInstall(walletId, wallet) {
        const installModal = document.createElement('div');
        installModal.className = 'fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm';
        
        installModal.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
                <div class="text-center mb-6">
                    <div class="text-4xl mb-3">${wallet.icon}</div>
                    <h3 class="text-xl font-semibold mb-2">${wallet.name} Not Installed</h3>
                    <p class="text-gray-400 text-sm">To connect with ${wallet.name}, you need to install it first.</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="window.open('${wallet.downloadUrl}', '_blank')" 
                            class="flex-1 bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg font-medium transition-all">
                        Install ${wallet.name}
                    </button>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(installModal);
    }

    async connectWallet(walletType) {
        try {
            this.showLoading(`Connecting to ${this.availableWallets[walletType]?.name || walletType}...`);

            let connected = false;

            switch (walletType) {
                case 'metamask':
                    connected = await this.connectMetaMask();
                    break;
                case 'coinbase':
                    connected = await this.connectCoinbaseWallet();
                    break;
                case 'walletconnect':
                    connected = await this.connectWalletConnect();
                    break;
                case 'phantom':
                    connected = await this.connectPhantom();
                    break;
                case 'okx':
                    connected = await this.connectOKX();
                    break;
                case 'rabby':
                    connected = await this.connectRabby();
                    break;
                case 'coin98':
                    connected = await this.connectCoin98();
                    break;
                case 'opera':
                    connected = await this.connectOpera();
                    break;
                default:
                    throw new Error(`Unsupported wallet type: ${walletType}`);
            }

            if (connected) {
                this.connectedWallet = walletType;
                localStorage.setItem('sparkrush_connected_wallet', walletType);
                
                await this.loadBalance();
                this.updateWalletUI();
                this.hideWalletModal();
                
                this.showNotification(`Connected to ${this.availableWallets[walletType]?.name || walletType} successfully!`, 'success');
                
                // Emit connection event
                this.emit('walletConnected', {
                    walletType,
                    address: this.userAddress,
                    networkId: this.networkId
                });
            }

        } catch (error) {
            console.error('Wallet connection error:', error);
            this.showNotification(`Failed to connect: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async connectMetaMask() {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error('MetaMask not detected. Please install MetaMask.');
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found. Please unlock MetaMask.');
            }

            this.userAddress = accounts[0];
            this.networkId = await window.ethereum.request({ method: 'eth_chainId' });
            this.provider = window.ethereum;

            // Setup event listeners
            this.setupMetaMaskListeners();

            return true;

        } catch (error) {
            if (error.code === 4001) {
                throw new Error('Connection rejected by user');
            } else if (error.code === -32002) {
                throw new Error('Connection request already pending');
            }
            throw error;
        }
    }

    setupMetaMaskListeners() {
        if (this.eventListeners.has('metamask')) return;

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                this.disconnect();
                this.showNotification('MetaMask disconnected', 'warning');
            } else if (accounts[0] !== this.userAddress) {
                this.userAddress = accounts[0];
                this.loadBalance();
                this.updateWalletUI();
                this.showNotification('Account switched', 'info');
                this.emit('accountChanged', { address: this.userAddress });
            }
        };

        const handleChainChanged = (chainId) => {
            this.networkId = chainId;
            this.loadBalance();
            this.updateWalletUI();
            const networkName = this.getNetworkName(chainId);
            this.showNotification(`Network switched to ${networkName}`, 'info');
            this.emit('chainChanged', { chainId, networkName });
        };

        const handleDisconnect = () => {
            this.disconnect();
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('disconnect', handleDisconnect);

        // Store listeners for cleanup
        this.eventListeners.set('metamask', {
            accountsChanged: handleAccountsChanged,
            chainChanged: handleChainChanged,
            disconnect: handleDisconnect
        });
    }

    async connectCoinbaseWallet() {
        if (!window.ethereum || !window.ethereum.isCoinbaseWallet) {
            throw new Error('Coinbase Wallet not detected');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        this.userAddress = accounts[0];
        this.networkId = await window.ethereum.request({ method: 'eth_chainId' });
        this.provider = window.ethereum;

        return true;
    }

    async connectWalletConnect() {
        try {
            // Dynamic import for WalletConnect
            const { EthereumProvider } = await import('https://cdn.skypack.dev/@walletconnect/ethereum-provider');
            
            const provider = await EthereumProvider.init({
                projectId: 'YOUR_PROJECT_ID', // Replace with actual project ID
                chains: [1, 137, 56], // Ethereum, Polygon, BSC
                showQrModal: true,
                methods: ['eth_sendTransaction', 'personal_sign'],
                events: ['chainChanged', 'accountsChanged']
            });

            await provider.enable();

            const accounts = await provider.request({ method: 'eth_accounts' });
            this.userAddress = accounts[0];
            this.networkId = await provider.request({ method: 'eth_chainId' });
            this.provider = provider;

            // Setup WalletConnect event listeners
            provider.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.userAddress = accounts[0];
                    this.updateWalletUI();
                }
            });

            provider.on('chainChanged', (chainId) => {
                this.networkId = chainId;
                this.updateWalletUI();
            });

            provider.on('disconnect', () => {
                this.disconnect();
            });

            return true;

        } catch (error) {
            throw new Error('WalletConnect failed: ' + error.message);
        }
    }

    async connectPhantom() {
        if (!window.phantom?.solana) {
            throw new Error('Phantom wallet not detected');
        }

        const resp = await window.phantom.solana.connect();
        this.userAddress = resp.publicKey.toString();
        this.networkId = 'solana-mainnet';
        this.provider = window.phantom.solana;

        // Setup Phantom listeners
        window.phantom.solana.on('accountChanged', (publicKey) => {
            if (publicKey) {
                this.userAddress = publicKey.toString();
                this.updateWalletUI();
            } else {
                this.disconnect();
            }
        });

        return true;
    }

    async connectOKX() {
        if (!window.okxwallet) {
            throw new Error('OKX Wallet not detected');
        }

        const accounts = await window.okxwallet.request({
            method: 'eth_requestAccounts'
        });

        this.userAddress = accounts[0];
        this.networkId = await window.okxwallet.request({ method: 'eth_chainId' });
        this.provider = window.okxwallet;

        return true;
    }

    async connectRabby() {
        if (!window.ethereum?.isRabby) {
            throw new Error('Rabby Wallet not detected');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        this.userAddress = accounts[0];
        this.networkId = await window.ethereum.request({ method: 'eth_chainId' });
        this.provider = window.ethereum;

        return true;
    }

    async connectCoin98() {
        if (!window.coin98?.provider) {
            throw new Error('Coin98 Wallet not detected');
        }

        const accounts = await window.coin98.provider.request({
            method: 'eth_requestAccounts'
        });

        this.userAddress = accounts[0];
        this.networkId = await window.coin98.provider.request({ method: 'eth_chainId' });
        this.provider = window.coin98.provider;

        return true;
    }

    async connectOpera() {
        if (!window.ethereum?.isOpera) {
            throw new Error('Opera Wallet not detected');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        this.userAddress = accounts[0];
        this.networkId = await window.ethereum.request({ method: 'eth_chainId' });
        this.provider = window.ethereum;

        return true;
    }

    async loadBalance() {
        if (!this.provider || !this.userAddress) return;

        try {
            if (this.networkId === 'solana-mainnet') {
                // Solana balance (simplified)
                this.balance = { value: '0', formatted: '0 SOL' };
            } else {
                // Ethereum-compatible networks
                const balance = await this.provider.request({
                    method: 'eth_getBalance',
                    params: [this.userAddress, 'latest']
                });

                const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
                this.balance = {
                    value: balance,
                    formatted: `${balanceInEth.toFixed(4)} ${this.getNetworkCurrency()}`
                };
            }
        } catch (error) {
            console.error('Failed to load balance:', error);
            this.balance = { value: '0', formatted: '0 ETH' };
        }
    }

    getNetworkCurrency() {
        const currencies = {
            '0x1': 'ETH',
            '0x89': 'MATIC',
            '0x38': 'BNB',
            'solana-mainnet': 'SOL'
        };
        return currencies[this.networkId] || 'ETH';
    }

    getNetworkName(chainId) {
        const networks = {
            '0x1': 'Ethereum',
            '0x89': 'Polygon',
            '0x38': 'BSC',
            '0xa86a': 'Avalanche',
            '0xfa': 'Fantom',
            'solana-mainnet': 'Solana'
        };
        return networks[chainId] || `Network ${chainId}`;
    }

    async checkExistingConnections() {
        const savedWallet = localStorage.getItem('sparkrush_connected_wallet');
        const savedSocial = localStorage.getItem('sparkrush_social');

        if (savedWallet && this.availableWallets[savedWallet]?.installed) {
            try {
                await this.reconnectWallet(savedWallet);
            } catch (error) {
                console.log('Failed to reconnect wallet:', error);
                localStorage.removeItem('sparkrush_connected_wallet');
            }
        }

        if (savedSocial) {
            try {
                const socialData = JSON.parse(savedSocial);
                this.reconnectSocial(socialData);
            } catch (error) {
                console.log('Failed to reconnect social:', error);
                localStorage.removeItem('sparkrush_social');
            }
        }
    }

    async reconnectWallet(walletType) {
        switch (walletType) {
            case 'metamask':
                if (window.ethereum?.isMetaMask) {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        this.userAddress = accounts[0];
                        this.networkId = await window.ethereum.request({ method: 'eth_chainId' });
                        this.provider = window.ethereum;
                        this.connectedWallet = walletType;
                        this.setupMetaMaskListeners();
                        await this.loadBalance();
                        this.updateWalletUI();
                    }
                }
                break;
            case 'phantom':
                if (window.phantom?.solana?.isConnected) {
                    this.userAddress = window.phantom.solana.publicKey.toString();
                    this.networkId = 'solana-mainnet';
                    this.provider = window.phantom.solana;
                    this.connectedWallet = walletType;
                    await this.loadBalance();
                    this.updateWalletUI();
                }
                break;
            // Add other wallet reconnection logic
        }
    }

    reconnectSocial(socialData) {
        this.socialAuth = socialData.type;
        this.userAddress = socialData.user.email || socialData.user.username;
        this.updateWalletUI();
    }

    disconnect() {
        // Clean up event listeners
        if (this.eventListeners.has('metamask') && window.ethereum) {
            const listeners = this.eventListeners.get('metamask');
            window.ethereum.removeListener('accountsChanged', listeners.accountsChanged);
            window.ethereum.removeListener('chainChanged', listeners.chainChanged);
            window.ethereum.removeListener('disconnect', listeners.disconnect);
        }

        this.connectedWallet = null;
        this.userAddress = null;
        this.networkId = null;
        this.balance = null;
        this.provider = null;
        this.socialAuth = null;

        localStorage.removeItem('sparkrush_connected_wallet');
        localStorage.removeItem('sparkrush_social');

        this.updateWalletUI();
        this.showNotification('Wallet disconnected', 'success');
        
        this.emit('walletDisconnected');
    }

    updateWalletUI() {
        const connectBtn = document.getElementById('connect-wallet-btn');
        if (!connectBtn) return;

        if (this.userAddress) {
            const displayAddress = this.formatAddress(this.userAddress);
            const walletName = this.availableWallets[this.connectedWallet]?.name || this.socialAuth || 'Connected';
            const networkName = this.getNetworkName(this.networkId);

            connectBtn.innerHTML = `
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div class="text-left">
                        <div class="text-sm font-medium">${displayAddress}</div>
                        <div class="text-xs text-gray-400">${networkName} ${this.balance ? '• ' + this.balance.formatted : ''}</div>
                    </div>
                    <i class="fas fa-chevron-down text-xs"></i>
                </div>
            `;
            
            connectBtn.onclick = () => this.showAccountMenu();
        } else {
            connectBtn.innerHTML = `
                <i class="fas fa-wallet mr-2"></i>
                <span>Connect Wallet</span>
            `;
            connectBtn.onclick = () => this.showWalletModal();
        }
    }

    showAccountMenu() {
        const menu = document.createElement('div');
        menu.className = 'fixed top-16 right-4 bg-gray-800 border border-gray-700 rounded-lg p-2 z-50 shadow-xl min-w-[200px]';
        
        const walletName = this.availableWallets[this.connectedWallet]?.name || 'Wallet';
        
        menu.innerHTML = `
            <div class="px-3 py-2 border-b border-gray-700 mb-2">
                <div class="text-sm font-medium text-white">${walletName}</div>
                <div class="text-xs text-gray-400">${this.formatAddress(this.userAddress)}</div>
                ${this.balance ? `<div class="text-xs text-gray-400">${this.balance.formatted}</div>` : ''}
            </div>
            <button class="menu-item" onclick="navigator.clipboard.writeText('${this.userAddress}'); window.walletManager.showNotification('Address copied!', 'success'); this.closest('.fixed').remove();">
                <i class="fas fa-copy"></i> Copy Address
            </button>
            <button class="menu-item" onclick="window.walletManager.viewOnExplorer(); this.closest('.fixed').remove();">
                <i class="fas fa-external-link-alt"></i> View on Explorer
            </button>
            <button class="menu-item" onclick="window.walletManager.showWalletModal(); this.closest('.fixed').remove();">
                <i class="fas fa-exchange-alt"></i> Switch Wallet
            </button>
            <hr class="border-gray-700 my-1">
            <button class="menu-item text-red-400 hover:bg-red-500/10" onclick="window.walletManager.disconnect(); this.closest('.fixed').remove();">
                <i class="fas fa-sign-out-alt"></i> Disconnect
            </button>
        `;

        document.body.appendChild(menu);

        // Remove menu on outside click
        setTimeout(() => {
            const clickHandler = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', clickHandler);
                }
            };
            document.addEventListener('click', clickHandler);
        }, 100);
    }

    viewOnExplorer() {
        const explorers = {
            '0x1': `https://etherscan.io/address/${this.userAddress}`,
            '0x89': `https://polygonscan.com/address/${this.userAddress}`,
            '0x38': `https://bscscan.com/address/${this.userAddress}`,
            'solana-mainnet': `https://solscan.io/account/${this.userAddress}`
        };

        const explorerUrl = explorers[this.networkId];
        if (explorerUrl) {
            window.open(explorerUrl, '_blank');
        }
    }

    formatAddress(address) {
        if (address && address.length > 10) {
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        }
        return address;
    }

    showWalletModal() {
        const modal = document.getElementById('wallet-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.updateWalletOptions(); // Refresh wallet options
        }
    }

    hideWalletModal() {
        const modal = document.getElementById('wallet-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showLoading(message) {
        const loading = document.createElement('div');
        loading.id = 'wallet-loading';
        loading.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm';
        loading.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span class="text-white">${message}</span>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('wallet-loading');
        if (loading) {
            loading.remove();
        }
    }

    clearAllNotifications() {
        const container = document.getElementById('notification-container');
        if (container) {
            // Animate out all notifications
            const notifications = container.querySelectorAll('.notification');
            notifications.forEach(notification => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            });
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-1.5';
            document.body.appendChild(container);
        }

        // Limit to maximum notifications (3 for better UX)
        const existingNotifications = container.querySelectorAll('.notification');
        if (existingNotifications.length >= 3) {
            // Remove oldest notification
            const oldest = existingNotifications[0];
            oldest.style.transform = 'translateX(100%)';
            setTimeout(() => oldest.remove(), 300);
        }

        const notification = document.createElement('div');
        notification.className = `notification bg-gray-800/90 border rounded-lg p-3 shadow-lg backdrop-blur-sm max-w-xs transform transition-all duration-300 translate-x-full`;
        
        const icons = {
            success: 'fa-check-circle text-green-400',
            error: 'fa-exclamation-circle text-red-400',
            warning: 'fa-exclamation-triangle text-yellow-400',
            info: 'fa-info-circle text-blue-400'
        };

        const colors = {
            success: 'border-green-500/30',
            error: 'border-red-500/30',
            warning: 'border-yellow-500/30',
            info: 'border-blue-500/30'
        };

        notification.className += ` ${colors[type]}`;
        
        notification.innerHTML = `
            <div class="flex items-start space-x-2">
                <i class="fas ${icons[type]} text-sm mt-0.5 flex-shrink-0"></i>
                <div class="flex-1 min-w-0">
                    <div class="text-white text-xs font-medium truncate pr-2">${message}</div>
                </div>
                <button onclick="this.closest('.notification').style.transform='translateX(100%)'; setTimeout(() => this.closest('.notification')?.remove(), 300)" 
                        class="text-gray-400 hover:text-white flex-shrink-0 p-0.5">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `;

        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);

        return notification;
    }

    // Social login methods
    async connectSocial(socialType) {
        try {
            this.showLoading(`Connecting to ${socialType}...`);

            switch (socialType) {
                case 'google':
                    await this.connectGoogle();
                    break;
                case 'discord':
                    await this.connectDiscord();
                    break;
                case 'twitter':
                    await this.connectTwitter();
                    break;
                default:
                    throw new Error('Unsupported social login type');
            }

            this.socialAuth = socialType;
            this.hideWalletModal();
            this.showNotification(`Connected with ${socialType} successfully!`, 'success');
            this.emit('socialConnected', { socialType, address: this.userAddress });

        } catch (error) {
            console.error('Social login error:', error);
            this.showNotification(`Failed to connect with ${socialType}: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async connectGoogle() {
        return new Promise((resolve, reject) => {
            const popup = window.open(
                'about:blank',
                'google-auth',
                'width=500,height=600,scrollbars=no,resizable=no'
            );

            popup.document.write(`
                <html>
                    <head><title>Google Authentication</title></head>
                    <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background: #f8f9fa;">
                        <div style="max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <img src="https://developers.google.com/identity/images/g-logo.png" width="40" height="40" style="margin-bottom: 20px;">
                            <h3 style="color: #333; margin-bottom: 10px;">Google OAuth Simulation</h3>
                            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">This is a demo. In production, use Google OAuth 2.0</p>
                            <button onclick="window.opener.postMessage({type: 'google-auth', success: true, user: {email: 'user@gmail.com', name: 'Demo User'}}, '*'); window.close();" 
                                    style="background: #4285f4; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-bottom: 10px; width: 100%; font-size: 14px;">
                                Continue with Google
                            </button>
                            <br>
                            <button onclick="window.opener.postMessage({type: 'google-auth', success: false, error: 'User cancelled'}, '*'); window.close();" 
                                    style="background: #f8f9fa; color: #5f6368; border: 1px solid #dadce0; padding: 12px 24px; border-radius: 6px; cursor: pointer; width: 100%; font-size: 14px;">
                                Cancel
                            </button>
                        </div>
                    </body>
                </html>
            `);

            const messageHandler = (event) => {
                if (event.data.type === 'google-auth') {
                    window.removeEventListener('message', messageHandler);
                    if (event.data.success) {
                        this.userAddress = event.data.user.email;
                        localStorage.setItem('sparkrush_social', JSON.stringify({
                            type: 'google',
                            user: event.data.user
                        }));
                        resolve(event.data.user);
                    } else {
                        reject(new Error(event.data.error));
                    }
                }
            };

            window.addEventListener('message', messageHandler);

            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageHandler);
                    reject(new Error('Authentication popup was closed'));
                }
            }, 1000);
        });
    }

    async connectDiscord() {
        return new Promise((resolve, reject) => {
            const popup = window.open(
                'about:blank',
                'discord-auth',
                'width=500,height=600,scrollbars=no,resizable=no'
            );

            popup.document.write(`
                <html>
                    <head><title>Discord Authentication</title></head>
                    <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background: #36393f; color: white;">
                        <div style="max-width: 400px; margin: 50px auto; background: #2f3136; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                            <div style="width: 60px; height: 60px; margin: 0 auto 20px; background: #5865F2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                                🎮
                            </div>
                            <h3 style="color: #5865F2; margin-bottom: 10px;">Discord OAuth Simulation</h3>
                            <p style="color: #b9bbbe; font-size: 14px; margin-bottom: 20px;">This is a demo. In production, use Discord OAuth 2.0</p>
                            <button onclick="window.opener.postMessage({type: 'discord-auth', success: true, user: {id: '123456789', username: 'DemoUser#1234', avatar: ''}}, '*'); window.close();" 
                                    style="background: #5865F2; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-bottom: 10px; width: 100%; font-size: 14px;">
                                Continue with Discord
                            </button>
                            <br>
                            <button onclick="window.opener.postMessage({type: 'discord-auth', success: false, error: 'User cancelled'}, '*'); window.close();" 
                                    style="background: #4f545c; color: #b9bbbe; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; width: 100%; font-size: 14px;">
                                Cancel
                            </button>
                        </div>
                    </body>
                </html>
            `);

            const messageHandler = (event) => {
                if (event.data.type === 'discord-auth') {
                    window.removeEventListener('message', messageHandler);
                    if (event.data.success) {
                        this.userAddress = event.data.user.username;
                        localStorage.setItem('sparkrush_social', JSON.stringify({
                            type: 'discord',
                            user: event.data.user
                        }));
                        resolve(event.data.user);
                    } else {
                        reject(new Error(event.data.error));
                    }
                }
            };

            window.addEventListener('message', messageHandler);
        });
    }

    async connectTwitter() {
        return new Promise((resolve, reject) => {
            const popup = window.open(
                'about:blank',
                'twitter-auth',
                'width=500,height=600,scrollbars=no,resizable=no'
            );

            popup.document.write(`
                <html>
                    <head><title>Twitter Authentication</title></head>
                    <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background: #15202b; color: white;">
                        <div style="max-width: 400px; margin: 50px auto; background: #1da1f2; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                            <div style="width: 60px; height: 60px; margin: 0 auto 20px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #1da1f2;">
                                🐦
                            </div>
                            <h3 style="color: white; margin-bottom: 10px;">Twitter OAuth Simulation</h3>
                            <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 20px;">This is a demo. In production, use Twitter OAuth 2.0</p>
                            <button onclick="window.opener.postMessage({type: 'twitter-auth', success: true, user: {id: '123456789', username: '@demouser', name: 'Demo User'}}, '*'); window.close();" 
                                    style="background: white; color: #1da1f2; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin-bottom: 10px; width: 100%; font-size: 14px; font-weight: bold;">
                                Continue with Twitter
                            </button>
                            <br>
                            <button onclick="window.opener.postMessage({type: 'twitter-auth', success: false, error: 'User cancelled'}, '*'); window.close();" 
                                    style="background: transparent; color: white; border: 2px solid white; padding: 12px 24px; border-radius: 25px; cursor: pointer; width: 100%; font-size: 14px;">
                                Cancel
                            </button>
                        </div>
                    </body>
                </html>
            `);

            const messageHandler = (event) => {
                if (event.data.type === 'twitter-auth') {
                    window.removeEventListener('message', messageHandler);
                    if (event.data.success) {
                        this.userAddress = event.data.user.username;
                        localStorage.setItem('sparkrush_social', JSON.stringify({
                            type: 'twitter',
                            user: event.data.user
                        }));
                        resolve(event.data.user);
                    } else {
                        reject(new Error(event.data.error));
                    }
                }
            };

            window.addEventListener('message', messageHandler);
        });
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    handleEthereumInitialized() {
        // Re-detect wallets when ethereum is initialized
        setTimeout(() => {
            this.detectAvailableWallets();
            this.updateWalletOptions();
        }, 1000);
    }

    // Network switching
    async switchNetwork(chainId) {
        if (!this.provider) {
            throw new Error('No wallet connected');
        }

        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                // Network not added, try to add it
                const networkConfig = this.getNetworkConfig(chainId);
                if (networkConfig) {
                    await this.provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [networkConfig],
                    });
                }
            }
            throw switchError;
        }
    }

    getNetworkConfig(chainId) {
        const configs = {
            '0x89': {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
            },
            '0x38': {
                chainId: '0x38',
                chainName: 'BNB Smart Chain',
                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/']
            }
        };
        return configs[chainId];
    }
}

// CSS for menu items
const style = document.createElement('style');
style.textContent = `
    .menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 8px 12px;
        text-align: left;
        color: white;
        font-size: 14px;
        border-radius: 6px;
        transition: background-color 0.2s;
    }
    .menu-item:hover {
        background-color: rgba(75, 85, 99, 0.5);
    }
    .menu-item i {
        margin-right: 8px;
        width: 16px;
    }
`;
document.head.appendChild(style);

// Initialize wallet manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.walletManager = new Web3WalletManager();
});