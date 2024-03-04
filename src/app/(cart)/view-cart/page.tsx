"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CartItemCard from "@/components/CartItem";

const ViewCart = () => {
    const [cart, setCart] = useState(null); // State to store cart data
    const [menuItems, setMenuItems] = useState([]); // State to store menu items
    const [showCheckoutPopup, setShowCheckoutPopup] = useState(false); // State to manage checkout pop-up visibility
    const port = process.env.BASE_URL || "localhost:8000";

    useEffect(() => {
        // Fetch cart data from the backend
        const fetchCart = async () => {
            try {
                const username = Cookies.get("username");
                const token = Cookies.get("token");
                const response = await axios.post(`${port}/api/users/viewcart`, { username, token });
                setCart(response.data); // Update cart state with fetched data
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart(); // Call fetchCart function when the component mounts
    }, []);

    useEffect(() => {
        // Fetch menu details for each item in the cart
        const fetchMenuItems = async () => {
            if (cart) {
                const promises = cart.map(async (item) => {
                    try {
                        const response = await axios.get(`${port}/api/menus/restaurant/${item.restaurantId}/${item.menuId}`);
                        return response.data; // Return menu item data
                    } catch (error) {
                        console.error(`Error fetching menu details for item ${item.menuId}:`, error);
                        return null;
                    }
                });
                const menuData = await Promise.all(promises);
                setMenuItems(menuData.filter(Boolean)); // Filter out any null values
            }
        };

        fetchMenuItems(); // Call fetchMenuItems function when cart state changes
    }, [cart]);

    const removeFromCart = async (menuId) => {
        try {
            const response = await axios.post(`${port}/api/users/remove-from-cart`, { menuId, token: Cookies.get("token"), username: Cookies.get("username") });
            if (response.status === 200) {
                // If successful, update the cart state
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
                // If successful, display a success message or redirect to a thank you page
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
                    {/* Display menu items here */}
                    {menuItems.map((menuItem, index) => (
                        <div key={index} className="border rounded-lg p-4 mb-4">
                            <CartItemCard cartItem={menuItem} />
                            <button onClick={() => removeFromCart(menuItem.menuId)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">Remove from Cart</button>
                        </div>
                    ))}
                </div>
            )}
            {menuItems.length === 0 && <p className="text-3xl font-semibold text-center mb-8">Cart is Empty.</p>}
            {menuItems.length != 0 && <div className="text-center">
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
