document.addEventListener('DOMContentLoaded', () => 
{
    const addProductForm = document.getElementById('add_product_form');
    const adminProductListContainer = document.getElementById('admin_product_list');

    /* Display all products in admin view */
    async function displayAdminProducts() 
    {
        adminProductListContainer.innerHTML = '';
        const products = await getProducts();

        if (products.length === 0) 
        {
            adminProductListContainer.innerHTML = '<p style="text-align: center; color: #888;">No products found. Add one using the form above.</p>';
            return;
        }

        products.forEach(product => 
        {
            const productItem = document.createElement('div');
            productItem.className = 'admin-product-item';
            
            productItem.innerHTML = `
                <span class="product-name">${product.name}</span>
                <div class="product-controls">
                    <div class="quantity-controls">
                        <button class="quantity-change-btn" data-product-id="${product.id}" data-change="-1">-</button>
                        <span class="quantity-display">${product.quantity} in stock</span>
                        <button class="quantity-change-btn" data-product-id="${product.id}" data-change="1">+</button>
                    </div>
                    <button class="remove-product-btn" data-product-id="${product.id}">Remove</button>
                </div>
            `;
            adminProductListContainer.appendChild(productItem);
        });

        document.querySelectorAll('.quantity-change-btn').forEach(button => 
        {
            button.addEventListener('click', (e) => 
            {
                const productId = parseInt(e.target.dataset.productId);
                const change = parseInt(e.target.dataset.change);
                updateProductQuantity(productId, change);
            });
        });

        document.querySelectorAll('.remove-product-btn').forEach(button => 
        {
            button.addEventListener('click', (e) => 
            {
                const productId = parseInt(e.target.dataset.productId);
                removeProduct(productId);
            });
        });
    }

    /* Handle adding new product */
    async function handleAddProduct(event) 
    {
        event.preventDefault();
        const products = await getProducts();

        const newProduct = 
        {
            id: Date.now(),
            name: document.getElementById('product_name').value,
            price: parseFloat(document.getElementById('product_price').value),
            quantity: parseInt(document.getElementById('product_quantity').value, 10),
            scent: document.getElementById('product_scent').value,
            description: "A beautifully crafted candle, perfect for any occasion.",
            image: 
            {
                [document.getElementById('product_color_name_1').value.toLowerCase() || 'default']: document.getElementById('product_image_url_1').value
            },
            colors: [ document.getElementById('product_color_1').value || '#FFFFFF' ]
        };

        const colorName2 = document.getElementById('product_color_name_2').value;
        if (colorName2) 
        {
            newProduct.image[colorName2.toLowerCase()] = document.getElementById('product_image_url_2').value;
            newProduct.colors.push(document.getElementById('product_color_2').value);
        }

        products.push(newProduct);
        saveProducts(products);
        
        addProductForm.reset();
        await displayAdminProducts();
        alert('Product added successfully!');
    }

    /* Update product quantity */
    async function updateProductQuantity(productId, change) 
    {
        const products = await getProducts();
        const productToUpdate = products.find(p => p.id === productId);

        if (productToUpdate) 
        {
            productToUpdate.quantity += change;
            if (productToUpdate.quantity < 0) 
            {
                productToUpdate.quantity = 0;
            }
            saveProducts(products);
            await displayAdminProducts();
        }
    }

    /* Remove product */
    async function removeProduct(productId) 
    {
        if (!confirm("Are you sure you want to remove this product?")) 
        {
            return;
        }
        let products = await getProducts();
        const updatedProducts = products.filter(product => product.id !== productId);
        saveProducts(updatedProducts);
        await displayAdminProducts();
    }

    addProductForm.addEventListener('submit', handleAddProduct);
    displayAdminProducts();
});