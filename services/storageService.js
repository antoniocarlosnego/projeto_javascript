/**
 * Serviço de Persistência com localStorage
 * Gerencia o salvamento e recuperação de dados
 */

class StorageService {
    constructor() {
        this.STORAGE_KEY = 'task_manager_data';
    }

    /**
     * Salva os dados completos no localStorage
     * @param {Object} appData - Objeto contendo categories e tasks
     */
    save(appData) {
        try {
            const serialized = JSON.stringify(appData);
            localStorage.setItem(this.STORAGE_KEY, serialized);
            console.log('✅ Dados salvos com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
            return false;
        }
    }

    /**
     * Recupera os dados do localStorage
     * @returns {Object|null} - Dados salvos ou null se não existirem
     */
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return null;

            const parsed = JSON.parse(data);
            console.log('✅ Dados carregados com sucesso');
            return parsed;
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            return null;
        }
    }

    /**
     * Limpa todos os dados do localStorage
     */
    clear() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('✅ Dados limpos com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar dados:', error);
            return false;
        }
    }

    /**
     * Verifica se há dados salvos
     * @returns {Boolean}
     */
    hasData() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }
}

// Instância global
window.storageService = new StorageService();