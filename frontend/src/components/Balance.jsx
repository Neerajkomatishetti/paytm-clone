import axios from "axios";
import { useEffect, useState } from "react"


export default function Balance(){
    const [amount, setAmount] = useState(0);

    useEffect(() =>{
        axios.get("/api/v1/account/balance",{headers:{
            authorization: `Bearer ${localStorage.getItem('token')}`
        }})
        .then(response => {
            setAmount(response.data.balance);
        })
    },[])

    return(
        <div className="flex flex-row flex-start w-[97%] mt-4 h-10 border-1 items-center border-slate-100 shadow rounded-sm">
            <h2 className="font-bold text-lg ml-5">Your Balance</h2>
            <h2 className="ml-5">Rs/- {amount}</h2>
        </div>
    )
}