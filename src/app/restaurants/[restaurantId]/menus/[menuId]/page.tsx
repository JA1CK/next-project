"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";

type MenuItem = {
    _id: string;
    menuId: number;
    itemName: string;
    price: number;
    imageUrl: string;
};

type MenuDetailsProps = {
    params: {
        restaurantId: number;
        menuId: number;
    };
};

export default function MenuDetails({ params }: MenuDetailsProps) {
    const { restaurantId, menuId } = params;
    const token = Cookies.get("token");
    const username = Cookies.get("username");
    const [menu, setMenu] = useState<MenuItem | null>(null);
    const router = useRouter();
    const { user, dispatch } = useUser(); // Access the user state and dispatch function from context
    const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";

    useEffect(() => {
        const fetchMenuDetails = async () => {
            try {
                const response = await axios.get(`${port}/api/menus/restaurant/${restaurantId}/${menuId}`);
                setMenu(response.data);
            } catch (error) {
                console.error("Error fetching menu details:", error);
            }
        };

        fetchMenuDetails();
    }, [restaurantId, menuId]);

    const handleAddToCart = async () => {
        try {
            await axios.post(`${port}/api/users/add-to-cart`, {
                restaurantId,
                menuId,
                token, username
            });
            alert("Item added to cart successfully!");
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const handleEditDetails = () => {
        // Navigate to the edit page for the current restaurant
        router.push(`/restaurants/${restaurantId}/menus/${menuId}/edit-menu`);
    };

    if (!menu) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="max-w-xl mx-auto">
                <Link href={`/restaurants/${restaurantId}/`} className="block text-blue-500 hover:underline mb-4">
                    &lt; Back to Menu
                </Link>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img className="h-80 w-80 object-cover mx-auto" src="/images/food-img.png" alt={menu.itemName} />
                    <div className="p-6">
                        <h1 className="text-3xl font-semibold mb-4 text-center">{menu.itemName}</h1>
                        <h2 className="text-2xl font-bold mb-4 text-center">$ {menu.price}</h2>
                        <div className="flex justify-center space-x-4">
                            {user.token && <button onClick={handleAddToCart} className="bg-blue-500 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded">
                                Add to Cart
                            </button>}
                            {user.isAdmin === true && <button onClick={handleEditDetails} className="bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded">
                                Edit Item
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
