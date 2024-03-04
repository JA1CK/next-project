"use client";
import '../../public/styles/error.css';

export default function ErrorBoundary({error}: {error:Error}) {
    return (
        <>           
            <div className="text"><p>Error! Something went wrong!</p></div>
            <div className="text"><p>{error.message}</p></div>
        </>
    );
}