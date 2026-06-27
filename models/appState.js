/**
 * Estado Global da Aplicação
 * Gerencia o estado centralizado: categorias, tarefas e estado selecionado
 */

class AppState {
    constructor() {
        this.categories = [];
        this.selectedCategoryId = null;
        this.deleteQueue = { type: null, id: null }; // Para confirmação de exclusão
    }

    /**
     * Inicializa o estado com dados do localStorage ou padrão
     */
    initialize() {
        const savedData = window.storageService.load();

        if (savedData) {
            this.categories = savedData.categories || [];
            console.log(`🔄 Carregadas ${this.categories.length} categorias`);
        } else {
            this._createDefaultCategories();
        }

        // Seleciona a primeira categoria se existir
        if (this.categories.length > 0) {
            this.selectedCategoryId = this.categories[0].id;
        }
    }

    /**
     * Cria categorias padrão para demonstração
     */
    _createDefaultCategories() {
        const defaultCategories = [
            {
                id: window.generateUUID(),
                name: 'Trabalho',
                color: '#4285F4',
                createdAt: new Date().toISOString(),
                tasks: [
                    {
                        id: window.generateUUID(),
                        title: 'Responder e-mails importantes',
                        description: 'Revisar e responder e-mails da caixa de entrada',
                        status: 'pendente',
                        categoryId: null, // Será preenchido abaixo
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: window.generateUUID(),
                        title: 'Reunião com o time às 14h',
                        description: 'Alinhamento semanal',
                        status: 'pendente',
                        categoryId: null,
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
            {
                id: window.generateUUID(),
                name: 'Estudos',
                color: '#34A853',
                createdAt: new Date().toISOString(),
                tasks: [
                    {
                        id: window.generateUUID(),
                        title: 'Estudar JavaScript - Arrow Functions',
                        description: 'Capítulo 5 do livro',
                        status: 'pendente',
                        categoryId: null,
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
            {
                id: window.generateUUID(),
                name: 'Pessoal',
                color: '#EA4335',
                createdAt: new Date().toISOString(),
                tasks: [],
            },
        ];

        // Atualiza categoryId nas tarefas
        defaultCategories.forEach((category) => {
            category.tasks.forEach((task) => {
                task.categoryId = category.id;
            });
        });

        this.categories = defaultCategories;
        this._persist();
    }

    /**
     * Retorna a categoria selecionada
     */
    getSelectedCategory() {
        return this.categories.find((cat) => cat.id === this.selectedCategoryId);
    }

    /**
     * Retorna todas as tarefas da categoria selecionada
     */
    getSelectedCategoryTasks() {
        const category = this.getSelectedCategory();
        return category ? category.tasks : [];
    }

    /**
     * Adiciona uma nova categoria
     */
    addCategory(name, color = '#4285F4') {
        const newCategory = {
            id: window.generateUUID(),
            name,
            color,
            createdAt: new Date().toISOString(),
            tasks: [],
        };

        this.categories.push(newCategory);
        this.selectedCategoryId = newCategory.id;
        this._persist();
        return newCategory;
    }

    /**
     * Remove uma categoria e todas suas tarefas
     */
    removeCategory(categoryId) {
        this.categories = this.categories.filter((cat) => cat.id !== categoryId);

        // Se a categoria removida era a selecionada, seleciona outra
        if (this.selectedCategoryId === categoryId) {
            this.selectedCategoryId = this.categories.length > 0 ? this.categories[0].id : null;
        }

        this._persist();
    }

    /**
     * Seleciona uma categoria
     */
    selectCategory(categoryId) {
        this.selectedCategoryId = categoryId;
    }

    /**
     * Adiciona uma tarefa à categoria selecionada
     */
    addTask(title, description = '') {
        const category = this.getSelectedCategory();
        if (!category) return null;

        const newTask = {
            id: window.generateUUID(),
            title,
            description,
            status: 'pendente',
            categoryId: category.id,
            createdAt: new Date().toISOString(),
        };

        category.tasks.push(newTask);
        this._persist();
        return newTask;
    }

    /**
     * ⭐ FUNÇÃO CRÍTICA: Remove uma tarefa quando seu status muda para "Finalizado"
     * Esta é a principal função que implementa a regra de negócio crucial
     * @param {string} taskId - ID da tarefa a ser removida
     * @param {string} categoryId - ID da categoria que contém a tarefa
     */
    removeTaskWhenCompleted(taskId, categoryId) {
        const category = this.categories.find((cat) => cat.id === categoryId);
        if (!category) return false;

        // Remove a tarefa do array
        const initialLength = category.tasks.length;
        category.tasks = category.tasks.filter((task) => task.id !== taskId);

        // Verifica se a tarefa foi realmente removida
        const wasRemoved = category.tasks.length < initialLength;

        if (wasRemoved) {
            console.log(`🗑️ Tarefa "${taskId}" removida com sucesso`);
            this._persist();
        }

        return wasRemoved;
    }

    /**
     * Atualiza o status de uma tarefa
     * Nota: A remoção quando status = "finalizado" é feita pelo controller
     */
    updateTaskStatus(taskId, categoryId, newStatus) {
        const category = this.categories.find((cat) => cat.id === categoryId);
        if (!category) return false;

        const task = category.tasks.find((t) => t.id === taskId);
        if (!task) return false;

        task.status = newStatus;
        this._persist();
        return true;
    }

    /**
     * Remove uma tarefa manualmente (via botão delete)
     */
    removeTask(taskId, categoryId) {
        const category = this.categories.find((cat) => cat.id === categoryId);
        if (!category) return false;

        const initialLength = category.tasks.length;
        category.tasks = category.tasks.filter((task) => task.id !== taskId);

        const wasRemoved = category.tasks.length < initialLength;
        if (wasRemoved) {
            this._persist();
        }

        return wasRemoved;
    }

    /**
     * Persiste o estado no localStorage
     */
    _persist() {
        window.storageService.save({
            categories: this.categories,
        });
    }
}

// Instância global
window.appState = new AppState();