"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";

type RestaurantType = {
    _id: string;
    restaurantId: number;
    name: string;
    address: string;
    phone: string;
    cuisine: string[];
    rating: number;
    menu: {
        _id: string;
        menuId: number;
        itemName: string;
        price: number;
    }[];
};

export default function RestaurantDetails({ params }: { params: { restaurantId: number } }) {
    const { restaurantId } = params;
    const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
    const router = useRouter();
    const { user, dispatch } = useUser(); // Access the user state and dispatch function from context
    const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";

    const fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get(`${port}/api/restaurants/${restaurantId}`);
            setRestaurant(response.data);
        } catch (error) {
            console.error("Error fetching restaurant details:", error);
        }
    };

    useEffect(() => {
        fetchRestaurantDetails();
    }, [restaurantId]);

    const handleEditDetails = () => {
        // Navigate to the edit page for the current restaurant
        router.push(`/restaurants/${restaurantId}/edit-restaurant`);
    };

    const handleAddMenuItem = () => {
        // Navigate to the add menu item page for the current restaurant
        router.push(`/restaurants/${restaurantId}/add-menu-item`);
    };

    const handleDeleteMenuItem = async (menuItemId: number) => {
        try {

            const token = Cookies.get('token');
            const isAdmin = Cookies.get('isAdmin')

            const confirmed = window.confirm("Are you sure you want to delete this menu item?");
            if (!confirmed) {
                return;
            }
            await axios.delete(`${port}/api/menus/restaurant/${restaurantId}/${menuItemId}`, {
                data: {
                    token,
                    isAdmin
                }
            });
            // After successful deletion, fetch restaurant details again to update the menu
            fetchRestaurantDetails();
        } catch (error) {
            console.error("Error deleting menu item:", error);
        }
    };

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <Link href="/restaurants" className="block mt-4 text-blue-500 hover:underline">
                &lt; Back
            </Link>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
                <img className="h-60 w-60 mb-4" src="/images/restaurant-img.jpg" alt={restaurant.name} />
                <div className="p-6">
                    <h1 className="text-3xl font-semibold mb-4">{restaurant.name}</h1>
                    <p className="text-gray-700 mb-2"><b>Location: </b>{restaurant.address}</p>
                    <p className="text-gray-700 mb-2"><b>Phone: </b>{restaurant.phone}</p>
                    <p className="text-gray-700 mb-2"><b>Cuisine: </b>{restaurant.cuisine.join(', ')}</p>
                    <p className="text-gray-700 mb-2"><b>Rating: </b>{restaurant.rating}</p>
                    <div className="flex justify-between items-center mt-6 mb-4">
                        <h2 className="text-xl font-semibold">Menu:</h2>
                        {user.isAdmin === true && <div>
                            <button onClick={handleAddMenuItem} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Add Menu Item
                            </button>
                            <button onClick={handleEditDetails} className="bg-blue-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-4">
                                Edit Restaurant Details
                            </button>
                        </div>}
                    </div>
                    <ul className="grid grid-cols-1 gap-4">
                        {restaurant.menu.map(item => (
                            <li key={item.menuId} className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-blue-500 hover:text-blue-700">
                                        {item.itemName}
                                    </p>
                                    <p className="mt-2 text-gray-700"><b>Price:</b> ${item.price}</p>
                                </div>
                                <div className="flex items-center">
                                    <Link href={`/restaurants/${restaurantId}/menus/${item.menuId}`} className="bg-blue-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
                                        View
                                    </Link>
                                    {user.isAdmin === true && <button onClick={() => handleDeleteMenuItem(item.menuId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
