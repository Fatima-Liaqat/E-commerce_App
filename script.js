document.addEventListener('DOMContentLoaded', async () => 
{
    // --- Element Selectors ---
    const productContainer = document.getElementById('product_container');
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart_sidebar');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartItemsContainer = document.getElementById('cart_items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart_total');
    const checkoutBtn = document.getElementById('checkout_btn');
    const overlay = document.getElementById('overlay');
    const searchInput = document.querySelector('.search_bar input');

    // --- Global Data Holders ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let allProducts = [];

    // --- Core functions to open/close cart (with overlay) ---
    function openCart() 
    {
        cartSidebar.style.width = '350px';
        overlay.classList.add('active');
        document.body.classList.add('noscroll');
    }

    function closeCart() 
    {
        cartSidebar.style.width = '0';
        overlay.classList.remove('active');
        document.body.classList.remove('noscroll');
    }

    // --- Display products on the home page ---
    function displayProducts(productsToDisplay) 
    {
        productContainer.innerHTML = '';
        if (productsToDisplay.length === 0) 
        {
            productContainer.innerHTML = '<p class="no-results-message">No products match your search.</p>';
            return;
        }
        productsToDisplay.forEach(product => 
        {
            const productDiv = document.createElement('div');
            productDiv.classList.add("product");
            const defaultColorKey = Object.keys(product.image)[0];
            const imgElement = document.createElement('img');
            imgElement.src = product.image[defaultColorKey];
            imgElement.alt = product.name;
            const name = document.createElement('h3');
            name.textContent = product.name;
            const price = document.createElement('p');
            price.textContent = `$${product.price.toFixed(2)}`;
            const colorContainer = document.createElement('div');
            colorContainer.className = 'color-container';
            product.colors.forEach((color, index) => 
            {
                const swatch = document.createElement('span');
                swatch.classList.add('color-box');
                swatch.style.backgroundColor = color;
                const colorKey = Object.keys(product.image)[index];
                if (index === 0) swatch.classList.add('selected');
                swatch.addEventListener('click', (e) => 
                {
                    e.stopPropagation();
                    imgElement.src = product.image[colorKey];
                    const siblings = swatch.parentElement.querySelectorAll('.color-box');
                    siblings.forEach(sib => sib.classList.remove('selected'));
                    swatch.classList.add('selected');
                });
                colorContainer.appendChild(swatch);
            });
            const detailsBtn = document.createElement('a');
            detailsBtn.textContent = 'View Details';
            detailsBtn.classList.add('details-btn');
            detailsBtn.href = `product.html?id=${product.id}`;
            const infoWrapper = document.createElement('div');
            infoWrapper.className = 'product-info-wrapper';
            infoWrapper.appendChild(name);
            infoWrapper.appendChild(price);
            infoWrapper.appendChild(colorContainer);
            productDiv.appendChild(imgElement);
            productDiv.appendChild(infoWrapper);
            productDiv.appendChild(detailsBtn);
            imgElement.addEventListener('click', () => 
            {
                window.location.href = `product.html?id=${product.id}`;
            });
            productContainer.appendChild(productDiv);
        });
    }

    // --- Search Handler Function ---
    function handleSearch(event) 
    {
        const searchTerm = event.target.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.scent.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    }

    // --- Cart Management Functions (DEFINITIVE FIX) ---
    function updateCart() 
    {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) 
        {
            cartItemsContainer.innerHTML = '<p class="cart-empty-text">Your cart is empty.</p>';
        } 
        else 
        {
            cart.forEach(item => 
            {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                
                const imageUrl = item.image[item.color];
                const colorName = item.color.charAt(0).toUpperCase() + item.color.slice(1);
                
                cartItemDiv.innerHTML = `
                    <a href="product.html?id=${item.id}" class="cart-item-link">
                        <img src="${imageUrl}" alt="${item.name}">
                        <div class="cart-item-info">
                            <p><b>${item.name}</b></p>
                            <p class="cart-item-color">Color: ${colorName}</p>
                            <div class="cart-quantity-controls">
                                <button class="change-quantity" data-product-id="${item.id}" data-color="${item.color}" data-change="-1">-</button>
                                <span>${item.quantity}</span>
                                <button class="change-quantity" data-product-id="${item.id}" data-color="${item.color}" data-change="1">+</button>
                            </div>
                        </div>
                    </a>
                    <div class="cart-item-details">
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-from-cart-btn" data-product-id="${item.id}" data-color="${item.color}" title="Remove item">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path><path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path></svg>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);

                total += item.price * item.quantity;
                count += item.quantity;
            });
        }
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = count;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    
    function removeCartItem(productId, color) 
    {
        cart = cart.filter(item => !(item.id === productId && item.color === color));
        updateCart(); 
    }

    
    function changeCartQuantity(productId, color, change) 
    {
        const cartItem = cart.find(item => item.id === productId && item.color === color);
        if (cartItem) 
        {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) 
            {
                
                removeCartItem(productId, color);
            } 
            else 
            {
                updateCart(); 
            }
        }
    }
    
    // --- Initial Page Load ---
    async function initializeShop() 
    {
        allProducts = await getProducts();
        displayProducts(allProducts);
        updateCart();
    }

    // --- EVENT LISTENERS ---
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', () => { if (cart.length > 0) window.location.href = 'checkout.html'; });
    searchInput.addEventListener('input', handleSearch);

    
    cartItemsContainer.addEventListener('click', (e) => 
    {
        const target = e.target;

        
        const quantityBtn = target.closest('.change-quantity');
        if (quantityBtn) 
        {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(quantityBtn.dataset.productId);
            const color = quantityBtn.dataset.color;
            const change = parseInt(quantityBtn.dataset.change);
            changeCartQuantity(productId, color, change);
            return; 
        }

        
        const removeBtn = target.closest('.remove-from-cart-btn');
        if (removeBtn) 
        {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(removeBtn.dataset.productId);
            const color = removeBtn.dataset.color;
            removeCartItem(productId, color);
            return; 
        }
    });
    
    // Kick off the entire process.
    initializeShop();
});