/**
 * Utilitário para gerar UUIDs v4
 * Implementação simplificada de UUID geração
 */

export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// Exportar para uso global (sem ES6 modules)
if (typeof window !== 'undefined') {
    window.generateUUID = generateUUID;
}