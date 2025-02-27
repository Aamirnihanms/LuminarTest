import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "@/services/userApi";

export function SignIn() {
     
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password); 
      console.log("Sign in successful:", data);

      if (data) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard/home");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Invalid credentials");
    }
  };


  return (
    <section className="flex h-screen overflow-hidden">
      <div className="w-full lg:w-3/5 p-8 flex flex-col justify-center">
        <div className="text-center">
          <Typography variant="h2" color="purple" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              type="email"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                Remember me
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button type="submit" color="purple" className="mt-6" fullWidth>
            Sign In
          </Button>
        </form>
      </div>
      
      <div className="w-2/5 hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
        <motion.img
          src="/img/luminar.png"
          className="h-64 w-64 object-cover rounded-3xl mb-6"
          alt="Luminar Logo"
          animate={{ rotateY: [0, 180, 0] }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear", repeatDelay: 3 }}
        />
        <Typography 
          variant="h1" 
          className="text-center font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent"
        >
          Luminar Technolab
        </Typography>
        <Typography
          variant="lead"
          className="text-center text-purple-600 italic"
        >
          "Where IT Experts Are Born"
        </Typography>
      </div>
    </section>
  );
}

export default SignIn;