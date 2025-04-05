import ProductCell from "./ProductCell"
import style from './HomePage.module.css'

export default function Home(props) {
    return (
        <div>
            <div>
                Carousel of top rated products
            </div>

            <div className={style.scrollContainer}>
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
                <ProductCell productID="1" />
            </div>
        </div>
    )
}