// Navbar component

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from "@/context/UserContext";

const Navbar = () => {
    const pathname = usePathname();
    const { user, dispatch } = useUser(); // Access the user state and dispatch function from context


    return (
        <nav className="sticky top-20 bg-gray-200 flex flex-col z-10">
            <div className="container mx-auto mt-4"> {/* Added top padding to account for header height */}
                <ul className="flex flex-col">
                    <li className="my-2">
                        <Link href="/">
                            <span className={`block text-blue-600 hover:text-yellow-600 p-2 text-center text-lg ${pathname === '/' ? 'active' : ''}`}>Home</span>
                        </Link>
                    </li>
                    <hr className="my-2 border-t-2 border-gray-300" />
                    <li className="my-2">
                        <Link href="/restaurants">
                            <span className={`block text-blue-600 hover:text-yellow-600 p-2 text-center text-lg ${pathname === '/restaurants' ? 'active' : ''}`}>Restaurants</span>
                        </Link>
                    </li>
                    <hr className="my-2 border-t-2 border-gray-300" />
                    {user.isAdmin === true &&
                        <>
                            <li className="my-2">
                                <Link href="/users">
                                    <span className={`block text-blue-600 hover:text-yellow-600 p-2 text-center text-lg ${pathname === '/users' ? 'active' : ''}`}>View Users</span>
                                </Link>
                            </li>
                            <hr className="my-2 border-t-2 border-gray-300" />
                        </>
                    }
                    {user.token == "" ? (<li></li>) : (
                        <>
                            <li className="my-2">
                                <Link href="/view-cart">
                                    <span className={`block text-blue-600 hover:text-yellow-600 p-2 text-center text-lg ${pathname === '/view-cart' ? 'active' : ''}`}>View Cart</span>
                                </Link>
                            </li>
                            <hr className="my-2 border-t-2 border-gray-300" />
                            <li className="my-2">
                                <Link href="/logout">
                                    <span className="block text-blue-600 hover:text-yellow-600 p-2 text-center text-lg">Logout</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
