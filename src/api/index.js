const API_URL = 'http://localhost:5074/api'; // replace with your API base URL
// const API_URL = 'http://alicestore.runasp.net/api'; // replace with your API base URL

export const getAllRestaurants = async () => {
    const response = await fetch(`${API_URL}/Restaurant/GetRestaurants`);
    return response.json();
};

export const getCurrentMenu = async (restaurantId, menuId) => {
    const response = await fetch(`${API_URL}/getCurrentMenu?restaurantId=${restaurantId}&menuId=${menuId}`);
    return response.json();
};

export const getDish = async (dishId) => {
    const response = await fetch(`${API_URL}/getDish?dishId=${dishId}`);
    return response.json();
};

export const deleteDish = async (dishId) => {
    const response = await fetch(`${API_URL}/deleteDish?dishId=${dishId}`, { method: 'DELETE' });
    return response.json();
};

export const updateDish = async (dishId, dishData) => {
    const response = await fetch(`${API_URL}/updateDish?dishId=${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishData),
    });
    return response.json();
};

export const updateMenu = async (restaurantId, menuId, menuData) => {
    const response = await fetch(`${API_URL}/updateMenu?restaurantId=${restaurantId}&menuId=${menuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
    });
    return response.json();
};

export const addNewDish = async (dish) => {
    const response = await fetch(`${API_URL}/addNewDish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish),
    });

    if (!response.ok) {
        throw new Error('Failed to add new dish');
    }

    return response.json();
};