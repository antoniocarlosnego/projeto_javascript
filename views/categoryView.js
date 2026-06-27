/**
 * View de Categorias
 * Responsável pela renderização das categorias no DOM
 */

class CategoryView {
    constructor() {
        this.categoriesList = document.getElementById('categoriesList');
        this.categoryTitle = document.getElementById('categoryTitle');
        this.categoryInfo = document.getElementById('categoryInfo');
    }

    /**
     * Renderiza todas as categorias na sidebar
     */
    render() {
        const categories = window.appState.categories;
        const selectedId = window.appState.selectedCategoryId;

        // Limpa a lista
        this.categoriesList.innerHTML = '';

        // Renderiza cada categoria
        categories.forEach((category) => {
            const isSelected = category.id === selectedId;
            const element = this._createCategoryElement(category, isSelected);
            this.categoriesList.appendChild(element);
        });

        // Atualiza o header
        this._updateCategoryHeader();
    }

    /**
     * Cria um elemento de categoria
     */
    _createCategoryElement(category, isSelected) {
        const li = document.createElement('li');
        li.className = `category-item ${isSelected ? 'active' : ''}`;
        li.dataset.categoryId = category.id;

        const taskCount = category.tasks.length;

        li.innerHTML = `
            <div class="category-item-content">
                <div class="category-color" style="background-color: ${category.color}"></div>
                <span class="category-name">${this._escapeHtml(category.name)}</span>
                <span class="category-count">${taskCount}</span>
            </div>
            <button
                class="btn-delete-category"
                data-category-id="${category.id}"
                title="Deletar categoria"
            >
                🗑️
            </button>
        `;

        // Event listeners
        li.addEventListener('click', (e) => {
            // Evita selecionar a categoria se clicar no botão delete
            if (e.target.classList.contains('btn-delete-category')) {
                e.stopPropagation();
                window.categoryController.handleDeleteCategory(category.id);
                return;
            }

            window.categoryController.handleSelectCategory(category.id);
        });

        return li;
    }

    /**
     * Atualiza o header com informações da categoria selecionada
     */
    _updateCategoryHeader() {
        const category = window.appState.getSelectedCategory();

        if (!category) {
            this.categoryTitle.textContent = 'Nenhuma categoria selecionada';
            this.categoryInfo.textContent = '';
            return;
        }

        this.categoryTitle.textContent = category.name;
        const taskCount = category.tasks.length;

        let info = '';
        if (taskCount === 0) {
            info = 'Nenhuma tarefa';
        } else if (taskCount === 1) {
            info = '1 tarefa';
        } else {
            info = `${taskCount} tarefas`;
        }

        this.categoryInfo.textContent = info;
    }

    /**
     * Escapa caracteres HTML para evitar XSS
     */
    _escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}

// Instância global
window.categoryView = new CategoryView();