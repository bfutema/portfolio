/**
 * Converte YYYY-MM-DD (ISO) para DD/MM/YYYY (exibição)
 */
export function toDisplayFormat(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return '';
  const [y, m, d] = isoDate.slice(0, 10).split('-');
  return `${d ?? ''}/${m ?? ''}/${y ?? ''}`;
}

/**
 * Converte DD/MM/YYYY para YYYY-MM-DD (ISO)
 * Retorna string vazia se inválido
 */
export function toIsoFormat(displayDate: string): string {
  const cleaned = displayDate.replace(/\D/g, '');
  if (cleaned.length === 8) {
    const d = cleaned.slice(0, 2);
    const m = cleaned.slice(2, 4);
    const y = cleaned.slice(4, 8);
    const day = parseInt(d, 10);
    const month = parseInt(m, 10);
    const year = parseInt(y, 10);
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
      return `${y}-${m}-${d}`;
    }
  }
  return '';
}

/**
 * Formata input parcial para DD/MM/YYYY enquanto o usuário digita
 */
export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
