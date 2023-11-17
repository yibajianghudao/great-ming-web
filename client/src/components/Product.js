// Product.js
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const Product = ({ id, name, price, imageUrl }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div>
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
      <p>${price}</p>
      <button onClick={() => addToCart({ id, name, price })}>Add to Cart</button>
    </div>
  );
};

export default Product;
