const sheetID = '1jt-m4j6801xuhEqKIHoY_GWnLX9YGlfLUuq43SOQ9Qk';
const url = `https://opensheet.elk.sh/${sheetID}/Sheet1`;


async function fetchServices() {
    try {
        const res = await fetch(url);
        let services = await res.json();

        services.forEach(service => {
            try {
                service.timeline = JSON.parse(service.timeline || '[]');
            } catch {
                service.timeline = [];
            }
            service.lastIncident = getLastIncident(service.timeline);
        });
        console.log('Fetched services:', services);
        renderStatusCards(services);
        updateTime();
    } catch (err) {
        console.error('Fetch failed:', err);
        alert("Failed to load service data.");
    }
}


function getLastIncident(timeline) {
    if (!Array.isArray(timeline) || timeline.length === 0) return 'N/A';

    const incidentDates = timeline
        .filter(item => item.status !== 'operational')
        .map(item => new Date(item.time))
        .sort((a, b) => b - a);

    if (incidentDates.length === 0) return 'None';

    const last = incidentDates[0];
    const diffDays = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} day(s) ago`;
}

function renderStatusCards(services) {
    const statusGrid = document.getElementById('status-grid');
    statusGrid.innerHTML = '';
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'status-card';
        card.dataset.id = service.id;

        card.innerHTML = `
            <h3>
                ${service.name}
                <span class="status-text status-${service.status}">${service.statusText}</span>
            </h3>
            <div class="status-details">${service.details}</div>
        `;

        card.addEventListener('click', () => showServiceDetails(service));
        statusGrid.appendChild(card);
    });
}

function showServiceDetails(service) {
    document.getElementById('modal-title').textContent = service.name;
    document.getElementById('modal-status-message').textContent = service.details;
    const indicator = document.getElementById('modal-indicator');
    indicator.className = 'status-indicator indicator-' + service.status;

    const timeline = document.getElementById('modal-timeline');
    timeline.innerHTML = '';

    service.timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        let iconColor = 'var(--color-neutral)';
        switch (item.status) {
            case 'operational': iconColor = 'var(--color-success)'; break;
            case 'degraded': iconColor = 'var(--color-warning)'; break;
            case 'outage': iconColor = 'var(--color-danger)'; break;
            case 'maintenance': iconColor = 'var(--color-neutral)'; break;
        }

        timelineItem.innerHTML = `
            <div class="timeline-icon" style="background-color: ${iconColor}"></div>
            <div class="timeline-content">
                <div class="timeline-time">${new Date(item.time).toLocaleString()}</div>
                <div class="timeline-text">${item.text}</div>
            </div>
        `;

        timeline.appendChild(timelineItem);
    });

    document.getElementById('modal-backdrop').classList.add('active');
}

document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal-backdrop').classList.remove('active');
});

document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-backdrop')) {
        document.getElementById('modal-backdrop').classList.remove('active');
    }
});

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

document.addEventListener('DOMContentLoaded', fetchServices);
