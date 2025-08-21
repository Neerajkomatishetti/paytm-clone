import Appbar from "../components/Appbar.jsx"

const paymentlogs =[{
                username:"neeraj",
                Amount:500
                },{
                username:"Ravi",
                Amount:200
                    }];

export default function History() {
    return (
        <div>
            <Appbar/>
            <Logs paymentlogs={paymentlogs}/>

        </div>
    )
}

function Logs({paymentlogs}) {
    return <>
       {paymentlogs.map((log) =>{<div className="flex flex-col w-[97%]">
        <div className="flex items-center">{log.username}</div>
        <div>{log.Amount}</div>
       </div>})}
    </>
}