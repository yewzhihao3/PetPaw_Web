import { API_URL } from "./config";

export const fetchOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.detail || "Unknown error"
        }`
      );
    }
    const data = await response.json();
    const pendingOrders = data.filter((order) => order.status === "PENDING");
    return pendingOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const fetchAllOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.detail || "Unknown error"
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

export const fetchProducts = async (token) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch products: ${errorData.detail || "Unknown error"}`
      );
    }
    const data = await response.json();
    console.log("Fetched products:", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchCategories = async (token) => {
  try {
    const response = await fetch(`${API_URL}/sanity/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const handleOrderAction = async (orderId, action, token) => {
  try {
    let endpoint;
    if (action === "accept") {
      endpoint = `${API_URL}/orders/${orderId}/accept_by_shop`;
    } else if (action === "decline") {
      endpoint = `${API_URL}/orders/${orderId}/decline`;
    } else {
      throw new Error("Invalid action");
    }

    console.log(`Sending ${action} request for order ${orderId}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Server responded with status ${response.status}:`, data);
      throw new Error(data.detail || `Failed to ${action} order`);
    }

    console.log(`Order ${orderId} ${action} successful:`, data);
    return data;
  } catch (error) {
    console.error(`Error ${action}ing order ${orderId}:`, error);
    throw error;
  }
};
