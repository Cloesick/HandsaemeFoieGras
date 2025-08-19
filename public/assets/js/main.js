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

    function createFilterButtons() {
        const types = ['all', ...new Set(allProducts.map(p => p.type))];
        productFilters.innerHTML = types.map(type => `
            <button class="filter-btn px-4 py-2 rounded-full shadow transition-colors duration-300 ${type === 'all' ? 'bg-brand-gold text-white' : 'bg-white text-brand-gold'}" data-filter="${type}">
                ${type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
        `).join('');
    }
    
    function renderProducts(filter = 'all') {
        const filteredProducts = filter === 'all' ? allProducts : allProducts.filter(p => p.type === filter);
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
    
    function addFilterEventListeners() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('bg-brand-gold', 'text-white'));
                filterBtns.forEach(b => b.classList.add('bg-white', 'text-brand-gold'));
                btn.classList.add('bg-brand-gold', 'text-white');
                btn.classList.remove('bg-white');
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
