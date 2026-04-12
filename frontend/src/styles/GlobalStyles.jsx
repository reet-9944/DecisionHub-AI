import { useEffect } from 'react';

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050508;
    --surface: #0d0d14;
    --surface2: #13131f;
    --border: rgba(255,255,255,0.08);
    --accent: #7c3aed;
    --accent2: #06b6d4;
    --text: #f1f5f9;
    --muted: #94a3b8;
    --success: #10b981;
    --radius: 16px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: #050508;
    color: #f1f5f9;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a { color: inherit; text-decoration: none; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #050508; }
  ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 3px; }

  select option { background: #13131f; color: #f1f5f9; }
`;

export default function GlobalStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
}
