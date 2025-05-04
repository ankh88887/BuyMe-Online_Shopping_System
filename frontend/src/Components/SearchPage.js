import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SearchProductCell from "./SearchProductCell"
import style from "./SearchPage.module.css"

export default function Search() {
    const { keywords } = useParams();
    const [product, setProduct] = useState(null);
    const [filteredProduct, setFilteredProduct] = useState(null);
    const [minPriceLimit, setMinPriceLimit] = useState(0);
    const [maxPriceLimit, setMaxPriceLimit] = useState(100);

    // Fetch product data from backend
    const fetchProduct = async (productKeywords) => {
        try {
            console.log("Fetching products with keywords:", productKeywords);
            const response = await fetch(`http://localhost:5005/api/products/search/${productKeywords}`);
            if (!response.ok) {
                throw new Error("Product not found");
            }
            const productData = await response.json();
            console.log("Product data fetched:",productData);
            setProduct(productData.products);
            setFilteredProduct(productData.products);
        } catch (error) {
            console.error("Error fetching product:", error);
            setProduct([]); // Set to empty array if no product found
        }
    }

    useEffect(() => {
        console.log("useEffect triggered with keywords:", keywords);
        fetchProduct(keywords);
    }, [keywords]);

    if (!product) {
        return <p>Loading...</p>
    }

    const handleMinPriceLimit = (event) => {
        setMinPriceLimit(event.target.value);
    }

    const handleMaxPriceLimit = (event) => {
        setMaxPriceLimit(event.target.value);
    }

    const filterProduct = () => {
        const filtered = product.filter(
            (productItem) =>
                productItem.price >= minPriceLimit && productItem.price <= maxPriceLimit
        );
        setFilteredProduct(filtered);
    };

    return (
        <div>
            <h1 className={style.NoOfResults}>{product.length} search results for "{keywords}"</h1>
            {product.length ? (
                <div>
                    <h2 className={style.Flter}>
                        Filter price range between:
                        <input
                            type="number"
                            placeholder="min"
                            className={style.textBox}
                            min="0"
                            max={maxPriceLimit}
                            value={minPriceLimit}
                            onChange={handleMinPriceLimit}
                            style={{ width: "120px" }}
                            key="minPriceLimit"
                        />
                        ~
                        <input
                            type="number"
                            placeholder="max"
                            className={style.textBox}
                            min={minPriceLimit}
                            value={maxPriceLimit}
                            onChange={handleMaxPriceLimit}
                            style={{ width: "120px" }}
                            key="maxPriceLimit"
                        />
                        <button className={style.FilterButton} onClick={filterProduct}>
                            Confirm
                        </button>
                    </h2>

                    <div className={style.scrollContainer}>
                        {filteredProduct.map((productItem) => (
                            <SearchProductCell key={productItem.id} productJSON={productItem} />
                        ))}
                    </div>
                </div>
            ) : (
                <h2 style={{ textAlign: "center", marginTop: "20px" }}>
                    Try another keyword or check your spelling.
                </h2>
            )}
        </div>
    )
}