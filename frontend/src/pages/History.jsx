import Appbar from "../components/Appbar.jsx"
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Dev_Path = import.meta.env.VITE_Local_Prefix || "";

// const paymentlogs = [{
//     username: "Neeraj",
//     Amount: 500,
//     paymentmode: "Paid"
//   },
//   {
//     username: "Ravi",
//     Amount: 200,
//     paymentmode: "Received"
//   },
//   {
//     username: "Aisha",
//     Amount: 750,
//     paymentmode: "Paid"
//   },
//   {
//     username: "Karan",
//     Amount: 300,
//     paymentmode: "Received"
//   },
//   {
//     username: "Meena",
//     Amount: 1000,
//     paymentmode: "Paid"
//   },
//   {
//     username: "Tariq",
//     Amount: 150,
//     paymentmode: "Received"
//   }
// ];

export default function History() {

    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get(Dev_Path + "/api/v1/account/history",{headers:{
            authorization:`Bearer ${localStorage.getItem('token')}`
        }}).then(response =>{
            setTransactions(response.data.transactions)
        })
    },[])

    return (
        <div className="flex flex-col items-center">
            <Appbar/>
            <div className="my-2 w-[97%] [&>*]:my-2">
                {transactions[0]? <Logs transactions={transactions}/>:<p className="flex justify-center">No transactions!</p>}
            </div>
            <div>
                <button onClick={()=>{
                    navigate('/dashboard');
                }} className="flex justify-center items-center h-8 w-auto px-2 mb-10 rounded-md fixed bottom-0 text-white bg-gray-700">DashBoard</button>
            </div>
            

        </div>
    )
}

function Logs({transactions}) {
    let idx = 0;

    return <>
       {transactions.map(log =>{
        return <div key={idx++} className="flex flex-row justify-between [&>*]:px-4 w-full h-10 font-medium items-center bg-gray-100 shadow hover:bg-gray-300">
        <div className="flexitems-center">{log.username}</div>
        <div>{`${log.paymentmode}:${log.Amount}`}</div>
        </div>
        })}
    </>
}