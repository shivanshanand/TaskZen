"use client";
import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center px-4">
      <h1 className="text-6xl md:text-8xl font-extrabold mb-6 animate-bounce">
        😵‍💫 404
      </h1>

      <p className="text-xl md:text-2xl mb-6">
        Oops! Looks like you took a wrong turn on the internet highway 🚧
      </p>

      <div className="space-x-4">
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg"
        >
          🏠 Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-block bg-gray-700 hover:bg-gray-600 transition-colors px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg"
        >
          🔙 Go Back
        </button>
      </div>

      <div className="mt-10 text-sm opacity-70 animate-pulse">
        Lost in cyberspace... 🌌
      </div>
    </div>
  );
};

export default NotFound;
