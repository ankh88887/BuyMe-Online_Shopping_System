import React, { useState, useEffect } from "react"
import ProductCell from "./ProductCell"
import style from "./HomePage.module.css"

export default function Home(props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [products, setProducts] = useState()

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:5005/api/products/`) // Backend API
            if (!response.ok) {
                throw new Error("Product not found")
            }
            const productData = await response.json();
            console.log("Product data fetched:", productData);
            setProducts(productData.products);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    useEffect(() => {
        console.log("Fetching products...");
        fetchProduct();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        )
    }

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide()
            }, 5000)

            return () => clearInterval(interval);
        }
    }, [currentIndex, isHovered, nextSlide]);

    if (!products) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div
                className={style.carousel}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button className={style.carouselButton} onClick={prevSlide}>
                    &#9664;
                </button>
                <div className={style.carouselTrack}>
                    <ProductCell productJSON={products[currentIndex]} />
                </div>
                <button className={style.carouselButton} onClick={nextSlide}>
                    &#9654;
                </button>
            </div>

            <div className={style.scrollContainer}>
                {products.map((productItem) => (
                    <ProductCell key={productItem.id} productJSON={productItem} />
                ))}
            </div>
        </div>
    )
}