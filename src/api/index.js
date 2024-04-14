const API_URL = 'https://localhost:7101/api';
// const API_URL = 'https://alicerestaurant.azurewebsites.net/api';

//Restaurant
export const getAllRestaurants = async () => {
    const response = await fetch(`${API_URL}/restaurants`);
    return response.json();
};

export const getByRestaurantId = async (restaurantId) => {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}`);
    return response.json();
};

export const getCurrentMenu = async (restaurantId, type) => {
    const response = (type === "DineIn") ? 
        await fetch(`${API_URL}/Restaurants/${restaurantId}/dishes?dineIn=${type}`) 
        : await fetch(`${API_URL}/Restaurants/${restaurantId}/dishes?delivery=${type}`);
    return response.json();
};

export const getDishesByRestaurantId = async (restaurantId) => {
    const response = await fetch(`${API_URL}/Restaurants/${restaurantId}/dishes`);
    return response.json();
}

export const getDeliveryMenu = async (restaurantId, type, categoryId) => {
    let base_url = `${API_URL}/dishes`;
    const queryParams = [];
    if (restaurantId) {
        queryParams.push(`restaurantId=${restaurantId}`);
    }
    if (type) {
        queryParams.push(`deliveryType=${type}`);
    }
    if (categoryId) {
        queryParams.push(`deliveryCatId=${categoryId}`);
    }

    if (queryParams.length > 0) {
        base_url += `?${queryParams.join("&")}`;
    }
    const response = await fetch(base_url);
    return response.json();
}

export const getPOSMenu = async (restaurantId, type, categoryId) => {
    let base_url = `${API_URL}/dishes`;
    const queryParams = [];
    if(restaurantId) {
        queryParams.push(`restaurantId=${restaurantId}`);
    }
    if(type) {
        queryParams.push(`dineInType=${type}`);
    }
    if(categoryId) {
        queryParams.push(`dineInCatId=${categoryId}`);
    }

    if(queryParams.length > 0) {
        base_url += `?${queryParams.join("&")}`;
    }
    const response = await fetch(base_url);
    return response.json();
}

export const addNewRestaurant = async (restaurant) => {
    const response = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurant),
    });
    return response.json();
};

export const updateRestaurant = async (restaurantId, restaurantData) => {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantData),
    });
    return response.json();
};

export const deleteRestaurant = async (restaurantId) => {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}`, { method: 'DELETE' });
    return response.json();
};

//Dropdowns
export const getAllDropdowns = async () => {
    const response = await fetch(`${API_URL}/dropdowns`);
    return response.json();
};

export const getDropdownByModuleAndType = async (module, type) => {
    const response = await fetch(`${API_URL}/dropdowns?module=${module}&type=${type}&activeStatus=true`);
    return response.json();
};

export const getByDropdownId = async (dropdownId) => {
    const response = await fetch(`${API_URL}/dropdowns/${dropdownId}`);
    return response.json();
};

export const addNewDropdown = async (dropdown) => {
    const response = await fetch(`${API_URL}/dropdowns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dropdown),
    });
    return response.json();
};

export const updateDropdown = async (dropdownId, dropdownData) => {
    const response = await fetch(`${API_URL}/dropdowns/${dropdownId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dropdownData),
    });
    return response.json();
};

export const deleteDropdown = async (dropdownId) => {
    const response = await fetch(`${API_URL}/dropdowns/${dropdownId}`, { method: 'DELETE' });
    return response.json();
};

//Dishes
export const getAllDishes = async () => {
    const response = await fetch(`${API_URL}/dishes`);
    return response.json();
};

export const getAllDishesByRestaurantId = async (restaurantId) => {
    const response = await fetch(`${API_URL}/dishes?restaurantId=${restaurantId}`);
    return response.json();
};

export const getByDishId = async (dishId) => {
    const response = await fetch(`${API_URL}/dishes?${dishId}`);
    return response.json();
};

export const addNewDish = async (dish) => {
    const response = await fetch(`${API_URL}/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish),
    });
    return response.json();
};

export const updateDish = async (dishId, dishData) => {
    const response = await fetch(`${API_URL}/dishes/${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishData),
    });
    return response.json();
};

export const deleteDish = async (dishId) => {
    const response = await fetch(`${API_URL}/dishes/${dishId}`, { method: 'DELETE' });
    return response.json();
};

//DineInCategory
export const getAllDineInCategories = async () => {
    const response = await fetch(`${API_URL}/dinein-categories`);
    return response.json();
}

export const getByDineInCategoryId = async (dineInCategoryId) => {
    const response = await fetch(`${API_URL}/dinein-categories/${dineInCategoryId}`);
    return response.json();
}

export const addNewDineInCategory = async (dineInCategory) => {
    const response = await fetch(`${API_URL}/dinein-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dineInCategory),
    });
    return response.json();
}

export const updateDineInCategory = async (dineInCategoryId, dineInCategoryData) => {
    const response = await fetch(`${API_URL}/dinein-categories/${dineInCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dineInCategoryData),
    });
    return response.json();
}

export const deleteDineInCategory = async (dineInCategoryId) => {
    const response = await fetch(`${API_URL}/dinein-categories/${dineInCategoryId}`, { method: 'DELETE' });
    return response.json();
}

//DeliveryCategory
export const getAllDeliveryCategories = async () => {
    const response = await fetch(`${API_URL}/delivery-categories`);
    return response.json();
}

export const getByDeliveryCategoryId = async (deliveryCategoryId) => {
    const response = await fetch(`${API_URL}/delivery-categories/${deliveryCategoryId}`);
    return response.json();
}

export const addNewDeliveryCategory = async (deliveryCategory) => {
    const response = await fetch(`${API_URL}/delivery-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryCategory),
    });
    return response.json();
}

export const updateDeliveryCategory = async (deliveryCategoryId, deliveryCategoryData) => {
    const response = await fetch(`${API_URL}/delivery-categories/${deliveryCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryCategoryData),
    });
    return response.json();
}

export const deleteDeliveryCategory = async (deliveryCategoryId) => {
    const response = await fetch(`${API_URL}/delivery-categories/${deliveryCategoryId}`, { method: 'DELETE' });
    return response.json();
}
