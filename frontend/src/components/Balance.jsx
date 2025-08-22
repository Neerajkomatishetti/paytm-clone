import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
const Dev_Path = import.meta.env.VITE_Local_Prefix || "";



export default function Balance(){
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() =>{
        axios.get(Dev_Path + "/api/v1/account/balance",{headers:{
            authorization: `Bearer ${localStorage.getItem('token')}`
        }})
        .then(response => {
            setAmount(response.data.balance);
        })
    },[])

    return(
        <div className="flex flex-row flex-start w-[97%] mt-4 h-10 border-1 justify-between items-center border-slate-100 shadow rounded-sm">
            <div className="flex flex-row items-center">
                <h2 className="font-bold text-lg ml-5">Your Balance</h2>
                <h2 className="ml-5">Rs/- {amount}</h2>
            </div>
            <button className="bg-[#2b2a2a] shadow shadow-gray-400 rounded-xl  font-light text-[12px] mr-2 px-2 py-1 text-white" onClick={()=>{
                navigate('/history');
            }}>History</button>
        </div>
    )
}