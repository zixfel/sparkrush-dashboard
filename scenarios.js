// SparkRush Scenarios - Interactive Anti-Scam Demonstrations
class ScenarioManager {
    constructor() {
        this.currentScenario = null;
        this.scenarios = this.initializeScenarios();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Scenario card clicks
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', () => {
                const scenarioId = card.dataset.scenario;
                this.showScenario(scenarioId);
            });
        });

        // Close scenario modal
        const closeBtn = document.getElementById('close-scenario-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideScenario();
            });
        }

        // Modal backdrop click
        const modal = document.getElementById('scenario-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'scenario-modal') {
                    this.hideScenario();
                }
            });
        }
    }

    initializeScenarios() {
        return {
            1: {
                id: '1',
                title: 'Duplicate Tokens After KOL Tweet',
                description: 'Multiple tokens with same name appear after influencer mentions',
                category: 'duplicate_detection',
                difficulty: 'Medium',
                steps: [
                    {
                        title: 'KOL Posts Tweet',
                        description: 'Elon Musk tweets about "GOAT" token',
                        content: 'Simulating real-world scenario where Elon tweets: "The GOAT token is interesting 🐐"',
                        action: 'tweet_simulation'
                    },
                    {
                        title: 'Multiple Deployments Detected',
                        description: 'AI detects 47 new GOAT tokens deployed within 5 minutes',
                        content: 'Real-time blockchain monitoring shows massive token deployment spike',
                        action: 'deployment_detection'
                    },
                    {
                        title: 'SparkRush ID Ranking',
                        description: 'AI analyzes and ranks tokens by legitimacy',
                        content: 'Ranking based on volume, liquidity, deploy time, and community verification',
                        action: 'token_ranking'
                    },
                    {
                        title: 'Community Verification',
                        description: 'Community votes to confirm the authentic token',
                        content: 'Users vote on which GOAT token is the real one mentioned by Elon',
                        action: 'community_vote'
                    }
                ],
                mockData: {
                    originalTweet: {
                        author: 'Elon Musk',
                        handle: '@elonmusk',
                        content: 'The GOAT token is interesting 🐐',
                        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
                        likes: 45623,
                        retweets: 12456
                    },
                    duplicateTokens: [
                        {
                            name: 'GOAT',
                            contract: '0x1111111111111111111111111111111111111111',
                            chain: 'ETH',
                            deployTime: new Date(Date.now() - 180000).toISOString(),
                            volume: 2450000,
                            liquidity: 850000,
                            holders: 1247,
                            sparkRushScore: 95,
                            verified: true,
                            flags: ['high_liquidity', 'early_deploy', 'community_verified']
                        },
                        {
                            name: 'GOAT',
                            contract: '0x2222222222222222222222222222222222222222',
                            chain: 'BSC',
                            deployTime: new Date(Date.now() - 120000).toISOString(),
                            volume: 150000,
                            liquidity: 45000,
                            holders: 234,
                            sparkRushScore: 35,
                            verified: false,
                            flags: ['low_liquidity', 'suspicious_deploy_time', 'copy_paste_code']
                        },
                        {
                            name: 'GOAT',
                            contract: '0x3333333333333333333333333333333333333333',
                            chain: 'SOL',
                            deployTime: new Date(Date.now() - 90000).toISOString(),
                            volume: 89000,
                            liquidity: 12000,
                            holders: 89,
                            sparkRushScore: 15,
                            verified: false,
                            flags: ['honeypot_detected', 'no_liquidity_lock', 'scam_pattern']
                        }
                    ]
                }
            },
            2: {
                id: '2',
                title: 'Fresh Deploy Scam Detection',
                description: 'Real-time detection of fake tokens deployed after trending news',
                category: 'real_time_detection',
                difficulty: 'Hard',
                steps: [
                    {
                        title: 'Trending Event Occurs',
                        description: 'Major crypto news breaks',
                        content: 'Breaking: "Bitcoin reaches new ATH, altcoin season incoming!"',
                        action: 'news_simulation'
                    },
                    {
                        title: 'Scam Deploy Wave',
                        description: 'Scammers deploy fake tokens to capitalize on FOMO',
                        content: 'AI detects 156 suspicious token deployments in last 10 minutes',
                        action: 'scam_detection'
                    },
                    {
                        title: 'Real-time Analysis',
                        description: 'AI analyzes contracts within 30 seconds',
                        content: 'Automated contract auditing and risk assessment in real-time',
                        action: 'realtime_analysis'
                    },
                    {
                        title: 'Instant Alert System',
                        description: 'Users receive immediate warnings',
                        content: 'RED ALERT: High-risk tokens blocked from trading interfaces',
                        action: 'alert_system'
                    }
                ],
                mockData: {
                    newsEvent: {
                        title: 'Bitcoin Reaches $75K ATH',
                        content: 'Bitcoin surges to new all-time high amid institutional adoption',
                        timestamp: new Date(Date.now() - 600000).toISOString(),
                        impact: 'Market euphoria leads to increased altcoin interest'
                    },
                    scamTokens: [
                        {
                            name: 'ALTCOIN',
                            contract: '0xscam111111111111111111111111111111111111',
                            riskScore: 95,
                            flags: ['honeypot', 'unlimited_mint', 'no_owner_verification'],
                            deployTime: new Date(Date.now() - 60000).toISOString()
                        },
                        {
                            name: 'BTCMOON',
                            contract: '0xscam222222222222222222222222222222222222',
                            riskScore: 87,
                            flags: ['rug_pull_pattern', 'fake_liquidity', 'copied_code'],
                            deployTime: new Date(Date.now() - 45000).toISOString()
                        }
                    ]
                }
            },
            3: {
                id: '3',
                title: 'Vague KOL Hints Prediction',
                description: 'AI predicts tokens from cryptic influencer messages',
                category: 'prediction_ai',
                difficulty: 'Hard',
                steps: [
                    {
                        title: 'Cryptic Tweet Posted',
                        description: 'KOL posts vague hint without naming specific token',
                        content: 'KOL tweets: "My dog will launch soon 🐕 Big things coming..."',
                        action: 'hint_analysis'
                    },
                    {
                        title: 'AI Keyword Extraction',
                        description: 'NLP algorithms extract key terms and context',
                        content: 'Keywords: dog, launch, soon. Historical pattern: dog coins',
                        action: 'nlp_processing'
                    },
                    {
                        title: 'Token Candidate Monitoring',
                        description: 'AI monitors for tokens matching the hint pattern',
                        content: 'Tracking 23 potential candidates with dog-related names',
                        action: 'candidate_tracking'
                    },
                    {
                        title: 'Probability Ranking',
                        description: 'Candidates ranked by likelihood of being "the one"',
                        content: 'Real-time scoring based on deployment timing and social signals',
                        action: 'probability_scoring'
                    }
                ],
                mockData: {
                    crypticTweet: {
                        author: 'Crypto KOL',
                        handle: '@cryptoking',
                        content: 'My dog will launch soon 🐕 Big things coming... #staywild',
                        timestamp: new Date(Date.now() - 900000).toISOString(),
                        followers: 845000
                    },
                    candidates: [
                        {
                            name: 'WILDDOG',
                            probability: 89,
                            reasoning: 'Contains "wild" from hashtag + dog theme + recent deploy',
                            deployTime: new Date(Date.now() - 480000).toISOString(),
                            socialSignals: ['trending_telegram', 'kol_connections']
                        },
                        {
                            name: 'LAUNCHDOG',
                            probability: 76,
                            reasoning: 'Direct "launch" + "dog" correlation',
                            deployTime: new Date(Date.now() - 360000).toISOString(),
                            socialSignals: ['growing_community']
                        },
                        {
                            name: 'PUPPY',
                            probability: 45,
                            reasoning: 'Dog theme but lacks "launch" context',
                            deployTime: new Date(Date.now() - 720000).toISOString(),
                            socialSignals: ['moderate_activity']
                        }
                    ]
                }
            },
            4: {
                id: '4',
                title: 'Official Contract Verification',
                description: 'Verify authentic contracts from announced deployments',
                category: 'contract_verification',
                difficulty: 'Medium',
                steps: [
                    {
                        title: 'Official Announcement',
                        description: 'KOL announces contract deployment schedule',
                        content: 'KOL: "MOON token contract will be deployed at exactly 3 PM UTC"',
                        action: 'announcement_tracking'
                    },
                    {
                        title: 'Pre-deployment Monitoring',
                        description: 'Scammers deploy fake contracts early',
                        content: '12 fake MOON contracts detected before official deployment time',
                        action: 'fake_monitoring'
                    },
                    {
                        title: 'Verified Wallet Tracking',
                        description: 'Only contracts from verified wallets are trusted',
                        content: 'KOL wallet: 0xverified... is monitored for authentic deployment',
                        action: 'wallet_verification'
                    },
                    {
                        title: 'Multi-sig Confirmation',
                        description: 'Community witnesses verify the authentic deployment',
                        content: '5 trusted community members confirm contract authenticity',
                        action: 'multisig_verification'
                    }
                ],
                mockData: {
                    announcement: {
                        author: 'Project Team',
                        content: 'MOON token contract deployment scheduled for 15:00 UTC today',
                        verifiedWallet: '0xverified1234567890123456789012345678901234',
                        scheduledTime: new Date(Date.now() + 3600000).toISOString()
                    },
                    fakeContracts: [
                        {
                            contract: '0xfake111111111111111111111111111111111111',
                            deployTime: new Date(Date.now() - 1800000).toISOString(),
                            deployer: '0xscammer1111111111111111111111111111111111',
                            flags: ['early_deploy', 'unverified_deployer', 'honeypot']
                        },
                        {
                            contract: '0xfake222222222222222222222222222222222222',
                            deployTime: new Date(Date.now() - 900000).toISOString(),
                            deployer: '0xscammer2222222222222222222222222222222222',
                            flags: ['suspicious_code', 'rug_pull_pattern']
                        }
                    ],
                    authenticContract: {
                        contract: '0xreal111111111111111111111111111111111111',
                        deployTime: null, // Will be set when "deployed"
                        deployer: '0xverified1234567890123456789012345678901234',
                        verified: true,
                        witnesses: 5
                    }
                }
            },
            5: {
                id: '5',
                title: 'Coordinated Pump Detection',
                description: 'Identify organized manipulation when multiple KOLs promote same token',
                category: 'pump_detection',
                difficulty: 'Expert',
                steps: [
                    {
                        title: 'Multiple KOL Posts',
                        description: 'Several influencers mention the same token simultaneously',
                        content: '8 crypto KOLs post about PUMP token within 15 minutes',
                        action: 'kol_tracking'
                    },
                    {
                        title: 'Timeline Analysis',
                        description: 'AI analyzes posting patterns for coordination signs',
                        content: 'Suspicious: All posts within narrow timeframe, similar messaging',
                        action: 'timeline_analysis'
                    },
                    {
                        title: 'Network Relationship Mapping',
                        description: 'Analyze connections between the KOLs',
                        content: '6/8 KOLs have financial relationships with the same agency',
                        action: 'network_analysis'
                    },
                    {
                        title: 'Manipulation Alert',
                        description: 'System warns users about potential coordinated pump',
                        content: 'CAUTION: Detected coordinated promotion pattern. High manipulation risk.',
                        action: 'manipulation_warning'
                    }
                ],
                mockData: {
                    kolPosts: [
                        {
                            author: 'CryptoInfluencer1',
                            content: 'PUMP token looks promising! Great fundamentals 🚀',
                            timestamp: new Date(Date.now() - 900000).toISOString(),
                            followers: 125000
                        },
                        {
                            author: 'BlockchainGuru',
                            content: 'Just discovered PUMP - huge potential here! 💎',
                            timestamp: new Date(Date.now() - 750000).toISOString(),
                            followers: 89000
                        },
                        {
                            author: 'CryptoAnalyst99',
                            content: 'PUMP fundamentals are solid, getting in early 📈',
                            timestamp: new Date(Date.now() - 600000).toISOString(),
                            followers: 156000
                        }
                    ],
                    relationships: {
                        commonAgency: 'CryptoPromo Inc',
                        connectedKOLs: 6,
                        suspiciousPatterns: ['synchronized_timing', 'similar_messaging', 'financial_connections']
                    },
                    manipulationScore: 85
                }
            },
            6: {
                id: '6',
                title: 'Token Rebrand Identity Tracking',
                description: 'Maintain continuity when tokens change names or rebrand',
                category: 'identity_tracking',
                difficulty: 'Medium',
                steps: [
                    {
                        title: 'Rebrand Announcement',
                        description: 'Existing token announces name change',
                        content: 'OLDTOKEN announces rebrand to NEWTOKEN to align with new vision',
                        action: 'rebrand_detection'
                    },
                    {
                        title: 'Contract History Tracking',
                        description: 'System tracks the evolution from old to new identity',
                        content: 'Maintaining link between OLDTOKEN contract and new branding',
                        action: 'history_tracking'
                    },
                    {
                        title: 'Community Verification',
                        description: 'Holders vote to confirm legitimate rebrand',
                        content: 'Token holders vote 89% in favor of confirming rebrand legitimacy',
                        action: 'rebrand_verification'
                    },
                    {
                        title: 'Identity Continuity',
                        description: 'SparkRush ID maintains connection between old and new',
                        content: 'SparkRush ID updated: oldtoken.original.spark → newtoken.original.spark',
                        action: 'identity_update'
                    }
                ],
                mockData: {
                    originalToken: {
                        name: 'OLDTOKEN',
                        contract: '0xoriginal1111111111111111111111111111111111',
                        sparkRushId: 'oldtoken.original.spark',
                        holders: 15647,
                        established: new Date(Date.now() - 86400000 * 90).toISOString()
                    },
                    rebrandAnnouncement: {
                        newName: 'NEWTOKEN',
                        reason: 'Alignment with expanded DeFi ecosystem vision',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        officialChannels: ['website', 'telegram', 'twitter']
                    },
                    verificationVote: {
                        totalVotes: 8934,
                        approve: 7951,
                        reject: 983,
                        approvalRate: 89
                    }
                }
            }
        };
    }

    showScenario(scenarioId) {
        this.currentScenario = this.scenarios[scenarioId];
        if (!this.currentScenario) return;

        const modal = document.getElementById('scenario-modal');
        const title = document.getElementById('scenario-title');
        const content = document.getElementById('scenario-content');

        title.textContent = this.currentScenario.title;
        content.innerHTML = this.renderScenarioContent();

        modal.classList.remove('hidden');
        modal.classList.add('modal-enter');
        setTimeout(() => {
            modal.classList.remove('modal-enter');
        }, 300);

        // Start scenario simulation
        this.startScenarioSimulation();
    }

    hideScenario() {
        const modal = document.getElementById('scenario-modal');
        modal.classList.add('modal-exit');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('modal-exit');
            this.currentScenario = null;
        }, 300);
    }

    renderScenarioContent() {
        const scenario = this.currentScenario;
        
        return `
            <div class="space-y-6">
                <!-- Scenario Header -->
                <div class="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 border border-primary/30">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-primary">Scenario ${scenario.id}</span>
                        <span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">${scenario.difficulty}</span>
                    </div>
                    <p class="text-gray-300">${scenario.description}</p>
                </div>

                <!-- Progress Indicator -->
                <div class="flex items-center space-x-2">
                    ${scenario.steps.map((step, index) => `
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center text-sm scenario-step" data-step="${index}">
                                ${index + 1}
                            </div>
                            ${index < scenario.steps.length - 1 ? '<div class="w-8 h-0.5 bg-gray-600 scenario-progress" data-progress="${index}"></div>' : ''}
                        </div>
                    `).join('')}
                </div>

                <!-- Step Content -->
                <div id="scenario-steps" class="space-y-4">
                    ${scenario.steps.map((step, index) => `
                        <div class="scenario-step-content hidden" data-step-content="${index}">
                            <div class="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                                <div class="flex items-center space-x-3 mb-4">
                                    <div class="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                                        <span class="text-white font-bold">${index + 1}</span>
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-semibold">${step.title}</h4>
                                        <p class="text-sm text-gray-400">${step.description}</p>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-700/30 rounded-lg p-4 mb-4">
                                    <p class="text-gray-300">${step.content}</p>
                                </div>

                                <!-- Interactive Content -->
                                <div id="interactive-content-${index}">
                                    ${this.renderInteractiveContent(step.action, index)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Navigation -->
                <div class="flex justify-between pt-4 border-t border-gray-700">
                    <button id="prev-step" class="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium hover:border-primary transition-colors" disabled>
                        Previous
                    </button>
                    <button id="next-step" class="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-sm font-medium hover:from-primary/80 hover:to-secondary/80 transition-colors">
                        Start Demo
                    </button>
                </div>
            </div>
        `;
    }

    renderInteractiveContent(action, stepIndex) {
        const scenario = this.currentScenario;
        
        switch (action) {
            case 'tweet_simulation':
                return this.renderTweetSimulation();
            case 'deployment_detection':
                return this.renderDeploymentDetection();
            case 'token_ranking':
                return this.renderTokenRanking();
            case 'community_vote':
                return this.renderCommunityVote();
            case 'scam_detection':
                return this.renderScamDetection();
            case 'realtime_analysis':
                return this.renderRealtimeAnalysis();
            case 'hint_analysis':
                return this.renderHintAnalysis();
            case 'probability_scoring':
                return this.renderProbabilityScoring();
            case 'manipulation_warning':
                return this.renderManipulationWarning();
            case 'identity_update':
                return this.renderIdentityUpdate();
            default:
                return `<div class="text-center py-8"><div class="pulse-loader mx-auto mb-2"></div><p class="text-gray-400">Processing ${action}...</p></div>`;
        }
    }

    renderTweetSimulation() {
        const tweet = this.currentScenario.mockData.originalTweet;
        return `
            <div class="bg-gray-900 rounded-lg p-4 border border-gray-600">
                <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <i class="fab fa-twitter text-white"></i>
                    </div>
                    <div>
                        <div class="font-semibold">${tweet.author}</div>
                        <div class="text-sm text-gray-400">${tweet.handle}</div>
                    </div>
                </div>
                <p class="text-lg mb-3">${tweet.content}</p>
                <div class="flex items-center space-x-6 text-sm text-gray-400">
                    <span><i class="far fa-heart mr-1"></i>${tweet.likes.toLocaleString()}</span>
                    <span><i class="fas fa-retweet mr-1"></i>${tweet.retweets.toLocaleString()}</span>
                    <span class="ml-auto">${new Date(tweet.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        `;
    }

    renderDeploymentDetection() {
        return `
            <div class="space-y-4">
                <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <i class="fas fa-exclamation-triangle text-red-400"></i>
                        <span class="text-red-400 font-medium">Mass Deployment Alert</span>
                    </div>
                    <p class="text-sm">47 new GOAT tokens detected on multiple blockchains</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-700/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-orange-400">23</div>
                        <div class="text-xs text-gray-400">Ethereum</div>
                    </div>
                    <div class="bg-gray-700/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-yellow-400">15</div>
                        <div class="text-xs text-gray-400">BSC</div>
                    </div>
                    <div class="bg-gray-700/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-purple-400">9</div>
                        <div class="text-xs text-gray-400">Solana</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTokenRanking() {
        const tokens = this.currentScenario.mockData.duplicateTokens;
        return `
            <div class="space-y-3">
                <h5 class="font-medium mb-3">SparkRush AI Ranking</h5>
                ${tokens.map((token, index) => `
                    <div class="bg-gray-700/30 rounded-lg p-4 border ${token.verified ? 'border-green-500/50' : 'border-gray-600'}">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    ${index + 1}
                                </div>
                                <div>
                                    <div class="font-medium">${token.name} (${token.chain})</div>
                                    <div class="text-xs text-gray-400 font-mono">${token.contract}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-lg font-bold ${token.sparkRushScore >= 80 ? 'text-green-400' : token.sparkRushScore >= 50 ? 'text-yellow-400' : 'text-red-400'}">
                                    ${token.sparkRushScore}
                                </div>
                                <div class="text-xs text-gray-400">Score</div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-3 mb-3">
                            <div class="text-center">
                                <div class="text-sm font-medium">$${(token.volume / 1000000).toFixed(1)}M</div>
                                <div class="text-xs text-gray-400">Volume</div>
                            </div>
                            <div class="text-center">
                                <div class="text-sm font-medium">$${(token.liquidity / 1000).toFixed(0)}K</div>
                                <div class="text-xs text-gray-400">Liquidity</div>
                            </div>
                            <div class="text-center">
                                <div class="text-sm font-medium">${token.holders}</div>
                                <div class="text-xs text-gray-400">Holders</div>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1">
                            ${token.flags.map(flag => `
                                <span class="px-2 py-1 rounded text-xs ${flag.includes('scam') || flag.includes('honeypot') ? 'bg-red-500/20 text-red-400' : flag.includes('verified') || flag.includes('high') ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">
                                    ${flag.replace(/_/g, ' ')}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderCommunityVote() {
        return `
            <div class="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-3">
                    <i class="fas fa-check-circle text-green-400"></i>
                    <span class="text-green-400 font-medium">Community Verified</span>
                </div>
                <p class="text-sm text-gray-300 mb-3">
                    The community has voted to assign SparkRush ID: <span class="font-mono text-primary">goat.elon.spark</span> 
                    to the Ethereum contract 0x1111...1111
                </p>
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-400">89%</div>
                        <div class="text-xs text-gray-400">Approval Rate</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold">2,847</div>
                        <div class="text-xs text-gray-400">Total Votes</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderScamDetection() {
        return `
            <div class="space-y-4">
                <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <i class="fas fa-shield-alt text-red-400"></i>
                        <span class="text-red-400 font-medium">Scam Wave Detected</span>
                    </div>
                    <p class="text-sm">156 suspicious deployments in the last 10 minutes</p>
                </div>
                
                <div class="space-y-2">
                    ${this.currentScenario.mockData.scamTokens.map(token => `
                        <div class="bg-gray-700/30 rounded-lg p-3">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium">${token.name}</span>
                                <span class="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                                    BLOCKED
                                </span>
                            </div>
                            <div class="text-xs text-gray-400 mb-2">${token.contract}</div>
                            <div class="flex flex-wrap gap-1">
                                ${token.flags.map(flag => `
                                    <span class="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                                        ${flag.replace(/_/g, ' ')}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderRealtimeAnalysis() {
        return `
            <div class="space-y-4">
                <div class="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <i class="fas fa-robot text-blue-400"></i>
                        <span class="text-blue-400 font-medium">AI Analysis in Progress</span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Contract Code Analysis</span>
                            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Liquidity Verification</span>
                            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Pattern Matching</span>
                            <div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Risk Assessment</span>
                            <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center py-4">
                    <div class="text-2xl font-bold text-primary mb-2">< 30s</div>
                    <div class="text-sm text-gray-400">Average Analysis Time</div>
                </div>
            </div>
        `;
    }

    renderHintAnalysis() {
        const tweet = this.currentScenario.mockData.crypticTweet;
        return `
            <div class="space-y-4">
                <div class="bg-gray-900 rounded-lg p-4 border border-gray-600">
                    <div class="flex items-center space-x-3 mb-3">
                        <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <i class="fab fa-twitter text-white"></i>
                        </div>
                        <div>
                            <div class="font-semibold">${tweet.author}</div>
                            <div class="text-sm text-gray-400">${tweet.handle}</div>
                        </div>
                    </div>
                    <p class="text-lg mb-3">${tweet.content}</p>
                </div>
                
                <div class="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <div class="text-sm font-medium text-blue-400 mb-2">AI Keyword Extraction</div>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">dog</span>
                        <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">launch</span>
                        <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">soon</span>
                        <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">#staywild</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderProbabilityScoring() {
        const candidates = this.currentScenario.mockData.candidates;
        return `
            <div class="space-y-3">
                <h5 class="font-medium mb-3">Token Candidates by Probability</h5>
                ${candidates.map((candidate, index) => `
                    <div class="bg-gray-700/30 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    ${index + 1}
                                </div>
                                <span class="font-medium">${candidate.name}</span>
                            </div>
                            <div class="text-right">
                                <div class="text-lg font-bold text-purple-400">${candidate.probability}%</div>
                                <div class="text-xs text-gray-400">Match</div>
                            </div>
                        </div>
                        <p class="text-sm text-gray-300 mb-2">${candidate.reasoning}</p>
                        <div class="flex flex-wrap gap-1">
                            ${candidate.socialSignals.map(signal => `
                                <span class="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
                                    ${signal.replace(/_/g, ' ')}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderManipulationWarning() {
        const data = this.currentScenario.mockData;
        return `
            <div class="space-y-4">
                <div class="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <i class="fas fa-exclamation-triangle text-orange-400"></i>
                        <span class="text-orange-400 font-medium">Manipulation Detected</span>
                    </div>
                    <div class="text-sm text-gray-300">
                        Coordinated promotion pattern detected with ${data.manipulationScore}% confidence
                    </div>
                </div>
                
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <h5 class="font-medium mb-3">Relationship Analysis</h5>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-400">Connected KOLs</span>
                            <span class="font-medium">${data.relationships.connectedKOLs}/8</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-400">Common Agency</span>
                            <span class="font-medium">${data.relationships.commonAgency}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-400">Risk Factors</span>
                            <span class="text-red-400 font-medium">${data.relationships.suspiciousPatterns.length}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <div class="text-sm font-medium text-red-400 mb-2">⚠️ Trading Warning</div>
                    <p class="text-sm text-gray-300">
                        This token shows signs of coordinated manipulation. Exercise extreme caution and consider waiting for organic community growth.
                    </p>
                </div>
            </div>
        `;
    }

    renderIdentityUpdate() {
        const data = this.currentScenario.mockData;
        return `
            <div class="space-y-4">
                <div class="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <i class="fas fa-link text-green-400"></i>
                        <span class="text-green-400 font-medium">Identity Continuity Maintained</span>
                    </div>
                    <div class="text-sm text-gray-300">
                        SparkRush ID successfully updated with community approval
                    </div>
                </div>
                
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <h5 class="font-medium mb-3">Rebrand Verification</h5>
                    <div class="space-y-3">
                        <div>
                            <div class="text-sm text-gray-400">Original Identity</div>
                            <div class="font-mono text-sm">${data.originalToken.sparkRushId}</div>
                        </div>
                        <div class="flex items-center justify-center text-gray-400">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div>
                            <div class="text-sm text-gray-400">New Identity</div>
                            <div class="font-mono text-sm text-primary">newtoken.original.spark</div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-700/30 rounded-lg p-4">
                    <h5 class="font-medium mb-3">Community Vote Results</h5>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-lg font-bold text-green-400">${data.verificationVote.approvalRate}%</div>
                            <div class="text-xs text-gray-400">Approval</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold">${data.verificationVote.totalVotes}</div>
                            <div class="text-xs text-gray-400">Total Votes</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold">${data.originalToken.holders}</div>
                            <div class="text-xs text-gray-400">Holders</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    startScenarioSimulation() {
        let currentStep = 0;
        const totalSteps = this.currentScenario.steps.length;

        // Show first step
        this.showStep(currentStep);

        // Setup navigation
        this.setupStepNavigation(currentStep, totalSteps);
    }

    showStep(stepIndex) {
        // Hide all step contents
        document.querySelectorAll('.scenario-step-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Show current step content
        const currentContent = document.querySelector(`[data-step-content="${stepIndex}"]`);
        if (currentContent) {
            currentContent.classList.remove('hidden');
        }

        // Update progress indicators
        document.querySelectorAll('.scenario-step').forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('border-primary', 'bg-primary', 'text-white');
                step.classList.remove('border-gray-600');
            } else {
                step.classList.remove('border-primary', 'bg-primary', 'text-white');
                step.classList.add('border-gray-600');
            }
        });

        document.querySelectorAll('.scenario-progress').forEach((progress, index) => {
            if (index < stepIndex) {
                progress.classList.add('bg-primary');
                progress.classList.remove('bg-gray-600');
            } else {
                progress.classList.remove('bg-primary');
                progress.classList.add('bg-gray-600');
            }
        });
    }

    setupStepNavigation(currentStep, totalSteps) {
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');

        let step = currentStep;

        const updateButtons = () => {
            prevBtn.disabled = step === 0;
            prevBtn.textContent = step === 0 ? 'Previous' : 'Previous';
            
            nextBtn.textContent = step === totalSteps - 1 ? 'Complete' : 
                                 step === 0 ? 'Start Demo' : 'Next Step';
        };

        prevBtn.onclick = () => {
            if (step > 0) {
                step--;
                this.showStep(step);
                updateButtons();
            }
        };

        nextBtn.onclick = () => {
            if (step < totalSteps - 1) {
                step++;
                this.showStep(step);
                updateButtons();
            } else {
                // Complete scenario
                this.completeScenario();
            }
        };

        updateButtons();
    }

    completeScenario() {
        const content = document.getElementById('scenario-content');
        content.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold mb-4">Scenario Complete!</h3>
                <p class="text-gray-300 mb-6 max-w-md mx-auto">
                    You've successfully experienced how SparkRush protects traders in real-world scenarios.
                </p>
                <div class="flex justify-center space-x-4">
                    <button onclick="window.scenarioManager.hideScenario()" class="px-6 py-3 border border-gray-600 rounded-lg hover:border-primary transition-colors">
                        Close
                    </button>
                    <button onclick="location.reload()" class="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/80 hover:to-secondary/80 transition-colors">
                        Try Another Scenario
                    </button>
                </div>
            </div>
        `;
    }

    // Get scenario statistics for user profile
    getScenarioStats() {
        const completedScenarios = JSON.parse(localStorage.getItem('completed_scenarios') || '[]');
        return {
            total: Object.keys(this.scenarios).length,
            completed: completedScenarios.length,
            completionRate: (completedScenarios.length / Object.keys(this.scenarios).length * 100).toFixed(1)
        };
    }
}

// Initialize scenarios when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.scenarioManager = new ScenarioManager();
});