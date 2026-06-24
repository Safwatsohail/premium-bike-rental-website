// Pricing Validation and Display Helper
(function() {
    'use strict';

    // Pricing validation utilities
    window.PricingValidator = {
        
        // Validate and format price
        validatePrice: function(price) {
            if (price === null || price === undefined || price === '' || isNaN(price)) {
                return 0;
            }
            
            // Handle string prices like "AED 500" or "500 AED"
            if (typeof price === 'string') {
                const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
                return isNaN(numericPrice) ? 0 : numericPrice;
            }
            
            return parseFloat(price) || 0;
        },

        // Format price for display
        formatPrice: function(price, showCurrency = true) {
            const validPrice = this.validatePrice(price);
            if (validPrice <= 0) {
                return showCurrency ? 'Contact for pricing' : 'N/A';
            }
            return showCurrency ? `AED ${validPrice.toFixed(2)}` : validPrice.toFixed(2);
        },

        // Get bike pricing with fallbacks
        getBikePricing: function() {
            const selectedBike = JSON.parse(localStorage.getItem('selectedBike') || '{}');
            const selectedDuration = JSON.parse(localStorage.getItem('selectedDuration') || '{}');
            const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
            
            // Calculate rental days
            let rentalDays = 1;
            if (selectedDuration.pricing && selectedDuration.pricing.days) {
                rentalDays = selectedDuration.pricing.days;
            } else if (userDetails.pickupDate && userDetails.dropoffDate) {
                const pickup = new Date(userDetails.pickupDate);
                const dropoff = new Date(userDetails.dropoffDate);
                const diffTime = Math.abs(dropoff - pickup);
                rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            }

            // If we have duration-based pricing, use it
            if (selectedDuration.pricing) {
                return {
                    totalPrice: this.validatePrice(selectedDuration.pricing.totalPrice),
                    pricePerDay: this.validatePrice(selectedDuration.pricing.pricePerDay),
                    days: rentalDays,
                    hasValidPricing: this.validatePrice(selectedDuration.pricing.totalPrice) > 0
                };
            }

            // Fallback to bike base price
            const basePrice = this.validatePrice(selectedBike.price);
            return {
                totalPrice: basePrice * rentalDays,
                pricePerDay: basePrice,
                days: rentalDays,
                hasValidPricing: basePrice > 0
            };
        },

        // Validate booking data before submission
        validateBookingData: function() {
            const selectedBike = JSON.parse(localStorage.getItem('selectedBike') || '{}');
            const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
            const pricing = this.getBikePricing();
            
            const errors = [];
            
            // Check required fields
            if (!selectedBike.name) {
                errors.push('No bike selected');
            }
            
            if (!userDetails.email) {
                errors.push('Customer email is missing');
            }
            
            if (!userDetails.firstName || !userDetails.lastName) {
                errors.push('Customer name is incomplete');
            }
            
            // Pricing validation
            if (!pricing.hasValidPricing) {
                console.warn('⚠️ No valid pricing found - booking will require manual pricing');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors,
                warnings: pricing.hasValidPricing ? [] : ['No pricing data available']
            };
        },

        // Generate pricing summary HTML
        generatePricingSummary: function(options = {}) {
            const pricing = this.getBikePricing();
            const selectedBike = JSON.parse(localStorage.getItem('selectedBike') || '{}');
            const accessoriesCart = JSON.parse(localStorage.getItem('accessoriesCart') || '[]');
            
            let html = '';
            
            // Bike pricing
            if (selectedBike.name) {
                html += `
                    <div class="pricing-item">
                        <span class="item-label">Bike: ${selectedBike.name}</span>
                        <span class="item-price">${this.formatPrice(pricing.totalPrice)}</span>
                    </div>
                `;
                
                if (pricing.hasValidPricing && pricing.days > 1) {
                    html += `
                        <div class="pricing-detail">
                            <span class="detail-label">${pricing.days} days × ${this.formatPrice(pricing.pricePerDay)}/day</span>
                        </div>
                    `;
                }
            }
            
            // Accessories pricing
            let accessoriesTotal = 0;
            if (accessoriesCart.length > 0) {
                accessoriesCart.forEach(item => {
                    if (item.quantity > 0) {
                        const itemPrice = this.validatePrice(item.price);
                        const itemTotal = itemPrice * item.quantity * pricing.days;
                        accessoriesTotal += itemTotal;
                        
                        html += `
                            <div class="pricing-item">
                                <span class="item-label">${item.name} × ${item.quantity}</span>
                                <span class="item-price">${this.formatPrice(itemTotal)}</span>
                            </div>
                        `;
                    }
                });
            }
            
            // Total
            const total = pricing.totalPrice + accessoriesTotal;
            html += `
                <div class="pricing-total">
                    <span class="total-label">Total Amount:</span>
                    <span class="total-price">${this.formatPrice(total)}</span>
                </div>
            `;
            
            return html;
        },

        // Update all pricing displays on page
        updateAllPricingDisplays: function() {
            const pricing = this.getBikePricing();
            
            // Update common pricing elements
            const elements = {
                'totalAmount': this.formatPrice(pricing.totalPrice),
                'bikePricePerDay': this.formatPrice(pricing.pricePerDay),
                'bikeTotal': this.formatPrice(pricing.totalPrice),
                'rentalDays': pricing.days.toString()
            };
            
            Object.keys(elements).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = elements[id];
                }
            });
            
            console.log('💰 Pricing displays updated:', pricing);
        }
    };

    // Auto-update pricing when localStorage changes
    window.addEventListener('storage', function(e) {
        if (e.key && (e.key.includes('selectedBike') || e.key.includes('selectedDuration'))) {
            setTimeout(() => {
                window.PricingValidator.updateAllPricingDisplays();
            }, 100);
        }
    });

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.PricingValidator.updateAllPricingDisplays();
        }, 500);
    });

    console.log('💰 Pricing validator initialized');
})();