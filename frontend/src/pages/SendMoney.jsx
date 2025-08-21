import axios from "axios";
import { Heading } from "../components/Heading"
import { SubHeading } from "../components/SubHeading"
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";



export default function SendMoney() {
    const [amount, setAmount] = useState(0);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const navigate = useNavigate();

    return <div className="bg-blue-100 h-screen flex justify-center items-center">
      <div className="rounded-lg bg-[#fefdfd] w-[80vw] max-w-80 text-center p-2 h-max px-4 pb-8 sm:w-80">
        <Heading label={"Send Money"} />
        <SubHeading label={"Enter the amount you want to send"} />
        <div className="flex flex-start flex-row gap-2 pt -2 pb-5">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-bold">{name}</h1>
        </div>
        <input type="number" onChange={(e) =>{
          setAmount(Number(e.target.value));
        }} placeholder="Enter amount" className="w-full p-2 rounded-md border border-gray-300 mb-2" />
        <button onClick={async ()=>{
          try{
              await axios.post("/api/v1/account/transfer",{
                to:id,
                amount
              },{
                headers:{
                  authorization: `Bearer ${localStorage.getItem('token')}`
                }
              })
              navigate("/dashboard");
        }catch (err) {
          alert(err?.response?.data?.message || "Transfer failed");
        }
        
        }} className="bg-green-500 text-white px-4 py-2 rounded-md w-full">Send Money</button>
      </div>
      
    </div>;
  }