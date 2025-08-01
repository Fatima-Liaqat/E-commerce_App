/* Save products array to local storage */
function saveProducts(products) 
{
    localStorage.setItem('products', JSON.stringify(products));
}

/* Get all products from local storage or fetch initial data */
async function getProducts() 
{
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) 
    {
        return JSON.parse(storedProducts);
    }

    try 
    {
        console.log("Local storage is empty. Fetching initial data from products.json...");
        
        const response = await fetch('./products.json'); 
        
        if (!response.ok) 
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const initialProducts = await response.json();
        console.log("Successfully fetched initial products:", initialProducts);
        
        saveProducts(initialProducts);
        
        return initialProducts;

    } 
    catch (error) 
    {
        console.error("FATAL: Could not fetch initial products.json file. Please ensure it exists and the path is correct.", error);
        return [];
    }
}