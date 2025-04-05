import { useState } from "react";
 ;
import { SocialLogin } from "../social/SocialLogin";
import { useAuth } from "../../context/AuthContext";
import { AButton } from "../../shared/components/AButton";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        setError("");
        setSuccess("");
    
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
    
        const response = await register(formData);
        
        if (response.success) {
            setSuccess("Registration successful. Redirecting...");
            setTimeout(() => navigate('/dashboard'), 1500);
        } else {
            setError(response.error || "Registration failed");
        }
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center h-screen bg-black">
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

            {error && (
                <div className="mb-4 mt-2 text-red-500 font-mono border border-red-500 p-2 bg-red-950 w-80 text-center">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 mt-2 text-green-500 font-mono border border-green-500 p-2 bg-green-950 w-80 text-center">
                    {success}
                </div>
            )}

            <div className="flex flex-row">
                <p>Already have an account? <AButton link="/login" icon={<LogIn />} label="Login now" /></p>
            </div>
            
            <SocialLogin register />
        </div>
    );
}
