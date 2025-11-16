/* Mavrk Widget - TokenFactory deployment (IIFE bundle entry)
 * Exposes window.MavrkWidget.init({ target, network, theme, primaryColor, onReady, onTokenDeployed, onError })
 */

import { ethers } from 'ethers';
import { MavrkSDK } from '../src/MavrkSDK';

type InitConfig = {
  target: string | HTMLElement;
  network?: 'ink';
  theme?: 'light' | 'dark';
  // Renamed "primaryColor" -> "borderOutlines", but keep backward compat alias
  borderOutlines?: string;
  primaryColor?: string; // deprecated alias
  fontColor?: string;
  // New customization options
  backgroundColor?: string; // container background color
  buttonBackground?: string; // buttons bg color
  inputBackground?: string;  // inputs bg color
  npm?: string; // default NPM to prefill
  onReady?: () => void;
  onTokenDeployed?: (data: { tokenAddress: string; txHash: string }) => void;
  onError?: (err: unknown) => void;
};

function createContainer(target: string | HTMLElement): HTMLElement {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) throw new Error('MavrkWidget: target element not found');
  return el as HTMLElement;
}

function css(opts: {
  outlines: string;
  theme: 'light' | 'dark';
  background?: string;
  buttonBackground?: string;
  inputBackground?: string;
  fontColor?: string;
}) {
  const fg = opts.fontColor ?? (opts.theme === 'dark' ? '#e5e7eb' : '#111827');
  const defaultBg = opts.theme === 'dark' ? '#0b0f14' : '#ffffff';
  const bg = opts.background ?? defaultBg;
  const border = opts.theme === 'dark' ? '#1f2937' : '#e5e7eb';
  const btnBg = opts.buttonBackground ?? opts.outlines;
  const inputBg = opts.inputBackground ?? bg;
  return `
    .mvw-root { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; color: ${fg}; background:${bg}; border:1px solid ${border}; border-radius:12px; padding:16px; max-width:520px; }
    .mvw-field { display:flex; flex-direction:column; gap:6px; margin-bottom:12px; }
    .mvw-label { font-size:12px; color:${opts.fontColor ? fg : (opts.theme === 'dark' ? '#9ca3af' : '#374151')}; }
    .mvw-input { border:1px solid ${`color-mix(in srgb, ${opts.outlines} 30%, transparent)`}; background:${inputBg}; color:${fg}; border-radius:8px; padding:10px 12px; outline:none; }
    .mvw-input:focus { border-color:${opts.outlines}; box-shadow: 0 0 0 3px ${`color-mix(in srgb, ${opts.outlines} 10%, transparent)`}; }
    .mvw-row { display:flex; gap:12px; }
    .mvw-row .mvw-field { flex:1; }
    .mvw-help { font-size:12px; color:${opts.fontColor ? fg : (opts.theme === 'dark' ? '#9ca3af' : '#6b7280')}; margin-top:-4px; margin-bottom:8px; }
    .mvw-btn { width:100%; padding:12px; border:1px solid ${`color-mix(in srgb, ${opts.outlines} 30%, transparent)`}; border-radius:10px; background:${btnBg}; color:${fg}; font-weight:600; cursor:pointer; }
    .mvw-btn[disabled] { opacity:.6; cursor:not-allowed; }
    .mvw-error { color:#dc2626; font-size:12px; margin-top:8px; }
    .mvw-success { color:#16a34a; font-size:12px; margin-top:8px; }
    .mvw-footer { display:flex; align-items:center; justify-content:center; gap:8px; margin-top:14px; }
    .mvw-powered { font-size:12px; color:${opts.fontColor ? fg : (opts.theme === 'dark' ? '#9ca3af' : '#6b7280')}; }
    .mvw-powered-logo { height:20px; width:auto; object-fit:contain; display:inline-block; opacity:0.95; }
  `;
}

async function requireWallet(): Promise<ethers.Signer> {
  const anyWindow = window as any;
  if (!anyWindow.ethereum) {
    throw new Error('No wallet found. Please install MetaMask or a compatible wallet.');
  }
  const provider = new ethers.BrowserProvider(anyWindow.ethereum);
  await provider.send('eth_requestAccounts', []);
  return await provider.getSigner();
}

async function init(config: InitConfig) {
  const theme = config.theme || 'dark';
  // outlines color (primaryColor is canonical; borderOutlines supported too)
  const outlines = config.primaryColor || config.borderOutlines || '#7c3aed';
  const mount = createContainer(config.target);
  const footerLogoSrc =
    theme === 'light'
      ? 'https://esjrycmiokijtxnbfyox.supabase.co/storage/v1/object/public/token-logos/Mavrk%20-%20Logo%20Lockup%20-%20Purple.png'
      : 'https://esjrycmiokijtxnbfyox.supabase.co/storage/v1/object/public/token-logos/Mavrk%20-%20Logo%20Lockup%20-%20White.png';

  // Shadow DOM for isolation
  const shadow = mount.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = css({
    outlines,
    theme,
    background: config.backgroundColor,
    buttonBackground: config.buttonBackground,
    inputBackground: config.inputBackground,
    fontColor: config.fontColor,
  });
  shadow.appendChild(style);

  const root = document.createElement('div');
  root.className = 'mvw-root';
  root.innerHTML = `
    <div class="mvw-row">
      <div class="mvw-field">
        <label class="mvw-label">Token Name</label>
        <input class="mvw-input" id="mvw-name" type="text" placeholder="My Token" />
      </div>
      <div class="mvw-field">
        <label class="mvw-label">Symbol</label>
        <input class="mvw-input" id="mvw-symbol" type="text" placeholder="MTK" maxlength="12" />
      </div>
    </div>
    <div class="mvw-field">
      <label class="mvw-label">NonfungiblePositionManager (NPM)</label>
      <input class="mvw-input" id="mvw-npm" type="text" placeholder="0x..." />
      <div class="mvw-help">Select the target DEX by providing its NPM address.</div>
    </div>
    <button class="mvw-btn" id="mvw-submit">Deploy Token</button>
    <div class="mvw-error" id="mvw-error" style="display:none"></div>
    <div class="mvw-success" id="mvw-success" style="display:none"></div>
    <div class="mvw-footer">
      <span class="mvw-powered">Powered by</span>
      <img class="mvw-powered-logo" src="${footerLogoSrc}" alt="Mavrk" referrerpolicy="no-referrer" />
    </div>
  `;
  shadow.appendChild(root);

  const nameInput = shadow.getElementById('mvw-name') as HTMLInputElement;
  const symbolInput = shadow.getElementById('mvw-symbol') as HTMLInputElement;
  const npmInput = shadow.getElementById('mvw-npm') as HTMLInputElement;
  const submitBtn = shadow.getElementById('mvw-submit') as HTMLButtonElement;
  const errorBox = shadow.getElementById('mvw-error') as HTMLDivElement;
  const successBox = shadow.getElementById('mvw-success') as HTMLDivElement;

  if (config.npm) npmInput.value = config.npm;
  errorBox.style.display = 'none';
  successBox.style.display = 'none';

  config.onReady && config.onReady();

  submitBtn.onclick = async () => {
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
    submitBtn.disabled = true;

    const name = (nameInput.value || '').trim();
    const symbol = (symbolInput.value || '').trim();
    const npm = (npmInput.value || '').trim();

    if (!name || !symbol || !npm) {
      errorBox.textContent = 'Please fill out name, symbol, and NPM address.';
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      return;
    }

    try {
      const signer = await requireWallet();
      const sdk = new MavrkSDK({ signer });
      const res = await sdk.deployToken({ name, symbol, npm });
      successBox.textContent = `Token deployed at ${res.tokenAddress}`;
      successBox.style.display = 'block';
      config.onTokenDeployed && config.onTokenDeployed({ tokenAddress: res.tokenAddress, txHash: res.txHash });
    } catch (err: any) {
      errorBox.textContent = err?.message || String(err);
      errorBox.style.display = 'block';
      config.onError && config.onError(err);
    } finally {
      submitBtn.disabled = false;
    }
  };
}

(function attachGlobal() {
  (window as any).MavrkWidget = { init };
})();


