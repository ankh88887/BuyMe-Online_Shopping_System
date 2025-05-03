import React, { useContext, useState } from "react"
import style from "./AddToCartBtn.module.css"
import {CartContext} from "./CartContext"

export default function AddToCartBtn({ productID }) {

    const {cartItems, setCartItems} = useContext(CartContext)
    let productIndexInCart = cartItems.findIndex((element)=>{
        return element.id === productID
    })
    let [numInCart,setNumInCart] = useState(
        (productIndexInCart===-1) ? 0 : cartItems[productIndexInCart].quantity
    )

    const Add = ()=>{

        if(productIndexInCart===-1)
        {
            setCartItems(
                [{
                    id : productID,
                    quantity:1
                },
                ...cartItems]
            )
        }
        else
        {
            let newCartArray = [...cartItems]
            newCartArray[productIndexInCart].quantity++
            setCartItems(newCartArray)
        }

        setNumInCart(numInCart+1)
    }

    const Subtract = ()=>{

        if(cartItems[productIndexInCart].quantity===1)
        {
            let newCartArray = [...cartItems]
            newCartArray.splice(productIndexInCart,1)
            setCartItems(newCartArray)
        }
        else
        {
            let newCartArray = [...cartItems]
            newCartArray[productIndexInCart].quantity--
            setCartItems(newCartArray)
        }

        setNumInCart(numInCart-1)
    }
    const updateCart = ()=>{
        let newCartArray = [...cartItems]
        alert(`Product ID: ${newCartArray[productIndexInCart].id} has ${newCartArray[productIndexInCart].quantity} in the cart!`);
    }

    return (
        <div style={{ display: "flex"}}>
            <button className={numInCart === 0 ? style.BtnDisable : style.BtnAble} onClick={Subtract} disabled={numInCart === 0}>⊖</button>
            <span className={style.Qty}>{numInCart}</span>
            <button className={style.BtnAble} onClick={Add}>⊕</button>
            <button className={style.AddToCart} onClick={updateCart} disabled={numInCart === 0} >Update Cart</button>
        </div>
    )
}
