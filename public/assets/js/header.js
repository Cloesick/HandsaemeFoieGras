// Self-contained script for header functionality
(function() {
    /**
     * Handles the logic for switching languages.
     * @param {string} selectedLang - The language code ('nl', 'fr', 'en').
     */
    function handleLanguageSwitch(selectedLang) {
        console.log(`Language selected: ${selectedLang}`);
        
        // Select ALL language buttons, both desktop and mobile
        const allLangButtons = document.querySelectorAll('[data-lang]');

        allLangButtons.forEach(btn => {
            // Reset all buttons to their default state
            btn.classList.remove('font-bold', 'text-white');
            btn.classList.add('font-normal', 'text-gray-400');
            
            // Activate the correct buttons (both mobile and desktop)
            if (btn.dataset.lang === selectedLang) {
                btn.classList.add('font-bold', 'text-white');
                btn.classList.remove('font-normal', 'text-gray-400');
            }
        });
        
        // TODO: Implement the full translation logic here.
        // This function would update the text content of the entire website.
        // For example: translateWebsite(selectedLang);
    }

    // Use event delegation on the header for cleaner event handling
    // We wait a brief moment for the header to be fully loaded by loader.js
    setTimeout(() => {
        const header = document.querySelector('header.header-background');
        if (header) {
            header.addEventListener('click', (e) => {
                // Handle clicks on any language button
                if (e.target.matches('[data-lang]')) {
                    handleLanguageSwitch(e.target.dataset.lang);
                }

                // Handle clicks on the mobile menu button
                if (e.target.closest('#mobile-menu-button')) {
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu) {
                        mobileMenu.classList.toggle('hidden');
                    }
                }
            });
        }
    }, 100); // A small delay ensures the header element exists
})();
