import { useState, useEffect, useSyncExternalStore } from "react";

type Currency = "ZAR" | "USD";

const STORAGE_KEY = "app-currency";

const getInitial = (): Currency => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "USD" || stored === "ZAR") return stored;
  } catch {}
  return "ZAR";
};

let _currency: Currency = getInitial();
const _listeners = new Set<() => void>();

const store = {
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
  const currency = useSyncExternalStore(store.subscribe, store.get);
  return {
    currency,
    setCurrency: store.set,
    symbol: currency === "ZAR" ? "R" : "$",
    locale: currency === "ZAR" ? "en-ZA" : "en-US",
  };
}

export function formatCurrency(amount: number, currency?: Currency) {
  const c = currency || store.get();
  const symbol = c === "ZAR" ? "R" : "$";
  return `${symbol} ${amount.toLocaleString(c === "ZAR" ? "en-ZA" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
