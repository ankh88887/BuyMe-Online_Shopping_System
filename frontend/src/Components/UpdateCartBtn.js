import React, { useContext, useState } from "react"
import style from "./UpdateCartBtn.module.css"
import { CartContext } from "./CartContext"

export default function UpdateCartBtn({ productID, stock }) {

    const { cartItems, setCartItems } = useContext(CartContext)
    const productIndexInCart = cartItems.findIndex((element) => {
        return element.id === productID
    })
    let numInCart = productIndexInCart === -1 ? 0 : cartItems[productIndexInCart].quantity;

    const Add = () => {
        if (productIndexInCart === -1) {
            setCartItems([
                { id: productID, quantity: 1 },
                ...cartItems,
            ]);
        } else {
            const newCartArray = [...cartItems]
            newCartArray[productIndexInCart].quantity++
            setCartItems(newCartArray)
        }
        numInCart++
    };

    const Subtract = () => {
        if (cartItems[productIndexInCart].quantity === 1) {
            const newCartArray = [...cartItems]
            newCartArray.splice(productIndexInCart, 1)
            setCartItems(newCartArray)
        } else {
            const newCartArray = [...cartItems]
            newCartArray[productIndexInCart].quantity--
            setCartItems(newCartArray)
        }
        numInCart--
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <p style={{ margin: 0 }}>Quantity in your shopping cart: </p>
            <button
                className={numInCart === 0 ? style.BtnDisable : style.BtnAble}
                onClick={Subtract}
                disabled={numInCart === 0}
            >
                ⊖
            </button>
            <span className={style.Qty}>{numInCart}</span>
            <button
                className={numInCart >= stock ? style.BtnDisable : style.BtnAble}
                onClick={Add}
                disabled={numInCart >= stock}
            >
                ⊕
            </button>
        </div>
    );
}