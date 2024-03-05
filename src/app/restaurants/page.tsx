"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";
import { env } from 'node:process';

interface RestaurantType {
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

export default function Restaurants() {

    const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
    const { user, dispatch } = useUser(); // Access the user state and dispatch function from context
    const port = process.env.NEXT_PUBLIC_BASE_URL;    
    const [loading, setLoading] = useState<boolean>(true);

    const sendGetRequest = async () => {
        try {
            const response = await axios.get(
                `${port}/api/restaurants`
            );
            setRestaurants(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteRestaurant = async (restaurantId: number) => {
        try {
            const token = Cookies.get("token");
            const isAdmin = Cookies.get("isAdmin");

            // Ask for confirmation before deleting
            const confirmed = window.confirm("Are you sure you want to delete this restaurant?");
            if (!confirmed) {
                return; // If not confirmed, do nothing
            }

            // Send a DELETE request to the server to delete the restaurant
            await axios.delete(`${port}/api/restaurants/${restaurantId}`, {
                data: {
                    token,
                    isAdmin
                }
            });

            // After successful deletion, update the restaurant list
            sendGetRequest();
        } catch (error) {
            console.error('Error deleting restaurant:', error);
        }
    };


    useEffect(() => {
        sendGetRequest();
    }, []);

    return (
        <>
            <h1 className="text-3xl font-semibold text-center mb-8"><u>Restaurants</u></h1>
            {loading && <p className="text-3xl font-semibold text-center mb-8">Loading...</p>}
            <div className="flex justify-center mb-4">
                {user.isAdmin === true && <Link href={`/restaurants/add-restaurant`} className="bg-green-700 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                    Add Restaurant
                </Link>}
            </div>
            {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-8">
                    <div className="md:flex md:flex-col items-center justify-center">
                        <div className="md:flex-shrink-0">
                            <img className="h-48 w-full object-cover md:w-48" src="/images/restaurant-img.jpg" alt="Restaurant Image" />
                        </div>
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold"><b>Name: </b>{restaurant.name}</div>
                            <p className="mt-2 text-gray-700"><b>Location: </b><i>{restaurant.address}</i></p>
                            <p className="mt-2 text-gray-700"><b>Phone: </b>{restaurant.phone}</p>
                            <p className="mt-2 text-gray-700"><b>Cuisine: </b>{restaurant.cuisine.join(', ')}</p>
                            <p className="mt-2 text-gray-700"><b>Rating: </b>{restaurant.rating}</p>
                        </div>
                        <div className="mb-5">
                            <Link href={`/restaurants/${restaurant.restaurantId}`} className="inline-block bg-blue-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300 mr-5">
                                View Restaurant
                            </Link>
                            {user.isAdmin === true && <button onClick={() => handleDeleteRestaurant(restaurant.restaurantId)} className="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                                Delete Restaurant
                            </button>}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
