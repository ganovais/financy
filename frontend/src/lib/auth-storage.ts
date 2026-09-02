import { useSyncExternalStore } from "react";

const STORAGE_KEY = "financy:token";
const listeners = new Set<() => void>();

function read(storage: Storage) {
  try {
    return storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function write(storage: Storage, value: string | null) {
  try {
    if (value === null) storage.removeItem(STORAGE_KEY);
    else storage.setItem(STORAGE_KEY, value);
  } catch {}
}

let token = read(localStorage) ?? read(sessionStorage);

function notify() {
  for (const listener of listeners) listener();
}

export function getToken() {
  return token;
}

export function setToken(next: string | null, { persistent = true } = {}) {
  token = next;
  write(localStorage, persistent ? next : null);
  write(sessionStorage, persistent ? null : next);
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

window.addEventListener("storage", (event) => {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  token = read(localStorage) ?? read(sessionStorage);
  notify();
});

export function useToken() {
  return useSyncExternalStore(subscribe, getToken);
}
