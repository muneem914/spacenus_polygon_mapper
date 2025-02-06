/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { current } from "@/lib/leafIcon";
import { Marker, Tooltip, useMapEvents } from "react-leaflet";

const UserGeoLocation = () => {
  const [position, setPosition] = useState<any>(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      localStorage.setItem("userLocation", JSON.stringify(e.latlng));
      map.flyTo(e.latlng, map.getZoom());
    },
    locationerror(e) {
      const defaultPosition = { lat: 51.505, lng: -0.09 };
      setPosition(defaultPosition);
      localStorage.setItem("userLocation", JSON.stringify(defaultPosition));
      map.setView(defaultPosition, map.getZoom());
      console.log(e);
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("userLocation");
    if (stored) {
      const storedPosition = JSON.parse(stored);
      setPosition(storedPosition);
      map.setView(storedPosition, map.getZoom());
    } else {
      map.locate();
    }
  }, [map]);
  return position ? (
    <Marker position={position} icon={current}>
      <Tooltip>Current Location</Tooltip>
    </Marker>
  ) : null;
};

export default UserGeoLocation;
