import { useParams } from "react-router-dom"

export default function ProductMain() {

    let params = useParams()

    return (
        <div>
            <h1>{'#' + params.id +'ProductInfo'}</h1>
        </div>
    )
}