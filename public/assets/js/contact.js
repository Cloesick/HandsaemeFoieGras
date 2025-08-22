// This function will now wait for the 'componentsLoaded' event before running.
(function() {
    
    document.addEventListener('componentsLoaded', function() {
        // Target the placeholder div
        const statusContainer = document.getElementById('opening-status');
        if (!statusContainer) return;

        // Define opening hours (Day: 0=Sun, 1=Mon, ..., 6=Sat)
        const closedDays = [0, 1]; // Sunday and Monday
        const openTime = 9 * 60; // 9:00 AM in minutes from midnight
        const closeTime = 19 * 60 + 30; // 7:30 PM in minutes from midnight

        // Get current time details for the visitor
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        let isOpen = false;
        // Check if it's not a closed day
        if (!closedDays.includes(currentDay)) {
            // Check if current time is within opening hours
            if (currentTime >= openTime && currentTime < closeTime) {
                isOpen = true;
            }
        }

        // Create and display the message
        if (isOpen) {
            statusContainer.innerHTML = `<p class="font-bold text-green-600">✓ We zijn nu open</p>`;
        } else {
            statusContainer.innerHTML = `<p class="font-bold text-red-600">✗ We zijn momenteel gesloten</p>`;
        }
    });

})();