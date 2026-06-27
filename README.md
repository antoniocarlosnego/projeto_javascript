# 📝 Task Manager - Gerenciador de Tarefas com Categorias

Uma aplicação web moderna de gerenciamento de tarefas, inspirada no visual limpo e funcional do **Google Tasks**, desenvolvida em **JavaScript Moderno (ES6+)**.

## ✨ Funcionalidades Principais

### 1. **Gestão de Categorias**
- Criar categorias personalizadas (ex: "Trabalho", "Estudos", "Pessoal")
- Atribuir cores únicas a cada categoria
- Cada categoria funciona como uma lista/aba independente
- Deletar categorias com confirmação de segurança

### 2. **Gestão de Tarefas por Categoria**
- Criar tarefas dentro de categorias específicas
- Ver todas as tarefas de uma categoria selecionada
- Contador de tarefas por categoria

### 3. **Controle de Status Dinâmico** ⭐
- **Pendente**: Tarefa aguardando execução
- **Em Andamento**: Tarefa em progresso
- **Finalizado**: Tarefa concluída

### 4. **Regra de Negócio Crucial** 🎯
> **Assim que uma tarefa é marcada como "Finalizado", ela é automaticamente removida da lista ativa**

- A tarefa desaparece do DOM com animação suave
- Dados persistem no localStorage
- Comportamento intuitivo e satisfatório para o usuário

### 5. **Persistência de Dados**
- Todos os dados são salvos automaticamente no `localStorage`
- Dados persistem após recarregar a página
- Possibilidade de limpar dados manualmente

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas
```
projeto_javascript/
├── index.html                 # HTML principal
├── styles.css                # Estilos CSS
├── app.js                    # Inicialização da aplicação
│
├── utils/
│   └── uuid.js              # Geração de UUIDs
│
├── services/
│   └── storageService.js    # Gerenciamento de localStorage
│
├── models/
│   └── appState.js          # Estado centralizado da aplicação
│
├── controllers/
│   ├── categoryController.js # Lógica de negócio de categorias
│   └── taskController.js    # Lógica de negócio de tarefas ⭐
│
└── views/
    ├── categoryView.js      # Renderização de categorias
    └── taskView.js          # Renderização de tarefas
```

### Padrão de Arquitetura

A aplicação segue o padrão **MVC (Model-View-Controller)** com separação clara de responsabilidades:

1. **Models** (`appState.js`): Gerencia o estado centralizado
2. **Controllers** (`categoryController.js`, `taskController.js`): Lógica de negócio
3. **Views** (`categoryView.js`, `taskView.js`): Renderização do DOM
4. **Services** (`storageService.js`): Serviços auxiliares (localStorage)

## 📊 Modelagem de Dados

### Estrutura de Categoria
```javascript
Category {
  id: string (UUID),              // Identificador único
  name: string,                   // Nome da categoria
  color: string,                  // Cor hexadecimal
  createdAt: string (ISO date),   // Data de criação
  tasks: Array<Task>              // Tarefas dentro da categoria
}
```

### Estrutura de Tarefa
```javascript
Task {
  id: string (UUID),                          // Identificador único
  title: string,                              // Título da tarefa
  description: string,                        // Descrição (opcional)
  status: 'pendente' | 'em_andamento' | 'finalizado',
  categoryId: string,                         // Referência à categoria
  createdAt: string (ISO date)                // Data de criação
}
```

## 🔑 Função Crítica: Mudança de Status com Remoção Automática

### Localização: `controllers/taskController.js`

```javascript
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
 */
_handleTaskCompletion(taskId, categoryId) {
    const category = window.appState.categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const task = category.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const taskTitle = task.title;

    // Remove a tarefa do estado
    const removed = window.appState.removeTaskWhenCompleted(taskId, categoryId);

    if (removed) {
        console.log(`✅ Tarefa concluída e removida: "${taskTitle}"`);

        // Cria animação visual
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.style.opacity = '0';
            taskElement.style.transform = 'translateX(100px)';
            taskElement.style.transition = 'all 0.3s ease-out';

            // Remove do DOM após a animação
            setTimeout(() => {
                window.taskView.render();
            }, 300);
        } else {
            window.taskView.render();
        }
    }
}
```

### Fluxo de Execução

```
Usuario altera status para "Finalizado"
          ↓
taskView.js dispara evento "change" no select
          ↓
taskController.handleTaskStatusChange() é chamado
          ↓
Verifica se newStatus === 'finalizado'
          ↓
SIM → _handleTaskCompletion()
          ├─ Busca a tarefa no estado
          ├─ Remove do array de tarefas
          ├─ Anima a saída do DOM (fade-out + slide-right)
          ├─ Re-renderiza a view
          └─ Mostra notificação de sucesso
          ↓
NÃO → updateTaskStatus() + render()
```

## 🎨 Design e UI

### Inspiração Google Tasks
- **Sidebar** com lista de categorias
- **Main content** com seletor de status por tarefa
- **Input minimalista** para adicionar tarefas
- **Cores suaves** e espaçamento generoso
- **Animações suaves** para transições

### Responsividade
- Design mobile-first
- Layout adaptativo para tablets e desktops
- Sidebar se transforma em horizontal em mobile

## 🚀 Como Usar

### 1. **Abrir a Aplicação**
Abra o arquivo `index.html` em um navegador moderno

### 2. **Criar uma Categoria**
- Clique no botão `+` na sidebar
- Digite um nome para a categoria
- Escolha uma cor (opcional)
- Clique em "Criar"

### 3. **Adicionar Tarefas**
- Selecione uma categoria
- Digite o título da tarefa no input
- Clique em "Adicionar" ou pressione Enter

### 4. **Alterar Status da Tarefa**
- Clique no dropdown de status da tarefa
- Selecione: "Pendente", "Em Andamento" ou "Finalizado"
- **Se selecionar "Finalizado", a tarefa será removida automaticamente**

### 5. **Deletar Tarefa**
- Passe o mouse sobre a tarefa
- Clique no ícone 🗑️
- Confirme a exclusão

## 💾 Persistência de Dados

- Todos os dados são salvos automaticamente no `localStorage`
- Dados persistem ao recarregar a página
- O aplicativo carrega com dados anteriores ao iniciar

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos, flexbox, grid, animações
- **JavaScript ES6+**: Classes, arrow functions, destructuring
- **localStorage**: Persistência de dados
- **UUID v4**: Geração de IDs únicos

## 📋 Requisitos Atendidos

✅ Gestão de Categorias com criação e exclusão  
✅ Gestão de Tarefas por Categoria  
✅ Controle de Status Dinâmico (Pendente, Em Andamento, Finalizado)  
✅ **Remoção automática quando status = "Finalizado"** ⭐  
✅ Arquitetura modular e bem estruturada  
✅ Separação clara entre lógica (estado) e apresentação (DOM)  
✅ Persistência com localStorage  
✅ Interface limpa estilo Google Tasks  
✅ Código legível e bem comentado  

## 📝 Notas de Desenvolvimento

### Adicionando Funcionalidades Futuras

1. **Edição de Tarefas**: Adicione um método `editTask()` em `AppState`
2. **Vencimento de Tarefas**: Adicione campo `dueDate` e ordenação
3. **Tags/Labels**: Estenda a estrutura de `Task` com array de tags
4. **Busca**: Implemente busca em `AppState`
5. **Modo Escuro**: Adicione theme toggler em CSS

### Debug e Logs

A aplicação usa `console.log()` extensivamente. Abra o DevTools (F12) para acompanhar:
- 🚀 Inicialização
- ✅ Sucessos
- ❌ Erros
- 📊 Mudanças de estado
- 📋 Operações com tarefas

## 📄 Licença

Projeto de demonstração educacional - Livre para uso e modificação

---

**Desenvolvido com ❤️ utilizando JavaScript Moderno**