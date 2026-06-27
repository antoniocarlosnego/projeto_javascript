/**
 * Controller de Tarefas
 * Gerencia a lógica de negócio para tarefas
 * ⭐ Contém a função crítica de mudança de status com remoção automática
 */

class TaskController {
    constructor() {
        this.taskInput = document.getElementById('taskInput');
        this.btnAddTask = document.getElementById('btnAddTask');
        this.deleteModal = document.getElementById('deleteModal');
        this.deleteMessage = document.getElementById('deleteMessage');
        this.btnConfirmDelete = document.getElementById('btnConfirmDelete');
        this.btnCancelDelete = document.getElementById('btnCancelDelete');
        this.pendingDeleteTask = null; // Armazena a tarefa pendente de exclusão
    }

    /**
     * Inicializa os listeners de tarefa
     */
    init() {
        this.attachEventListeners();
    }

    /**
     * Anexa os listeners de eventos
     */
    attachEventListeners() {
        this.btnAddTask.addEventListener('click', () => this.handleAddTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddTask();
            }
        });

        // Modal de confirmação de exclusão
        this.btnCancelDelete.addEventListener('click', () => this.closeDeleteModal());
        this.btnConfirmDelete.addEventListener('click', () => this.confirmDeleteTask());

        // Fechar modal ao clicar fora
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) {
                this.closeDeleteModal();
            }
        });
    }

    /**
     * Manipula a adição de uma nova tarefa
     */
    handleAddTask() {
        const title = this.taskInput.value.trim();

        if (!title) {
            alert('Por favor, insira um título para a tarefa');
            return;
        }

        // Cria a tarefa no estado
        const task = window.appState.addTask(title, '');
        if (!task) {
            alert('Erro ao criar tarefa. Selecione uma categoria primeiro.');
            return;
        }

        console.log(`📝 Tarefa "${title}" criada com sucesso`);

        // Limpa o input
        this.taskInput.value = '';
        this.taskInput.focus();

        // Atualiza a view de tarefas
        window.taskView.render();
    }

    /**
     * ⭐ FUNÇÃO CRÍTICA: Manipula a mudança de status de uma tarefa
     * REGRA DE NEGÓCIO: Quando o status muda para "Finalizado", a tarefa é removida
     *
     * @param {string} taskId - ID da tarefa
     * @param {string} categoryId - ID da categoria
     * @param {string} newStatus - Novo status ('pendente', 'em_andamento', 'finalizado')
     */
    handleTaskStatusChange(taskId, categoryId, newStatus) {
        console.log(
            `📊 Status da tarefa ${taskId} alterado para: ${newStatus}`
        );

        // ⭐ LÓGICA CRÍTICA: Se o novo status é "finalizado", remove a tarefa
        if (newStatus === 'finalizado') {
            this._handleTaskCompletion(taskId, categoryId);
        } else {
            // Caso contrário, apenas atualiza o status
            window.appState.updateTaskStatus(taskId, categoryId, newStatus);
            window.taskView.render();
        }
    }

    /**
     * ⭐ LÓGICA DE CONCLUSÃO: Remove a tarefa quando marcada como finalizada
     * Esta função implementa a regra de negócio crucial
     *
     * @param {string} taskId - ID da tarefa
     * @param {string} categoryId - ID da categoria
     */
    _handleTaskCompletion(taskId, categoryId) {
        // Encontra a tarefa para obter o título
        const category = window.appState.categories.find((cat) => cat.id === categoryId);
        if (!category) return;

        const task = category.tasks.find((t) => t.id === taskId);
        if (!task) return;

        const taskTitle = task.title;

        // Remove a tarefa do estado (implementação da regra de negócio)
        const removed = window.appState.removeTaskWhenCompleted(taskId, categoryId);

        if (removed) {
            console.log(`✅ Tarefa concluída e removida: "${taskTitle}"`);

            // Cria uma animação visual antes de remover do DOM
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) {
                // Adiciona classe de animação
                taskElement.style.opacity = '0';
                taskElement.style.transform = 'translateX(100px)';
                taskElement.style.transition = 'all 0.3s ease-out';

                // Remove do DOM após a animação
                setTimeout(() => {
                    window.taskView.render();
                }, 300);
            } else {
                // Se não encontrar o elemento, renderiza direto
                window.taskView.render();
            }

            // Mostra uma notificação de sucesso (opcional)
            this._showCompletionNotification(taskTitle);
        }
    }

    /**
     * Mostra uma notificação de tarefa concluída
     */
    _showCompletionNotification(taskTitle) {
        // Você pode implementar um toast/notificação aqui
        console.log(`🎉 Parabéns! Tarefa concluída: "${taskTitle}"`);
    }

    /**
     * Manipula a exclusão manual de uma tarefa (via botão delete)
     */
    handleDeleteTask(taskId, categoryId) {
        const category = window.appState.categories.find((cat) => cat.id === categoryId);
        if (!category) return;

        const task = category.tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Armazena para confirmação
        this.pendingDeleteTask = { taskId, categoryId, taskTitle: task.title };

        // Mostra o modal de confirmação
        this.deleteMessage.textContent = `Tem certeza que deseja deletar a tarefa "${task.title}"?`;
        this.deleteModal.classList.remove('hidden');
    }

    /**
     * Confirma a exclusão de uma tarefa
     */
    confirmDeleteTask() {
        if (!this.pendingDeleteTask) return;

        const { taskId, categoryId, taskTitle } = this.pendingDeleteTask;

        // Remove a tarefa do estado
        window.appState.removeTask(taskId, categoryId);
        console.log(`🗑️ Tarefa "${taskTitle}" deletada manualmente`);

        // Fecha o modal
        this.closeDeleteModal();

        // Atualiza a view
        window.taskView.render();
    }

    /**
     * Fecha o modal de confirmação de exclusão
     */
    closeDeleteModal() {
        this.deleteModal.classList.add('hidden');
        this.pendingDeleteTask = null;
    }
}

// Instância global
window.taskController = new TaskController();