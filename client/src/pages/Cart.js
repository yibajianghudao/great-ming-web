// Cart.js
import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import "./homepage.css"
import {Link} from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
        <div className="homeHeader">
            <h1>大明军团</h1>
            <div className="homeNav">
                <Link href="/src/pages/development">主页</Link>
                <Link href="/src/pages/development">日历</Link>
                <Link href="/src/pages/development">军饷</Link>
                <Link href="/src/pages/development">商城</Link>
                <Link href="/src/pages/development">成员</Link>
            </div>
            <div className="homeLogin">
                <a className="button" href="/src/pages/login">登录</a>
            </div>
        </div>
        <h2>Shopping Cart</h2>
      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name} - ${item.price}</span>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
