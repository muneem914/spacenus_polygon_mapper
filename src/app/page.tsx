"use client";

import dynamic from "next/dynamic";
import PolygonList from "@/components/PolygonList";
import StoreProvider from "@/app/providers";
import { useState } from "react";
import { CiMenuFries } from "react-icons/ci";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function HomePage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StoreProvider>
      <div className="mainContainer">
        <nav className="bg-white shadow-sm relative z-400">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setView("map");
                    setIsOpen(false);
                  }}
                >
                  SPACENUS
                </button>
              </div>

              <div className="hidden md:block">
                <input
                  type="text"
                  placeholder="Search polygon by ID / Label"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-4 px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-blue-500 md:px-2 md:py-1"
                  style={{ borderRadius: 0 }}
                />
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => {
                    setView("map");
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1 text-sm rounded ${
                    view === "map"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } md:px-4 md:py-2 md:text-base`}
                >
                  Map View
                </button>
                <button
                  onClick={() => {
                    setView("list");
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1 text-sm rounded ${
                    view === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } md:px-4 md:py-2 md:text-base`}
                >
                  Polygon List
                </button>
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <CiMenuFries fontSize={30} />
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="fixed inset-0 z-[9999] flex items-start justify-center bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="bg-white w-full max-w-xs p-4 mt-16 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <input
                    type="text"
                    placeholder="Search polygon by ID / Label"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-blue-500 md:px-2 md:py-1"
                    style={{ borderRadius: 0 }}
                  />
                </div>
                <button
                  onClick={() => {
                    setView("map");
                    setIsOpen(false);
                  }}
                  className={`w-full my-4 px-4 py-2 rounded ${
                    view === "map"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } `}
                >
                  Map View
                </button>
                <button
                  onClick={() => {
                    setView("list");
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded ${
                    view === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } `}
                >
                  Polygon List
                </button>
              </div>
            </div>
          )}
        </nav>

        <main className="">
          {view === "map" ? (
            <MapComponent searchQuery={searchQuery} />
          ) : (
            <PolygonList searchQuery={searchQuery} />
          )}
        </main>
      </div>
    </StoreProvider>
  );
}
