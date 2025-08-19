document.addEventListener('DOMContentLoaded', function() {
    /**
     * Fetches an HTML component and loads it into a target element by its ID.
     * @param {string} componentPath - The file path to the HTML component (e.g., 'header.html').
     * @param {string} targetElementId - The ID of the element where the component will be loaded.
     */
    const loadComponent = (componentPath, targetElementId) => {
        // Check if the placeholder element exists on the page
        const targetElement = document.getElementById(targetElementId);
        if (!targetElement) {
            // If the placeholder doesn't exist on the current page, simply stop.
            // This allows the script to be used on pages that don't have all placeholders.
            return; 
        }

        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${componentPath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                // Inject the fetched HTML into the placeholder element
                targetElement.innerHTML = data;
            })
            .catch(error => console.error('Error loading component:', error));
    };

    // --- Load all components into their respective placeholders ---
    // This will work on any page, and only load the components for which it finds a placeholder.
    
    loadComponent('header.html', 'header-placeholder');
    loadComponent('story.html', 'story-placeholder');
    loadComponent('products.html', 'products-placeholder');
    loadComponent('method.html', 'method-placeholder');
    loadComponent('contact.html', 'contact-placeholder');
    loadComponent('footer.html', 'footer-placeholder');
    loadComponent('products.html', 'product-placeholder');
});
