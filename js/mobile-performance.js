// Mobile Performance Optimization Script - Buttery Smooth Experience
(function() {
    'use strict';

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
    const isVeryLowEndDevice = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
    
    // Performance tracking
    window.MobilePerf = {
        isMobile,
        isLowEndDevice,
        isVeryLowEndDevice,
        loadedResources: {
            firebase: false,
            bikes: false,
            testimonials: false,
            images: false,
            fonts: false
        },
        startTime: performance.now()
    };

    if (isMobile) {
        console.log('📱 Mobile device detected - applying buttery smooth optimizations');
        document.documentElement.classList.add('mobile-device');
        
        if (isLowEndDevice) {
            document.documentElement.classList.add('low-end-device');
            console.log('⚡ Low-end device detected - applying aggressive optimizations');
        }
        
        if (isVeryLowEndDevice) {
            document.documentElement.classList.add('very-low-end-device');
            console.log('🔋 Very low-end device - maximum optimizations enabled');
        }
    }

    // Optimize Firebase for mobile
    function optimizeFirebaseForMobile() {
        if (window.db && isMobile) {
            const cacheSize = isVeryLowEndDevice ? 1048576 : (isLowEndDevice ? 2097152 : 5242880);
            
            try {
                window.db.settings({
                    cacheSizeBytes: cacheSize,
                    ignoreUndefinedProperties: true
                });
                console.log('📱 Firebase optimized for mobile with cache size:', cacheSize);
            } catch (e) {
                console.warn('Firebase settings already applied');
            }
        }
    }

    // Request Animation Frame throttle for smooth 60fps
    let lastFrameTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    window.smoothRAF = function(callback) {
        return requestAnimationFrame((currentTime) => {
            if (currentTime - lastFrameTime >= frameInterval) {
                lastFrameTime = currentTime;
                callback(currentTime);
            } else {
                window.smoothRAF(callback);
            }
        });
    };

    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Passive event listeners for smooth scrolling
    function setupPassiveListeners() {
        const passiveSupported = (() => {
            let supported = false;
            try {
                const options = {
                    get passive() {
                        supported = true;
                        return false;
                    }
                };
                window.addEventListener('test', null, options);
                window.removeEventListener('test', null, options);
            } catch (e) {}
            return supported;
        })();

        if (passiveSupported) {
            document.addEventListener('touchstart', () => {}, { passive: true });
            document.addEventListener('touchmove', () => {}, { passive: true });
            document.addEventListener('wheel', () => {}, { passive: true });
            document.addEventListener('scroll', () => {}, { passive: true });
        }
    }

    // Optimize scroll performance
    function optimizeScrolling() {
        let ticking = false;
        
        const handleScroll = throttle(() => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    ticking = false;
                });
                ticking = true;
            }
        }, 16); // ~60fps
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Lazy load images with IntersectionObserver
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }

    // Reduce animations on low-end devices
    function optimizeAnimations() {
        const style = document.createElement('style');
        style.id = 'mobile-performance-styles';
        
        let css = `
            /* Smooth scrolling for all devices */
            html {
                scroll-behavior: smooth;
            }
            
            /* Mobile optimizations */
            .mobile-device {
                -webkit-overflow-scrolling: touch;
                -webkit-tap-highlight-color: transparent;
                touch-action: manipulation;
            }
            
            .mobile-device * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            .mobile-device img {
                image-rendering: -webkit-optimize-contrast;
                will-change: auto;
            }
            
            /* GPU acceleration for smooth animations */
            .mobile-device .bike-card,
            .mobile-device .duration-card,
            .mobile-device .accessory-card,
            .mobile-device .ai-chat-window,
            .mobile-device .page-loader {
                transform: translateZ(0);
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                perspective: 1000px;
            }
            
            /* Contain layout for better performance */
            .mobile-device .bikes-grid,
            .mobile-device .duration-grid,
            .mobile-device .accessories-grid,
            .mobile-device .fleet-grid {
                contain: layout style;
            }
        `;
        
        if (isLowEndDevice) {
            css += `
                /* Low-end device optimizations */
                .low-end-device * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.15s !important;
                }
                
                .low-end-device .bike-card:hover,
                .low-end-device .duration-card:hover,
                .low-end-device .accessory-card:hover {
                    transform: translateY(-3px) !important;
                }
                
                .low-end-device .loader-ring,
                .low-end-device .loader-ring-inner {
                    animation-duration: 3s !important;
                }
                
                .low-end-device .loader-glow {
                    animation: none !important;
                    opacity: 0.3 !important;
                }
            `;
        }
        
        if (isVeryLowEndDevice) {
            css += `
                /* Very low-end device - minimal animations */
                .very-low-end-device * {
                    animation: none !important;
                    transition: opacity 0.1s ease !important;
                }
                
                .very-low-end-device .bike-card:hover,
                .very-low-end-device .duration-card:hover,
                .very-low-end-device .accessory-card:hover {
                    transform: none !important;
                    box-shadow: 0 2px 10px rgba(255, 0, 51, 0.2) !important;
                }
                
                .very-low-end-device .loader-ring,
                .very-low-end-device .loader-ring-inner,
                .very-low-end-device .loader-glow,
                .very-low-end-device .loader-bg-grid {
                    display: none !important;
                }
                
                .very-low-end-device .page-loader {
                    background: #000 !important;
                }
                
                /* Disable 3D models on very low-end devices */
                .very-low-end-device #3d-container,
                .very-low-end-device .bike-3d-container,
                .very-low-end-device #why-choose-bike-canvas {
                    display: none !important;
                }
            `;
        }
        
        document.head.appendChild(style);
    }

    // Memory management
    function setupMemoryManagement() {
        if (!isMobile) return;
        
        // Clear unused data periodically
        const cleanupInterval = setInterval(() => {
            // Check if we should clean up
            if (performance.memory && performance.memory.usedJSHeapSize > 100000000) { // 100MB
                console.log('🧹 Cleaning up memory...');
                
                // Clear old cache entries
                try {
                    const cacheKeys = Object.keys(localStorage);
                    const now = Date.now();
                    cacheKeys.forEach(key => {
                        if (key.includes('timestamp')) {
                            const timestamp = parseInt(localStorage.getItem(key));
                            if (timestamp && (now - timestamp) > 1800000) { // 30 minutes
                                const dataKey = key.replace('_timestamp', '');
                                localStorage.removeItem(dataKey);
                                localStorage.removeItem(key);
                            }
                        }
                    });
                } catch (e) {}
            }
        }, 60000); // Check every minute
        
        // Clean up on page hide
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, reduce memory usage
                if (window.gc) window.gc();
            }
        });
    }

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            { href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap', as: 'style' },
            { href: 'Open folder Model.png', as: 'image' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = function() { this.rel = 'stylesheet'; };
            }
            document.head.appendChild(link);
        });
    }

    // Initialize all optimizations
    function init() {
        setupPassiveListeners();
        optimizeFirebaseForMobile();
        optimizeAnimations();
        optimizeScrolling();
        setupLazyLoading();
        setupMemoryManagement();
        preloadCriticalResources();
        
        // Mark as initialized
        window.MobilePerf.initialized = true;
        window.MobilePerf.initTime = performance.now() - window.MobilePerf.startTime;
        
        console.log(`📱 Mobile optimizations applied in ${window.MobilePerf.initTime.toFixed(2)}ms`);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();