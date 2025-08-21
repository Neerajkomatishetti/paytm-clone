import Appbar from "../components/Appbar.jsx"
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const paymentlogs = [{
    username: "Neeraj",
    Amount: 500,
    paymentmode: "Paid"
  },
  {
    username: "Ravi",
    Amount: 200,
    paymentmode: "Received"
  },
  {
    username: "Aisha",
    Amount: 750,
    paymentmode: "Paid"
  },
  {
    username: "Karan",
    Amount: 300,
    paymentmode: "Received"
  },
  {
    username: "Meena",
    Amount: 1000,
    paymentmode: "Paid"
  },
  {
    username: "Tariq",
    Amount: 150,
    paymentmode: "Received"
  }
];

export default function History() {

    const [transactions, setTransactions] = useState([]);

    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/account/history",{headers:{
            authorization:`Bearer ${localStorage.getItem('token')}`
        }}).then(response =>{
            setTransactions(response.data.transactions)
        })
    },[])

    return (
        <div className="flex flex-col items-center">
            <Appbar/>
            <div className="my-2 w-[97%] [&>*]:my-2">
                { transactions[0]? <Logs transactions={transactions}/>:<p className="flex justify-center">No transactions!</p>}
            </div>
            

        </div>
    )
}

function Logs({transactions}) {
    return <>
       {transactions.map(log =>{
        return <div div className="flex flex-row justify-between [&>*]:px-4 w-full h-10 font-medium items-center bg-gray-100 shadow hover:bg-gray-300">
        <div className="flexitems-center">{log.username}</div>
        <div>{`${log.paymentmode}:${log.Amount}`}</div>
        </div>
        })}
    </>
}