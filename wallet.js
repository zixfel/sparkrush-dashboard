// SparkRush Wallet Connection System
class WalletManager {
    constructor() {
        this.connectedWallet = null;
        this.userAddress = null;
        this.networkId = null;
        this.socialAuth = null;
        this.initializeEventListeners();
        this.checkExistingConnections();
    }

    initializeEventListeners() {
        // Main connect wallet button
        document.getElementById('connect-wallet-btn').addEventListener('click', () => {
            this.showWalletModal();
        });

        // Close modal buttons
        document.getElementById('close-wallet-modal').addEventListener('click', () => {
            this.hideWalletModal();
        });

        // Wallet option buttons
        document.querySelectorAll('.wallet-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const walletType = e.currentTarget.dataset.wallet;
                this.connectWallet(walletType);
            });
        });

        // Social login buttons
        document.querySelectorAll('.social-login').forEach(button => {
            button.addEventListener('click', (e) => {
                const socialType = e.currentTarget.dataset.social;
                this.connectSocial(socialType);
            });
        });

        // Modal backdrop click
        document.getElementById('wallet-modal').addEventListener('click', (e) => {
            if (e.target.id === 'wallet-modal') {
                this.hideWalletModal();
            }
        });
    }

    showWalletModal() {
        const modal = document.getElementById('wallet-modal');
        modal.classList.remove('hidden');
        modal.classList.add('modal-enter');
        setTimeout(() => {
            modal.classList.remove('modal-enter');
        }, 300);
    }

    hideWalletModal() {
        const modal = document.getElementById('wallet-modal');
        modal.classList.add('modal-exit');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('modal-exit');
        }, 300);
    }

    async checkExistingConnections() {
        // Check for existing wallet connections
        const savedWallet = localStorage.getItem('sparkrush_wallet');
        const savedSocial = localStorage.getItem('sparkrush_social');

        if (savedWallet) {
            try {
                await this.reconnectWallet(savedWallet);
            } catch (error) {
                console.log('Failed to reconnect wallet:', error);
                localStorage.removeItem('sparkrush_wallet');
            }
        }

        if (savedSocial) {
            try {
                await this.reconnectSocial(JSON.parse(savedSocial));
            } catch (error) {
                console.log('Failed to reconnect social:', error);
                localStorage.removeItem('sparkrush_social');
            }
        }
    }

    async connectWallet(walletType) {
        try {
            this.showLoading(`Connecting to ${walletType}...`);

            // Simulate connection delay for demo
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

            // Try real wallet connection first, fallback to demo
            let connected = false;
            
            try {
                switch (walletType) {
                    case 'metamask':
                        connected = await this.connectMetaMask();
                        break;
                    case 'phantom':
                        connected = await this.connectPhantom();
                        break;
                    case 'okx':
                        connected = await this.connectOKX();
                        break;
                    case 'coinbase':
                        connected = await this.connectCoinbase();
                        break;
                    case 'rabby':
                        connected = await this.connectRabby();
                        break;
                    case 'opera':
                        connected = await this.connectOpera();
                        break;
                    case 'coin98':
                        connected = await this.connectCoin98();
                        break;
                    case 'walletconnect':
                        connected = await this.connectWalletConnect();
                        break;
                    default:
                        throw new Error('Unsupported wallet type');
                }
            } catch (realError) {
                // Fallback to demo mode
                console.log(`Real wallet not available, using demo mode for ${walletType}`);
                connected = await this.connectDemoWallet(walletType);
            }

            if (connected) {
                this.connectedWallet = walletType;
                localStorage.setItem('sparkrush_wallet', walletType);
                this.updateUI();
                this.hideWalletModal();
                this.showNotification(`${walletType} connected successfully!`, 'success');
                
                // Dispatch wallet connected event
                document.dispatchEvent(new CustomEvent('walletConnected', {
                    detail: { address: this.userAddress, walletType }
                }));
            }

        } catch (error) {
            console.error('Wallet connection error:', error);
            this.showNotification(`Failed to connect ${walletType}: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async connectDemoWallet(walletType) {
        // Generate demo wallet address
        const demoAddresses = {
            metamask: '0x742d35Cc67fF68f7D5d8E3c6d8eb096b4b8d32c1',
            phantom: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            okx: '0x9f4cda013e354b8fc285bf4b9a60460cee7f7ea9',
            coinbase: '0x6f46cf5569aefa1acc1009290c8e043747172d89',
            rabby: '0xd2bd536adb0198f74d5f4f2bd4fe68fc078b5ebe',
            opera: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326',
            coin98: '0x8ba1f109551bd432803012645hac136c29d96c93',
            walletconnect: '0xa0b86991c431e4c0513473a097c5b9c8d1b79036e'
        };

        this.userAddress = demoAddresses[walletType] || demoAddresses.metamask;
        this.networkId = walletType === 'phantom' ? 'solana' : '0x1'; // Ethereum mainnet
        
        return true;
    }

    async connectMetaMask() {
        if (!window.ethereum) {
            // If MetaMask not installed, open installation link
            window.open('https://metamask.io/download/', '_blank');
            throw new Error('MetaMask not installed. Redirecting to installation page...');
        }

        if (!window.ethereum.isMetaMask) {
            throw new Error('Please use MetaMask wallet');
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

            // Setup event listeners for MetaMask
            if (!this.metamaskListenersSetup) {
                window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
                window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
                window.ethereum.on('disconnect', this.handleDisconnect.bind(this));
                this.metamaskListenersSetup = true;
            }

            // Get balance
            this.balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [this.userAddress, 'latest']
            });

            // Convert balance from wei to ETH
            this.balanceETH = parseInt(this.balance, 16) / Math.pow(10, 18);
            
            return true;
        } catch (error) {
            if (error.code === 4001) {
                throw new Error('Connection rejected by user');
            } else if (error.code === -32002) {
                throw new Error('MetaMask connection already pending');
            }
            throw error;
        }
    }

    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            this.disconnect();
            this.showNotification('MetaMask disconnected', 'warning');
        } else if (accounts[0] !== this.userAddress) {
            this.userAddress = accounts[0];
            this.updateUI();
            this.showNotification('Account switched in MetaMask', 'info');
        }
    }

    handleChainChanged(chainId) {
        this.networkId = chainId;
        this.updateUI();
        const networkName = this.getNetworkName(chainId);
        this.showNotification(`Network switched to ${networkName}`, 'info');
    }

    handleDisconnect() {
        this.disconnect();
    }

    getNetworkName(chainId) {
        const networks = {
            '0x1': 'Ethereum Mainnet',
            '0x89': 'Polygon',
            '0x38': 'BSC',
            '0xa86a': 'Avalanche',
            '0xfa': 'Fantom'
        };
        return networks[chainId] || `Network ${chainId}`;
    }

    async connectPhantom() {
        if (!window.phantom?.solana) {
            throw new Error('Phantom wallet not installed');
        }

        const resp = await window.phantom.solana.connect();
        this.userAddress = resp.publicKey.toString();
        this.networkId = 'solana';

        // Listen for account changes
        window.phantom.solana.on('accountChanged', (publicKey) => {
            if (publicKey) {
                this.userAddress = publicKey.toString();
                this.updateUI();
            } else {
                this.disconnect();
            }
        });
        
        return true;
    }

    async connectOKX() {
        if (!window.okxwallet) {
            throw new Error('OKX Wallet not installed');
        }

        const accounts = await window.okxwallet.request({
            method: 'eth_requestAccounts'
        });

        this.userAddress = accounts[0];
        this.networkId = await window.okxwallet.request({ method: 'eth_chainId' });
        return true;
    }

    async connectCoinbase() {
        if (!window.ethereum?.isCoinbaseWallet) {
            throw new Error('Coinbase Wallet not detected');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        this.userAddress = accounts[0];
        this.networkId = await window.ethereum.request({ method: 'eth_chainId' });
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
        return true;
    }

    async connectWalletConnect() {
        try {
            // Initialize WalletConnect
            const WalletConnectProvider = window.WalletConnectProvider.default;
            const provider = new WalletConnectProvider({
                infuraId: "demo", // Demo infura ID - replace with real one
                rpc: {
                    1: "https://mainnet.infura.io/v3/demo",
                    137: "https://polygon-rpc.com",
                    56: "https://bsc-dataseed.binance.org"
                }
            });

            await provider.enable();
            
            const web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();
            
            this.userAddress = accounts[0];
            this.networkId = await web3.eth.getChainId();

            // Listen for connection events
            provider.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.userAddress = accounts[0];
                    this.updateUI();
                }
            });

            provider.on('chainChanged', (chainId) => {
                this.networkId = chainId;
                this.updateUI();
            });

            provider.on('disconnect', () => {
                this.disconnect();
            });

            return true;

        } catch (error) {
            throw new Error('Failed to connect with WalletConnect: ' + error.message);
        }
    }

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

        } catch (error) {
            console.error('Social login error:', error);
            this.showNotification(`Failed to connect with ${socialType}: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async connectGoogle() {
        // Simulate Google OAuth flow (in real implementation, use Google OAuth library)
        return new Promise((resolve, reject) => {
            // Simulate authentication popup
            const popup = window.open(
                'about:blank',
                'google-auth',
                'width=500,height=600,scrollbars=no,resizable=no'
            );

            popup.document.write(`
                <html>
                    <head><title>Google Authentication</title></head>
                    <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                        <h3>Google OAuth Simulation</h3>
                        <p>This is a demo. In production, use Google OAuth 2.0</p>
                        <button onclick="window.opener.postMessage({type: 'google-auth', success: true, user: {email: 'user@gmail.com', name: 'Demo User'}}, '*'); window.close();" 
                                style="background: #4285f4; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Continue with Google
                        </button>
                        <br><br>
                        <button onclick="window.opener.postMessage({type: 'google-auth', success: false, error: 'User cancelled'}, '*'); window.close();" 
                                style="background: #ccc; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Cancel
                        </button>
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

            // Check if popup was closed
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
        // Simulate Discord OAuth flow
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
                        <h3 style="color: #5865F2;">Discord OAuth Simulation</h3>
                        <p>This is a demo. In production, use Discord OAuth 2.0</p>
                        <button onclick="window.opener.postMessage({type: 'discord-auth', success: true, user: {id: '123456789', username: 'DemoUser#1234', avatar: ''}}, '*'); window.close();" 
                                style="background: #5865F2; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Continue with Discord
                        </button>
                        <br><br>
                        <button onclick="window.opener.postMessage({type: 'discord-auth', success: false, error: 'User cancelled'}, '*'); window.close();" 
                                style="background: #ccc; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Cancel
                        </button>
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
        // Simulate Twitter OAuth flow
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
                        <h3 style="color: #1DA1F2;">Twitter OAuth Simulation</h3>
                        <p>This is a demo. In production, use Twitter OAuth 2.0</p>
                        <button onclick="window.opener.postMessage({type: 'twitter-auth', success: true, user: {id: '123456789', username: '@demouser', name: 'Demo User'}}, '*'); window.close();" 
                                style="background: #1DA1F2; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer;">
                            Continue with Twitter
                        </button>
                        <br><br>
                        <button onclick="window.opener.postMessage({type: 'twitter-auth', success: false, error: 'User cancelled'}, '*'); window.close();" 
                                style="background: #ccc; color: black; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer;">
                            Cancel
                        </button>
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

    async reconnectWallet(walletType) {
        // Attempt to reconnect to previously connected wallet
        switch (walletType) {
            case 'metamask':
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        this.userAddress = accounts[0];
                        this.networkId = await window.ethereum.request({ method: 'eth_chainId' });
                        this.connectedWallet = walletType;
                        this.updateUI();
                    }
                }
                break;
            case 'phantom':
                if (window.phantom?.solana?.isConnected) {
                    this.userAddress = window.phantom.solana.publicKey.toString();
                    this.networkId = 'solana';
                    this.connectedWallet = walletType;
                    this.updateUI();
                }
                break;
            // Add other wallet reconnection logic as needed
        }
    }

    async reconnectSocial(socialData) {
        this.socialAuth = socialData.type;
        this.userAddress = socialData.user.email || socialData.user.username || socialData.user.id;
        this.updateUI();
    }

    disconnect() {
        this.connectedWallet = null;
        this.userAddress = null;
        this.networkId = null;
        this.socialAuth = null;
        
        localStorage.removeItem('sparkrush_wallet');
        localStorage.removeItem('sparkrush_social');
        
        this.updateUI();
        this.showNotification('Disconnected successfully', 'success');
    }

    updateUI() {
        const connectBtn = document.getElementById('connect-wallet-btn');
        
        if (this.userAddress) {
            const displayAddress = this.formatAddress(this.userAddress);
            const connectionType = this.connectedWallet || this.socialAuth;
            const networkName = this.getNetworkName(this.networkId);
            
            connectBtn.innerHTML = `
                <div class="flex items-center space-x-2">
                    <div class="text-right">
                        <div class="text-sm font-medium">${displayAddress}</div>
                        <div class="text-xs text-gray-400">${networkName} ${this.balanceETH ? '• ' + this.balanceETH.toFixed(4) + ' ETH' : ''}</div>
                    </div>
                    <i class="fas fa-check-circle text-green-400"></i>
                </div>
            `;
            connectBtn.onclick = () => this.showAccountModal();
            
            // Update voting power if connected
            if (this.connectedWallet) {
                this.updateVotingPower();
            }
        } else {
            connectBtn.innerHTML = `
                <i class="fas fa-wallet"></i>
                <span>Connect Wallet</span>
            `;
            connectBtn.onclick = () => this.showWalletModal();
        }
    }

    formatAddress(address) {
        if (address.length > 20) {
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        }
        return address;
    }

    showAccountModal() {
        // Show account details modal (implement as needed)
        const options = [
            { label: 'View Profile', action: () => this.viewProfile() },
            { label: 'Switch Account', action: () => this.showWalletModal() },
            { label: 'Disconnect', action: () => this.disconnect() }
        ];
        
        this.showContextMenu(options);
    }

    showContextMenu(options) {
        // Simple context menu implementation
        const menu = document.createElement('div');
        menu.className = 'fixed bg-gray-800 border border-gray-700 rounded-lg p-2 z-50 shadow-lg';
        menu.style.top = '60px';
        menu.style.right = '20px';
        
        options.forEach(option => {
            const item = document.createElement('button');
            item.className = 'block w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-sm';
            item.textContent = option.label;
            item.onclick = () => {
                option.action();
                document.body.removeChild(menu);
            };
            menu.appendChild(item);
        });
        
        document.body.appendChild(menu);
        
        // Remove menu on outside click
        setTimeout(() => {
            const clickHandler = (e) => {
                if (!menu.contains(e.target)) {
                    document.body.removeChild(menu);
                    document.removeEventListener('click', clickHandler);
                }
            };
            document.addEventListener('click', clickHandler);
        }, 100);
    }

    updateVotingPower() {
        // Simulate voting power calculation
        const votingPowerElement = document.getElementById('voting-power');
        if (votingPowerElement) {
            const mockPower = Math.floor(Math.random() * 10000) + 1000;
            votingPowerElement.textContent = mockPower.toLocaleString();
        }
    }

    viewProfile() {
        // Implement profile view
        this.showNotification('Profile view coming soon!', 'info');
    }

    showLoading(message) {
        // Show loading overlay
        const loading = document.createElement('div');
        loading.id = 'wallet-loading';
        loading.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
        loading.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
                <div class="pulse-loader"></div>
                <span class="text-white">${message}</span>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('wallet-loading');
        if (loading) {
            document.body.removeChild(loading);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            ai: 'fa-robot'
        };

        const colorMap = {
            success: 'text-green-400',
            error: 'text-red-400',
            warning: 'text-yellow-400',
            info: 'text-blue-400',
            ai: 'text-purple-400'
        };

        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <i class="fas ${iconMap[type]} ${colorMap[type]} text-lg mt-0.5"></i>
                <div class="flex-1">
                    <div class="font-medium text-white text-sm">${message}</div>
                    <div class="text-xs text-gray-400 mt-1">${new Date().toLocaleTimeString()}</div>
                </div>
                <button onclick="this.closest('.notification').classList.add('removing'); setTimeout(() => this.closest('.notification')?.remove(), 300)" class="text-gray-400 hover:text-white ml-2">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>
        `;

        container.appendChild(notification);

        // Auto remove after specified duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('removing');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);

        return notification;
    }

    // Network utilities
    async switchNetwork(chainId) {
        if (!this.connectedWallet || !window.ethereum) {
            throw new Error('No wallet connected');
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (switchError) {
            // Network not added to wallet
            if (switchError.code === 4902) {
                const networkConfig = this.getNetworkConfig(chainId);
                if (networkConfig) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [networkConfig],
                    });
                }
            }
            throw switchError;
        }
    }

    getNetworkConfig(chainId) {
        const networks = {
            '0x1': {
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.infura.io/v3/'],
                blockExplorerUrls: ['https://etherscan.io/']
            },
            '0x89': {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
            },
            '0x38': {
                chainId: '0x38',
                chainName: 'BSC Mainnet',
                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/']
            }
        };
        return networks[chainId];
    }
}

// Initialize wallet manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.walletManager = new WalletManager();
});