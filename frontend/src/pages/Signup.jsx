import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export default function Signup() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const navigate = useNavigate();

    return <div className="bg-blue-100 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="flex flex-col items-center rounded-lg bg-[#fefdfd] w-[80vw] max-w-100 text-center p-2 h-max px-4 sm:w-100">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox placeholder="John" label={"First Name"} onChange={(e) =>{
          setFirstName(e.target.value);
        }} />
        <InputBox placeholder="Doe" label={"Last Name"}  onChange={(e) =>{
          setLastName(e.target.value);
        }}/>
        <InputBox placeholder="example@gmail.com" label={"Email"} onChange={(e) =>{
          setUserName(e.target.value);
        }}/>
        <InputBox placeholder="123456" label={"Password"} onChange={(e) =>{
          setPassword(e.target.value);
        }}/>
        <div className="pt-4">
          <Button label={"Sign up"} onClick={async () =>{
            const response = await axios.post("/api/v1/user/signup",{
              username,
              password,
              firstname,
              lastname
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            navigate('/dashboard');
          }}/>
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}