"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from "js-cookie";

interface User {
    _id: string;
    username: string;
    password: string;
    admin?: boolean; // Optional field
    approved?: boolean; // Optional field
    cart: CartItem[]; // Array of cart items
}

interface CartItem {
    menuId: number;
    restaurantId: number;
}

export default function Restaurants() {

    const [users, setUsers] = useState<User[]>([]);
    const username = Cookies.get("username");
    const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";

    const sendGetRequest = async () => {
        try {
            const response = await axios.post(
                `${port}/api/admin/view/`, { username }
            );
            setUsers(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        sendGetRequest();
    }, []);

    return (
        <>
            <h1 className="text-3xl font-semibold text-center mb-8"><u>All Users</u></h1>
            {users.map((user) => (
                <div key={user._id} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-8">
                    <div className="md:flex">
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold"><b>Username: </b>{user.username}</div>
                            <p className="mt-2 text-gray-700"><b>Password: </b>{user.password}</p>
                            <p className="mt-2 text-gray-700"><b>Admin: </b>{user.admin ? 'Yes' : 'No'}</p>
                            <p className="mt-2 text-gray-700"><b>Approved: </b>{user.approved ? 'Yes' : 'No'}</p>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Cart:</h3>
                                {user.cart.map((item, index) => (
                                    <div key={index} className="mx-20 flex justify-between">
                                        <p className="mt-2 text-gray-700"><b>Menu ID: </b>{item.menuId}</p>
                                        <p className="mt-2 text-gray-700"><b>Restaurant ID: </b>{item.restaurantId}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>

    );
}
