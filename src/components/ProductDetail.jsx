// ProductDetail.js
import React from 'react';
import { Card, CardContent, Button } from './ui';

const ProductDetail = ({ product, onClose }) => {
  return (
    <Card>
      <CardContent>
        <button onClick={onClose} className="text-gray-500">Close</button>
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        <p className="text-lg font-semibold">${product.price}</p>
        <p>{product.description}</p>
        <Button onClick={() => alert('Added to cart!')}>Add to Cart</Button>
      </CardContent>
    </Card>
  );
};

export default ProductDetail;
