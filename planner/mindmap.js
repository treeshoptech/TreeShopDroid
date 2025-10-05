// TreeShop Mind Map - Visualization Engine
// Handles canvas rendering, node interactions, and visual layout

class MindMap {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.hoveredNode = null;
        this.isDragging = false;
        this.dragNode = null;
        this.isPanning = false;
        this.panStart = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.zoom = 1.0;
        this.minZoom = 0.3;
        this.maxZoom = 2.0;

        // Node styling
        this.nodeRadius = 80;
        this.nodeColors = {
            pending: '#FFB74D',
            in_progress: '#42A5F5',
            completed: '#66BB6A',
            blocked: '#EF5350'
        };

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupEventListeners();
        this.render();
    }

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.render();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
        this.canvas.addEventListener('dblclick', (e) => this.onDoubleClick(e));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - this.offset.x) / this.zoom,
            y: (e.clientY - rect.top - this.offset.y) / this.zoom
        };
    }

    getTouchPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        return {
            x: (touch.clientX - rect.left - this.offset.x) / this.zoom,
            y: (touch.clientY - rect.top - this.offset.y) / this.zoom
        };
    }

    findNodeAtPosition(x, y) {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const node = this.nodes[i];
            const dx = x - node.x;
            const dy = y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.nodeRadius) {
                return node;
            }
        }
        return null;
    }

    onMouseDown(e) {
        const pos = this.getMousePos(e);
        const node = this.findNodeAtPosition(pos.x, pos.y);

        if (node) {
            this.isDragging = true;
            this.dragNode = node;
            this.dragOffset = {
                x: pos.x - node.x,
                y: pos.y - node.y
            };
        } else {
            this.isPanning = true;
            this.panStart = { x: e.clientX - this.offset.x, y: e.clientY - this.offset.y };
        }
    }

    onMouseMove(e) {
        const pos = this.getMousePos(e);

        if (this.isDragging && this.dragNode) {
            this.dragNode.x = pos.x - this.dragOffset.x;
            this.dragNode.y = pos.y - this.dragOffset.y;
            this.render();
        } else if (this.isPanning) {
            this.offset.x = e.clientX - this.panStart.x;
            this.offset.y = e.clientY - this.panStart.y;
            this.render();
        } else {
            const node = this.findNodeAtPosition(pos.x, pos.y);
            if (node !== this.hoveredNode) {
                this.hoveredNode = node;
                this.render();
            }
        }
    }

    onMouseUp(e) {
        if (this.isDragging && this.dragNode) {
            // Check if this was a click (minimal movement)
            const pos = this.getMousePos(e);
            const dx = pos.x - this.dragNode.x;
            const dy = pos.y - this.dragNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 5) {
                this.selectNode(this.dragNode);
            }
        }

        this.isDragging = false;
        this.dragNode = null;
        this.isPanning = false;
    }

    onDoubleClick(e) {
        const pos = this.getMousePos(e);
        const node = this.findNodeAtPosition(pos.x, pos.y);

        if (node) {
            // Open edit modal
            if (window.app) {
                window.app.editNode(node);
            }
        }
    }

    onWheel(e) {
        e.preventDefault();
        const delta = -e.deltaY / 1000;
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom + delta));

        // Zoom towards mouse position
        const pos = this.getMousePos(e);
        this.zoom = newZoom;
        this.render();
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            const pos = this.getTouchPos(e);
            const node = this.findNodeAtPosition(pos.x, pos.y);

            if (node) {
                this.isDragging = true;
                this.dragNode = node;
                this.dragOffset = {
                    x: pos.x - node.x,
                    y: pos.y - node.y
                };
            }
        }
    }

    onTouchMove(e) {
        e.preventDefault();
        if (this.isDragging && this.dragNode && e.touches.length === 1) {
            const pos = this.getTouchPos(e);
            this.dragNode.x = pos.x - this.dragOffset.x;
            this.dragNode.y = pos.y - this.dragOffset.y;
            this.render();
        }
    }

    onTouchEnd(e) {
        this.isDragging = false;
        this.dragNode = null;
    }

    selectNode(node) {
        this.selectedNode = node;
        this.render();

        // Notify app
        if (window.app) {
            window.app.onNodeSelected(node);
        }
    }

    addNode(nodeData) {
        const node = {
            id: Date.now() + Math.random(),
            x: nodeData.x || this.canvas.width / 2 / this.zoom - this.offset.x / this.zoom,
            y: nodeData.y || this.canvas.height / 2 / this.zoom - this.offset.y / this.zoom,
            title: nodeData.title || 'New Node',
            description: nodeData.description || '',
            status: nodeData.status || 'pending',
            priority: nodeData.priority || 'medium',
            tags: nodeData.tags || [],
            notes: nodeData.notes || '',
            parentId: nodeData.parentId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.nodes.push(node);

        // Create connection if parent exists
        if (node.parentId) {
            this.connections.push({
                from: node.parentId,
                to: node.id
            });
        }

        this.render();
        return node;
    }

    updateNode(id, updates) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            Object.assign(node, updates);
            node.updatedAt = new Date().toISOString();
            this.render();
        }
    }

    deleteNode(id) {
        // Remove connections
        this.connections = this.connections.filter(c => c.from !== id && c.to !== id);

        // Remove children connections
        const childNodes = this.nodes.filter(n => n.parentId === id);
        childNodes.forEach(child => {
            child.parentId = null;
        });

        // Remove node
        this.nodes = this.nodes.filter(n => n.id !== id);

        if (this.selectedNode && this.selectedNode.id === id) {
            this.selectedNode = null;
        }

        this.render();
    }

    loadData(data) {
        this.nodes = data.nodes || [];
        this.connections = data.connections || [];
        this.selectedNode = null;
        this.render();
    }

    getData() {
        return {
            nodes: this.nodes,
            connections: this.connections
        };
    }

    resetView() {
        this.offset = { x: 0, y: 0 };
        this.zoom = 1.0;
        this.render();
    }

    zoomIn() {
        this.zoom = Math.min(this.maxZoom, this.zoom + 0.1);
        this.render();
    }

    zoomOut() {
        this.zoom = Math.max(this.minZoom, this.zoom - 0.1);
        this.render();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(this.offset.x, this.offset.y);
        ctx.scale(this.zoom, this.zoom);

        // Draw connections
        this.drawConnections();

        // Draw nodes
        this.nodes.forEach(node => {
            this.drawNode(node);
        });

        ctx.restore();
    }

    drawConnections() {
        const ctx = this.ctx;

        this.connections.forEach(conn => {
            const fromNode = this.nodes.find(n => n.id === conn.from);
            const toNode = this.nodes.find(n => n.id === conn.to);

            if (fromNode && toNode) {
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);

                // Bezier curve for smooth connections
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                ctx.quadraticCurveTo(midX, fromNode.y, midX, midY);
                ctx.quadraticCurveTo(midX, toNode.y, toNode.x, toNode.y);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }

    drawNode(node) {
        const ctx = this.ctx;
        const isSelected = this.selectedNode && this.selectedNode.id === node.id;
        const isHovered = this.hoveredNode && this.hoveredNode.id === node.id;

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);

        // Fill
        const color = this.nodeColors[node.status] || this.nodeColors.pending;
        ctx.fillStyle = color;
        ctx.fill();

        // Border
        if (isSelected) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.stroke();
        } else if (isHovered) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Checkmark if completed
        if (node.status === 'completed') {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(node.x - 20, node.y);
            ctx.lineTo(node.x - 5, node.y + 15);
            ctx.lineTo(node.x + 20, node.y - 15);
            ctx.stroke();
        }

        // Title
        ctx.fillStyle = node.status === 'pending' ? '#000' : '#fff';
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxWidth = this.nodeRadius * 1.6;
        const words = node.title.split(' ');
        let line = '';
        let lines = [];

        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });
        lines.push(line);

        const lineHeight = 16;
        const startY = node.y - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, i) => {
            ctx.fillText(line.trim(), node.x, startY + i * lineHeight);
        });

        // Priority indicator
        if (node.priority === 'high' || node.priority === 'critical') {
            ctx.beginPath();
            ctx.arc(node.x + this.nodeRadius - 15, node.y - this.nodeRadius + 15, 8, 0, Math.PI * 2);
            ctx.fillStyle = node.priority === 'critical' ? '#F44336' : '#FF9800';
            ctx.fill();
        }
    }
}
