import { useParams } from "react-router-dom";

function SingleOrderHistoric() {
    const { reference } = useParams();
    console.log(reference);
  return (
    <div>
        <h1>Single Order</h1>
    </div>
  )
}

export default SingleOrderHistoric