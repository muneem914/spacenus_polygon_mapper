import { RootState } from "@/lib/store";
import React from "react";
import { useSelector } from "react-redux";

const Exporter = () => {
  const polygons = useSelector((state: RootState) => state.polygons.polygons);

  // fetching redux state to json data and download
  const handleExport = () => {
    const dataStr = JSON.stringify(polygons, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "polygons.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="px-2 py-1 text-sm md:px-4 md:py-2 md:text-base rounded bg-blue-500 text-white"
      onClick={handleExport}
    >
      Export Data
    </button>
  );
};

export default Exporter;
