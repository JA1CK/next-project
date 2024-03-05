"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Params {
    restaurantId: string;
}

export default function AddMenuItem({ params }: { params: Params }) {
    const { restaurantId } = params;
    const [formData, setFormData] = useState({
        itemName: '',
        price: '',
    });
    const router = useRouter();
    const port = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = Cookies.get("token");
        const isAdmin = Cookies.get("isAdmin");

        try {
            await axios.post(`${port}/api/menus/restaurant/${restaurantId}`, {
                formData, token, isAdmin
            });
            console.log('Menu item added successfully');
            router.push(`/restaurants/${restaurantId}`);
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            <Link href={`/restaurants/${restaurantId}/`} className="block mt-4 text-blue-500 hover:underline">
                &lt; Back
            </Link>
            <h1 className="text-3xl font-semibold mb-4">Add Menu Item</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 p-6">
                <div className="mb-4">
                    <label htmlFor="itemName" className="block mb-2">Item Name:</label>
                    <input type="text" id="itemName" name="itemName" value={formData.itemName} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block mb-2">Price:</label>
                    <input type="number" id="price" name="price" step="0.01" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Menu Item</button>
            </form>
        </div>
    );
}
