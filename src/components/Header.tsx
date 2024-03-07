"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const Header = () => {
    const { user, dispatch } = useUser(); // Access the user state and dispatch function from context

    useEffect(() => {
        const storedUsername = Cookies.get("username");
        const storedIsAdmin = Cookies.get("isAdmin");
        const storedToken = Cookies.get("token");

        if (storedUsername && storedIsAdmin) {
            dispatch({
                type: 'LOGIN',
                payload: {
                    username: storedUsername,
                    isAdmin: JSON.parse(storedIsAdmin),
                    token: storedToken,
                }
            });
        }
    }, [dispatch]);

    return (
        <header className="sticky top-0 bg-blue-200 text-gray-900 py-4 z-20">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/images/logo-transparent-png.png" alt="Logo" className="h-16 mr-7 ml-7" />
                    <h1 className="text-2xl font-bold">reactRangers</h1>
                </div>
                {user.username && user.token ? (
                    <div className="flex items-center mr-10">
                        <p className="my-4 text-center text-gray-500">{user.username}</p>
                    </div>
                ) : (
                <div className="flex items-center mr-10">
                    <Link href="/login" className="my-4 text-center text-gray-500 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</Link>
                </div>
                )}
            </div>
        </header>
    );
};

export default Header;
