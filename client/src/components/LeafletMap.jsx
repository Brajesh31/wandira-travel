import React, { useEffect, useRef } from 'react';

const LeafletMap = ({ coordinates = [40.7128, -74.0060], zoom = 13, markers = [] }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const loadLeaflet = async () => {
            if (!window.L) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);

                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                document.head.appendChild(script);

                return new Promise((resolve) => {
                    script.onload = resolve;
                });
            }
        };

        const initMap = async () => {
            await loadLeaflet();

            if (mapRef.current && window.L && !mapInstanceRef.current) {
                mapInstanceRef.current = window.L.map(mapRef.current).setView(coordinates, zoom);

                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                }).addTo(mapInstanceRef.current);

                window.L.marker(coordinates)
                    .addTo(mapInstanceRef.current)
                    .bindPopup('Trip country!');

                markers.forEach((marker, index) => {
                    window.L.marker([marker.lat, marker.lng])
                        .addTo(mapInstanceRef.current)
                        .bindPopup(marker.popup || `Marker ${index + 1}`);
                });
            }
        };

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [coordinates, zoom, markers]);

    return (
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-sm">
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
};

export default LeafletMap
