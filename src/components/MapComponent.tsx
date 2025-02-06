/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon as RLPolygon,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useDispatch, useSelector } from "react-redux";
import L from "leaflet";
import type { RootState } from "@/lib/store";
import { addPolygon } from "@/lib/features/polygonsSlice";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as turf from "@turf/turf";
import { icon } from "@/lib/leafIcon";
import UserGeoLocation from "./UserGeoLocation";

const EditControl = dynamic(
  () => import("react-leaflet-draw").then((mod) => mod.EditControl),
  { ssr: false }
);

interface MapComponentProps {
  searchQuery: string;
}

export default function MapComponent({ searchQuery }: MapComponentProps) {
  const dispatch = useDispatch();
  const polygons = useSelector((state: RootState) => state.polygons.polygons);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [filteredPolygons, setFilteredPolygons] = useState(polygons);

  const onCreated = (e: any) => {
    if (e.layerType === "polygon") {
      const layer = e.layer;
      const latlngs = layer.getLatLngs()[0];
      const id = L.stamp(layer).toString();
      const label = `Unnamed-${id}`;

      let coordinates: [number, number][] = latlngs.map((latlng: L.LatLng) => [
        latlng.lat,
        latlng.lng,
      ]);
      // first and last set of coordinates should be same otherwise it wont be a polygon
      const first = coordinates[0];
      const last = coordinates[coordinates.length - 1];
      const isClosed = first[0] === last[0] && first[1] === last[1];
      if (!isClosed) {
        coordinates = [...coordinates, first];
      }

      const turfPolygon = turf.polygon([
        coordinates.map(([lat, lng]) => [lng, lat]),
      ]);
      const area = turf.area(turfPolygon);
      const centroidCoords = turf.centroid(turfPolygon).geometry.coordinates;
      const center: [number, number] = [centroidCoords[1], centroidCoords[0]];

      layer.options.id = id;

      dispatch(
        addPolygon({
          id,
          label,
          coordinates,
          fillColor: "#3388ff",
          boundaryColor: "#3388ff",
          area,
          center,
        })
      );
    }
  };

  // // polygon editing (not working, unable to fetch id)
  // const onEdited = (e: any) => {
  //   e.layers.eachLayer((layer: L.Layer) => {
  //     if (layer instanceof L.Polygon) {
  //       const id = (layer as any).options.id;
  //       if (!id) return;
  //       const coordinates = (layer as L.Polygon)
  //         .getLatLngs()[0]
  //         .map(latlng => [latlng.lat, latlng.lng]);

  //       dispatch(updatePolygon({
  //         id,
  //         coordinates
  //       }));
  //     }
  //   });
  // };

  // // polygon deletion (not working, unable to fetch id)
  // const onDeleted = (e: any) => {
  //   e.layers.eachLayer((layer: L.Layer) => {
  //     const id = (layer as any).options.id;
  //     console.log(id);
  //     if (id) {
  //       dispatch(deletePolygon(id));
  //     }
  //   });
  // };

  const renderPolygonMarker = (polygon: any) => {
    const { coordinates, id } = polygon;
    if (coordinates.length < 3) return null;

    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    const isClosed = first[0] === last[0] && first[1] === last[1];
    const closedRing = isClosed ? coordinates : [...coordinates, first];

    const turfPolygon = turf.polygon([
      closedRing.map(([lat, lng]: [number, number]) => [lng, lat]),
    ]);
    const centroid = turf.centroid(turfPolygon);
    const area = turf.area(turfPolygon);

    const formattedArea =
      area >= 1e6 ? `${(area / 1e6).toFixed(2)} km²` : `${area.toFixed(2)} m²`;

    return (
      <Marker
        key={`marker-${id}`}
        position={[
          centroid.geometry.coordinates[1],
          centroid.geometry.coordinates[0],
        ]}
        icon={icon}
      >
        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
          <p>ID: {polygon?.id}</p>
          <p>Label: {polygon?.label}</p>
          <p>Area: {formattedArea}</p>
          <p>
            Center: [
            {[
              centroid.geometry.coordinates[1],
              centroid.geometry.coordinates[0],
            ]}
            ]
          </p>
        </Tooltip>
      </Marker>
    );
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
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "calc(100vh - 70px)", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={onCreated}
          // onEdited={onEdited}
          // onDeleted={onDeleted}
          draw={{
            rectangle: false,
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false,
          }}
        />
        {filteredPolygons.map((polygon) => (
          <RLPolygon
            key={polygon.id}
            positions={polygon.coordinates}
            pathOptions={{
              color: polygon.boundaryColor,
              fillColor: polygon.fillColor,
              fillOpacity: 0.5,
            }}
          />
        ))}
      </FeatureGroup>
      {filteredPolygons.map((polygon: any) => renderPolygonMarker(polygon))}
      <UserGeoLocation />
    </MapContainer>
  );
}
