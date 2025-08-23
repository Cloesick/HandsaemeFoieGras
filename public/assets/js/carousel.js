// UPDATED to wait for the 'componentsLoaded' event
(function() {

    document.addEventListener('componentsLoaded', () => {
    
        async function fetchData(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`Could not fetch data from ${url}:`, error);
                return null;
            }
        }
    
        function populateCarousel(wrapperId, data, dataKey) {
            const wrapper = document.getElementById(wrapperId);
            if (!wrapper || !data || !data[dataKey]) {
                console.error(`Carousel wrapper #${wrapperId} not found or data is invalid.`);
                return;
            }
    
            wrapper.innerHTML = '';
            
            data[dataKey].forEach((item, index) => {
                const slide = document.createElement('div');
                slide.className = 'carousel-item';
                if (index === 0) {
                    slide.classList.add('active');
                }
                const imagePath = item.src;
slide.innerHTML = `<img src="${imagePath}" onerror="..." alt="${item.alt}" class="w-full h-full object-cover" loading="lazy">`;                wrapper.appendChild(slide);
            });
        }
    
        function initializeCarousel(carouselId) {
            const carousel = document.getElementById(carouselId);
            if (!carousel) return;
    
            const slides = carousel.querySelectorAll('.carousel-item');
            const prevButton = carousel.querySelector('.carousel-prev');
            const nextButton = carousel.querySelector('.carousel-next');
            let currentIndex = 0;
            let autoPlayInterval;
    
            if (slides.length <= 1) return;
    
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.remove('active');
                    if (i === index) {
                        slide.classList.add('active');
                    }
                });
            }
            
            function nextSlide() {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            }
    
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clearInterval(autoPlayInterval);
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(currentIndex);
            });
    
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clearInterval(autoPlayInterval);
                nextSlide();
            });
    
            function startAutoPlay() {
                autoPlayInterval = setInterval(nextSlide, 3000);
            }
    
            showSlide(currentIndex);
            startAutoPlay();
        }
    
        async function main() {
            const foodJsonPath = 'public/assets/data/food.json';
            const locationJsonPath = 'public/assets/data/location.json';
    
            const [foodData, venueData] = await Promise.all([
                fetchData(foodJsonPath),
                fetchData(locationJsonPath)
            ]);
    
            populateCarousel('food-carousel-wrapper', foodData, 'food');
            populateCarousel('venue-carousel-wrapper', venueData, 'locations');
    
            initializeCarousel('food-carousel');
            initializeCarousel('venue-carousel');
        }
    
        main();
    });

})();