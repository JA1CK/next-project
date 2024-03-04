"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";


const Logout = () => {
    const router = useRouter();
    const { dispatch } = useUser(); // Access the dispatch function from context
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleLogout = () => {
        // Clear cookies on logout
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("isAdmin");
        dispatch({ type: 'LOGOUT' });

        // Redirect to the main page or any other desired page
        router.push("/");
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-3xl font-semibold mb-4">Logout Page</h1>
            {showConfirmation ? (
                <div className="text-center">
                    <p className="mb-4">Are you sure you want to logout?</p>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => setShowConfirmation(false)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowConfirmation(true)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            )}
        </div>
    );
};

export default Logout;
