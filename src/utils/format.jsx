    // Função para formatar datas do padrão yyyy-mm-dd para dd/mm/yyyy
    export function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
    }

    // Função para formatar valores numéricos para moeda brasileira
    export function formatCurrency(value) {
    if (value == null || isNaN(value)) return "";
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    }
