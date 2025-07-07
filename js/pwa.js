/**
 * AllNighter v2 - PWA Module
 * 
 * Progressive Web App functionality including service worker registration,
 * installation prompts, and offline handling.
 * 
 * @author Julián LR, Lucas Salmerón Olschansky, Julián Moreira
 * @version 2.0.0
 * @license MIT
 */

let deferredPrompt;
let isInstalled = false;
let swRegistration = null;

/**
 * Initialize PWA functionality
 */
export function initializePWA() {
  // Register service worker
  registerServiceWorker();
  
  // Set up installation prompt
  setupInstallPrompt();
  
  // Monitor online/offline status
  setupOfflineHandling();
  
  // Add PWA install button if not already installed
  createInstallButton();
  
  console.log('[PWA] Progressive Web App features initialized');
}

/**
 * Register the service worker
 */
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service workers not supported');
    return;
  }
  
  try {
    swRegistration = await navigator.serviceWorker.register('/sw.js');
    console.log('[PWA] Service Worker registered:', swRegistration);
    
    // Listen for updates
    swRegistration.addEventListener('updatefound', () => {
      const newWorker = swRegistration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateAvailable();
        }
      });
    });
    
    // Check for updates every hour
    setInterval(() => {
      swRegistration.update();
    }, 60 * 60 * 1000);
    
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
  }
}

/**
 * Set up installation prompt handling
 */
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] Before install prompt fired');
    
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show custom install button
    showInstallButton();
  });
  
  window.addEventListener('appinstalled', (e) => {
    console.log('[PWA] App was installed');
    isInstalled = true;
    hideInstallButton();
    
    // Track installation
    if (typeof gtag !== 'undefined') {
      gtag('event', 'app_installed', {
        event_category: 'PWA',
        event_label: 'Installation'
      });
    }
  });
}

/**
 * Set up offline handling
 */
function setupOfflineHandling() {
  window.addEventListener('online', () => {
    console.log('[PWA] Back online');
    hideOfflineMessage();
    syncWhenOnline();
  });
  
  window.addEventListener('offline', () => {
    console.log('[PWA] Gone offline');
    showOfflineMessage();
  });
  
  // Check initial online status
  if (!navigator.onLine) {
    showOfflineMessage();
  }
}

/**
 * Create install button in the UI
 */
function createInstallButton() {
  // Check if already installed
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    isInstalled = true;
    return;
  }
  
  if (window.navigator.standalone === true) {
    isInstalled = true;
    return;
  }
  
  // Create install button
  const installButton = document.createElement('button');
  installButton.id = 'pwa-install-btn';
  installButton.className = 'btn btn-success position-fixed';
  installButton.style.cssText = `
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    display: none;
    border-radius: 50px;
    padding: 10px 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  installButton.innerHTML = '📱 Install App';
  installButton.setAttribute('aria-label', 'Install AllNighter as an app');
  
  installButton.addEventListener('click', installApp);
  document.body.appendChild(installButton);
}

/**
 * Show the install button
 */
function showInstallButton() {
  const installButton = document.getElementById('pwa-install-btn');
  if (installButton && !isInstalled) {
    installButton.style.display = 'block';
    installButton.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Hide the install button
 */
function hideInstallButton() {
  const installButton = document.getElementById('pwa-install-btn');
  if (installButton) {
    installButton.style.display = 'none';
    installButton.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Install the app
 */
async function installApp() {
  if (!deferredPrompt) {
    console.log('[PWA] No deferred prompt available');
    return;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`[PWA] User response to install prompt: ${outcome}`);
  
  // Track user choice
  if (typeof gtag !== 'undefined') {
    gtag('event', 'install_prompt_response', {
      event_category: 'PWA',
      event_label: outcome
    });
  }
  
  // Clear the deferredPrompt so it can only be used once
  deferredPrompt = null;
  hideInstallButton();
}

/**
 * Show update available notification
 */
function showUpdateAvailable() {
  const updateBanner = document.createElement('div');
  updateBanner.id = 'pwa-update-banner';
  updateBanner.className = 'alert alert-info position-fixed w-100';
  updateBanner.style.cssText = `
    top: 0;
    left: 0;
    z-index: 1001;
    margin: 0;
    border-radius: 0;
    text-align: center;
  `;
  updateBanner.innerHTML = `
    <div class="container">
      <span>🚀 A new version of AllNighter is available!</span>
      <button id="pwa-update-btn" class="btn btn-sm btn-primary ms-2">Update Now</button>
      <button id="pwa-dismiss-btn" class="btn btn-sm btn-secondary ms-1">Later</button>
    </div>
  `;
  updateBanner.setAttribute('role', 'banner');
  updateBanner.setAttribute('aria-live', 'polite');
  
  document.body.insertBefore(updateBanner, document.body.firstChild);
  
  // Handle update button click
  document.getElementById('pwa-update-btn').addEventListener('click', () => {
    updateApp();
  });
  
  // Handle dismiss button click
  document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
    updateBanner.remove();
  });
}

/**
 * Update the app to new version
 */
function updateApp() {
  if (swRegistration && swRegistration.waiting) {
    // Tell the waiting service worker to take over
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
  
  // Reload the page to get the new version
  window.location.reload();
}

/**
 * Show offline message
 */
function showOfflineMessage() {
  let offlineMessage = document.getElementById('pwa-offline-message');
  
  if (!offlineMessage) {
    offlineMessage = document.createElement('div');
    offlineMessage.id = 'pwa-offline-message';
    offlineMessage.className = 'alert alert-warning position-fixed';
    offlineMessage.style.cssText = `
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1002;
      max-width: 400px;
      text-align: center;
    `;
    offlineMessage.innerHTML = `
      <div>
        <strong>📡 Offline Mode</strong><br>
        <small>You're working offline. Some features may be limited.</small>
      </div>
    `;
    offlineMessage.setAttribute('role', 'alert');
    offlineMessage.setAttribute('aria-live', 'assertive');
    
    document.body.appendChild(offlineMessage);
  }
  
  offlineMessage.style.display = 'block';
}

/**
 * Hide offline message
 */
function hideOfflineMessage() {
  const offlineMessage = document.getElementById('pwa-offline-message');
  if (offlineMessage) {
    offlineMessage.style.display = 'none';
  }
}

/**
 * Sync data when back online
 */
function syncWhenOnline() {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then(function(registration) {
      return registration.sync.register('background-sync');
    }).catch(function(error) {
      console.log('[PWA] Background sync registration failed:', error);
    });
  }
}

/**
 * Get PWA status information
 */
export function getPWAStatus() {
  return {
    isInstalled: isInstalled || 
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      (window.navigator.standalone === true),
    isOnline: navigator.onLine,
    hasServiceWorker: 'serviceWorker' in navigator,
    swRegistration: swRegistration,
    canInstall: !!deferredPrompt
  };
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('[PWA] Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Show local notification
 */
export function showNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  
  const defaultOptions = {
    body: '',
    icon: '/img/AN-logo.png',
    badge: '/img/favicon.png',
    vibrate: [100, 50, 100],
    tag: 'allnighter-notification'
  };
  
  const notification = new Notification(title, { ...defaultOptions, ...options });
  
  notification.onclick = function() {
    window.focus();
    notification.close();
  };
  
  return notification;
}

/**
 * Add to home screen prompt for iOS
 */
export function showIOSInstallPrompt() {
  if (isIOSDevice() && !isInstalled) {
    const iosPrompt = document.createElement('div');
    iosPrompt.id = 'ios-install-prompt';
    iosPrompt.className = 'alert alert-info position-fixed';
    iosPrompt.style.cssText = `
      bottom: 20px;
      left: 20px;
      right: 20px;
      z-index: 1003;
      text-align: center;
    `;
    iosPrompt.innerHTML = `
      <div>
        <strong>📱 Install AllNighter</strong><br>
        <small>Tap <strong>Share</strong> then <strong>Add to Home Screen</strong></small>
        <button class="btn btn-sm btn-secondary ms-2" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    
    document.body.appendChild(iosPrompt);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (iosPrompt.parentElement) {
        iosPrompt.remove();
      }
    }, 10000);
  }
}

/**
 * Check if device is iOS
 */
function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Auto-initialize PWA when module loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePWA);
  } else {
    initializePWA();
  }
}
