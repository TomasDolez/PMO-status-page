// Sample data - this would typically come from an API
        const services = [
            {
                id: 'api-service',
                name: 'API Service',
                status: 'operational',
                statusText: 'Operational',
                details: 'All systems functioning normally.',
                uptime: 99.98,
                responseTime: '187ms',
                lastIncident: '15 days ago',
                totalOutages: 0,
                timeline: [
                    { time: 'May 12, 2025 - 10:30 AM', text: 'Routine maintenance completed', status: 'operational' },
                    { time: 'May 10, 2025 - 2:15 PM', text: 'Performance optimizations deployed', status: 'operational' },
                    { time: 'April 27, 2025 - 9:45 AM', text: 'Scheduled maintenance performed', status: 'maintenance' }
                ]
            },
            {
                id: 'auth-service',
                name: 'Authentication Service',
                status: 'degraded',
                statusText: 'Degraded Performance',
                details: 'Experiencing higher than normal latency. Our team is investigating.',
                uptime: 98.32,
                responseTime: '321ms',
                lastIncident: '2 days ago',
                totalOutages: 1,
                timeline: [
                    { time: 'May 12, 2025 - 8:20 AM', text: 'Investigating increased latency', status: 'degraded' },
                    { time: 'May 11, 2025 - 11:40 PM', text: 'Performance degradation detected', status: 'degraded' },
                    { time: 'May 10, 2025 - 3:30 PM', text: 'Service fully operational', status: 'operational' }
                ]
            },
            {
                id: 'database',
                name: 'Database Cluster',
                status: 'operational',
                statusText: 'Operational',
                details: 'All database nodes functioning normally.',
                uptime: 99.99,
                responseTime: '52ms',
                lastIncident: '45 days ago',
                totalOutages: 0,
                timeline: [
                    { time: 'May 5, 2025 - 1:15 AM', text: 'Routine backup completed', status: 'operational' },
                    { time: 'April 28, 2025 - 2:30 AM', text: 'Database optimization performed', status: 'operational' },
                    { time: 'April 20, 2025 - 3:45 AM', text: 'Backup verification completed', status: 'operational' }
                ]
            },
            {
                id: 'storage',
                name: 'Storage Service',
                status: 'outage',
                statusText: 'Major Outage',
                details: 'Storage service is currently unavailable. Our engineers are working to resolve this issue.',
                uptime: 92.45,
                responseTime: 'N/A',
                lastIncident: 'Ongoing',
                totalOutages: 3,
                timeline: [
                    { time: 'May 12, 2025 - 9:10 AM', text: 'Identified root cause, implementing fix', status: 'outage' },
                    { time: 'May 12, 2025 - 7:30 AM', text: 'Major outage detected', status: 'outage' },
                    { time: 'May 11, 2025 - 4:15 PM', text: 'Minor connectivity issues resolved', status: 'operational' }
                ]
            },
            {
                id: 'cdn',
                name: 'Content Delivery Network',
                status: 'operational',
                statusText: 'Operational',
                details: 'All edge locations reporting normal operation.',
                uptime: 99.95,
                responseTime: '78ms',
                lastIncident: '8 days ago',
                totalOutages: 1,
                timeline: [
                    { time: 'May 12, 2025 - 12:00 PM', text: 'All systems normal', status: 'operational' },
                    { time: 'May 4, 2025 - 5:45 PM', text: 'Edge node in Asia region restored', status: 'operational' },
                    { time: 'May 4, 2025 - 2:30 PM', text: 'Issues with Asia region edge node', status: 'degraded' }
                ]
            },
            {
                id: 'analytics',
                name: 'Analytics Platform',
                status: 'maintenance',
                statusText: 'Scheduled Maintenance',
                details: 'Scheduled maintenance in progress. Service will be fully restored by 2:00 PM.',
                uptime: 97.85,
                responseTime: '245ms',
                lastIncident: '1 day ago',
                totalOutages: 0,
                timeline: [
                    { time: 'May 12, 2025 - 11:00 AM', text: 'Scheduled maintenance started', status: 'maintenance' },
                    { time: 'May 11, 2025 - 4:30 PM', text: 'Maintenance scheduled for May 12', status: 'operational' },
                    { time: 'May 10, 2025 - 10:15 AM', text: 'Performance optimizations deployed', status: 'operational' }
                ]
            }
        ];

        // Generate status cards
        function renderStatusCards() {
            const statusGrid = document.getElementById('status-grid');
            statusGrid.innerHTML = '';

            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'status-card';
                card.dataset.id = service.id;

                let uptimeFillColor;
                switch(service.status) {
                    case 'operational': uptimeFillColor = 'var(--color-success)'; break;
                    case 'degraded': uptimeFillColor = 'var(--color-warning)'; break;
                    case 'outage': uptimeFillColor = 'var(--color-danger)'; break;
                    case 'maintenance': uptimeFillColor = 'var(--color-neutral)'; break;
                }

                card.innerHTML = `
                    <h3>
                        ${service.name}
                        <span class="status-text status-${service.status}">${service.statusText}</span>
                    </h3>
                    <div class="status-details">${service.details}</div>
        
                `;

                card.addEventListener('click', () => showServiceDetails(service.id));
                statusGrid.appendChild(card);
            });
        }

        // Show service details in modal
        function showServiceDetails(serviceId) {
            const service = services.find(s => s.id === serviceId);
            if (!service) return;

            // Set modal content
            document.getElementById('modal-title').textContent = service.name;
            document.getElementById('modal-status-message').textContent = service.details;


            // Set status indicator
            const indicator = document.getElementById('modal-indicator');
            indicator.className = 'status-indicator indicator-' + service.status;

            // Generate timeline
            const timeline = document.getElementById('modal-timeline');
            timeline.innerHTML = '';

            service.timeline.forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';

                let iconColor;
                switch(item.status) {
                    case 'operational': iconColor = 'var(--color-success)'; break;
                    case 'degraded': iconColor = 'var(--color-warning)'; break;
                    case 'outage': iconColor = 'var(--color-danger)'; break;
                    case 'maintenance': iconColor = 'var(--color-neutral)'; break;
                }

                timelineItem.innerHTML = `
                    <div class="timeline-icon" style="background-color: ${iconColor}"></div>
                    <div class="timeline-content">
                        <div class="timeline-time">${item.time}</div>
                        <div class="timeline-text">${item.text}</div>
                    </div>
                `;

                timeline.appendChild(timelineItem);
            });

            // Show modal
            document.getElementById('modal-backdrop').classList.add('active');
        }

        // Close modal
        document.getElementById('modal-close').addEventListener('click', () => {
            document.getElementById('modal-backdrop').classList.remove('active');
        });

        // Close modal when clicking on backdrop
        document.getElementById('modal-backdrop').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal-backdrop')) {
                document.getElementById('modal-backdrop').classList.remove('active');
            }
        });

        // Update time
        function updateTime() {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit'
            };
            document.getElementById('update-time').textContent = now.toLocaleDateString('en-US', options);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderStatusCards();
            updateTime();
        });