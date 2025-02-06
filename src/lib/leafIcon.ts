import L from "leaflet";

const icon = L.icon({
    iconUrl: "/marker.png",
    iconSize: [50, 50],
})

const current = L.icon({
    iconUrl: "/current.png",
    iconSize: [50, 50],
})

export { icon, current };