document.addEventListener('DOMContentLoaded', () => {
    // --- Global Functions & Initializers ---

    const loadComponent = async (selector, url) => {
        try {
            const element = document.querySelector(selector);
            if (element) {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to load ${url}`);
                element.innerHTML = await response.text();
            }
        } catch (error) {
            console.error(`Error loading component: ${error.message}`);
        }
    };

    loadComponent('#header-placeholder', '/components/header.html');
    loadComponent('#footer-placeholder', '/components/footer.html')
        .then(() => {
            const yearSpan = document.getElementById('current-year');
            if(yearSpan) yearSpan.textContent = new Date().getFullYear();
        });

    if (document.getElementById('product-grid')) {
        initHomePage();
    }
});


// --- Home Page Specific Functions ---

async function initHomePage() {
    try {
        const response = await fetch('/assets/data/products.json');
        if (!response.ok) throw new Error('Product data not found.');
        const products = await response.json();
        
        setupFilters(products);
        renderProducts(products);
        renderPriceChart(products);

    } catch (error) {
        console.error(`Error initializing home page: ${error.message}`);
        document.getElementById('product-grid').innerHTML = `<p class="text-center text-red-500 col-span-full">Kon producten niet laden. Probeer het later opnieuw.</p>`;
    }
}

function renderProducts(products, filter = 'all') {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; 

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.type === filter);
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p class="text-center text-gray-500 col-span-full">Geen producten gevonden voor deze selectie.</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <span class="inline-block bg-brand-gold/20 text-brand-gold text-xs font-semibold px-2 py-1 rounded-full mb-2">${product.type}</span>
                <h3 class="text-2xl font-bold mb-2 text-brand-dark-brown">${product.name}</h3>
                <p class="text-gray-600 leading-relaxed">${product.description}</p>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function setupFilters(products) {
    const filtersContainer = document.getElementById('product-filters');
    const types = ['all', ...new Set(products.map(p => p.type))];

    types.forEach(type => {
        const button = document.createElement('button');
        button.className = 'filter-btn px-6 py-2 rounded-full shadow-md transition-colors';
        button.textContent = type === 'all' ? 'Alles' : type;
        button.dataset.filter = type;

        if (type === 'all') {
            button.classList.add('bg-brand-gold', 'text-white');
        } else {
            button.classList.add('bg-white', 'text-brand-gold');
        }

        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-brand-gold', 'text-white');
                btn.classList.add('bg-white', 'text-brand-gold');
            });
            button.classList.add('bg-brand-gold', 'text-white');
            button.classList.remove('bg-white', 'text-brand-gold');
            renderProducts(products, type);
        });

        filtersContainer.appendChild(button);
    });
}

function renderPriceChart(products) {
    const ctx = document.getElementById('priceChart');
    if (!ctx || typeof Chart === 'undefined') return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.name),
            datasets: [{
                label: 'Prijs per kg (€)',
                data: products.map(p => p.price_per_kg),
                backgroundColor: 'rgba(184, 134, 11, 0.6)',
                borderColor: 'rgba(184, 134, 11, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Prijs in Euro (€)' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `€ ${context.raw.toFixed(2)} per kg`
                    }
                }
            }
        }
    });
}