// import { Button } from "./Button"

// export const Users = () => {
//     return (
//         <div className="flex flex-col flex-start w-[97%] [&>*]:pl-5 mt-5">
//             <h1 className="font-bold">Users</h1>
//             <div>
//                 <Button label={Send Money} onClick={()=>{
//                     console.log("hi there")
//                 }}/>
//             </div>
//             <div>users</div>
//         </div>
//     )
// }
import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Dev_Path = import.meta.env.VITE_Local_Prefix


export const Users = () => {
    // Replace with backend call
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const timeout = setTimeout(async () =>{
            const response = await axios.get(`${Dev_Path}/api/v1/user/bulk?filter=${filter}`);

            setUsers(response.data.users)

        },300);

        return () => clearTimeout(timeout);
        
    }, [filter]);

    const username = localStorage.getItem('username');

    const displayedUsers = users.slice(0, 10).filter(user => user.username != username);

    return <>
    <div className="flex flex-col flex-start w-[97%] [&>*]:ml-5">
        <div className="font-bold mt-6 text-lg">
            Users {users.length-1}
        </div>
        <div className="my-2">
            <input name="searchbar" onChange={(e) => {
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div className="block overflow-auto ">
            {displayedUsers.map(user => <User key={user._id} user={user} />)}
        </div>
    </div>
    </>
}

function User({user}) {
    const navigate = useNavigate();

    if (!user || !user.firstname || !user.lastname) {
        return null; // or show a fallback UI
      }
    

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-lg">
                    {user.firstname[0].toUpperCase()}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstname} {user.lastname}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={() => {
                navigate("/send?id=" + user._id + "&name=" + user.firstname);
            }} label={"Send Money"} />
        </div>
    </div>
}