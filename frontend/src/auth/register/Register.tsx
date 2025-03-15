import { useState } from "react";
 ;
import { SocialLogin } from "../social/SocialLogin";
import { useAuth } from "../../context/AuthContext";

export const Register = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        await register(formData);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border-2 border-white text-white w-80">
                <input 
                    type="text" 
                    name="username"
                    placeholder="Username" 
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-black border-2 border-white p-2 text-white focus:outline-none font-mono"
                />
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-black border-2 border-white p-2 text-white focus:outline-none font-mono"
                />
                <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-black border-2 border-white p-2 text-white focus:outline-none font-mono"
                />
                <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirm Password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-black border-2 border-white p-2 text-white focus:outline-none font-mono"
                />
                <button 
                    type="submit" 
                    className="bg-black border-2 border-white text-white p-2 font-mono hover:bg-white hover:text-black transition"
                >
                    Register
                </button>
            </form>
            
            <SocialLogin />
        </div>
    );
}
