'use client';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { url } from '../../mainurl';
import { Lock, Unlock } from "lucide-react";


export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/login`, form);
            if (res.status === 200) {
                toast.success(res.data.message)
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate(`/`);
            }
        } catch (err) {
            toast.error(err.response?.data?.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
            <div className="max-w-md w-full p-6 shadow-lg rounded-lg bg-white text-center">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full border p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    <div className="relative">
                        <input className="w-full border p-2" type={showPassword ? 'text' : 'password'} placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <Unlock size={18} /> : <Lock size={18} />}
                        </span>
                    </div>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded" type="submit">Login</button>
                    <p className="mt-4 text-sm">
                        New User ? <Link to="/register" className="text-blue-600">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
