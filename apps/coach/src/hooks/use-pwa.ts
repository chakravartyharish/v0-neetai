import { useEffect, useState } from 'react';

interface PWAInstallPrompt extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: PWAInstallPrompt | null;
}

interface PWAActions {
  install: () => Promise<void>;
  updateApp: () => void;
  skipUpdate: () => void;
}

export function usePWA(): PWAState & PWAActions {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [serviceWorkerReg, setServiceWorkerReg] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if app is installed (running in standalone mode)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstalled();

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial offline state
    setIsOffline(!navigator.onLine);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app install completion
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      setServiceWorkerReg(registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              setIsUpdateAvailable(true);
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setIsUpdateAvailable(true);
        }
      });

      // Check for existing updates
      await registration.update();

    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  };

  const install = async (): Promise<void> => {
    if (!installPrompt) {
      throw new Error('Install prompt not available');
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
        // isInstalled will be set by the 'appinstalled' event
      }
    } catch (error) {
      console.error('Install failed:', error);
      throw error;
    }
  };

  const updateApp = (): void => {
    if (serviceWorkerReg && serviceWorkerReg.waiting) {
      // Tell the waiting service worker to skip waiting
      serviceWorkerReg.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page after the new service worker takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  const skipUpdate = (): void => {
    setIsUpdateAvailable(false);
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    installPrompt,
    install,
    updateApp,
    skipUpdate,
  };
}

// Hook for managing app shortcuts
export function useAppShortcuts() {
  const [shortcuts, setShortcuts] = useState<any[]>([]);

  useEffect(() => {
    if ('getInstalledRelatedApps' in navigator) {
      // Check for installed related apps and shortcuts
      (navigator as any).getInstalledRelatedApps().then((relatedApps: any[]) => {
        setShortcuts(relatedApps);
      });
    }
  }, []);

  const addShortcut = async (shortcut: {
    name: string;
    url: string;
    icons?: { src: string; sizes: string; type: string }[];
  }) => {
    if ('shortcuts' in navigator) {
      try {
        // This is a hypothetical API - actual implementation may vary
        await (navigator as any).shortcuts.add(shortcut);
        setShortcuts(prev => [...prev, shortcut]);
      } catch (error) {
        console.error('Failed to add shortcut:', error);
      }
    }
  };

  return { shortcuts, addShortcut };
}

// Hook for managing offline storage
export function useOfflineStorage() {
  const [isSupported, setIsSupported] = useState(false);
  const [usage, setUsage] = useState<{ used: number; quota: number } | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        setIsSupported(true);
        try {
          const estimate = await navigator.storage.estimate();
          setUsage({
            used: estimate.usage || 0,
            quota: estimate.quota || 0,
          });
        } catch (error) {
          console.error('Failed to get storage estimate:', error);
        }
      }
    };

    checkSupport();
  }, []);

  const clearStorage = async (): Promise<void> => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_MANAGEMENT',
        action: 'clear'
      });
    }

    // Clear other storage
    if ('storage' in navigator) {
      const databases = await indexedDB.databases();
      await Promise.all(
        databases.map(db => {
          return new Promise((resolve, reject) => {
            const deleteReq = indexedDB.deleteDatabase(db.name!);
            deleteReq.onerror = () => reject(deleteReq.error);
            deleteReq.onsuccess = () => resolve(undefined);
          });
        })
      );
    }

    localStorage.clear();
    sessionStorage.clear();
    
    // Update usage after clearing
    if (isSupported) {
      const estimate = await navigator.storage.estimate();
      setUsage({
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      });
    }
  };

  const requestPersistentStorage = async (): Promise<boolean> => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      return await navigator.storage.persist();
    }
    return false;
  };

  return {
    isSupported,
    usage,
    clearStorage,
    requestPersistentStorage,
  };
}

// Hook for push notifications
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'Notification' in window && 
                       'serviceWorker' in navigator && 
                       'PushManager' in window;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Push notifications not supported');
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    return permission;
  };

  const subscribe = async (vapidPublicKey: string): Promise<PushSubscription> => {
    if (!isSupported) {
      throw new Error('Push notifications not supported');
    }

    if (permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });

    setSubscription(sub);
    return sub;
  };

  const unsubscribe = async (): Promise<void> => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}