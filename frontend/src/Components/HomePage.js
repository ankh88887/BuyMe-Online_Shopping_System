import React, { useState, useEffect } from "react";
import ProductCell from "./ProductCell"
import style from "./HomePage.module.css"

export default function Home(props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const products = [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
    ]; // Example product data

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        );
    };
    
    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [currentIndex, isHovered]);

    return (
        <div>
            <div className={style.carousel} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <button className={style.carouselButton} onClick={prevSlide}>
                    &#9664;
                </button>
                <div className={style.carouselTrack}>
                    <ProductCell productID={products[currentIndex].id} />
                </div>
                <button className={style.carouselButton} onClick={nextSlide}>
                    &#9654;
                </button>
            </div>

            <div className={style.scrollContainer}>
                {products.map((product) => (
                    <ProductCell key={product.id} productID={product.id} />
                ))}
            </div>
        </div>
    )
}