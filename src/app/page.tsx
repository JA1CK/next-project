import React from 'react';

export default function Home() {
    return (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-6">
                <img src="images/logo-png.png" alt="ReactRangers Team Logo" className="w-16 h-16 mr-4" />
                <div>
                    <h1 className="text-3xl font-semibold">Welcome to the Restaurant Management Application</h1>
                    <p className="text-lg pt-2 text-gray-600">Developed by <b>Team ReactRangers</b></p>
                </div>
            </div>
            <p className="mb-4">This application allows users to manage restaurants and their menus. Here&apos; a brief overview of its features:</p>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Features:</h2>
                <ul className="list-disc list-inside">
                    <li>User Registration: Users can register for an account to access the application.</li>
                    <li>User Login: Registered users can log in securely using their credentials.</li>
                    <li>Add Restaurant: Authorized users can add new restaurants, providing details such as name, address, phone number, cuisine, and rating.</li>
                    <li>View Restaurants: Users can view a list of all restaurants along with their details, including name, address, phone number, cuisine, and rating.</li>
                    <li>Edit Restaurant Details: Authorized users can edit the details of existing restaurants, such as name, address, phone number, cuisine, and rating.</li>
                    <li>Delete Restaurant: Authorized users can delete restaurants from the system.</li>
                    <li>Add Menu Item: Authorized users can add new menu items to existing restaurants, specifying the item name and price.</li>
                    <li>View Menu Items: Users can view a list of menu items for each restaurant.</li>
                    <li>Delete Menu Item: Authorized users can delete menu items from the system.</li>
                    <li>Cart Feature: Users can add menu items to their cart for future ordering.</li>
                    <li>View Cart: Users can view the items in their cart, along with the total price.</li>
                    <li>Order Placement: Users can place orders for the items in their cart.</li>
                    <li>Logout: Users can log out of their account securely.</li>
                </ul>
            </div>
            <p className="mb-4">This application provides a user-friendly interface for managing restaurant data efficiently, along with a convenient cart feature for easy ordering.</p>
            <p className="mb-4">Feel free to explore the various features and functionalities!</p>
            {/* Team Details */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Team Details:</h2>
                <div className="flex items-center mb-4">
                    <img src="/images/logo-transparent-png.png" alt="ReactRangers Team Logo" className="w-10 h-10 mr-4" />
                    <div>
                        <p className="font-semibold">Team Name:</p>
                        <p>ReactRangers</p>
                    </div>
                </div>
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <p className="font-bold">JP</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg">Team Lead:</p>
                        <p className="font-bold text-lg">Jainish Patel</p>
                    </div>
                </div>
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <p>AJ</p>
                    </div>
                    <div>
                        <p className="font-semibold">Team Member:</p>
                        <p>Aditya Joshi</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <p>PG</p>
                    </div>
                    <div>
                        <p className="font-semibold">Team Member:</p>
                        <p>Param Gandhi</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
