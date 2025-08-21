document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Fetches JSON data from a given URL.
     * @param {string} url - The URL of the JSON file to fetch.
     * @returns {Promise<object>} - A promise that resolves with the parsed JSON data.
     */
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) { // FIXED: Added opening brace for the catch block
            console.error(`Could not fetch data from ${url}:`, error);
            return null; // Return null on error to prevent crashes
        } // FIXED: Added closing brace for the catch block
    }

    /**
     * Creates and populates a carousel with slides from the provided data.
     * @param {string} wrapperId - The ID of the element that will contain the slides.
     * @param {object} data - The JSON object containing the array of items.
     * @param {string} dataKey - The key in the data object that holds the array.
     */
    function populateCarousel(wrapperId, data, dataKey) {
        const wrapper = document.getElementById(wrapperId);
        // Exit if the wrapper element or data is not found
        if (!wrapper || !data || !data[dataKey]) {
            console.error(`Carousel wrapper #${wrapperId} not found or data is invalid.`);
            return;
        }

        wrapper.innerHTML = ''; // Clear any pre-existing content
        
        data[dataKey].forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-item';
            // Make the first slide active by default
            if (index === 0) {
                slide.classList.add('active');
            }
            // IMPORTANT: The image src path also needs to be correct relative to the HTML file.
            // If carousel.html is in /components, the image path should start with ../
            const imagePath = item.src.startsWith('public') ? `../${item.src}` : item.src;
            slide.innerHTML = `<img src="${imagePath}" onerror="this.onerror=null;this.src='https://placehold.co/800x400/3D2B1F/FFFFFF?text=${encodeURIComponent(item.alt)}';" alt="${item.alt}" class="w-full h-full object-cover">`;
            wrapper.appendChild(slide);
        });
    }

    /**
     * Initializes the controls and functionality for a carousel.
     * @param {string} carouselId - The ID of the main carousel container element.
     */
    function initializeCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-item');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        let currentIndex = 0;

        // Do not initialize if there are no slides to show
        if (slides.length === 0) return;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                   slide.classList.add('active');
                }
            });
        }

        // Event listener for the 'previous' button
        prevButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the parent <a> tag from being triggered
            e.stopPropagation(); // Stop the event from bubbling up
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        // Event listener for the 'next' button
        nextButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the parent <a> tag from being triggered
            e.stopPropagation(); // Stop the event from bubbling up
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        showSlide(currentIndex); // Show the initial slide
    }

    /**
     * Main function to load data and set up the carousels.
     */
    async function main() {
        // --- CORRECTED PATHS ---
        // Paths are now relative to an HTML file inside the 'components' folder.
        const foodJsonPath = '../public/data/food.json';
        const locationJsonPath = '../public/data/location.json';

        // Fetch both JSON files concurrently
        const [foodData, venueData] = await Promise.all([
            fetchData(foodJsonPath),
            fetchData(locationJsonPath)
        ]);

        // Populate the carousels with the fetched data
        // Note: The key for food is 'food', and for locations it's 'locations'
        populateCarousel('food-carousel-wrapper', foodData, 'food');
        populateCarousel('venue-carousel-wrapper', venueData, 'locations');

        // Initialize the functionality for both carousels now that they have content
        initializeCarousel('food-carousel');
        initializeCarousel('venue-carousel');
    }

    // --- SCRIPT EXECUTION ---
    main();
});
