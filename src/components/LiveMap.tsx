import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Activity, Stethoscope, AlertTriangle, Layers, Video, MapPin, Shield } from 'lucide-react';

interface LiveMapProps {
  height?: string;
  darkTheme?: boolean;
  tacticalOverlay?: boolean;
  markers?: Array<{ lat: number; lng: number; title: string; color?: string }>;
  activeRouteTarget?: { name: string; lat: number; lng: number; distance: string } | null;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  height = 'h-96',
  darkTheme = false,
  tacticalOverlay = false,
  markers = [],
  activeRouteTarget = null
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [viewMode, setViewMode] = useState<'leaflet' | 'tactical'>(tacticalOverlay ? 'tactical' : 'leaflet');

  useEffect(() => {
    if (viewMode !== 'leaflet' || !containerRef.current) return;

    // Clean up existing instance if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const coords: [number, number] = [28.6139, 77.2090];
    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView(coords, 13);
    mapRef.current = map;

    const tileUrl = darkTheme
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    const defaultMarkers = markers.length > 0 ? markers : [
      { lat: 28.6150, lng: 77.2100, title: '🔴 P1 Flash Flood Trap - Sector 9 (6 Civilians Stranded)', color: '#DC2626' },
      { lat: 28.6100, lng: 77.2180, title: '🟢 Govt High School Relief Shelter (1,140/1,500 Occupied)', color: '#16A34A' },
      { lat: 28.6180, lng: 77.2050, title: '🔵 NDRF Alpha-1 Assault Boat Unit', color: '#2563EB' },
      { lat: 28.6250, lng: 77.2010, title: '🏥 Relief Camp Medical Station #12 (ICU & Trauma)', color: '#059669' },
      { lat: 28.5840, lng: 77.2980, title: '⚠️ Structural Bridge Damage (NH-44 Crossing)', color: '#D97706' },
      { lat: 28.6050, lng: 77.2300, title: '🟢 University Safe Shelter Hub (1,200/2,500 Beds)', color: '#16A34A' }
    ];

    defaultMarkers.forEach(m => {
      const pinColor = m.color || '#2563EB';
      const customHtml = `<div style="background-color: ${pinColor}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${pinColor}; transition: transform 0.2s;"></div>`;
      
      const customIcon = L.divIcon({
        className: 'custom-map-marker-pin',
        html: customHtml,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      L.marker([m.lat, m.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; min-width: 180px;">
            <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-bottom: 2px;">${m.title}</div>
            <div style="font-size: 10px; color: #64748B; font-mono: true;">GPS: ${m.lat.toFixed(4)}° N, ${m.lng.toFixed(4)}° E</div>
          </div>
        `);
    });

    // If active route target is specified, draw route line & start/end markers
    if (activeRouteTarget) {
      const routePoints: [number, number][] = [
        coords,
        [coords[0] + (activeRouteTarget.lat - coords[0]) * 0.5 + 0.002, coords[1] + (activeRouteTarget.lng - coords[1]) * 0.5 - 0.002],
        [activeRouteTarget.lat, activeRouteTarget.lng]
      ];

      const polyline = L.polyline(routePoints, {
        color: '#2563EB',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8'
      }).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

    const timer = setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [darkTheme, markers, viewMode]);

  return (
    <div className={`relative w-full ${height} rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col`}>
      {/* MAP HEADER CONTROL STRIP */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 z-20 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
          <span className="font-bold text-slate-900">
            {viewMode === 'leaflet' ? 'Live OpenStreetMap Telemetry' : 'Tactical Geo-Grid Radar'}
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">[OpenLayers v13.2 • Real-Time GPS]</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'leaflet' ? 'tactical' : 'leaflet')}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{viewMode === 'leaflet' ? 'Tactical Mode' : 'OSM Map'}</span>
          </button>
        </div>
      </div>

      {/* ACTIVE ROUTE OVERLAY BANNER */}
      {activeRouteTarget && (
        <div className="bg-blue-600 text-white px-4 py-2 text-xs flex items-center justify-between z-30 shadow-md">
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 animate-bounce" />
            <span className="font-bold">Active Navigation Route:</span>
            <span className="underline font-semibold">{activeRouteTarget.name}</span>
            <span className="bg-blue-800 text-blue-100 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
              {activeRouteTarget.distance} away • ETA ~8 mins
            </span>
          </div>
          <span className="bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase font-mono">
            Elevated Clear Passage
          </span>
        </div>
      )}

      {/* MAP CONTAINER */}
      {viewMode === 'leaflet' ? (
        <div ref={containerRef} className="w-full flex-1 z-10" />
      ) : (
        <div className="w-full flex-1 bg-slate-950 p-4 relative overflow-hidden flex flex-col justify-between text-emerald-400 font-mono text-xs">
          {/* Tactical Overlay Canvas Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-emerald-400 font-bold text-sm">SECTOR 9 GEOSPATIAL RADAR</div>
              <div className="text-[10px] text-slate-400">LAT: 28.6139° N | LON: 77.2090° E</div>
            </div>
            <span className="px-2 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] rounded font-bold">
              SONAR SENSORS ONLINE
            </span>
          </div>

          <div className="relative z-10 flex justify-between items-end text-[10px] text-slate-400">
            <div>SIGNAL STRENGTH: 98% • L-BAND MESH</div>
            <div>RAKSHASETU TACTICAL GRID v2.4</div>
          </div>
        </div>
      )}
    </div>
  );
};
