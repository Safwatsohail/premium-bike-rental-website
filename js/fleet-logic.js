// Fleet Logic - Uses pre-fetched data for instant display
(function() {
    'use strict';
    
    let rendered = false;

    function init() {
        const fleetGrid = document.querySelector('.fleet-grid');
        if (!fleetGrid) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            }
            return;
        }

        // Set up callback FIRST so it's ready when data arrives
        window.renderFleetNow = function() {
            if (!rendered && window.FSM && window.FSM.bikes) {
                rendered = true;
                renderFleet(window.FSM.bikes, fleetGrid);
            }
        };

        // Check if data is already pre-fetched (from head script)
        if (window.FSM && window.FSM.bikesReady && window.FSM.bikes) {
            console.log('⚡ Fleet: Using pre-fetched data instantly!');
            rendered = true;
            renderFleet(window.FSM.bikes, fleetGrid);
            return;
        }

        // Try localStorage cache for instant display
        try {
            const cached = localStorage.getItem('fsm_bikes_cache');
            if (cached) {
                const bikes = JSON.parse(cached);
                if (bikes && bikes.length > 0) {
                    console.log('⚡ Fleet: Using cached data');
                    rendered = true;
                    renderFleet(bikes, fleetGrid);
                    return;
                }
            }
        } catch(e) {}

        // If still loading, wait for it
        if (window.FSM && !window.FSM.bikesReady) {
            console.log('⏳ Fleet: Waiting for pre-fetch...');
            return; // renderFleetNow will be called when ready
        }

        // Fallback: direct fetch
        console.log('⚠️ Fleet: Fallback fetch');
        if (window.db) {
            window.db.collection('bikes').get().then(function(snapshot) {
                var bikes = [];
                snapshot.forEach(function(doc) { bikes.push({ id: doc.id, ...doc.data() }); });
                if (!rendered) {
                    rendered = true;
                    renderFleet(bikes, fleetGrid);
                }
            });
        }
    }

    function renderFleet(bikes, container) {
        container.innerHTML = '';

        if (!bikes || bikes.length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#888;font-size:1.2rem;">No bikes available at the moment.</div>';
            return;
        }

        bikes.forEach(function(bike) {
            container.appendChild(createBikeCard(bike));
        });

        window.allBikes = bikes;
        console.log('✅ Fleet rendered:', bikes.length, 'bikes');
    }

    function createBikeCard(bike) {
        const image = bike.image || 'https://via.placeholder.com/600x400?text=No+Image';
        const name = bike.name || 'Unknown';
        const type = bike.type || 'Sport';
        const price = bike.price || '0';
        const hp = bike.hp || '-';
        const topSpeed = bike.topSpeed || '-';
        const engine = bike.engine || '-';

        const card = document.createElement('div');
        card.className = 'bike-card';
        card.setAttribute('data-category', type.toLowerCase());
        card.innerHTML = `
            <div class="card-inner" onclick="openBikeDetail('${bike.id}')">
                <div class="card-glow"></div>
                <div class="card-image">
                    <img src="${image}" alt="${name}" loading="eager">
                    <div class="image-overlay"></div>
                </div>
                <div class="card-content">
                    <div class="card-category">${type.toUpperCase()}</div>
                    <h3 class="bike-name">${name}</h3>
                    <div class="bike-specs">
                        <div class="spec-item">
                            <span class="spec-label">Power</span>
                            <span class="spec-value">${hp} HP</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Top Speed</span>
                            <span class="spec-value">${topSpeed} km/h</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Engine</span>
                            <span class="spec-value">${engine}cc</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="price">
                            <span class="price-amount">AED ${price}</span>
                            <span class="price-period">/day</span>
                        </div>
                        <button class="rent-btn" onclick="event.stopPropagation(); window.location.href='user-details.html'">
                            RENT NOW
                        </button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    // Bike Detail Modal
    window.openBikeDetail = function(bikeId) {
        const bike = window.allBikes ? window.allBikes.find(b => b.id === bikeId) : null;
        if (!bike) return;

        const modal = document.getElementById('bikeDetailModal');
        if (!modal) return;

        const detailImg = modal.querySelector('.detail-img');
        const detailTitle = modal.querySelector('.detail-title');
        const detailPrice = modal.querySelector('.detail-price');
        const detailDesc = modal.querySelector('.detail-desc');

        if (detailImg) detailImg.src = bike.image || '';
        if (detailTitle) detailTitle.textContent = bike.name;
        if (detailPrice) detailPrice.innerHTML = 'AED ' + bike.price;
        if (detailDesc) detailDesc.textContent = bike.description || 'No description available.';

        animateStat('stat-hp', bike.hp || 0);
        animateStat('stat-speed', bike.topSpeed || 0);
        animateStat('stat-engine', bike.engine || 0);
        animateStat('stat-accel', bike.acceleration || 0, true);
        animateStat('stat-kms', bike.mileage || 0);

        updateBar('bar-hp', (bike.hp || 0) / 250 * 100);
        updateBar('bar-speed', (bike.topSpeed || 0) / 350 * 100);
        updateBar('bar-engine', (bike.engine || 0) / 1500 * 100);

        const rentBtn = modal.querySelector('.rent-now-btn-large');
        if (rentBtn) rentBtn.onclick = function() { window.location.href = 'user-details.html'; };

        modal.classList.add('active');
        document.body.classList.add('scroll-locked');
    };

    function animateStat(id, target, isFloat) {
        const el = document.getElementById(id);
        if (!el) return;
        if (!target) { el.textContent = '-'; return; }
        let current = 0;
        const step = target / 30;
        const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
        }, 30);
    }

    function updateBar(id, percent) {
        const bar = document.getElementById(id);
        if (bar) {
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = Math.min(percent, 100) + '%'; }, 100);
        }
    }

    window.closeBikeDetail = function() {
        const modal = document.getElementById('bikeDetailModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('scroll-locked');
        }
    };

    // Start immediately
    init();
})();
