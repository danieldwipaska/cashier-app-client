export default function formatNumber(number: string): string {
  if (!number) return '';
  const cleanedNumber = number.replace(/[^\d]/g, '');

  return new Intl.NumberFormat('id-ID').format(Number(cleanedNumber));
}
