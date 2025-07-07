const API = "http://127.0.0.1:8000";

export const placeOrder = async (orderData, token) => {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(orderData),
  });
  return await res.json();
};

export const getMyOrders = async (token) => {
  const res = await fetch(`${API}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return await res.json();
};
