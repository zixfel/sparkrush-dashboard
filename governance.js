// SparkRush Community Governance System
class GovernanceManager {
    constructor() {
        this.proposals = [];
        this.userVotes = new Map();
        this.stakingBalance = 0;
        this.votingPower = 0;
        this.initializeGovernance();
        this.loadMockProposals();
    }

    initializeGovernance() {
        this.setupEventListeners();
        this.updateVotingPowerDisplay();
    }

    setupEventListeners() {
        // Vote buttons in proposals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('vote-yes')) {
                this.castVote(e.target.dataset.proposalId, 'yes');
            } else if (e.target.classList.contains('vote-no')) {
                this.castVote(e.target.dataset.proposalId, 'no');
            } else if (e.target.classList.contains('vote-abstain')) {
                this.castVote(e.target.dataset.proposalId, 'abstain');
            }
        });

        // Stake more SPARK button
        const stakeButton = document.querySelector('button:contains("Stake More SPARK")');
        if (stakeButton) {
            stakeButton.addEventListener('click', () => {
                this.showStakeModal();
            });
        }
    }

    loadMockProposals() {
        const mockProposals = [
            {
                id: 'prop-001',
                title: 'Verify GOAT Token as Official Elon Musk Meme',
                description: 'Following Elon Musk\'s recent tweet about GOAT, multiple tokens have been deployed. Community verification is needed to identify the official token.',
                type: 'Token Verification',
                proposer: '0x1234...5678',
                created: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
                status: 'active',
                votes: {
                    yes: 8547,
                    no: 1203,
                    abstain: 445
                },
                quorum: 10000,
                details: {
                    contract: '0xabcd1234567890abcdef1234567890abcdef1234',
                    chain: 'Ethereum',
                    evidence: 'Deployed 30 minutes after Elon tweet, highest liquidity, team verified'
                },
                category: 'verification'
            },
            {
                id: 'prop-002',
                title: 'Blacklist Honeypot Token SAFEMOON2.0',
                description: 'Multiple users reported inability to sell SAFEMOON2.0 tokens. Contract analysis reveals honeypot characteristics.',
                type: 'Scam Report',
                proposer: '0x9876...5432',
                created: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                deadline: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
                status: 'active',
                votes: {
                    yes: 15623,
                    no: 234,
                    abstain: 123
                },
                quorum: 8000,
                details: {
                    contract: '0xdeadbeef1234567890deadbeef1234567890dead',
                    chain: 'BSC',
                    evidence: 'Failed sell attempts, high buy tax, no liquidity exit function'
                },
                category: 'scam_report'
            },
            {
                id: 'prop-003',
                title: 'Update Risk Assessment Algorithm Parameters',
                description: 'Proposal to adjust AI detection sensitivity based on recent false positive reports from the community.',
                type: 'Protocol Update',
                proposer: '0xaaaa...bbbb',
                created: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
                deadline: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
                status: 'active',
                votes: {
                    yes: 4521,
                    no: 3876,
                    abstain: 1203
                },
                quorum: 15000,
                details: {
                    changes: 'Reduce honeypot detection threshold by 10%, increase liquidity weight by 15%',
                    impact: 'May reduce false positives but slightly increase detection time'
                },
                category: 'protocol'
            },
            {
                id: 'prop-004',
                title: 'Approve Partnership with CoinGecko for Data Integration',
                description: 'Integrate CoinGecko API for enhanced token metadata and price data to improve accuracy of risk assessments.',
                type: 'Partnership',
                proposer: '0xcccc...dddd',
                created: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
                deadline: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
                status: 'active',
                votes: {
                    yes: 7234,
                    no: 2456,
                    abstain: 876
                },
                quorum: 12000,
                details: {
                    benefits: 'Real-time price data, verified token lists, enhanced metadata',
                    cost: '5000 SPARK tokens per month',
                    duration: '12 months initial term'
                },
                category: 'partnership'
            },
            {
                id: 'prop-005',
                title: 'Establish Emergency Response Protocol for Zero-Day Exploits',
                description: 'Create fast-track governance process for immediate blacklisting of tokens exploiting new vulnerabilities.',
                type: 'Emergency Protocol',
                proposer: '0xeeee...ffff',
                created: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
                deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
                status: 'active',
                votes: {
                    yes: 9876,
                    no: 567,
                    abstain: 234
                },
                quorum: 10000,
                details: {
                    threshold: 'Requires 3 verified security researchers + 5000 emergency votes',
                    timeframe: '2-hour emergency voting period',
                    reversal: 'Can be overturned by regular governance within 48 hours'
                },
                category: 'emergency'
            }
        ];

        this.proposals = mockProposals;
        this.renderProposals();
        
        // Simulate real-time vote updates
        this.startVoteUpdates();
    }

    renderProposals() {
        const proposalsContainer = document.getElementById('governance-proposals');
        if (!proposalsContainer) return;

        proposalsContainer.innerHTML = this.proposals.map(proposal => this.renderProposal(proposal)).join('');
    }

    renderProposal(proposal) {
        const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain;
        const yesPercentage = totalVotes > 0 ? (proposal.votes.yes / totalVotes * 100).toFixed(1) : 0;
        const noPercentage = totalVotes > 0 ? (proposal.votes.no / totalVotes * 100).toFixed(1) : 0;
        const abstainPercentage = totalVotes > 0 ? (proposal.votes.abstain / totalVotes * 100).toFixed(1) : 0;
        
        const quorumPercentage = Math.min(totalVotes / proposal.quorum * 100, 100).toFixed(1);
        const timeLeft = this.calculateTimeLeft(proposal.deadline);
        
        const categoryColors = {
            verification: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            scam_report: 'bg-red-500/20 text-red-400 border-red-500/50',
            protocol: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
            partnership: 'bg-green-500/20 text-green-400 border-green-500/50',
            emergency: 'bg-orange-500/20 text-orange-400 border-orange-500/50'
        };

        const userVote = this.userVotes.get(proposal.id);
        
        return `
            <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <!-- Header -->
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <span class="px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[proposal.category] || categoryColors.verification}">
                                ${proposal.type}
                            </span>
                            <span class="text-xs text-gray-400">${proposal.id.toUpperCase()}</span>
                        </div>
                        <h4 class="text-lg font-semibold mb-2">${proposal.title}</h4>
                        <p class="text-gray-300 text-sm mb-3">${proposal.description}</p>
                    </div>
                </div>

                <!-- Proposal Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Proposer</div>
                        <div class="font-mono text-sm">${proposal.proposer}</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 mb-1">Time Remaining</div>
                        <div class="text-sm ${timeLeft.expired ? 'text-red-400' : 'text-green-400'}">${timeLeft.text}</div>
                    </div>
                </div>

                <!-- Additional Details -->
                ${this.renderProposalDetails(proposal)}

                <!-- Voting Progress -->
                <div class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium">Voting Progress</span>
                        <span class="text-xs text-gray-400">${totalVotes.toLocaleString()} / ${proposal.quorum.toLocaleString()} votes</span>
                    </div>
                    
                    <!-- Quorum Progress -->
                    <div class="mb-3">
                        <div class="bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div class="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500" style="width: ${quorumPercentage}%"></div>
                        </div>
                        <div class="text-xs text-gray-400 mt-1">Quorum: ${quorumPercentage}%</div>
                    </div>

                    <!-- Vote Distribution -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-green-500 rounded"></div>
                                <span class="text-sm">Yes</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-sm font-medium">${proposal.votes.yes.toLocaleString()}</span>
                                <span class="text-xs text-gray-400">(${yesPercentage}%)</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-red-500 rounded"></div>
                                <span class="text-sm">No</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-sm font-medium">${proposal.votes.no.toLocaleString()}</span>
                                <span class="text-xs text-gray-400">(${noPercentage}%)</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-gray-500 rounded"></div>
                                <span class="text-sm">Abstain</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-sm font-medium">${proposal.votes.abstain.toLocaleString()}</span>
                                <span class="text-xs text-gray-400">(${abstainPercentage}%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Voting Buttons -->
                <div class="flex space-x-3">
                    ${!timeLeft.expired && window.walletManager?.userAddress ? `
                        <button class="vote-button vote-yes ${userVote === 'yes' ? 'bg-green-500/20' : ''}" data-proposal-id="${proposal.id}" ${userVote ? 'disabled' : ''}>
                            <i class="fas fa-thumbs-up mr-1"></i>
                            ${userVote === 'yes' ? 'Voted Yes' : 'Yes'}
                        </button>
                        <button class="vote-button vote-no ${userVote === 'no' ? 'bg-red-500/20' : ''}" data-proposal-id="${proposal.id}" ${userVote ? 'disabled' : ''}>
                            <i class="fas fa-thumbs-down mr-1"></i>
                            ${userVote === 'no' ? 'Voted No' : 'No'}
                        </button>
                        <button class="vote-button vote-abstain ${userVote === 'abstain' ? 'bg-gray-500/20' : ''}" data-proposal-id="${proposal.id}" ${userVote ? 'disabled' : ''}>
                            <i class="fas fa-minus mr-1"></i>
                            ${userVote === 'abstain' ? 'Abstained' : 'Abstain'}
                        </button>
                    ` : `
                        <div class="text-sm text-gray-400 p-2">
                            ${timeLeft.expired ? 'Voting has ended' : 'Connect wallet to vote'}
                        </div>
                    `}
                </div>

                ${userVote ? `
                    <div class="mt-3 text-xs text-gray-400 italic">
                        You voted "${userVote}" on this proposal
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderProposalDetails(proposal) {
        switch (proposal.category) {
            case 'verification':
                return `
                    <div class="bg-gray-700/30 rounded-lg p-3 mb-4">
                        <div class="text-xs font-medium text-blue-400 mb-2">Token Details</div>
                        <div class="space-y-1 text-sm">
                            <div><span class="text-gray-400">Contract:</span> <span class="font-mono">${proposal.details.contract}</span></div>
                            <div><span class="text-gray-400">Chain:</span> ${proposal.details.chain}</div>
                            <div><span class="text-gray-400">Evidence:</span> ${proposal.details.evidence}</div>
                        </div>
                    </div>
                `;
            case 'scam_report':
                return `
                    <div class="bg-gray-700/30 rounded-lg p-3 mb-4">
                        <div class="text-xs font-medium text-red-400 mb-2">Scam Evidence</div>
                        <div class="space-y-1 text-sm">
                            <div><span class="text-gray-400">Contract:</span> <span class="font-mono">${proposal.details.contract}</span></div>
                            <div><span class="text-gray-400">Chain:</span> ${proposal.details.chain}</div>
                            <div><span class="text-gray-400">Evidence:</span> ${proposal.details.evidence}</div>
                        </div>
                    </div>
                `;
            case 'protocol':
                return `
                    <div class="bg-gray-700/30 rounded-lg p-3 mb-4">
                        <div class="text-xs font-medium text-purple-400 mb-2">Protocol Changes</div>
                        <div class="space-y-1 text-sm">
                            <div><span class="text-gray-400">Changes:</span> ${proposal.details.changes}</div>
                            <div><span class="text-gray-400">Impact:</span> ${proposal.details.impact}</div>
                        </div>
                    </div>
                `;
            case 'partnership':
                return `
                    <div class="bg-gray-700/30 rounded-lg p-3 mb-4">
                        <div class="text-xs font-medium text-green-400 mb-2">Partnership Details</div>
                        <div class="space-y-1 text-sm">
                            <div><span class="text-gray-400">Benefits:</span> ${proposal.details.benefits}</div>
                            <div><span class="text-gray-400">Cost:</span> ${proposal.details.cost}</div>
                            <div><span class="text-gray-400">Duration:</span> ${proposal.details.duration}</div>
                        </div>
                    </div>
                `;
            case 'emergency':
                return `
                    <div class="bg-gray-700/30 rounded-lg p-3 mb-4">
                        <div class="text-xs font-medium text-orange-400 mb-2">Emergency Protocol</div>
                        <div class="space-y-1 text-sm">
                            <div><span class="text-gray-400">Threshold:</span> ${proposal.details.threshold}</div>
                            <div><span class="text-gray-400">Timeframe:</span> ${proposal.details.timeframe}</div>
                            <div><span class="text-gray-400">Reversal:</span> ${proposal.details.reversal}</div>
                        </div>
                    </div>
                `;
            default:
                return '';
        }
    }

    calculateTimeLeft(deadline) {
        const now = new Date();
        const end = new Date(deadline);
        const diff = end - now;

        if (diff <= 0) {
            return { expired: true, text: 'Voting ended' };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return { expired: false, text: `${days}d ${hours}h remaining` };
        } else if (hours > 0) {
            return { expired: false, text: `${hours}h ${minutes}m remaining` };
        } else {
            return { expired: false, text: `${minutes}m remaining` };
        }
    }

    async castVote(proposalId, vote) {
        if (!window.walletManager?.userAddress) {
            window.walletManager?.showNotification('Please connect your wallet to vote', 'warning');
            return;
        }

        if (this.votingPower === 0) {
            window.walletManager?.showNotification('You need to stake SPARK tokens to vote', 'warning');
            this.showStakeModal();
            return;
        }

        if (this.userVotes.has(proposalId)) {
            window.walletManager?.showNotification('You have already voted on this proposal', 'warning');
            return;
        }

        try {
            // Show voting animation
            this.showVotingAnimation(proposalId, vote);

            // Simulate blockchain transaction
            await this.simulateVoteTransaction(proposalId, vote);

            // Record the vote
            this.userVotes.set(proposalId, vote);
            
            // Update proposal votes
            const proposal = this.proposals.find(p => p.id === proposalId);
            if (proposal) {
                proposal.votes[vote] += this.votingPower;
            }

            // Re-render proposals
            this.renderProposals();

            // Show success notification
            window.walletManager?.showNotification(`Vote "${vote}" submitted successfully!`, 'success');

            // Save to localStorage
            localStorage.setItem('sparkrush_votes', JSON.stringify([...this.userVotes]));

        } catch (error) {
            console.error('Voting error:', error);
            window.walletManager?.showNotification('Failed to submit vote: ' + error.message, 'error');
        }
    }

    showVotingAnimation(proposalId, vote) {
        const button = document.querySelector(`[data-proposal-id="${proposalId}"].vote-${vote}`);
        if (button) {
            button.disabled = true;
            button.innerHTML = '<div class="pulse-loader mr-1"></div>Voting...';
        }
    }

    async simulateVoteTransaction(proposalId, vote) {
        // Simulate blockchain transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        
        // Simulate potential transaction failures (5% chance)
        if (Math.random() < 0.05) {
            throw new Error('Transaction failed: insufficient gas fee');
        }
    }

    startVoteUpdates() {
        // Simulate real-time vote updates from other users
        setInterval(() => {
            this.simulateVoteUpdate();
        }, 15000 + Math.random() * 30000); // Every 15-45 seconds
    }

    simulateVoteUpdate() {
        if (this.proposals.length === 0) return;

        const proposal = this.proposals[Math.floor(Math.random() * this.proposals.length)];
        const votes = ['yes', 'no', 'abstain'];
        const vote = votes[Math.floor(Math.random() * votes.length)];
        const voteCount = Math.floor(Math.random() * 50) + 1;

        proposal.votes[vote] += voteCount;
        
        // Re-render only if governance section is visible
        const governanceSection = document.getElementById('governance');
        if (governanceSection && this.isElementInViewport(governanceSection)) {
            this.renderProposals();
        }
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    updateVotingPowerDisplay() {
        // Simulate voting power based on wallet connection and staking
        if (window.walletManager?.userAddress) {
            this.stakingBalance = Math.floor(Math.random() * 50000) + 1000;
            this.votingPower = Math.floor(this.stakingBalance * 1.5); // Voting power multiplier
        } else {
            this.stakingBalance = 0;
            this.votingPower = 0;
        }

        const votingPowerElement = document.getElementById('voting-power');
        if (votingPowerElement) {
            votingPowerElement.textContent = this.votingPower.toLocaleString();
        }

        // Update staking UI
        this.updateStakingUI();
    }

    updateStakingUI() {
        // Update various staking-related UI elements
        const elements = document.querySelectorAll('[data-staking-balance]');
        elements.forEach(el => {
            el.textContent = this.stakingBalance.toLocaleString();
        });
    }

    showStakeModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-semibold">Stake SPARK Tokens</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="mb-6">
                    <p class="text-gray-300 text-sm mb-4">
                        Stake SPARK tokens to participate in governance voting. Your voting power is proportional to your staked amount.
                    </p>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Amount to Stake</label>
                        <input type="number" id="stake-amount" placeholder="1000" min="1" 
                               class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary">
                    </div>
                    
                    <div class="text-xs text-gray-400 mb-4">
                        <div class="flex justify-between">
                            <span>Current Balance:</span>
                            <span>${(this.stakingBalance + Math.floor(Math.random() * 10000)).toLocaleString()} SPARK</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Currently Staked:</span>
                            <span>${this.stakingBalance.toLocaleString()} SPARK</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex space-x-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 border border-gray-600 hover:border-gray-500 px-4 py-2 rounded-lg text-sm font-medium">
                        Cancel
                    </button>
                    <button onclick="window.governanceManager.processStaking()" 
                            class="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-4 py-2 rounded-lg text-sm font-medium">
                        Stake Tokens
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async processStaking() {
        const amountInput = document.getElementById('stake-amount');
        const amount = parseInt(amountInput.value);
        
        if (!amount || amount < 1) {
            window.walletManager?.showNotification('Please enter a valid amount', 'warning');
            return;
        }

        try {
            // Show loading state
            const button = event.target;
            button.disabled = true;
            button.innerHTML = '<div class="pulse-loader mr-2"></div>Staking...';

            // Simulate staking transaction
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Update staking balance
            this.stakingBalance += amount;
            this.updateVotingPowerDisplay();

            // Close modal
            const modal = button.closest('.fixed');
            modal.remove();

            window.walletManager?.showNotification(`Successfully staked ${amount.toLocaleString()} SPARK tokens!`, 'success');

        } catch (error) {
            window.walletManager?.showNotification('Staking failed: ' + error.message, 'error');
        }
    }

    // Create new proposal (for future implementation)
    createProposal(proposalData) {
        const newProposal = {
            id: `prop-${Date.now()}`,
            ...proposalData,
            created: new Date().toISOString(),
            status: 'active',
            votes: { yes: 0, no: 0, abstain: 0 }
        };

        this.proposals.unshift(newProposal);
        this.renderProposals();
        
        return newProposal.id;
    }

    // Get proposal by ID
    getProposal(id) {
        return this.proposals.find(p => p.id === id);
    }

    // Get user's voting history
    getVotingHistory() {
        return [...this.userVotes.entries()].map(([proposalId, vote]) => ({
            proposalId,
            vote,
            proposal: this.getProposal(proposalId)
        }));
    }

    // Calculate user's governance statistics
    getGovernanceStats() {
        const totalVotes = this.userVotes.size;
        const yesVotes = [...this.userVotes.values()].filter(vote => vote === 'yes').length;
        const noVotes = [...this.userVotes.values()].filter(vote => vote === 'no').length;
        const abstainVotes = [...this.userVotes.values()].filter(vote => vote === 'abstain').length;

        return {
            totalVotes,
            yesVotes,
            noVotes,
            abstainVotes,
            stakingBalance: this.stakingBalance,
            votingPower: this.votingPower,
            participationRate: this.proposals.length > 0 ? (totalVotes / this.proposals.length * 100).toFixed(1) : 0
        };
    }
}

// Initialize governance when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.governanceManager = new GovernanceManager();
    
    // Update voting power when wallet connects
    document.addEventListener('walletConnected', () => {
        setTimeout(() => {
            window.governanceManager.updateVotingPowerDisplay();
        }, 1000);
    });
});