import React from "react";

const CartItemCard = ({ cartItem }:any) => {
    
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <img className="h-80 w-80 object-cover mx-auto" src="/images/food-img.png" alt={cartItem.itemName} />
            <div className="p-6">
                <h1 className="text-3xl font-semibold mb-4 text-center">{cartItem.itemName}</h1>
                <h2 className="text-2xl font-bold mb-4 text-center">$ {cartItem.price}</h2>
                <div className="flex justify-center">
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;
