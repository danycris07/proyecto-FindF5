export function normalizeArgentinaWhatsAppPhone(phone) {
  if (typeof phone !== "string") return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);

  if (digits.startsWith("549") && digits.length === 13) return digits;
  if (digits.startsWith("54")) digits = digits.slice(2);
  if (digits.startsWith("9") && digits.length === 11) digits = digits.slice(1);
  if (digits.startsWith("0")) digits = digits.slice(1);

  // Domestic Argentine mobile format may include the trunk prefix and 15.
  if (digits.length === 12 && digits.startsWith("15")) digits = digits.slice(2);
  if (digits.length !== 10) return null;
  return `549${digits}`;
}

export function createMatchWhatsAppUrl(phone, matchName) {
  const normalizedPhone = normalizeArgentinaWhatsAppPhone(phone);
  if (!normalizedPhone || typeof matchName !== "string" || !matchName.trim()) {
    return null;
  }
  const message = `Hola, te contacto por el partido ${matchName.trim()}.`;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
