/**
 * Arquivo Principal da Aplicação
 * Inicializa todos os módulos e listeners
 */

class App {
    constructor() {
        console.log('🚀 Iniciando Task Manager...');
    }

    /**
     * Inicializa a aplicação
     */
    init() {
        try {
            // 1. Inicializa o estado da aplicação
            window.appState.initialize();
            console.log('✅ Estado inicializado');

            // 2. Inicializa os controllers
            window.categoryController.init();
            window.taskController.init();
            console.log('✅ Controllers inicializados');

            // 3. Renderiza as views
            window.categoryView.render();
            window.taskView.render();
            console.log('✅ Views renderizadas');

            // 4. Habilita inputs se há categoria selecionada
            if (window.appState.selectedCategoryId) {
                const taskInput = document.getElementById('taskInput');
                const btnAddTask = document.getElementById('btnAddTask');
                taskInput.disabled = false;
                btnAddTask.disabled = false;
            }

            console.log('🎉 Task Manager pronto!');
        } catch (error) {
            console.error('❌ Erro ao inicializar a aplicação:', error);
        }
    }
}

// Espera o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});