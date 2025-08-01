document.addEventListener('DOMContentLoaded', () => 
{
    const checkoutItemsList = document.getElementById('checkout_items_list');
    const checkoutTotal = document.getElementById('checkout_total');
    const checkoutForm = document.getElementById('checkout_form');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    /* Render checkout items and calculate total */
    function renderCheckout() 
    {
        if (cart.length === 0) 
        {
            alert("Your cart is empty. Redirecting to the shop.");
            window.location.href = 'index.html';
            return;
        }

        checkoutItemsList.innerHTML = '';
        let total = 0;

        cart.forEach(item => 
        {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const checkoutItemDiv = document.createElement('div');
            checkoutItemDiv.classList.add('checkout-item');
            checkoutItemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            checkoutItemsList.appendChild(checkoutItemDiv);
        });

        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }

    /* Handle order submission */
    checkoutForm.addEventListener('submit', (e) => 
    {
        e.preventDefault();
        
        alert('Thank you for your order! Your items will be shipped soon.');

        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });

    renderCheckout();
});