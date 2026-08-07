export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // fumadocs-ui (banner, tabs) calls localStorage.getItem() without SSR guard.
    // Provide a no-op Storage so SSR doesn't throw.
    if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') {
      (global as unknown as Record<string, unknown>).localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      };
    }
  }
}
