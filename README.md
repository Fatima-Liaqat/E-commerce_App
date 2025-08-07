# E-commerce Frontend with Admin Panel

A comprehensive front-end simulation of a single-page e-commerce application. This project features both a customer-facing storefront and a protected admin panel for managing products and inventory. The application is designed to provide a seamless experience for both shoppers and administrators without any page reloads.

# [#E-commerce_App](https://fatima-liaqat.github.io/E-commerce_App/)

### Key Features

#### For Customers:
*   **Dynamic Product Catalog:** Products are loaded dynamically from a local JSON file.
*   **Detailed Product View:** Users can click on a product to see more information.
*   **Interactive Shopping Cart:** Full cart functionality, including adding products, adjusting quantities, and viewing a running total.
*   **State Persistence:** The shopping cart's state is saved to `localStorage`, so items are not lost when the user closes or reloads the page.
*   **Simulated Checkout:** A simple checkout process to complete the user journey.

#### For Administrators:
*   **Admin Product Management:** A separate admin view allows for adding new products, editing existing product details (like name and price), and removing them from the store.
*   **Stock Control:** Administrators can update the stock levels for each product to simulate real-world inventory management.
*   **Centralized Data:** All changes made in the admin panel are reflected in the local JSON data, immediately updating the customer-facing storefront.

### Technologies Used

*   HTML5
*   CSS3
*   JavaScript (ES6)
*   JSON
*   `localStorage` API
