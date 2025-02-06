import React from "react";
import { useDispatch } from "react-redux";
import { setPolygons } from "@/lib/features/polygonsSlice";

const Importer = () => {
  const dispatch = useDispatch();

  // import and reading the json data
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedPolygons = JSON.parse(event.target?.result as string);
        dispatch(setPolygons(importedPolygons));
      } catch (error) {
        console.error("Error importing polygons:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="importer">
      <div className="flex items-center justify-center">
        <label
          htmlFor="upload_file"
          className="cursor-pointer px-2 py-1 text-sm md:px-4 md:py-2 md:text-base bg-gray-500 text-white rounded hover:bg-blue-700"
        >
          Import as JSON Data File
        </label>
        <input
          id="upload_file"
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="sr-only"
        />
      </div>
    </div>
  );
};

export default Importer;
