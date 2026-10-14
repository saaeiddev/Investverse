import { useStore } from '../store/useStore';
export function useI18n() {
  const lang = useStore(s => s.lang); const currency = useStore(s => s.currency);
  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';
  return {
    lang, t: (en: string, fa: string) => lang === 'fa' ? fa : en,
    num: (n: number, digits = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(n),
    money: (n: number, compact = false) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0, notation: compact ? 'compact' : 'standard' }).format(n),
    percent: (n: number, digits = 0) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: digits }).format(n / 100),
  };
}
