import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ProductData() {
    const { id } = useParams() // Get productID from URL params
    const [product, setProduct] = useState(null)

    // Fetch product data from backend
    const fetchProduct = async (productID) => {
        try {
            const response = await fetch(`http://localhost:5000/api/product/${productID}`) // Backend API
            if (!response.ok) {
                throw new Error('Product not found')
            }
            const productData = await response.json()
            setProduct(productData) // Update state with product data
        } catch (error) {
            console.error('Error fetching product:', error)
        }
    }

    useEffect(() => {
        fetchProduct(id) // Fetch product when component mounts
    }, [id])

    if (!product) {
        return <p>Loading...</p> // Show loading message while fetching
    }

    return (
        <div>
            call product data!
        </div>
    )
}