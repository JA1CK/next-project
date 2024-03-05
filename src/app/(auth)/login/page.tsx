"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import Cookies library
import { useUser } from "@/context/UserContext"; // Import the user context
import Link from "next/link";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { dispatch } = useUser(); // Access the dispatch function from context
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";
            const response = await axios.post(`${port}/api/users/login`, {
                username,
                password,
            });
            const { token, isAdmin } = response.data; // Extract token and isAdmin from response
            // Set cookies with token and isAdmin values
            Cookies.set("token", token, { httpOnly: false });
            Cookies.set("isAdmin", isAdmin, { httpOnly: false });
            Cookies.set("username", username, { httpOnly: false });

            // Dispatch action to update user state
            dispatch({
                type: 'LOGIN',
                payload: {
                    username,
                    isAdmin,
                    token
                }
            });

            // Redirect to home page or any other page after successful login
            router.push("/restaurants");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError; // Cast 'err' to AxiosError
                if (axiosError.response && axiosError.response.data) {
                    const errorMessage = typeof axiosError.response.data === 'string' ? axiosError.response.data : "An unknown error occurred.";
                    setError(errorMessage);
                } else {
                    setError("An unknown error occurred."); // Fallback error message
                }
                console.error(axiosError);
            } else {
                console.error('Unknown error occurred:', err);
            }
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-3xl font-semibold mb-4">Login</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Login
                </button>
            </form>
            <p className="mt-4 text-gray-600">
                New user?{" "}
                <Link href="/register" className="text-blue-500 hover:underline">
                    Go to Register page
                </Link>
            </p>
        </div>
    );
}
