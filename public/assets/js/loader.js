document.addEventListener('DOMContentLoaded', function() {
    const componentsToLoad = [
        { path: 'public/components/header.html', id: 'header-placeholder' },
        { path: 'public/components/about.html', id: 'about-placeholder' },
        { path: 'public/components/products.html', id: 'products-placeholder' },
        { path: 'public/components/method.html', id: 'method-placeholder' },
        { path: 'public/components/contact.html', id: 'contact-placeholder' },
        { path: 'public/components/footer.html', id: 'footer-placeholder' }
    ];

    const fetchComponent = (component) => {
        const targetElement = document.getElementById(component.id);
        if (!targetElement) {
            return Promise.resolve(); // Resolve immediately if placeholder doesn't exist
        }

        return fetch(component.path)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${component.path}`);
                return response.text();
            })
            .then(data => {
                targetElement.innerHTML = data;
            })
            .catch(error => console.error('Error loading component:', error));
    };

    // Wait for all components to be fetched and loaded
    Promise.all(componentsToLoad.map(fetchComponent))
        .then(() => {
            // Dispatch a custom event to signal that all components are loaded
            const event = new CustomEvent('componentsLoaded');
            document.dispatchEvent(event);
        });
});
