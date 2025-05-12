import { useContext, useState, useEffect } from "react"
import { CurrentLoginUser } from "./CurrentLoginUser";
import ProductCell from "./ProductCell"
import style from "./HomePage.module.css"

export default function Home(props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [products, setProducts] = useState()
    const { currentUser } = useContext(CurrentLoginUser);
    var maxProductInCarousel = 3;


    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:5005/api/products/`) // Backend API
            if (!response.ok) {
                throw new Error("Product not found")
            }
            const productData = await response.json();
            const sortedProducts = productData.products.sort((a, b) => {
                const avgRatingA = a.rateCount > 0 ? a.totalRate / a.rateCount : 0;
                const avgRatingB = b.rateCount > 0 ? b.totalRate / b.rateCount : 0;
                return avgRatingB - avgRatingA; 
            });
            setProducts(sortedProducts);
            maxProductInCarousel = Math.min(sortedProducts.length, maxProductInCarousel);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((currentIndex) => (currentIndex + 1) % maxProductInCarousel);
    }

    const prevSlide = () => {
        setCurrentIndex((currentIndex) =>
            currentIndex === 0 ? maxProductInCarousel - 1 : currentIndex - 1
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
            <h1 className={style.HomeName} >Hello {currentUser.userName}! Welcome to BuyMe!</h1>
            <div
                className={style.carousel}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button className={style.carouselButton} onClick={prevSlide}>
                    &#9664;
                </button>
                <div className={style.carouselTrack} >
                    <ProductCell productJSON={products[currentIndex]} />
                </div>
                <button className={style.carouselButton} onClick={nextSlide}>
                    &#9654;
                </button>
            </div>

            <div className={style.scrollContainer}>
                {products.map((productItem) => (
                    <ProductCell key={productItem.productID} productJSON={productItem} />
                ))}
            </div>
        </div>
    )
}