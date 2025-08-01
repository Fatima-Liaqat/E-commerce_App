document.addEventListener('DOMContentLoaded', () => 
{
    // --- All page elements ---
    const overlay = document.getElementById('overlay');
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart_sidebar');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartItemsContainer = document.getElementById('cart_items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart_total');
    const checkoutBtn = document.getElementById('checkout_btn');
    const productDetailContainer = document.getElementById('product_detail_container');
    
    // Load cart from browser storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Core functions to open/close cart ---
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
    
    // --- Main function to load and display the product ---
    function loadAndDisplayProduct() 
    {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));

        if (!productId) 
        {
            productDetailContainer.innerHTML = '<p>Sorry, product not found.</p>';
            return;
        }

        fetch('products.json')
            .then(res => res.json())
            .then(products => 
            {
                const product = products.find(p => p.id === productId);
                if (product) 
                {
                    displayProductDetails(product);
                } 
                else 
                {
                    productDetailContainer.innerHTML = '<p>Sorry, that product could not be found.</p>';
                }
            })
            .catch(err => 
            {
                console.error("Failed to load product details:", err);
                productDetailContainer.innerHTML = '<p>Error loading product. Please try again later.</p>';
            });
    }

    function displayProductDetails(product) 
    {
        document.title = product.name;
        let selectedColorKey = Object.keys(product.image)[0];

        productDetailContainer.innerHTML = `
            <div class="product-gallery">
                <img id="main_product_image" src="${product.image[selectedColorKey]}" alt="${product.name}">
            </div>
            <div class="product-details">
                <h1 class="product-title">${product.name}</h1>
                <p class="product-scent">Scent: ${product.scent}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <div class="color-selector"></div>
                <div class="quantity-selector">
                    <button id="decrease_quantity">-</button>
                    <span id="quantity">1</span>
                    <button id="increase_quantity">+</button>
                </div>
                <button id="add_to_cart_btn" class="add-to-cart-btn">Add to Cart</button>
            </div>
        `;

        const mainImage = document.getElementById('main_product_image');
        const colorSelector = productDetailContainer.querySelector('.color-selector');
        
        Object.keys(product.image).forEach((colorKey, index) => 
        {
            const swatch = document.createElement('span');
            swatch.className = 'color-box';
            swatch.style.backgroundColor = product.colors[index];
            if (index === 0) swatch.classList.add('selected');
            
            swatch.addEventListener('click', () => 
            {
                mainImage.src = product.image[colorKey];
                selectedColorKey = colorKey;
                document.querySelectorAll('.color-box').forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
            });
            colorSelector.appendChild(swatch);
        });

        const quantitySpan = document.getElementById('quantity');
        document.getElementById('increase_quantity').addEventListener('click', () => 
        {
            quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
        });
        document.getElementById('decrease_quantity').addEventListener('click', () => 
        {
            const currentQuantity = parseInt(quantitySpan.textContent);
            if (currentQuantity > 1) 
            {
                quantitySpan.textContent = currentQuantity - 1;
            }
        });
        
        document.getElementById('add_to_cart_btn').addEventListener('click', (e) => 
        {
            const quantity = parseInt(quantitySpan.textContent);
            addToCart(product, quantity, selectedColorKey);
            
            e.target.textContent = 'Added!';
            openCart(); 
            setTimeout(() => 
            {
                e.target.textContent = 'Add to Cart';
            }, 1500);
        });
    }

    // --- Cart Management Functions ---
    function addToCart(productToAdd, quantity, color) {
        const existingItem = cart.find(item => item.id === productToAdd.id && item.color === color);
        if (existingItem) 
        {
            existingItem.quantity += quantity;
        } 
        else 
        {
            cart.push({ ...productToAdd, quantity: quantity, color: color });
        }
        updateCart();
    }
    
    // --- UpdateCart FUNCTION ---
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

    // --- Event Listeners ---
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', () => 
    { 
        if (cart.length > 0) window.location.href = 'checkout.html'; 
    });

    // This single listener handles all clicks inside the cart.
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

    // --- Initial Page Load ---
    loadAndDisplayProduct();
    updateCart();
});