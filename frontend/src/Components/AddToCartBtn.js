import React, { useState } from "react"
import style from "./AddToCartBtn.module.css"

export default function AddToCartBtn({ productID }) {

    const [ quantity, setQuantity ] = useState(0);

    const Add = () => {
        setQuantity((quantity) => (quantity + 1));
    };

    const Subtract = () => {
        if (quantity === 0) 
            return;
        setQuantity((quantity) => (quantity - 1));
    };

    const AddToCart = () =>{
        alert(`Added ${quantity} items of Product ID: ${productID} to the cart!`);
    }

    return (
        <div style={{ display: "flex"}}>
            <button className={quantity === 0 ? style.BtnDisable : style.BtnAble} onClick={Subtract} disabled={quantity === 0}>⊖</button>
            <span className={style.Qty}>{quantity}</span>
            <button className={style.BtnAble} onClick={Add}>⊕</button>
            <button className={style.AddToCart} onClick={AddToCart} disabled={quantity === 0} >Add to Cart</button>
        </div>
    )
}
