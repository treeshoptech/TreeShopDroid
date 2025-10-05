// TreeShop Mind Map - Main Application Controller

class App {
    constructor() {
        this.mindMap = null;
        this.currentNode = null;
        this.autoSaveInterval = null;
        this.init();
    }

    init() {
        // Initialize canvas
        const canvas = document.getElementById('mindMapCanvas');
        this.mindMap = new MindMap(canvas);
        window.app = this; // Make globally accessible

        // Load data
        this.loadData();

        // Setup event listeners
        this.setupEventListeners();

        // Start auto-save
        this.startAutoSave();

        // Update stats
        this.updateStats();
    }

    setupEventListeners() {
        // Header buttons
        document.getElementById('searchBtn').addEventListener('click', () => this.showSearch());
        document.getElementById('filterBtn').addEventListener('click', () => this.showFilter());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => this.showImport());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());

        // Canvas controls
        document.getElementById('addRootNodeBtn').addEventListener('click', () => this.addRootNode());
        document.getElementById('addChildNodeBtn').addEventListener('click', () => this.addChildNode());
        document.getElementById('toggleCompleteBtn').addEventListener('click', () => this.toggleComplete());
        document.getElementById('zoomInBtn').addEventListener('click', () => this.mindMap.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.mindMap.zoomOut());
        document.getElementById('resetViewBtn').addEventListener('click', () => this.mindMap.resetView());

        // Sidebar
        document.getElementById('closeSidebar').addEventListener('click', () => this.closeSidebar());
        document.getElementById('deleteNodeBtn').addEventListener('click', () => this.deleteNode());
        document.getElementById('saveNodeBtn').addEventListener('click', () => this.saveNodeChanges());

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('saveModalBtn').addEventListener('click', () => this.saveModal());

        // Import file input
        document.getElementById('importFileInput').addEventListener('change', (e) => this.handleImport(e));

        // Click outside modal to close
        document.getElementById('nodeModal').addEventListener('click', (e) => {
            if (e.target.id === 'nodeModal') {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        // Ctrl/Cmd + S: Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveData();
        }

        // Ctrl/Cmd + E: Export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            this.exportData();
        }

        // Delete: Delete selected node
        if (e.key === 'Delete' && this.mindMap.selectedNode) {
            e.preventDefault();
            this.deleteNode();
        }

        // Escape: Deselect / Close modal
        if (e.key === 'Escape') {
            if (document.getElementById('nodeModal').classList.contains('active')) {
                this.closeModal();
            } else {
                this.mindMap.selectedNode = null;
                this.mindMap.render();
                this.closeSidebar();
            }
        }

        // Enter: Edit selected node
        if (e.key === 'Enter' && this.mindMap.selectedNode) {
            this.editNode(this.mindMap.selectedNode);
        }
    }

    loadData() {
        const data = storage.loadData();
        this.mindMap.loadData(data);
        document.getElementById('projectName').textContent = data.projectName || 'TreeShopDroid Development';
    }

    saveData() {
        const data = {
            projectName: document.getElementById('projectName').textContent,
            ...this.mindMap.getData(),
            lastModified: new Date().toISOString()
        };
        storage.saveData(data);
        this.updateStats();
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveData();
        }, 30000); // Save every 30 seconds
    }

    addRootNode() {
        this.currentNode = null;
        this.openModal('Add Root Node', {});
    }

    addChildNode() {
        if (!this.mindMap.selectedNode) {
            alert('Please select a parent node first');
            return;
        }
        this.currentNode = null;
        this.openModal('Add Child Node', { parentId: this.mindMap.selectedNode.id });
    }

    toggleComplete() {
        if (!this.mindMap.selectedNode) return;

        const node = this.mindMap.selectedNode;
        const newStatus = node.status === 'completed' ? 'pending' : 'completed';
        this.mindMap.updateNode(node.id, { status: newStatus });
        this.saveData();
        this.onNodeSelected(node);
    }

    openModal(title, defaultData = {}) {
        const modal = document.getElementById('nodeModal');
        document.getElementById('modalTitle').textContent = title;

        // Fill form with default or existing data
        document.getElementById('nodeTitle').value = defaultData.title || '';
        document.getElementById('nodeDescription').value = defaultData.description || '';
        document.getElementById('nodeStatus').value = defaultData.status || 'pending';
        document.getElementById('nodePriority').value = defaultData.priority || 'medium';
        document.getElementById('nodeTags').value = defaultData.tags ? defaultData.tags.join(', ') : '';
        document.getElementById('nodeNotes').value = defaultData.notes || '';

        // Store parent ID if this is a child node
        this.tempParentId = defaultData.parentId || null;

        modal.classList.add('active');
        document.getElementById('nodeTitle').focus();
    }

    closeModal() {
        document.getElementById('nodeModal').classList.remove('active');
    }

    saveModal() {
        const title = document.getElementById('nodeTitle').value.trim();
        if (!title) {
            alert('Please enter a title');
            return;
        }

        const nodeData = {
            title,
            description: document.getElementById('nodeDescription').value.trim(),
            status: document.getElementById('nodeStatus').value,
            priority: document.getElementById('nodePriority').value,
            tags: document.getElementById('nodeTags').value.split(',').map(t => t.trim()).filter(t => t),
            notes: document.getElementById('nodeNotes').value.trim(),
            parentId: this.tempParentId
        };

        if (this.currentNode) {
            // Update existing node
            this.mindMap.updateNode(this.currentNode.id, nodeData);
        } else {
            // Add new node
            const newNode = this.mindMap.addNode(nodeData);
            this.mindMap.selectNode(newNode);
        }

        this.saveData();
        this.closeModal();
    }

    editNode(node) {
        this.currentNode = node;
        this.openModal('Edit Node', node);
    }

    onNodeSelected(node) {
        this.currentNode = node;
        this.showSidebar(node);
        this.updateControlButtons();
    }

    showSidebar(node) {
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('sidebarContent');
        const footer = document.getElementById('sidebarFooter');

        sidebar.classList.remove('closed');
        footer.style.display = 'flex';

        // Build node details HTML
        content.innerHTML = `
            <div class="node-details">
                <div class="detail-group">
                    <div class="detail-label">Title</div>
                    <div class="detail-value">${this.escapeHtml(node.title)}</div>
                </div>

                <div class="detail-group">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <span class="status-badge ${node.status}">${this.formatStatus(node.status)}</span>
                    </div>
                </div>

                <div class="detail-group">
                    <div class="detail-label">Priority</div>
                    <div class="detail-value">${this.formatPriority(node.priority)}</div>
                </div>

                ${node.description ? `
                <div class="detail-group">
                    <div class="detail-label">Description</div>
                    <div class="detail-value">${this.escapeHtml(node.description)}</div>
                </div>
                ` : ''}

                ${node.tags && node.tags.length > 0 ? `
                <div class="detail-group">
                    <div class="detail-label">Tags</div>
                    <div class="tags">
                        ${node.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${node.notes ? `
                <div class="detail-group">
                    <div class="detail-label">Technical Notes</div>
                    <div class="detail-value" style="white-space: pre-wrap; font-family: monospace; font-size: 0.85rem; background: var(--bg-tertiary); padding: 1rem; border-radius: 4px;">${this.escapeHtml(node.notes)}</div>
                </div>
                ` : ''}

                <div class="detail-group">
                    <div class="detail-label">Created</div>
                    <div class="detail-value">${this.formatDate(node.createdAt)}</div>
                </div>

                <div class="detail-group">
                    <div class="detail-label">Last Updated</div>
                    <div class="detail-value">${this.formatDate(node.updatedAt)}</div>
                </div>
            </div>
        `;
    }

    closeSidebar() {
        document.getElementById('sidebar').classList.add('closed');
        document.getElementById('sidebarFooter').style.display = 'none';
        this.mindMap.selectedNode = null;
        this.mindMap.render();
        this.updateControlButtons();
    }

    saveNodeChanges() {
        if (!this.currentNode) return;
        this.editNode(this.currentNode);
    }

    deleteNode() {
        if (!this.currentNode) return;

        if (confirm(`Are you sure you want to delete "${this.currentNode.title}"?`)) {
            this.mindMap.deleteNode(this.currentNode.id);
            this.closeSidebar();
            this.saveData();
        }
    }

    updateControlButtons() {
        const hasSelection = this.mindMap.selectedNode !== null;
        document.getElementById('addChildNodeBtn').disabled = !hasSelection;
        document.getElementById('toggleCompleteBtn').disabled = !hasSelection;
    }

    updateStats() {
        const data = storage.loadData();
        const stats = storage.getStats(data);

        document.getElementById('totalNodes').textContent = stats.total;
        document.getElementById('completedNodes').textContent = stats.completed;
        document.getElementById('inProgressNodes').textContent = stats.inProgress;
        document.getElementById('progressPercent').textContent = `${stats.progress}%`;
    }

    exportData() {
        storage.exportData();
    }

    showImport() {
        document.getElementById('importFileInput').click();
    }

    async handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = await storage.importData(file);
            this.mindMap.loadData(data);
            document.getElementById('projectName').textContent = data.projectName || 'TreeShopDroid Development';
            this.updateStats();
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }

        // Reset file input
        e.target.value = '';
    }

    showSearch() {
        const query = prompt('Search nodes:');
        if (!query) return;

        const results = this.mindMap.nodes.filter(node =>
            node.title.toLowerCase().includes(query.toLowerCase()) ||
            (node.description && node.description.toLowerCase().includes(query.toLowerCase())) ||
            (node.tags && node.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
        );

        if (results.length === 0) {
            alert('No results found');
        } else {
            const titles = results.map((n, i) => `${i + 1}. ${n.title}`).join('\n');
            const index = prompt(`Found ${results.length} results:\n${titles}\n\nEnter number to view:`);
            if (index && !isNaN(index) && index > 0 && index <= results.length) {
                this.mindMap.selectNode(results[index - 1]);
            }
        }
    }

    showFilter() {
        const statuses = ['all', 'pending', 'in_progress', 'completed', 'blocked'];
        const status = prompt('Filter by status:\n' + statuses.join(', '));

        if (status && statuses.includes(status)) {
            // TODO: Implement filtering visualization
            alert('Filter feature coming soon!');
        }
    }

    showSettings() {
        alert('Settings:\n\nKeyboard Shortcuts:\n' +
            'Ctrl/Cmd + S: Save\n' +
            'Ctrl/Cmd + E: Export\n' +
            'Delete: Delete selected node\n' +
            'Escape: Deselect / Close\n' +
            'Enter: Edit selected node\n\n' +
            'Double-click node to edit\n' +
            'Drag nodes to reposition\n' +
            'Scroll to zoom\n' +
            'Drag canvas to pan');
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatStatus(status) {
        return status.replace(/_/g, ' ').toUpperCase();
    }

    formatPriority(priority) {
        const priorities = {
            low: '🟢 Low',
            medium: '🟡 Medium',
            high: '🟠 High',
            critical: '🔴 Critical'
        };
        return priorities[priority] || priority;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}
