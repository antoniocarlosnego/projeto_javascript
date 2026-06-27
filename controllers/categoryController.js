/**
 * Controller de Categorias
 * Gerencia a lógica de negócio para categorias
 */

class CategoryController {
    constructor() {
        this.modal = document.getElementById('categoryModal');
        this.form = document.getElementById('categoryForm');
        this.btnNewCategory = document.getElementById('btnNewCategory');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelCategory = document.getElementById('btnCancelCategory');
        this.categoryNameInput = document.getElementById('categoryName');
        this.categoryColorInput = document.getElementById('categoryColor');
        this.colorPreview = document.getElementById('colorPreview');
    }

    /**
     * Inicializa os listeners de categoria
     */
    init() {
        this.attachEventListeners();
    }

    /**
     * Anexa os listeners de eventos
     */
    attachEventListeners() {
        this.btnNewCategory.addEventListener('click', () => this.openModal());
        this.btnCloseModal.addEventListener('click', () => this.closeModal());
        this.btnCancelCategory.addEventListener('click', () => this.closeModal());
        this.form.addEventListener('submit', (e) => this.handleCreateCategory(e));
        this.categoryColorInput.addEventListener('change', (e) => this.updateColorPreview(e));
    }

    /**
     * Abre o modal de criar categoria
     */
    openModal() {
        this.modal.classList.remove('hidden');
        this.categoryNameInput.focus();
    }

    /**
     * Fecha o modal
     */
    closeModal() {
        this.modal.classList.add('hidden');
        this.form.reset();
        this.updateColorPreview();
    }

    /**
     * Atualiza a preview da cor
     */
    updateColorPreview() {
        const color = this.categoryColorInput.value;
        this.colorPreview.style.backgroundColor = color;
    }

    /**
     * Manipula a criação de uma nova categoria
     */
    handleCreateCategory(e) {
        e.preventDefault();

        const name = this.categoryNameInput.value.trim();
        const color = this.categoryColorInput.value;

        if (!name) {
            alert('Por favor, insira um nome para a categoria');
            return;
        }

        // Verifica se a categoria já existe
        if (this._categoryNameExists(name)) {
            alert('Uma categoria com este nome já existe');
            return;
        }

        // Cria a categoria no estado
        const category = window.appState.addCategory(name, color);
        console.log(`✨ Categoria "${name}" criada com sucesso`);

        // Atualiza a view
        window.categoryView.render();
        window.taskView.render();

        // Fecha o modal
        this.closeModal();
    }

    /**
     * Verifica se o nome da categoria já existe
     */
    _categoryNameExists(name) {
        return window.appState.categories.some(
            (cat) => cat.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Manipula a exclusão de uma categoria
     */
    handleDeleteCategory(categoryId) {
        const category = window.appState.categories.find((cat) => cat.id === categoryId);
        if (!category) return;

        const taskCount = category.tasks.length;
        const message =
            taskCount > 0
                ? `Tem certeza? Esta categoria possui ${taskCount} tarefa(s) que também serão deletadas.`
                : 'Tem certeza que deseja deletar esta categoria?';

        if (confirm(message)) {
            window.appState.removeCategory(categoryId);
            console.log(`🗑️ Categoria "${category.name}" removida`);

            // Atualiza as views
            window.categoryView.render();
            window.taskView.render();
        }
    }

    /**
     * Manipula a seleção de uma categoria
     */
    handleSelectCategory(categoryId) {
        window.appState.selectCategory(categoryId);
        console.log(`👁️ Categoria selecionada: ${categoryId}`);

        // Atualiza as views
        window.categoryView.render();
        window.taskView.render();

        // Habilita o input e botão de tarefa
        this.enableTaskInput();
    }

    /**
     * Habilita os inputs de tarefa
     */
    enableTaskInput() {
        const taskInput = document.getElementById('taskInput');
        const btnAddTask = document.getElementById('btnAddTask');
        taskInput.disabled = false;
        btnAddTask.disabled = false;
        taskInput.focus();
    }
}

// Instância global
window.categoryController = new CategoryController();