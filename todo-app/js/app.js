/**
 * Application Entry Point
 * Initializes and bootstraps the entire application
 */

class TodoApp {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('🚀 Initializing Todo App...');

        try {
            // 1. Check browser support
            this._checkBrowserSupport();

            // 2. Initialize storage
            this._initializeStorage();

            // 3. Initialize state
            appState.initialize();

            // 4. Render initial UI
            this._renderUI();

            // 5. Setup event listeners
            // (Already done in events.js via DOMContentLoaded)

            // 6. Setup periodic save
            this._setupAutoSave();

            this.initialized = true;
            console.log('✅ Todo App initialized successfully');
            this._logAppInfo();
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            uiManager.showNotification('Error initializing app', 'error');
        }
    }

    /**
     * Check browser support
     */
    _checkBrowserSupport() {
        const requiredAPIs = ['localStorage', 'Promise', 'Array.prototype.find'];
        const unsupported = requiredAPIs.filter(api => {
            try {
                eval(`typeof ${api}`);
                return false;
            } catch {
                return true;
            }
        });

        if (unsupported.length > 0) {
            console.warn('⚠️ Unsupported features:', unsupported);
        } else {
            console.log('✅ All required APIs supported');
        }
    }

    /**
     * Initialize storage
     */
    _initializeStorage() {
        const hasData = storageManager.exists();
        if (hasData) {
            console.log('💾 Existing data found');
            const size = storageManager.getSize();
            const lastSaved = storageManager.getLastSaved();
            console.log(`   Size: ${size}, Last saved: ${lastSaved}`);
        } else {
            console.log('📭 No existing data, will create new');
        }
    }

    /**
     * Render initial UI
     */
    _renderUI() {
        uiManager.renderTodos();
        uiManager.updateStats();
        uiManager.updateFilterButtons('all');
        console.log('🎨 UI rendered');
    }

    /**
     * Setup auto-save
     */
    _setupAutoSave() {
        // Auto-save every 30 seconds if data has changed
        setInterval(() => {
            appState.persist();
        }, 30000);

        // Save before leaving page
        window.addEventListener('beforeunload', () => {
            appState.persist();
        });

        console.log('💾 Auto-save configured');
    }

    /**
     * Log app info
     */
    _logAppInfo() {
        const stats = appState.getStats();
        const metadata = storageManager.loadMetadata();

        console.group('📊 App Status');
        console.log(`Total Todos: ${stats.total}`);
        console.log(`Completed: ${stats.completed}`);
        console.log(`Progress: ${stats.progress}%`);
        if (metadata) {
            console.log(`Total Sessions: ${metadata.totalSessions}`);
            console.log(`Storage Size: ${storageManager.getSize()}`);
        }
        console.groupEnd();
    }

    /**
     * Reset application
     */
    reset() {
        console.warn('🔄 Resetting app...');
        storageManager.clear();
        appState.todos = [];
        uiManager.renderTodos();
        uiManager.updateStats();
        console.log('✅ App reset complete');
    }

    /**
     * Get app state
     */
    getState() {
        return appState.getSnapshot();
    }

    /**
     * Export data
     */
    export() {
        return appState.export();
    }

    /**
     * Get storage info
     */
    getStorageInfo() {
        const metadata = storageManager.loadMetadata();
        return {
            size: storageManager.getSize(),
            exists: storageManager.exists(),
            lastSaved: storageManager.getLastSaved(),
            backups: storageManager.getBackups().length,
            ...(metadata && { totalSessions: metadata.totalSessions })
        };
    }

    /**
     * Create backup
     */
    backup() {
        const success = storageManager.backup();
        if (success) {
            uiManager.showNotification('Backup created successfully');
        } else {
            uiManager.showNotification('Failed to create backup', 'error');
        }
        return success;
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            todos: appState.todos.length,
            storageSize: storageManager.getSize(),
            state: appState.getSnapshot(),
            userAgent: navigator.userAgent.slice(0, 100),
            timestamp: new Date().toISOString()
        };
    }
}

// Create and initialize app when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
    app.init();

    // Make app globally available for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.__todoApp = app;
        console.log('🔍 App exposed to window.__todoApp for debugging');
    }
});