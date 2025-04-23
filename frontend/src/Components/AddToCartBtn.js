import React, { useState } from "react"
import style from "./AddToCartBtn.module.css"

export default function AddToCartBtn({ productID }) {

    const [ quantity, setQuantity ] = useState(0);

    const Add = () => {
        setQuantity((quantity) => (quantity + 1));
    };

    const Subtract = () => {
        setQuantity((quantity) =>
            quantity === 0 ? 0 : quantity - 1
        );
    };

    const AddToCart = () =>{
        console.log("Product ID: " + productID + " added to cart with quantity: " + quantity)
    }

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <span className={style.BtnAble} onClick={Subtract}>⊖</span>
            <span className={style.Qty}>{quantity}</span>
            <span className={style.BtnAble} onClick={Add}>⊕</span>
            <button className={style.AddToCart} onClick={AddToCart}>Add to Cart</button>
        </div>
    )
}
