import { getAllProducts } from "../api/products";

useEffect(() => {
  const load = async () => {
    const products = await getAllProducts();
    setProductList(products);
  };
  load();
}, []);
