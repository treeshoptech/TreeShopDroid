// TreeShopDroid Prototype - Interactive Demo

// Sample lead data
let leads = [
    {
        id: 1,
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        customerPhone: '(555) 123-4567',
        address: '123 Oak Street, Portland, OR',
        lat: 45.5231,
        lng: -122.6765,
        workflowStage: 'LEAD',
        serviceType: 'Tree Removal',
        priority: 'high',
        estimatedValue: 3500,
        notes: 'Large oak tree near house, needs removal ASAP'
    },
    {
        id: 2,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        customerPhone: '(555) 234-5678',
        address: '456 Pine Avenue, Portland, OR',
        lat: 45.5152,
        lng: -122.6784,
        workflowStage: 'PROPOSAL',
        serviceType: 'Tree Trimming',
        priority: 'medium',
        estimatedValue: 1200,
        notes: 'Multiple trees need trimming'
    },
    {
        id: 3,
        customerName: 'Mike Davis',
        customerEmail: 'mdavis@example.com',
        customerPhone: '(555) 345-6789',
        address: '789 Maple Drive, Portland, OR',
        lat: 45.5280,
        lng: -122.6850,
        workflowStage: 'WORK_ORDER',
        serviceType: 'Stump Grinding',
        priority: 'low',
        estimatedValue: 800,
        notes: '3 stumps in backyard'
    },
    {
        id: 4,
        customerName: 'Emily Wilson',
        customerEmail: 'ewilson@example.com',
        customerPhone: '(555) 456-7890',
        address: '321 Elm Street, Portland, OR',
        lat: 45.5195,
        lng: -122.6730,
        workflowStage: 'INVOICE',
        serviceType: 'Forestry Mulching',
        priority: 'medium',
        estimatedValue: 5500,
        notes: 'Large property clearing completed'
    },
    {
        id: 5,
        customerName: 'David Brown',
        customerEmail: 'dbrown@example.com',
        customerPhone: '(555) 567-8901',
        address: '654 Cedar Lane, Portland, OR',
        lat: 45.5340,
        lng: -122.6700,
        workflowStage: 'LEAD',
        serviceType: 'Tree Assessment',
        priority: 'critical',
        estimatedValue: 2000,
        notes: 'Emergency - tree damaged in storm'
    }
];

let map = null;
let markers = [];
let currentView = 'map';
let selectedLead = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
    renderLeadsList();
});

// Initialize Leaflet map
function initializeMap() {
    map = L.map('map').setView([45.5231, -122.6765], 13);

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 19
    }).addTo(map);

    // Add markers for all leads
    renderMarkers();
}

// Render lead markers on map
function renderMarkers() {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    // Add markers for each lead
    leads.forEach(lead => {
        const markerColor = getWorkflowColor(lead.workflowStage);

        const marker = L.circleMarker([lead.lat, lead.lng], {
            radius: 10,
            fillColor: markerColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
            <div style="color: #1C1B1F;">
                <strong>${lead.customerName}</strong><br>
                ${lead.address}<br>
                <span class="workflow-badge ${lead.workflowStage}">${lead.workflowStage.replace('_', ' ')}</span>
            </div>
        `);

        marker.on('click', () => {
            showLeadSheet(lead);
        });

        markers.push(marker);
    });
}

// Get color for workflow stage
function getWorkflowColor(stage) {
    const colors = {
        'LEAD': '#2196F3',
        'PROPOSAL': '#FF9800',
        'WORK_ORDER': '#4CAF50',
        'INVOICE': '#F44336',
        'COMPLETED': '#9E9E9E'
    };
    return colors[stage] || colors['LEAD'];
}

// Setup event listeners
function setupEventListeners() {
    // Menu button
    document.getElementById('menuBtn').addEventListener('click', toggleDrawer);

    // Drawer overlay
    document.getElementById('drawerOverlay').addEventListener('click', closeDrawer);

    // Navigation items
    document.querySelectorAll('.drawer-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            if (view) {
                switchView(view);
                closeDrawer();
            }
        });
    });

    // FAB - Add Lead
    document.getElementById('addLeadBtn').addEventListener('click', openAddLeadModal);

    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeAddLeadModal);
    document.getElementById('cancelBtn').addEventListener('click', closeAddLeadModal);

    // Save lead
    document.getElementById('saveLeadBtn').addEventListener('click', saveLead);

    // Filter chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const stage = chip.getAttribute('data-stage');
            filterLeads(stage);
        });
    });

    // Click outside modal to close
    document.getElementById('addLeadModal').addEventListener('click', (e) => {
        if (e.target.id === 'addLeadModal') {
            closeAddLeadModal();
        }
    });
}

// Toggle drawer
function toggleDrawer() {
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('drawerOverlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Close drawer
function closeDrawer() {
    document.getElementById('navDrawer').classList.remove('open');
    document.getElementById('drawerOverlay').classList.remove('active');
}

// Switch view
function switchView(viewName) {
    // Update active drawer item
    document.querySelectorAll('.drawer-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        }
    });

    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected view
    const targetView = document.getElementById(viewName + 'View');
    if (targetView) {
        targetView.classList.add('active');
        currentView = viewName;

        // Refresh map if switching to map view
        if (viewName === 'map' && map) {
            setTimeout(() => map.invalidateSize(), 300);
        }
    }
}

// Show lead detail sheet
function showLeadSheet(lead) {
    selectedLead = lead;
    const sheet = document.getElementById('leadSheet');
    const content = document.getElementById('sheetContent');

    content.innerHTML = `
        <div class="lead-card">
            <div class="lead-card-header">
                <div>
                    <div class="lead-name">${lead.customerName}</div>
                    <div class="lead-address">${lead.address}</div>
                </div>
                <span class="workflow-badge ${lead.workflowStage}">${lead.workflowStage.replace('_', ' ')}</span>
            </div>

            <div class="lead-details">
                <div class="detail-row">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">${lead.serviceType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Priority:</span>
                    <span class="detail-value">${lead.priority.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estimated Value:</span>
                    <span class="detail-value">$${lead.estimatedValue.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${lead.customerPhone}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${lead.customerEmail}</span>
                </div>
            </div>

            ${lead.notes ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div class="detail-label" style="margin-bottom: 8px;">Notes:</div>
                    <div style="font-size: 14px;">${lead.notes}</div>
                </div>
            ` : ''}

            <div class="lead-actions">
                <button class="btn btn-secondary" onclick="closeLeadSheet()">Close</button>
                <button class="btn btn-primary" onclick="advanceWorkflow(${lead.id})">
                    ${getNextWorkflowAction(lead.workflowStage)}
                </button>
            </div>
        </div>
    `;

    sheet.classList.add('open');
}

// Close lead sheet
function closeLeadSheet() {
    document.getElementById('leadSheet').classList.remove('open');
    selectedLead = null;
}

// Get next workflow action text
function getNextWorkflowAction(stage) {
    const actions = {
        'LEAD': 'Convert to Proposal',
        'PROPOSAL': 'Accept & Create Work Order',
        'WORK_ORDER': 'Complete & Invoice',
        'INVOICE': 'Mark as Paid',
        'COMPLETED': 'Completed'
    };
    return actions[stage] || 'Next Stage';
}

// Advance workflow
function advanceWorkflow(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const stageOrder = ['LEAD', 'PROPOSAL', 'WORK_ORDER', 'INVOICE', 'COMPLETED'];
    const currentIndex = stageOrder.indexOf(lead.workflowStage);

    if (currentIndex < stageOrder.length - 1) {
        lead.workflowStage = stageOrder[currentIndex + 1];
        renderMarkers();
        renderLeadsList();
        closeLeadSheet();

        // Show success message
        showToast(`${lead.customerName} moved to ${lead.workflowStage.replace('_', ' ')}`);
    }
}

// Open add lead modal
function openAddLeadModal() {
    document.getElementById('addLeadModal').classList.add('open');
}

// Close add lead modal
function closeAddLeadModal() {
    document.getElementById('addLeadModal').classList.remove('open');
    // Reset form
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('propertyAddress').value = '';
    document.getElementById('serviceType').value = 'tree_removal';
    document.getElementById('priority').value = 'medium';
    document.getElementById('estimatedValue').value = '';
    document.getElementById('notes').value = '';
}

// Save new lead
function saveLead() {
    const customerName = document.getElementById('customerName').value.trim();
    const propertyAddress = document.getElementById('propertyAddress').value.trim();

    if (!customerName || !propertyAddress) {
        alert('Please fill in required fields');
        return;
    }

    const newLead = {
        id: leads.length + 1,
        customerName,
        customerEmail: document.getElementById('customerEmail').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        address: propertyAddress,
        lat: 45.5231 + (Math.random() - 0.5) * 0.05,
        lng: -122.6765 + (Math.random() - 0.5) * 0.05,
        workflowStage: 'LEAD',
        serviceType: document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text,
        priority: document.getElementById('priority').value,
        estimatedValue: parseInt(document.getElementById('estimatedValue').value) || 0,
        notes: document.getElementById('notes').value.trim()
    };

    leads.push(newLead);
    renderMarkers();
    renderLeadsList();
    closeAddLeadModal();
    showToast('Lead created successfully!');

    // Pan to new lead on map
    if (currentView === 'map') {
        map.setView([newLead.lat, newLead.lng], 15);
    }
}

// Render leads list
function renderLeadsList() {
    const container = document.getElementById('leadsList');
    const activeFilter = document.querySelector('.chip.active')?.getAttribute('data-stage') || 'all';

    const filteredLeads = activeFilter === 'all'
        ? leads
        : leads.filter(l => l.workflowStage === activeFilter);

    if (filteredLeads.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No leads found</p></div>';
        return;
    }

    container.innerHTML = filteredLeads.map(lead => `
        <div class="list-lead-card" onclick="showLeadFromList(${lead.id})">
            <div class="lead-card-header">
                <div>
                    <div class="lead-name">${lead.customerName}</div>
                    <div class="lead-address">${lead.address}</div>
                </div>
                <span class="workflow-badge ${lead.workflowStage}">${lead.workflowStage.replace('_', ' ')}</span>
            </div>
            <div class="lead-details">
                <div class="detail-row">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">${lead.serviceType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Value:</span>
                    <span class="detail-value">$${lead.estimatedValue.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Show lead from list
function showLeadFromList(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
        switchView('map');
        map.setView([lead.lat, lead.lng], 16);
        setTimeout(() => showLeadSheet(lead), 300);
    }
}

// Filter leads
function filterLeads(stage) {
    renderLeadsList();
}

// Show toast notification
function showToast(message) {
    // Simple toast (could be enhanced)
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #323232;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        z-index: 1000;
        font-size: 14px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Make functions globally accessible
window.closeLeadSheet = closeLeadSheet;
window.advanceWorkflow = advanceWorkflow;
window.showLeadFromList = showLeadFromList;
