"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { deletePolygon, updatePolygon } from "@/lib/features/polygonsSlice";
import { useEffect, useState } from "react";
import Importer from "./Importer";
import Exporter from "./Exporter";

interface MapComponentProps {
  searchQuery: string;
}

export default function PolygonList({ searchQuery }: MapComponentProps) {
  const polygons = useSelector((state: RootState) => state.polygons.polygons);
  const dispatch = useDispatch();
  const [labelInputs, setLabelInputs] = useState<{ [key: string]: string }>({});
  const [filteredPolygons, setFilteredPolygons] = useState(polygons);

  // new color for the polygon
  const handleColorChange = (
    id: string,
    type: "fill" | "boundary",
    color: string
  ) => {
    dispatch(
      updatePolygon({
        id,
        [type === "fill" ? "fillColor" : "boundaryColor"]: color,
      })
    );
  };

  // new label for the polygon
  const handleSetLabel = (id: string) => {
    const newLabel = labelInputs[id]?.trim();
    if (newLabel) {
      dispatch(updatePolygon({ id, label: newLabel }));
      setLabelInputs((prev) => ({ ...prev, [id]: "" }));
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPolygons(polygons);
    } else {
      const filtered = polygons.filter(
        (p) => p.id.includes(searchQuery) || p.label.includes(searchQuery)
      );
      setFilteredPolygons(filtered);
    }
  }, [searchQuery, polygons]);

  return (
    <div className="list_polygons">
      <Importer />
      <div className="heading my-4">
        <h2 className="text-base md:text-xl">Saved Polygons</h2>
        {filteredPolygons.length === 0 ? "(No Data to export)" : <Exporter />}
      </div>
      {filteredPolygons.map((polygon) => {
        const formattedArea =
          polygon.area! >= 1e6
            ? `${(polygon.area! / 1e6).toFixed(2)} km²`
            : `${polygon.area!.toFixed(2)} m²`;
        return (
          <div
            key={polygon.id}
            className="border p-4 my-3 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => dispatch(deletePolygon(polygon.id))}
                className="px-2 py-1 text-sm rounded border text-red-500 border-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <p>
              <strong>Polygon ID:</strong> {polygon.id}
            </p>
            <p>
              <strong>Label:</strong> {polygon.label}{" "}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                className="border p-1"
                placeholder={polygon.label}
                value={labelInputs[polygon.id] || ""}
                onChange={(e) =>
                  setLabelInputs((prev) => ({
                    ...prev,
                    [polygon.id]: e.target.value,
                  }))
                }
              />
              <button
                className="px-2 py-1 text-sm md:px-4 md:py-2 md:text-base rounded border border-blue-500 text-blue-500"
                onClick={() => handleSetLabel(polygon.id)}
              >
                Set New Label
              </button>
            </div>
            <p className="pt-1">
              <strong>Coordinates:</strong>{" "}
              {JSON.stringify(polygon.coordinates)}
            </p>
            <p>
              <strong>Area:</strong> {formattedArea}
            </p>
            <p>
              <strong>Center:</strong> [{polygon.center![0]},{" "}
              {polygon.center![1]}]
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span>Fill:</span>
                <input
                  type="color"
                  value={polygon.fillColor}
                  onChange={(e) =>
                    handleColorChange(polygon.id, "fill", e.target.value)
                  }
                  className="w-10 h-6 cursor-pointer border rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <span>Border:</span>
                <input
                  type="color"
                  value={polygon.boundaryColor}
                  onChange={(e) =>
                    handleColorChange(polygon.id, "boundary", e.target.value)
                  }
                  className="w-10 h-6 cursor-pointer border rounded"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
