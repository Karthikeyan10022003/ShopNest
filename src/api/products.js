const API = "http://127.0.0.1:8000/products";

export const getAllProducts = async () => {
  const res = await fetch(API);
  return await res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(`${API}/${id}`);
  return await res.json();
};

export const addProduct = async (product, token) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product),
  });
  return await res.json();
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return await res.json();
};
