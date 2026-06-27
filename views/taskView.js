/**
 * View de Tarefas
 * Responsável pela renderização das tarefas no DOM
 */

class TaskView {
    constructor() {
        this.tasksContainer = document.getElementById('tasksContainer');
    }

    /**
     * Renderiza todas as tarefas da categoria selecionada
     */
    render() {
        const tasks = window.appState.getSelectedCategoryTasks();

        // Limpa o container
        this.tasksContainer.innerHTML = '';

        // Mostra mensagem vazia se não houver tarefas
        if (tasks.length === 0) {
            this.tasksContainer.innerHTML = '<div class="empty-state"><p>📋 Nenhuma tarefa ainda</p></div>';
            return;
        }

        // Renderiza cada tarefa
        tasks.forEach((task) => {
            const element = this._createTaskElement(task);
            this.tasksContainer.appendChild(element);
        });
    }

    /**
     * Cria um elemento de tarefa
     */
    _createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.status === 'finalizado' ? 'completed' : ''}`;
        div.dataset.taskId = task.id;
        div.dataset.categoryId = task.categoryId;

        const isCompleted = task.status === 'finalizado';

        div.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${isCompleted ? 'checked' : ''}
                data-task-id="${task.id}"
            />
            <div class="task-content">
                <div class="task-title">${this._escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <select class="task-status-select" data-task-id="${task.id}" data-category-id="${task.categoryId}">
                        <option value="pendente" ${task.status === 'pendente' ? 'selected' : ''}>
                            Pendente
                        </option>
                        <option value="em_andamento" ${task.status === 'em_andamento' ? 'selected' : ''}>
                            Em Andamento
                        </option>
                        <option value="finalizado" ${task.status === 'finalizado' ? 'selected' : ''}>
                            Finalizado
                        </option>
                    </select>
                </div>
            </div>
            <div class="task-actions">
                <button
                    class="btn-delete-task"
                    data-task-id="${task.id}"
                    data-category-id="${task.categoryId}"
                    title="Deletar tarefa"
                    aria-label="Deletar tarefa"
                >
                    🗑️
                </button>
            </div>
        `;

        // Event listeners
        this._attachTaskEventListeners(div, task);

        return div;
    }

    /**
     * Anexa event listeners a um elemento de tarefa
     */
    _attachTaskEventListeners(element, task) {
        const checkbox = element.querySelector('.task-checkbox');
        const statusSelect = element.querySelector('.task-status-select');
        const deleteBtn = element.querySelector('.btn-delete-task');

        // Listener para checkbox
        checkbox.addEventListener('change', () => {
            const newStatus = checkbox.checked ? 'finalizado' : 'pendente';
            statusSelect.value = newStatus;
            window.taskController.handleTaskStatusChange(
                task.id,
                task.categoryId,
                newStatus
            );
        });

        // ⭐ Listener crítico para mudança de status
        statusSelect.addEventListener('change', (e) => {
            const newStatus = e.target.value;
            console.log(`📋 Mudança de status: ${task.id} → ${newStatus}`);

            window.taskController.handleTaskStatusChange(
                task.id,
                task.categoryId,
                newStatus
            );
        });

        // Listener para botão delete
        deleteBtn.addEventListener('click', () => {
            window.taskController.handleDeleteTask(task.id, task.categoryId);
        });
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
window.taskView = new TaskView();