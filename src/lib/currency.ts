import { create } from "zustand";

type Currency = "ZAR" | "USD";

interface CurrencyStore {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const STORAGE_KEY = "app-currency";

const getInitial = (): Currency => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "USD" || stored === "ZAR") return stored;
  } catch {}
  return "ZAR";
};

// Simple zustand-like store without extra deps
let _currency: Currency = getInitial();
const _listeners = new Set<() => void>();

export const currencyStore = {
  get: () => _currency,
  set: (c: Currency) => {
    _currency = c;
    localStorage.setItem(STORAGE_KEY, c);
    _listeners.forEach((fn) => fn());
  },
  subscribe: (fn: () => void) => {
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  },
};

export function useCurrency() {
  const [currency, setCurrencyState] = (await import("react")).useState(_currency);

  (await import("react")).useEffect(() => {
    return currencyStore.subscribe(() => setCurrencyState(currencyStore.get()));
  }, []);

  return {
    currency,
    setCurrency: currencyStore.set,
    symbol: currency === "ZAR" ? "R" : "$",
    locale: currency === "ZAR" ? "en-ZA" : "en-US",
  };
}

export function formatCurrency(amount: number, currency?: Currency) {
  const c = currency || currencyStore.get();
  const symbol = c === "ZAR" ? "R" : "$";
  return `${symbol} ${amount.toLocaleString(c === "ZAR" ? "en-ZA" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
