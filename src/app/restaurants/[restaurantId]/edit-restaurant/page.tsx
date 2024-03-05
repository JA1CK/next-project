"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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

export default function EditRestaurantDetails({ params }: { params: { restaurantId: number } }) {
    const { restaurantId } = params;
    const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
    const [newRestaurantDetails, setNewRestaurantDetails] = useState<Partial<RestaurantType | null>>({});
    const router = useRouter();
    const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const response = await axios.get(`${port}/api/restaurants/${restaurantId}`);
                setRestaurant(response.data);                
            } catch (error) {
                console.error("Error fetching restaurant details:", error);
            }
        };

        fetchRestaurantDetails();
    }, [restaurantId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'cuisine') {
            // Split the input value by commas to get an array of cuisines
            const cuisines = value.split(',').map(cuisine => cuisine.trim());
            setNewRestaurantDetails(prevState => ({
                ...prevState,
                [name]: cuisines
            }));
        } else {
            // For other input fields, update the value directly
            setNewRestaurantDetails(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        const token = Cookies.get("token");
        const isAdmin = Cookies.get("isAdmin");
        
        e.preventDefault();
        try {
            await axios.put(`${port}/api/restaurants/${restaurantId}`, {newRestaurantDetails, token, isAdmin});
            
            router.push(`/restaurants/${restaurantId}`); // Redirect to the restaurant details page after editing
        } catch (error) {
            console.error("Error editing restaurant details:", error);
        }
    };

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <Link href={`/restaurants/${restaurantId}`} className="block mt-4 text-blue-500 hover:underline">
                &lt; Back to Details
            </Link>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 p-6">
                <h1 className="text-3xl font-semibold mb-4">Edit Restaurant Details</h1>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2">Name:</label>
                    <input type="text" id="name" name="name" placeholder={restaurant.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"  />
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block mb-2">Address:</label>
                    <input type="text" id="address" name="address" placeholder={restaurant.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"  />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block mb-2">Phone:</label>
                    <input type="tel" id="phone" name="phone" placeholder={restaurant.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"  />
                </div>
                <div className="mb-4">
                    <label htmlFor="cuisine" className="block mb-2">Cuisine:</label>
                    <input type="text" id="cuisine" name="cuisine" placeholder={restaurant.cuisine.join(', ')} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"  />
                </div>
                <div className="mb-4">
                    <label htmlFor="rating" className="block mb-2">Rating:</label>
                    <input type="number" id="rating" name="rating" step="any" placeholder={restaurant.rating.toString()} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"  />
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Changes</button>
            </form>
        </div>
    );
}
