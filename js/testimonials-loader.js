// Testimonials Loader - Uses pre-fetched data for instant display (same as fleet)
(function() {
    'use strict';

    let autoRotateInterval = null;
    let rendered = false;

    function init() {
        const track = document.getElementById('carouselTrack');
        if (!track) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            }
            return;
        }

        // Set up callback FIRST so it's ready when data arrives
        window.renderTestimonialsNow = function() {
            if (rendered) return;
            if (window.FSM && window.FSM.testimonials && window.FSM.testimonials.length > 0) {
                rendered = true;
                renderTestimonials(window.FSM.testimonials);
            } else if (window.FSM && window.FSM.testimonialsReady) {
                rendered = true;
                showEmpty();
            }
        };

        // Check if data is already pre-fetched (from head script)
        if (window.FSM && window.FSM.testimonialsReady && window.FSM.testimonials) {
            console.log('⚡ Testimonials: Using pre-fetched data instantly!');
            rendered = true;
            if (window.FSM.testimonials.length > 0) {
                renderTestimonials(window.FSM.testimonials);
            } else {
                showEmpty();
            }
            return;
        }

        // Try localStorage cache for instant display FIRST (before waiting for Firebase)
        try {
            const cached = localStorage.getItem('fsm_testimonials_cache');
            if (cached) {
                const data = JSON.parse(cached);
                if (data && data.length > 0) {
                    console.log('⚡ Testimonials: Using cached data instantly!');
                    rendered = true;
                    renderTestimonials(data);
                    return;
                }
            }
        } catch(e) {}

        // If still loading, wait for it
        if (window.FSM && !window.FSM.testimonialsReady) {
            console.log('⏳ Testimonials: Waiting for pre-fetch...');
            return; // renderTestimonialsNow will be called when ready
        }

        // Fallback: direct fetch if nothing else worked
        console.log('⚠️ Testimonials: Fallback fetch');
        if (window.db) {
            window.db.collection('testimonials').get().then(function(snapshot) {
                var testimonials = [];
                snapshot.forEach(function(doc) {
                    var d = doc.data();
                    if (d.isActive !== false) testimonials.push({ id: doc.id, ...d });
                });
                testimonials.sort(function(a, b) { return (a.displayOrder || 999) - (b.displayOrder || 999); });
                if (!rendered) {
                    rendered = true;
                    if (testimonials.length > 0) {
                        renderTestimonials(testimonials);
                    } else {
                        showEmpty();
                    }
                }
            });
        } else {
            showEmpty();
        }
    }

    function showEmpty() {
        const track = document.getElementById('carouselTrack');
        if (track) {
            track.innerHTML = '<div style="text-align:center;padding:40px;color:#888;">No reviews yet.</div>';
        }
        hideControls();
    }

    function hideControls() {
        const prev = document.querySelector('.carousel-nav.prev');
        const next = document.querySelector('.carousel-nav.next');
        const ind = document.getElementById('carouselIndicators');
        if (prev) prev.style.display = 'none';
        if (next) next.style.display = 'none';
        if (ind) ind.style.display = 'none';
    }

    function showControls() {
        const prev = document.querySelector('.carousel-nav.prev');
        const next = document.querySelector('.carousel-nav.next');
        const ind = document.getElementById('carouselIndicators');
        if (prev) prev.style.display = 'flex';
        if (next) next.style.display = 'flex';
        if (ind) ind.style.display = 'flex';
    }

    function renderTestimonials(testimonials) {
        const track = document.getElementById('carouselTrack');
        if (!track) return;

        track.innerHTML = '';
        testimonials.forEach((t, i) => {
            track.appendChild(createCard(t, i === 0));
        });

        showControls();
        initCarousel();
        console.log('✅ Testimonials rendered:', testimonials.length);
    }

    function createCard(t, isActive) {
        const card = document.createElement('div');
        card.className = 'feedback-card' + (isActive ? ' active' : '');

        const rating = t.rating || 5;
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) stars += '<i class="fas fa-star"></i>';
            else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
            else stars += '<i class="far fa-star"></i>';
        }

        const esc = (s) => { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; };

        card.innerHTML = `
            <div class="rating">${stars}</div>
            <p class="feedback-text">"${esc(t.text)}"</p>
            <div class="customer-info">
                <img src="${t.avatar || 'https://via.placeholder.com/50?text=User'}" 
                     alt="${esc(t.customerName)}" class="customer-avatar"
                     onerror="this.src='https://via.placeholder.com/50?text=User'">
                <div class="customer-details">
                    <h4>${esc(t.customerName)}</h4>
                    <span>${esc(t.customerTitle || 'Customer')}</span>
                </div>
            </div>
        `;
        return card;
    }

    function initCarousel() {
        const cards = document.querySelectorAll('.feedback-card');
        if (cards.length === 0) return;

        const track = document.getElementById('carouselTrack');
        const indicators = document.getElementById('carouselIndicators');

        if (indicators) {
            indicators.innerHTML = '';
            for (let i = 0; i < cards.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'indicator' + (i === 0 ? ' active' : '');
                dot.onclick = () => window.goToTestimonial(i);
                indicators.appendChild(dot);
            }
        }

        window.currentTestimonial = 0;

        window.updateCarousel = function() {
            document.querySelectorAll('.feedback-card').forEach((card, i) => {
                card.classList.toggle('active', i === window.currentTestimonial);
            });
            const c = document.querySelectorAll('.feedback-card');
            if (track && c[0]) {
                const w = c[0].offsetWidth + parseInt(getComputedStyle(c[0]).marginRight || 0);
                track.style.transform = `translateX(${-window.currentTestimonial * w}px)`;
            }
            document.querySelectorAll('.indicator').forEach((ind, i) => {
                ind.classList.toggle('active', i === window.currentTestimonial);
            });
        };

        window.nextTestimonial = function() {
            const t = document.querySelectorAll('.feedback-card').length;
            if (t === 0) return;
            window.currentTestimonial = (window.currentTestimonial + 1) % t;
            window.updateCarousel();
        };

        window.prevTestimonial = function() {
            const t = document.querySelectorAll('.feedback-card').length;
            if (t === 0) return;
            window.currentTestimonial = (window.currentTestimonial - 1 + t) % t;
            window.updateCarousel();
        };

        window.goToTestimonial = function(i) {
            window.currentTestimonial = i;
            window.updateCarousel();
        };

        window.updateCarousel();

        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(window.nextTestimonial, 5000);
    }

    // Start immediately
    init();
})();
