"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function AddRestaurant() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        cuisine: '',
        rating: ''
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
            await axios.post(`${port}/api/restaurants`, {formData,token,isAdmin});
            console.log('Restaurant added successfully');
            // Optionally, you can redirect the user to the restaurants page after adding the restaurant
            router.push('/restaurants');
        } catch (error) {
            console.error('Error adding restaurant:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            <Link href={`/restaurants/`} className="block mt-4 text-blue-500 hover:underline">
                &lt; Back
            </Link>
            <h1 className="text-3xl font-semibold mb-4">Add Restaurant</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 p-6">
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block mb-2">Address:</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block mb-2">Phone:</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="cuisine" className="block mb-2">Cuisine:</label>
                    <input type="text" id="cuisine" name="cuisine" value={formData.cuisine} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="rating" className="block mb-2">Rating:</label>
                    <input type="number" id="rating" name="rating" step="0.1" value={formData.rating} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" required />
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Restaurant</button>
            </form>
        </div>
    );
}
