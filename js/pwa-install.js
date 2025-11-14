// PWA Install Prompt Handler
let deferredPrompt;
let installPromptShown = false;

// Check if app is already installed
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
}

// Show install prompt
function showInstallPrompt() {
  // Don't show if already installed or prompt already shown
  if (isAppInstalled() || installPromptShown) {
    return;
  }

  // Check if browser supports install prompt
  if (!deferredPrompt) {
    return;
  }

  // Create and show the install prompt modal
  const installModal = document.createElement('div');
  installModal.id = 'pwa-install-modal';
  installModal.className = 'pwa-install-modal';
  installModal.innerHTML = `
    <div class="pwa-install-overlay"></div>
    <div class="pwa-install-content">
      <div class="pwa-install-icon">
        <span class="material-symbols-outlined" style="font-size: 64px; color: #051937;">download</span>
      </div>
      <h2 class="pwa-install-title">Install GHEMS App</h2>
      <p class="pwa-install-description">
        Install our app for a better experience! Get quick access, offline support, and faster loading times.
      </p>
      <div class="pwa-install-buttons">
        <button id="pwa-install-btn" class="pwa-install-btn-primary">
          <span class="material-symbols-outlined" style="font-size: 20px; margin-right: 8px;">install_mobile</span>
          Install Now
        </button>
        <button id="pwa-install-dismiss" class="pwa-install-btn-secondary">
          Maybe Later
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(installModal);

  // Animate in
  setTimeout(() => {
    installModal.classList.add('pwa-install-show');
  }, 10);

  installPromptShown = true;

  // Handle install button click
  document.getElementById('pwa-install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // Track installation if needed
      } else {
        console.log('User dismissed the install prompt');
      }
      
      deferredPrompt = null;
      closeInstallPrompt();
    }
  });

  // Handle dismiss button click
  document.getElementById('pwa-install-dismiss').addEventListener('click', () => {
    closeInstallPrompt();
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  });

  // Close on overlay click
  document.querySelector('.pwa-install-overlay').addEventListener('click', () => {
    closeInstallPrompt();
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  });
}

// Close install prompt
function closeInstallPrompt() {
  const modal = document.getElementById('pwa-install-modal');
  if (modal) {
    modal.classList.remove('pwa-install-show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default browser install prompt
  e.preventDefault();
  deferredPrompt = e;

  // Check if user dismissed the prompt recently (within 7 days)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) {
      return; // Don't show if dismissed within last 7 days
    }
  }

  // Show prompt after a short delay (better UX)
  setTimeout(() => {
    if (!isAppInstalled() && deferredPrompt) {
      showInstallPrompt();
    }
  }, 3000); // Show after 3 seconds
});

// Listen for app installed event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredPrompt = null;
  closeInstallPrompt();
  // Optionally show a success message
  if (typeof notification === 'function') {
    notification('App installed successfully!', 1);
  }
});

// Check if app is already installed on page load
if (isAppInstalled()) {
  console.log('App is already installed');
}

