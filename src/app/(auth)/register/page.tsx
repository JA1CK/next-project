"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [registered, setRegistered] = useState(false); // State to track registration status
    const [showPopup, setShowPopup] = useState(false); // State to track whether to show the success pop-up
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";

            const response = await axios.post(`${port}/api/users/register`, {
                username,
                password,
            });
            setRegistered(true); // Set registered state to true
            setShowPopup(true); // Show success pop-up
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
    };

    useEffect(() => {
        // Redirect to login page if registration is successful
        if (registered) {
            setTimeout(() => {
                router.push("/login");
            }, 2000); // Redirect after 2 seconds
        }
    }, [registered, router]);

    return (
        <div className="max-w-md mx-auto mt-8 relative">
            <h1 className="text-3xl font-semibold mb-4">Register</h1>
            {error && <p className="text-red-500 mb-4">{error} or use different Username for registeration.</p>}
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
                    Register
                </button>
            </form>
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded shadow-lg animate-fade-in">
                        <p className="text-green-500 text-xl font-semibold mb-2">Registration Successful!</p>
                        <p className="text-gray-700">Redirecting to login page...</p>
                    </div>
                </div>
            )}
            <p className="mt-4 text-gray-600">
                Already registered?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                    Go to login page
                </Link>
            </p>
        </div>
    );
}
