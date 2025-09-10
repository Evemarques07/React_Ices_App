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

// Função de máscara para campos de valor monetário
export function maskCurrency(value) {
  if (value == null) return "";
  // Remove caracteres não numéricos
  const cleaned = value.toString().replace(/\D/g, "");
  // Formata como moeda
  return formatCurrency(parseFloat(cleaned) / 100);
}

// Função para máscara de CPF no formato 000.000.000-00
export function maskCPF(value) {
  if (value == null) return "";
  const cleaned = value.toString().replace(/\D/g, "");
  let result = "";
  if (cleaned.length > 0) result += cleaned.slice(0, 3);
  if (cleaned.length > 3) result += "." + cleaned.slice(3, 6);
  if (cleaned.length > 6) result += "." + cleaned.slice(6, 9);
  if (cleaned.length > 9) result += "-" + cleaned.slice(9, 11);
  return result;
}

// Função para máscara de telefone no formato (00) 00000-0000
export function maskPhone(value) {
  if (value == null) return "";
  const cleaned = value.toString().replace(/\D/g, "");
  if (cleaned.length === 0) return "";
  if (cleaned.length < 3) return `(${cleaned}`;
  if (cleaned.length < 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length < 8)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}${cleaned.slice(7)}`;
  if (cleaned.length < 11)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
    7,
    11
  )}`;
}
