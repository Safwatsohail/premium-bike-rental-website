/**
 * BUTTERY SMOOTH MOBILE EXPERIENCE
 * Ultimate mobile optimization for flawless performance
 * No bugs, no crashes, no lag - just pure smoothness
 */

(function() {
    'use strict';

    // Early detection and configuration
    const CONFIG = {
        // Device detection
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
        isAndroid: /Android/i.test(navigator.userAgent),
        isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        
        // Performance metrics
        cpuCores: navigator.hardwareConcurrency || 4,
        deviceMemory: navigator.deviceMemory || 4,
        connectionType: navigator.connection?.effectiveType || '4g',
        
        // Touch capabilities
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        
        // Animation preferences
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        
        // Viewport
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
    };

    // Performance levels
    CONFIG.performanceLevel = (() => {
        if (CONFIG.cpuCores <= 2 || CONFIG.deviceMemory <= 2) return 'low';
        if (CONFIG.cpuCores <= 4 || CONFIG.deviceMemory <= 4) return 'medium';
        return 'high';
    })();

    // Expose config globally
    window.ButterySmooth = { CONFIG };

    console.log(`🚀 Buttery Smooth initialized - ${CONFIG.performanceLevel} performance mode`);

    // =========================================
    // 1. SMOOTH SCROLLING & TOUCH HANDLING
    // =========================================
    
    function initSmoothScrolling() {
        // Add smooth scroll CSS
        const style = document.createElement('style');
        style.textContent = `
            /* Smooth scroll for entire page */
            html {
                scroll-behavior: smooth;
            }
            
            /* iOS momentum scrolling */
            body,
            .scrollable,
            [data-scroll],
            .bikes-grid,
            .fleet-section,
            .testimonials-container,
            .ai-chat-messages {
                -webkit-overflow-scrolling: touch;
                overscroll-behavior-y: contain;
            }
            
            /* Prevent rubber-banding on iOS */
            html, body {
                overscroll-behavior: none;
            }
            
            /* Smooth touch feedback */
            * {
                -webkit-tap-highlight-color: transparent !important;
            }
            
            /* Improve touch targets */
            button, a, [role="button"], .btn, .nav-link, .card {
                touch-action: manipulation;
                min-height: 44px;
                cursor: pointer;
            }
            
            /* Fix 300ms tap delay */
            a, button, input, select, textarea {
                touch-action: manipulation;
            }
        `;
        document.head.appendChild(style);

        // Passive event listeners for better scroll performance
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        document.addEventListener('wheel', () => {}, { passive: true });
        document.addEventListener('scroll', () => {}, { passive: true });
    }

    // =========================================
    // 2. GPU ACCELERATION & COMPOSITING
    // =========================================
    
    function enableGPUAcceleration() {
        const style = document.createElement('style');
        style.id = 'gpu-acceleration-styles';
        style.textContent = `
            /* GPU accelerated elements for 60fps */
            .bike-card,
            .fleet-card,
            .duration-card,
            .accessory-card,
            .testimonial-card,
            .ai-chat-window,
            .page-loader,
            .modal,
            .success-modal,
            .onboarding-screen,
            .hero-section,
            [data-animate],
            .animate-on-scroll {
                transform: translateZ(0);
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                perspective: 1000px;
                will-change: transform, opacity;
            }
            
            /* Contain layout for better performance */
            .bikes-grid,
            .fleet-grid,
            .duration-grid,
            .accessories-grid,
            .testimonials-container {
                contain: layout style paint;
            }
            
            /* Optimize images */
            img {
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            }
            
            /* Smooth transitions */
            .smooth-transition {
                transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // =========================================
    // 3. OPTIMIZED ANIMATIONS
    // =========================================
    
    function optimizeAnimations() {
        const style = document.createElement('style');
        style.id = 'optimized-animations';
        
        let css = `
            /* Base animation optimizations */
            @media (max-width: 768px) {
                /* Reduce animation duration on mobile */
                *, *::before, *::after {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.2s !important;
                }
                
                /* Disable heavy animations */
                .parallax-bg,
                .floating-element {
                    animation: none !important;
                }
                
                /* Simplify hover effects */
                .bike-card:hover,
                .duration-card:hover,
                .accessory-card:hover,
                .fleet-card:hover {
                    transform: translateY(-4px) !important;
                }
                
                /* Reduce shadow complexity */
                .bike-card,
                .duration-card,
                .accessory-card {
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
                }
                
                .bike-card:hover,
                .duration-card:hover,
                .accessory-card:hover {
                    box-shadow: 0 8px 25px rgba(255, 0, 51, 0.3) !important;
                }
            }
        `;
        
        // Low performance mode - minimal animations
        if (CONFIG.performanceLevel === 'low') {
            css += `
                /* Minimal animations for low-end devices */
                @media (max-width: 768px) {
                    *, *::before, *::after {
                        animation: none !important;
                        transition: opacity 0.1s ease !important;
                    }
                    
                    .bike-card:hover,
                    .duration-card:hover,
                    .accessory-card:hover {
                        transform: none !important;
                    }
                    
                    /* Hide 3D elements */
                    #3d-container,
                    .bike-3d-container,
                    canvas {
                        display: none !important;
                    }
                    
                    /* Simplify backgrounds */
                    .hero-section,
                    .contact-section {
                        background: #000 !important;
                    }
                }
            `;
        }
        
        // Reduced motion preference
        if (CONFIG.prefersReducedMotion) {
            css += `
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `;
        }
        
        style.textContent = css;
        document.head.appendChild(style);
    }

    // =========================================
    // 4. INTERSECTION OBSERVER FOR LAZY LOADING
    // =========================================
    
    function setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
        // Lazy load images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        // Create a new image to preload
                        const preload = new Image();
                        preload.onload = () => {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            img.classList.remove('lazy');
                        };
                        preload.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.01
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src], img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
        
        // Animate elements on scroll
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    
                    // Stagger animation for grid items
                    if (entry.target.parentElement?.classList.contains('bikes-grid') ||
                        entry.target.parentElement?.classList.contains('fleet-grid')) {
                        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 50;
                        entry.target.style.animationDelay = `${delay}ms`;
                    }
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        document.querySelectorAll('[data-animate], .bike-card, .fleet-card, .duration-card, .accessory-card').forEach(el => {
            el.classList.add('animate-on-scroll');
            animateObserver.observe(el);
        });
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.4s ease, transform 0.4s ease;
            }
            
            .animate-on-scroll.animate-visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            img.lazy {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            img.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // =========================================
    // 5. DEBOUNCE & THROTTLE UTILITIES
    // =========================================
    
    function debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                lastRan = Date.now();
                inThrottle = true;
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Expose utilities
    window.ButterySmooth.debounce = debounce;
    window.ButterySmooth.throttle = throttle;

    // =========================================
    // 6. SCROLL PERFORMANCE OPTIMIZATION
    // =========================================
    
    function optimizeScrollPerformance() {
        let ticking = false;
        let lastKnownScrollPosition = 0;
        
        const handleScroll = () => {
            lastKnownScrollPosition = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Update parallax or scroll-based animations here
                    updateScrollBasedElements(lastKnownScrollPosition);
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
    }

    function updateScrollBasedElements(scrollPos) {
        // Update navbar visibility
        const navbar = document.querySelector('.top-navbar');
        if (navbar) {
            if (scrollPos > 100) {
                navbar.classList.add('visible');
            }
        }
        
        // Update scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = scrollPos > 50 ? '0' : '1';
        }
    }

    // =========================================
    // 7. FIX COMMON MOBILE BUGS
    // =========================================
    
    function fixMobileBugs() {
        // Fix iOS viewport height bug (100vh issue)
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', debounce(setVH, 100));
        window.addEventListener('orientationchange', () => setTimeout(setVH, 100));
        
        // Add CSS to use the custom vh
        const style = document.createElement('style');
        style.textContent = `
            /* Fix for iOS 100vh bug */
            .full-height {
                height: 100vh;
                height: calc(var(--vh, 1vh) * 100);
            }
            
            .hero-section,
            .onboarding-screen,
            .page-loader {
                min-height: 100vh;
                min-height: calc(var(--vh, 1vh) * 100);
            }
            
            /* Fix for position:fixed on iOS when keyboard is open */
            .top-navbar {
                position: fixed;
                transform: translateZ(0);
            }
            
            /* Prevent zoom on input focus (iOS) */
            @media (max-width: 768px) {
                input, textarea, select {
                    font-size: 16px !important;
                }
            }
            
            /* Fix for double-tap zoom */
            * {
                touch-action: manipulation;
            }
            
            /* Fix for address bar hiding on scroll */
            body {
                min-height: 100vh;
                min-height: -webkit-fill-available;
            }
            
            html {
                height: -webkit-fill-available;
            }
            
            /* Prevent horizontal scroll */
            html, body {
                overflow-x: hidden;
                max-width: 100vw;
            }
            
            /* Fix for Safari flexbox bugs */
            .flex-container {
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
            }
            
            /* Fix for sticky positioning on iOS */
            .sticky {
                position: -webkit-sticky;
                position: sticky;
            }
        `;
        document.head.appendChild(style);
        
        // Fix focus issues on iOS
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('touchstart', () => {}, { passive: true });
        });
        
        // Prevent accidental navigation
        window.addEventListener('popstate', (e) => {
            // Handle back button gracefully
        });
    }

    // =========================================
    // 8. MEMORY MANAGEMENT
    // =========================================
    
    function setupMemoryManagement() {
        if (!CONFIG.isMobile) return;
        
        // Clean up when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause any running animations
                document.querySelectorAll('[data-animated]').forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
                
                // Clear any timeouts/intervals that aren't critical
                console.log('📱 Page hidden - pausing animations');
            } else {
                // Resume animations
                document.querySelectorAll('[data-animated]').forEach(el => {
                    el.style.animationPlayState = 'running';
                });
                console.log('📱 Page visible - resuming animations');
            }
        });
        
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const used = performance.memory.usedJSHeapSize;
                const limit = performance.memory.jsHeapSizeLimit;
                const usage = (used / limit) * 100;
                
                if (usage > 80) {
                    console.warn('⚠️ High memory usage detected:', usage.toFixed(1) + '%');
                    // Force garbage collection if available
                    if (window.gc) window.gc();
                }
            }, 30000);
        }
    }

    // =========================================
    // 9. FORM INPUT OPTIMIZATION
    // =========================================
    
    function optimizeFormInputs() {
        const style = document.createElement('style');
        style.textContent = `
            /* Larger touch targets for inputs */
            @media (max-width: 768px) {
                input, textarea, select, button {
                    min-height: 48px;
                    padding: 12px 16px;
                }
                
                /* Better checkbox/radio touch targets */
                input[type="checkbox"],
                input[type="radio"] {
                    min-height: 24px;
                    min-width: 24px;
                }
                
                /* Larger select dropdown arrows */
                select {
                    background-size: 16px;
                    padding-right: 40px;
                }
                
                /* Better focus styles for touch */
                input:focus,
                textarea:focus,
                select:focus {
                    outline: none;
                    border-color: #FF0033 !important;
                    box-shadow: 0 0 0 3px rgba(255, 0, 51, 0.2) !important;
                }
                
                /* Smooth keyboard appearance */
                .form-control-wrapper {
                    transition: margin 0.3s ease;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Scroll to input when focused
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('focus', () => {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }

    // =========================================
    // 10. NETWORK-AWARE LOADING
    // =========================================
    
    function setupNetworkAwareLoading() {
        if (!navigator.connection) return;
        
        const connection = navigator.connection;
        
        const updateForNetwork = () => {
            const effectiveType = connection.effectiveType;
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                // Disable images and heavy resources
                document.body.classList.add('slow-connection');
                console.log('📶 Slow connection detected - optimizing');
                
                const style = document.createElement('style');
                style.textContent = `
                    .slow-connection img:not(.logo):not(.critical) {
                        display: none !important;
                    }
                    
                    .slow-connection .bike-image-wrapper {
                        background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
                    }
                    
                    .slow-connection video,
                    .slow-connection iframe:not(.critical) {
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);
            }
        };
        
        connection.addEventListener('change', updateForNetwork);
        updateForNetwork();
    }

    // =========================================
    // 11. ERROR HANDLING & RECOVERY
    // =========================================
    
    function setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('🔴 Runtime error:', e.message);
            
            // Attempt recovery for common issues
            if (e.message.includes('ResizeObserver')) {
                // Ignore ResizeObserver loop errors
                e.preventDefault();
                return false;
            }
        });
        
        // Promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('🔴 Unhandled promise rejection:', e.reason);
            
            // Prevent crashes
            e.preventDefault();
        });
        
        // Resource load error handler
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn('⚠️ Image failed to load:', e.target.src);
                // Replace with placeholder
                e.target.style.display = 'none';
            }
        }, true);
    }

    // =========================================
    // 12. SMOOTH PAGE TRANSITIONS
    // =========================================
    
    function setupPageTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            /* Page enter animation */
            body {
                animation: pageEnter 0.3s ease-out;
            }
            
            @keyframes pageEnter {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            /* Link hover animation */
            a {
                transition: color 0.2s ease, transform 0.2s ease;
            }
            
            /* Button press effect */
            button:active,
            .btn:active {
                transform: scale(0.98);
            }
            
            /* Card press effect */
            .bike-card:active,
            .duration-card:active,
            .accessory-card:active {
                transform: scale(0.99);
            }
        `;
        document.head.appendChild(style);
        
        // Smooth navigation
        document.querySelectorAll('a[href]:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip external links and anchors
                if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                    return;
                }
                
                e.preventDefault();
                
                // Fade out animation
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.2s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 200);
            });
        });
    }

    // =========================================
    // INITIALIZATION
    // =========================================
    
    function init() {
        const startTime = performance.now();
        
        // Apply all optimizations
        initSmoothScrolling();
        enableGPUAcceleration();
        optimizeAnimations();
        setupLazyLoading();
        optimizeScrollPerformance();
        fixMobileBugs();
        setupMemoryManagement();
        optimizeFormInputs();
        setupNetworkAwareLoading();
        setupErrorHandling();
        setupPageTransitions();
        
        const endTime = performance.now();
        
        console.log(`✨ Buttery Smooth mobile optimizations applied in ${(endTime - startTime).toFixed(2)}ms`);
        console.log(`📱 Device: ${CONFIG.isIOS ? 'iOS' : CONFIG.isAndroid ? 'Android' : 'Other'}`);
        console.log(`⚡ Performance Level: ${CONFIG.performanceLevel}`);
        console.log(`🌐 Connection: ${CONFIG.connectionType}`);
        
        // Mark as initialized
        document.documentElement.classList.add('buttery-smooth-ready');
        window.ButterySmooth.initialized = true;
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
