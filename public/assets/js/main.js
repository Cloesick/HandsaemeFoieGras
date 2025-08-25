// This function will run only after the loader has finished its job
function initializeProductSection() {
    let allProducts = [];
    let priceChart;

    const productGrid = document.getElementById('product-grid');
    const productFilters = document.getElementById('product-filters');
    const chartCanvas = document.getElementById('priceChart');

    // If these elements don't exist, stop the function
    if (!productGrid || !productFilters || !chartCanvas) {
        return;
    }

    async function fetchProducts() {
        try {
            const response = await fetch('public/assets/data/products.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allProducts = await response.json();
            displayProducts();
        } catch (error) {
            console.error("Could not fetch products:", error);
            productGrid.innerHTML = `<p class="col-span-full text-center text-red-500">Kon de producten niet laden.</p>`;
        }
    }

    function displayProducts() {
        createFilterButtons();
        renderProducts('all');
        addFilterEventListeners();
    }

    // UPDATED FUNCTION: Now creates both type and keyword filter buttons
    function createFilterButtons() {
        // 1. Get the existing type-based filters
        const types = ['all', ...new Set(allProducts.map(p => p.type))];
        
        // 2. Define your new keyword-based filters
        const keywordFilters = [
            { label: 'Paté', filterValue: 'pate' }, // We'll search for 'pat' or 'paté'
            { label: 'Lever', filterValue: 'lever' },
            { label: 'Borst', filterValue: 'borst' },
            { label: 'Rillette', filterValue: 'rillette' },
               { label: 'Foie Gras', filterValue: 'foiegras' },
    { label: 'Gekonfijt', filterValue: 'gekonfijt' },
    { label: 'Met Truffel', filterValue: 'truffel' },
    { label: 'Vers & Cru', filterValue: 'versecru' },
    { label: 'Worst', filterValue: 'worst' }
        ];

        // 3. Generate HTML for type buttons
        const typeButtonsHTML = types.map(type => `
            <button class="filter-btn px-4 py-2 rounded-full shadow transition-colors duration-300 ${type === 'all' ? 'bg-brand-gold text-white' : 'bg-white text-brand-gold'}" data-filter="${type}">
                ${type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
        `).join('');

        // 4. Generate HTML for keyword buttons
        const keywordButtonsHTML = keywordFilters.map(filter => `
            <button class="filter-btn px-4 py-2 rounded-full shadow transition-colors duration-300 bg-white text-brand-gold" data-filter="${filter.filterValue}">
                ${filter.label}
            </button>
        `).join('');

        // 5. Combine and render all buttons
        productFilters.innerHTML = typeButtonsHTML + keywordButtonsHTML;
    }
    
    // UPDATED FUNCTION: Now handles both type and keyword filtering logic
    function renderProducts(filter = 'all') {
        let filteredProducts;
        const knownTypes = [...new Set(allProducts.map(p => p.type))]; // Get a list of valid types

        // Check if the filter is 'all' or a known product type
        if (filter === 'all') {
            filteredProducts = allProducts;
        } else if (knownTypes.includes(filter)) {
            filteredProducts = allProducts.filter(p => p.type === filter);
        } else {
            // Otherwise, treat it as a keyword search on the product name
            const searchTerm = filter.toLowerCase();
            switch (searchTerm) {
                case 'pate':
                    // Special case for "pat" or "paté"
                    filteredProducts = allProducts.filter(p => 
                        p.name.toLowerCase().includes('pat') || 
                        p.name.toLowerCase().includes('paté')
                    );
                    break;
                case 'rillette': 
                     // Handle the typo in the original request ("rillete")
                    filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes('rillette'));
                    break;
                default:
                    // Default case for other keywords like 'lever', 'borst'
                    filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
                    break;
            }
        }
        
        productGrid.innerHTML = filteredProducts.map(product => {
            const pricePerKg = product.price_per_kg ? product.price_per_kg.toFixed(2) : ((product.price / product.weight) * 1000).toFixed(2);
            return `
                <div class="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-4" onerror="this.onerror=null;this.src='https://placehold.co/400x300/ccc/FFFFFF?text=Geen+Afbeelding';">
                    <h4 class="font-bold text-xl text-brand-dark-brown">${product.name}</h4>
                    <p class="text-md text-gray-500 mb-3">${product.type}</p>
                    ${product.price ? `<p class="text-2xl font-semibold text-brand-gold mb-1">${product.price.toFixed(2)}€</p>` : ''}
                    ${product.weight ? `<p class="text-xs text-gray-400 mb-3">(${product.weight}g)</p>` : ''}
                    <p class="text-md font-medium text-gray-700">${pricePerKg}€ / kg</p>
                </div>
            `;
        }).join('');
        updateChart(filteredProducts);
    }
    
    // This function doesn't need changes, as it just passes the 'data-filter' value
    function addFilterEventListeners() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button styles
                filterBtns.forEach(b => {
                    b.classList.remove('bg-brand-gold', 'text-white');
                    b.classList.add('bg-white', 'text-brand-gold');
                });
                btn.classList.add('bg-brand-gold', 'text-white');
                btn.classList.remove('bg-white', 'text-brand-gold');

                // Call renderProducts with the filter value from the clicked button
                renderProducts(btn.dataset.filter);
            });
        });
    }

    function updateChart(data) {
        const ctx = chartCanvas.getContext('2d');
        const chartData = {
            labels: data.map(p => p.name),
            datasets: [{
                label: 'Prijs per kg (€)',
                data: data.map(p => p.price_per_kg ? p.price_per_kg : ((p.price / p.weight) * 1000)),
                backgroundColor: 'rgba(184, 134, 11, 0.7)',
                borderColor: '#B8860B',
                borderWidth: 2,
                borderRadius: 5,
            }]
        };

        if (priceChart) {
            priceChart.data = chartData;
            priceChart.update();
        } else {
            priceChart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    fetchProducts();
}

// Listen for the custom event from loader.js before running the product script
document.addEventListener('componentsLoaded', initializeProductSection);