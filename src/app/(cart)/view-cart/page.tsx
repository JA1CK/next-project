"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CartItemCard from "@/components/CartItem";

interface CartItem {
    restaurantId: string;
    menuId: string;
    // Add other properties as needed
}

const ViewCart = () => {
    const [cart, setCart] = useState<CartItem[] | null>(null); // Explicitly type cart as CartItem[] or null
    const [menuItems, setMenuItems] = useState<CartItem[]>([]); // Explicitly type menuItems as CartItem[]
    const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
    const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const username = Cookies.get("username");
                const token = Cookies.get("token");
                const response = await axios.post(`${port}/api/users/viewcart`, { username, token });
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, [port]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            if (cart) {
                const promises = cart.map(async (item) => {
                    try {
                        const response = await axios.get(`${port}/api/menus/restaurant/${item.restaurantId}/${item.menuId}`);
                        return response.data;
                    } catch (error) {
                        console.error(`Error fetching menu details for item ${item.menuId}:`, error);
                        return null;
                    }
                });
                const menuData = await Promise.all(promises);
                setMenuItems(menuData.filter(Boolean) as CartItem[]);
            }
        };
        fetchMenuItems();
    }, [cart, port]);

    const removeFromCart = async (menuId: string) => {
        try {
            const response = await axios.post(`${port}/api/users/remove-from-cart`, { menuId, token: Cookies.get("token"), username: Cookies.get("username") });
            if (response.status === 200) {
                setCart(response.data);
            } else {
                console.error("Failed to remove item from cart:", response.data.message);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await axios.post(`${port}/api/users/checkout`, { username: Cookies.get("username"), token: Cookies.get("token") });
            if (response.status === 200) {
                console.log("Checkout successful!");
                setShowCheckoutPopup(true);
                setCart([]);
            } else {
                console.error("Failed to checkout:", response.data.message);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-center mb-8"><u>Your Cart</u></h1>
            {menuItems.length > 0 && (
                <div>
                    {menuItems.map((menuItem, index) => (
                        <div key={index} className="border rounded-lg p-4 mb-4">
                            <CartItemCard cartItem={menuItem} />
                            <button onClick={() => removeFromCart(menuItem.menuId)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">Remove from Cart</button>
                        </div>
                    ))}
                </div>
            )}
            {menuItems.length === 0 && <p className="text-3xl font-semibold text-center mb-8">Cart is Empty.</p>}
            {menuItems.length !== 0 && <div className="text-center">
                <button onClick={handleCheckout} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">Checkout</button>
            </div>}
            {showCheckoutPopup && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Checkout Successful!</h2>
                        <button onClick={() => setShowCheckoutPopup(false)} className="px-4 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 transition duration-300">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewCart;
