import { useParams } from "react-router-dom"

export default function Search() {

    let params = useParams()

    return (
        <div>
            <h1>{'#' + params.id + 'ProductInfo'}</h1>
        </div>
    )
}