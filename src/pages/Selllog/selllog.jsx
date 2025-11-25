import { useNavigate } from 'react-router-dom'
import './selllog.css'

const SellLog=()=>{
    const nav=useNavigate()
return <div className="sellg">
    <h1>Sell Smart, Earn Big — Start Your Online Store for Free!.</h1>
    <h3>Connect with millions of buyers and grow your brand.</h3>
    <h3>Become a Revoo seller and grow your business across India</h3>
    <button  onClick={()=>{nav('/sell')}}>Start Selling</button>
</div>
}
export default SellLog