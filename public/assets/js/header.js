// Self-contained script for ALL header functionality
(function() {

    /**
     * Handles the logic for switching languages.
     */
    function handleLanguageSwitch(selectedLang) {
        console.log(`Language selected: ${selectedLang}`);
        
        const allLangButtons = document.querySelectorAll('[data-lang]');
        allLangButtons.forEach(btn => {
            btn.classList.remove('font-bold', 'text-white');
            btn.classList.add('font-normal', 'text-gray-400');
            
            if (btn.dataset.lang === selectedLang) {
                btn.classList.add('font-bold', 'text-white');
                btn.classList.remove('font-normal', 'text-gray-400');
            }
        });
        
        // TODO: Implement the full translation logic here.
    }

    /**
     * Handles toggling the visibility of the mobile navigation menu.
     */
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            // Assumes you're using the 'is-open' class for animation
mobileMenu.classList.toggle('hidden');

        }
    }

    /**
     * UPDATED: This function now controls THREE status indicators.
     */
    function updateOpeningStatus() {
        // Find all three placeholders
        const desktopContainer = document.getElementById('header-status-desktop');
        const mobileContainer = document.getElementById('header-status-mobile');
        const topBarContainer = document.getElementById('top-bar-hours'); // The new one

        // Opening hours logic (unchanged)
        const closedDays = [0, 1]; // Sunday, Monday
        const openTime = 9 * 60; // 9:00 AM
        const closeTime = 19 * 60 + 30; // 7:30 PM
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        let isOpen = false;
        if (!closedDays.includes(currentDay) && (currentTime >= openTime && currentTime < closeTime)) {
            isOpen = true;
        }

        // Create different message formats for different locations
        const simpleMessage = isOpen 
            ? `<p class="text-green-400">✓ Nu Open</p>` 
            : `<p class="text-red-400">✗ Nu Gesloten</p>`;

        const topBarMessage = isOpen 
            ? `<span>Di-Za: 09:00 - 19:30 <span class="text-green-400 font-bold">(Nu Open)</span></span>` 
            : `<span>Di-Za: 09:00 - 19:30 <span class="text-red-400 font-bold">(Nu Gesloten)</span></span>`;

        // Update all placeholders with the correct message
        if (desktopContainer) desktopContainer.innerHTML = simpleMessage;
        if (mobileContainer) mobileContainer.innerHTML = simpleMessage;
        if (topBarContainer) topBarContainer.innerHTML = topBarMessage;
    }

    // This single event listener controls everything
    document.addEventListener('componentsLoaded', () => {
        
        // Run the status check as soon as the header loads.
        updateOpeningStatus();

        const header = document.querySelector('header.header-background');
        if (header) {
            header.addEventListener('click', (e) => {
                if (e.target.matches('[data-lang]')) {
                    handleLanguageSwitch(e.target.dataset.lang);
                }
                if (e.target.closest('#mobile-menu-button')) {
                    toggleMobileMenu();
                }
            });
        }
    });

})();