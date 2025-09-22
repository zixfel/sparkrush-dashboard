// SparkRush Analytics - Advanced Data Visualization
class AnalyticsManager {
    constructor() {
        this.charts = {};
        this.analyticsData = {};
        this.initializeAnalytics();
    }

    async initializeAnalytics() {
        // Generate mock analytics data
        this.generateMockData();
        
        // Initialize all charts
        setTimeout(() => {
            this.initializeScamDetectionChart();
            this.initializeRiskDistributionChart();
            this.initializeDeploymentTrendsChart();
            this.initializeCommunityActivityChart();
        }, 500);

        // Start real-time updates
        this.startRealTimeUpdates();
    }

    generateMockData() {
        // Scam detection over time (last 30 days)
        this.analyticsData.scamDetection = {
            labels: this.generateDateLabels(30),
            detected: this.generateScamDetectionData(30),
            prevented: this.generatePreventedScamsData(30),
            falsePositives: this.generateFalsePositivesData(30)
        };

        // Risk distribution
        this.analyticsData.riskDistribution = {
            high: Math.floor(Math.random() * 500) + 200,
            medium: Math.floor(Math.random() * 1000) + 500,
            low: Math.floor(Math.random() * 2000) + 1000,
            verified: Math.floor(Math.random() * 800) + 400
        };

        // Token deployment trends (last 7 days)
        this.analyticsData.deploymentTrends = {
            labels: this.generateDateLabels(7),
            legitimate: this.generateDeploymentData(7, 50, 200),
            suspicious: this.generateDeploymentData(7, 20, 100),
            scam: this.generateDeploymentData(7, 10, 50)
        };

        // Community activity (last 12 hours)
        this.analyticsData.communityActivity = {
            labels: this.generateHourLabels(12),
            votes: this.generateCommunityVotesData(12),
            reports: this.generateCommunityReportsData(12),
            verifications: this.generateCommunityVerificationsData(12)
        };
    }

    generateDateLabels(days) {
        const labels = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return labels;
    }

    generateHourLabels(hours) {
        const labels = [];
        for (let i = hours - 1; i >= 0; i--) {
            const date = new Date();
            date.setHours(date.getHours() - i);
            labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }
        return labels;
    }

    generateScamDetectionData(days) {
        const data = [];
        let baseValue = 50;
        for (let i = 0; i < days; i++) {
            // Add some trending and randomness
            baseValue += (Math.random() - 0.5) * 10;
            baseValue = Math.max(10, Math.min(200, baseValue));
            
            // Add weekly patterns (higher on weekends)
            const dayOfWeek = (i + new Date().getDay()) % 7;
            const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1;
            
            data.push(Math.floor(baseValue * weekendMultiplier + Math.random() * 20));
        }
        return data;
    }

    generatePreventedScamsData(days) {
        const detectedData = this.analyticsData.scamDetection?.detected || [];
        return detectedData.map(value => Math.floor(value * 0.85 + Math.random() * 10));
    }

    generateFalsePositivesData(days) {
        const detectedData = this.analyticsData.scamDetection?.detected || [];
        return detectedData.map(value => Math.floor(value * 0.05 + Math.random() * 3));
    }

    generateDeploymentData(days, min, max) {
        const data = [];
        for (let i = 0; i < days; i++) {
            data.push(Math.floor(Math.random() * (max - min) + min));
        }
        return data;
    }

    generateCommunityVotesData(hours) {
        const data = [];
        let baseValue = 150;
        for (let i = 0; i < hours; i++) {
            // Simulate daily activity patterns
            const hour = (new Date().getHours() - hours + i + 24) % 24;
            let activityMultiplier = 1;
            
            // Higher activity during US/EU hours
            if (hour >= 8 && hour <= 23) {
                activityMultiplier = 1.5;
            } else if (hour >= 0 && hour <= 2) {
                activityMultiplier = 0.7;
            }
            
            baseValue += (Math.random() - 0.5) * 20;
            data.push(Math.floor(baseValue * activityMultiplier + Math.random() * 30));
        }
        return data;
    }

    generateCommunityReportsData(hours) {
        const votesData = this.analyticsData.communityActivity?.votes || [];
        return votesData.map(value => Math.floor(value * 0.2 + Math.random() * 10));
    }

    generateCommunityVerificationsData(hours) {
        const votesData = this.analyticsData.communityActivity?.votes || [];
        return votesData.map(value => Math.floor(value * 0.15 + Math.random() * 5));
    }

    initializeScamDetectionChart() {
        const ctx = document.getElementById('scam-detection-chart');
        if (!ctx) return;

        this.charts.scamDetection = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.analyticsData.scamDetection.labels,
                datasets: [
                    {
                        label: 'Scams Detected',
                        data: this.analyticsData.scamDetection.detected,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Scams Prevented',
                        data: this.analyticsData.scamDetection.prevented,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'False Positives',
                        data: this.analyticsData.scamDetection.falsePositives,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d1d5db',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#ffffff',
                        bodyColor: '#d1d5db',
                        borderColor: '#374151',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' tokens';
                            }
                        }
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
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initializeRiskDistributionChart() {
        const ctx = document.getElementById('risk-distribution-chart');
        if (!ctx) return;

        const data = this.analyticsData.riskDistribution;
        
        this.charts.riskDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['High Risk', 'Medium Risk', 'Low Risk', 'Verified Safe'],
                datasets: [{
                    data: [data.high, data.medium, data.low, data.verified],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#10b981',
                        '#6366f1'
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
                        position: 'bottom',
                        labels: {
                            color: '#d1d5db',
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#ffffff',
                        bodyColor: '#d1d5db',
                        borderColor: '#374151',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return context.label + ': ' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    initializeDeploymentTrendsChart() {
        const ctx = document.getElementById('deployment-trends-chart');
        if (!ctx) return;

        this.charts.deploymentTrends = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.analyticsData.deploymentTrends.labels,
                datasets: [
                    {
                        label: 'Legitimate',
                        data: this.analyticsData.deploymentTrends.legitimate,
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    },
                    {
                        label: 'Suspicious',
                        data: this.analyticsData.deploymentTrends.suspicious,
                        backgroundColor: '#f59e0b',
                        borderRadius: 4
                    },
                    {
                        label: 'Scam',
                        data: this.analyticsData.deploymentTrends.scam,
                        backgroundColor: '#ef4444',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d1d5db',
                            usePointStyle: true,
                            pointStyle: 'rect'
                        }
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
                        stacked: true,
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initializeCommunityActivityChart() {
        const ctx = document.getElementById('community-activity-chart');
        if (!ctx) return;

        this.charts.communityActivity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.analyticsData.communityActivity.labels,
                datasets: [
                    {
                        label: 'Community Votes',
                        data: this.analyticsData.communityActivity.votes,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Scam Reports',
                        data: this.analyticsData.communityActivity.reports,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Verifications',
                        data: this.analyticsData.communityActivity.verifications,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d1d5db',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
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
                            color: '#9ca3af',
                            maxRotation: 45
                        }
                    },
                    y: {
                        grid: {
                            color: '#374151'
                        },
                        ticks: {
                            color: '#9ca3af'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    startRealTimeUpdates() {
        // Update analytics data every 30 seconds
        setInterval(() => {
            this.updateAnalyticsData();
        }, 30000);

        // Update community activity chart more frequently (every 10 seconds)
        setInterval(() => {
            this.updateCommunityActivity();
        }, 10000);
    }

    updateAnalyticsData() {
        // Add new data point to scam detection
        const newDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const lastDetected = this.analyticsData.scamDetection.detected.slice(-1)[0] || 50;
        const newDetected = Math.max(10, lastDetected + (Math.random() - 0.5) * 20);
        
        // Only update if we're not already at today's date
        if (this.analyticsData.scamDetection.labels.slice(-1)[0] !== newDate) {
            this.analyticsData.scamDetection.labels.push(newDate);
            this.analyticsData.scamDetection.detected.push(Math.floor(newDetected));
            this.analyticsData.scamDetection.prevented.push(Math.floor(newDetected * 0.85));
            this.analyticsData.scamDetection.falsePositives.push(Math.floor(newDetected * 0.05));

            // Keep only last 30 days
            if (this.analyticsData.scamDetection.labels.length > 30) {
                this.analyticsData.scamDetection.labels.shift();
                this.analyticsData.scamDetection.detected.shift();
                this.analyticsData.scamDetection.prevented.shift();
                this.analyticsData.scamDetection.falsePositives.shift();
            }

            // Update chart
            if (this.charts.scamDetection) {
                this.charts.scamDetection.update('none');
            }
        }

        // Update risk distribution
        const riskChanges = {
            high: (Math.random() - 0.5) * 10,
            medium: (Math.random() - 0.5) * 20,
            low: (Math.random() - 0.5) * 30,
            verified: (Math.random() - 0.5) * 15
        };

        Object.keys(riskChanges).forEach(key => {
            this.analyticsData.riskDistribution[key] = Math.max(0, 
                this.analyticsData.riskDistribution[key] + riskChanges[key]
            );
        });

        if (this.charts.riskDistribution) {
            this.charts.riskDistribution.data.datasets[0].data = [
                this.analyticsData.riskDistribution.high,
                this.analyticsData.riskDistribution.medium,
                this.analyticsData.riskDistribution.low,
                this.analyticsData.riskDistribution.verified
            ];
            this.charts.riskDistribution.update('none');
        }
    }

    updateCommunityActivity() {
        // Add new hourly data point
        const newTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        // Generate new activity data
        const lastVotes = this.analyticsData.communityActivity.votes.slice(-1)[0] || 150;
        const newVotes = Math.max(50, lastVotes + (Math.random() - 0.5) * 40);
        
        this.analyticsData.communityActivity.labels.push(newTime);
        this.analyticsData.communityActivity.votes.push(Math.floor(newVotes));
        this.analyticsData.communityActivity.reports.push(Math.floor(newVotes * 0.2 + Math.random() * 10));
        this.analyticsData.communityActivity.verifications.push(Math.floor(newVotes * 0.15 + Math.random() * 5));

        // Keep only last 12 hours
        if (this.analyticsData.communityActivity.labels.length > 12) {
            this.analyticsData.communityActivity.labels.shift();
            this.analyticsData.communityActivity.votes.shift();
            this.analyticsData.communityActivity.reports.shift();
            this.analyticsData.communityActivity.verifications.shift();
        }

        // Update chart
        if (this.charts.communityActivity) {
            this.charts.communityActivity.update('none');
        }
    }

    // Export analytics data
    exportAnalytics() {
        const exportData = {
            timestamp: new Date().toISOString(),
            scamDetection: this.analyticsData.scamDetection,
            riskDistribution: this.analyticsData.riskDistribution,
            deploymentTrends: this.analyticsData.deploymentTrends,
            communityActivity: this.analyticsData.communityActivity,
            summary: this.generateAnalyticsSummary()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `sparkrush-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    generateAnalyticsSummary() {
        const scamDetection = this.analyticsData.scamDetection;
        const riskDist = this.analyticsData.riskDistribution;
        const community = this.analyticsData.communityActivity;

        // Calculate totals and averages
        const totalScamsDetected = scamDetection.detected.reduce((a, b) => a + b, 0);
        const totalScamsPrevented = scamDetection.prevented.reduce((a, b) => a + b, 0);
        const avgScamsPerDay = (totalScamsDetected / scamDetection.detected.length).toFixed(1);
        const preventionRate = ((totalScamsPrevented / totalScamsDetected) * 100).toFixed(1);

        const totalTokensAnalyzed = Object.values(riskDist).reduce((a, b) => a + b, 0);
        const highRiskPercentage = ((riskDist.high / totalTokensAnalyzed) * 100).toFixed(1);
        const verifiedPercentage = ((riskDist.verified / totalTokensAnalyzed) * 100).toFixed(1);

        const totalVotes = community.votes.reduce((a, b) => a + b, 0);
        const totalReports = community.reports.reduce((a, b) => a + b, 0);
        const avgVotesPerHour = (totalVotes / community.votes.length).toFixed(0);

        return {
            scamDetection: {
                totalDetected: totalScamsDetected,
                totalPrevented: totalScamsPrevented,
                averagePerDay: avgScamsPerDay,
                preventionRate: preventionRate + '%'
            },
            riskDistribution: {
                totalAnalyzed: totalTokensAnalyzed,
                highRiskPercentage: highRiskPercentage + '%',
                verifiedPercentage: verifiedPercentage + '%'
            },
            communityActivity: {
                totalVotes: totalVotes,
                totalReports: totalReports,
                averageVotesPerHour: avgVotesPerHour
            }
        };
    }

    // Get specific analytics for external use
    getScamDetectionStats() {
        const data = this.analyticsData.scamDetection;
        return {
            totalDetected: data.detected.reduce((a, b) => a + b, 0),
            totalPrevented: data.prevented.reduce((a, b) => a + b, 0),
            latestDay: {
                detected: data.detected.slice(-1)[0],
                prevented: data.prevented.slice(-1)[0]
            },
            trend: this.calculateTrend(data.detected)
        };
    }

    getRiskDistributionStats() {
        const data = this.analyticsData.riskDistribution;
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        
        return {
            total: total,
            distribution: {
                high: { count: data.high, percentage: ((data.high / total) * 100).toFixed(1) },
                medium: { count: data.medium, percentage: ((data.medium / total) * 100).toFixed(1) },
                low: { count: data.low, percentage: ((data.low / total) * 100).toFixed(1) },
                verified: { count: data.verified, percentage: ((data.verified / total) * 100).toFixed(1) }
            }
        };
    }

    getCommunityActivityStats() {
        const data = this.analyticsData.communityActivity;
        return {
            totalVotes: data.votes.reduce((a, b) => a + b, 0),
            totalReports: data.reports.reduce((a, b) => a + b, 0),
            totalVerifications: data.verifications.reduce((a, b) => a + b, 0),
            averageActivity: {
                votes: (data.votes.reduce((a, b) => a + b, 0) / data.votes.length).toFixed(0),
                reports: (data.reports.reduce((a, b) => a + b, 0) / data.reports.length).toFixed(0),
                verifications: (data.verifications.reduce((a, b) => a + b, 0) / data.verifications.length).toFixed(0)
            }
        };
    }

    calculateTrend(dataArray) {
        if (dataArray.length < 2) return 0;
        
        const recent = dataArray.slice(-7).reduce((a, b) => a + b, 0) / 7;
        const previous = dataArray.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
        
        return ((recent - previous) / previous * 100).toFixed(1);
    }

    // Refresh all charts
    refreshCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.update();
            }
        });
    }

    // Destroy all charts (cleanup)
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other components to load first
    setTimeout(() => {
        window.analyticsManager = new AnalyticsManager();
    }, 1000);
});