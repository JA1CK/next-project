"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Define types for the menu item
type MenuItem = {
    _id: string;
    menuId: number;
    itemName: string;
    price: number;
};


export default function EditMenuDetails({ params }: { params: { restaurantId: number, menuId: number } }) {
    const { restaurantId, menuId } = params;
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [editedMenuItem, setEditedMenuItem] = useState<Partial<MenuItem | null>>({});
    const router = useRouter();
    const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";

    useEffect(() => {
        const fetchMenuItemDetails = async () => {
            try {
                const response = await axios.get(`${port}/api/menus/restaurant/${restaurantId}/${menuId}`);                
                setMenuItem(response.data);

            } catch (error) {
                console.error("Error fetching menuItem details:", error);
            }
        };

        fetchMenuItemDetails();
    }, [restaurantId, menuId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // For other input fields, update the value directly
        setEditedMenuItem(prevState => ({
            ...prevState,
            [name]: value
        }));

    };


    const handleSubmit = async (e: React.FormEvent) => {

        const token = Cookies.get("token");
        const isAdmin = Cookies.get("isAdmin");
        
        e.preventDefault();
        try {
            await axios.put(`${port}/api/menus/restaurant/${restaurantId}/${menuId}`, { editedMenuItem, token, isAdmin });

            router.push(`/restaurants/${restaurantId}/menus/${menuId}`); 
        } catch (error) {
            console.error("Error editing menuItem details:", error);
        }
    };

    if (!menuItem) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
             <Link href={`/restaurants/${restaurantId}/menus/${menuId}`} className="block mt-4 text-blue-500 hover:underline">
                 &lt; Back to Menu Item Details
             </Link>
             <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 p-6">
             <h1 className="text-3xl font-semibold mb-4">Edit Menu Item Details</h1>
                 <div className="mb-4">
                     <label htmlFor="itemName" className="block mb-2">Item Name:</label>
                     <input type="text" id="itemName" name="itemName" placeholder={menuItem.itemName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" />
                 </div>
                 <div className="mb-4">
                     <label htmlFor="price" className="block mb-2">Price:</label>
                     <input type="number" id="price" name="price" placeholder={menuItem.price.toString()} step="any" onChange={handleInputChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" />
                 </div>
                 <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Changes</button>
             </form>
         </div>
    );
}