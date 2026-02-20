"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix Leaflet icon issue
// delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const center = [15.3173, 75.7139]; // Karnataka/Bellary region approx

const alerts = [
    { id: 1, lat: 15.32, lng: 75.72, type: "Aphid Outbreak", count: 14, color: "red", radius: 800 },
    { id: 2, lat: 15.35, lng: 75.68, type: "Yellow Rust", count: 8, color: "orange", radius: 500 },
    { id: 3, lat: 15.28, lng: 75.75, type: "Water Stress", count: 22, color: "blue", radius: 1200 },
];

export default function MapComponent() {
    return (
        <MapContainer center={center as L.LatLngExpression} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Location */}
            <Marker position={center as L.LatLngExpression}>
                <Popup>
                    Your Farm <br /> Safe Zone
                </Popup>
            </Marker>

            {/* Alert Zones */}
            {alerts.map(alert => (
                <Circle
                    key={alert.id}
                    center={[alert.lat, alert.lng]}
                    pathOptions={{ fillColor: alert.color, color: alert.color }}
                    radius={alert.radius}
                >
                    <Popup>
                        <strong>{alert.type}</strong> <br />
                        {alert.count} reports in last 24h
                    </Popup>
                </Circle>
            ))}
        </MapContainer>
    );
}
