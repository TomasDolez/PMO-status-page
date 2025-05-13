const sheetID = '1jt-m4j6801xuhEqKIHoY_GWnLX9YGlfLUuq43SOQ9Qk';
const servicesURL = `https://opensheet.elk.sh/${sheetID}/Services`;
const timelineURL = `https://opensheet.elk.sh/${sheetID}/Timeline`;

async function fetchServices() {
    try {
        const [servicesRes, timelineRes] = await Promise.all([
            fetch(servicesURL),
            fetch(timelineURL)
        ]);

        let services = await servicesRes.json();
        const timelineEntries = await timelineRes.json();

        services.forEach(service => {
            console.log(service.timeline)
            service.timeline = timelineEntries
                .filter(t => t.serviceId === service.id)
                .sort((a, b) => new Date(b.time) - new Date(a.time));

            // Count both full and partial outages
            service.totalOutages = service.timeline.filter(t =>
                t.status === 'Outage' || t.status === 'Partial Outage'
            ).length;

            service.lastIncident = getLastIncident(service.timeline);
        });

        renderStatusCards(services);
        updateTime();
    } catch (err) {
        console.error('Fetch failed:', err);
        alert("Failed to load service data.");
    }
}

function getStatusColor(status) {
    console.log(status)
    switch (status) {
        case 'operational':
            return 'var(--color-operational)';
        case 'partial':
            return 'var(--color-partial)';
        case 'outage':
            return 'var(--color-outage)';
        default:
            return 'var(--color-neutral)';
    }
}

function formatDateOnly(date) {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getLastIncident(timeline) {
    if (!Array.isArray(timeline) || timeline.length === 0) return 'N/A';

    const incidentDates = timeline
        .filter(item => item.status !== 'Operational')
        .map(item => new Date(item.time))
        .sort((a, b) => b - a);

    if (incidentDates.length === 0) return 'None';

    const last = incidentDates[0];
    const diffDays = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} day(s) ago`;
}

function renderStatusCards(services) {
    const grid = document.getElementById('status-grid');
    grid.innerHTML = '';

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'status-card';

        card.innerHTML = `
            <h3>${service.name}
                <span class="status-text status-${service.status}">${service.statusText}</span>
            </h3>
            <div class="status-details">${service.details}</div>
            <div class="status-extra">🔁 Total Outages: ${service.totalOutages}</div>
        `;

        card.onclick = () => showServiceDetails(service);
        grid.appendChild(card);
    });
}

function showServiceDetails(service) {
    document.getElementById('modal-title').textContent = service.name;
    document.getElementById('modal-status-message').textContent = service.details;
    document.getElementById('modal-indicator').className = 'status-indicator indicator-' + service.status;

    const timeline = document.getElementById('modal-timeline');
    timeline.innerHTML = '';

    service.timeline.forEach(item => {
        const el = document.createElement('div');
        el.className = 'timeline-item';
        const iconColor = getStatusColor(item.status);
        el.innerHTML = `
            <div class="timeline-icon" style="background-color: ${iconColor}"></div>
            <div class="timeline-content">
                <div class="timeline-time">${formatDateOnly(item.time)}</div>
                <div class="timeline-text">${item.text}</div>
            </div>
        `;
        timeline.appendChild(el);
    });

    document.getElementById('modal-backdrop').classList.add('active');
}

document.getElementById('modal-close').onclick = () => {
    document.getElementById('modal-backdrop').classList.remove('active');
};

document.getElementById('modal-backdrop').onclick = e => {
    if (e.target.id === 'modal-backdrop') {
        document.getElementById('modal-backdrop').classList.remove('active');
    }
};

function updateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long', // 👈 This gives "May"
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    document.getElementById('update-time').textContent = now.toLocaleString('en-US', options);
}


document.addEventListener('DOMContentLoaded', fetchServices);
