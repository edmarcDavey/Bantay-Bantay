
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// All Baguio City police stations with accurate coordinates
const STATIONS = [
  {
    id: 1,
    name: 'Baguio City Police Office – Police Station 1 (Naguilian)',
    location: 'CH6H+XPG, Naguilian Road, Baguio City',
    contact: '(074) 424-2697',
    lat: 16.412466,
    lng: 120.579335,
  },
  {
    id: 2,
    name: 'Baguio City Police Office – Police Station 2 (Camdas)',
    location: 'CHGV+79G, Under the Flyover, Magsaysay Avenue, Baguio City',
    contact: '(074) 661-1255',
    lat: 16.425570,
    lng: 120.593830,
  },
  {
    id: 3,
    name: 'Baguio City Police Office – Police Station 3 (Pacdal)',
    location: '7Q82CJ88+M6, Pacdal Circle, Baguio City',
    contact: '(074) 443-9113',
    lat: 16.416700,
    lng: 120.615510,
  },
  {
    id: 4,
    name: 'Baguio City Police Office – Police Station 4 (Loakan)',
    location: '14 Loakan Road, Camp John Hay, Baguio City',
    contact: '(074) 424-0992',
    lat: 16.394940,
    lng: 120.609120,
  },
  {
    id: 5,
    name: 'Baguio City Police Office – Police Station 5 (San Vicente / Legarda)',
    location: 'Legarda Road, San Vicente, Baguio City',
    contact: '(074) 442-0629',
    lat: 16.402660,
    lng: 120.590050,
  },
  {
    id: 6,
    name: 'Baguio City Police Office – Police Station 6 (Aurora Hill)',
    location: 'CJG4+FFP, Bayan Park Road, Aurora Hill, Baguio City',
    contact: '(074) 424-2174',
    lat: 16.402150,
    lng: 120.590360,
  },
  {
    id: 7,
    name: 'Baguio City Police Office – Police Station 7 (CBD / Abanao)',
    location: '102 Abanao Street, Central Business District, Baguio City',
    contact: '(074) 661-1489',
    lat: 16.414350,
    lng: 120.592120,
  },
  {
    id: 8,
    name: 'Police Precinct 1 – Market Area (Compact 1)',
    location: 'CH6H+XPG, Check Point, Naguilian Road, Baguio City',
    contact: '(074) 443-9111',
    lat: 16.412466,
    lng: 120.579335,
  },
  {
    id: 9,
    name: 'Police Precinct 2 – Center Mall (Compact 3)',
    location: '7Q82CH8W+PG, A. Bonifacio Road (Center Mall), Baguio City',
    contact: '(074) 619-0929',
    lat: 16.416810,
    lng: 120.596260,
  },
  {
    id: 10,
    name: 'Police Precinct 3 – Session Road',
    location: 'Session Road, Baguio City',
    contact: '(074) 424-0641',
    lat: 16.412540,
    lng: 120.597190,
  },
  {
    id: 11,
    name: 'Baguio City Police Office – Police Station 8 (Kennon Road)',
    location: '9HRX+QX3, Kennon Road, Baguio City',
    contact: '(074) 424-2681',
    lat: 16.364040,
    lng: 120.605120,
  },
  {
    id: 12,
    name: 'Baguio City Police Office – Police Station 9 (Irisan)',
    location: 'Purok 3, Irisan, Baguio City',
    contact: '(074) 424-8834',
    lat: 16.430180,
    lng: 120.548470,
  },
  {
    id: 13,
    name: 'Baguio City Police Office – Police Station 10 (Marcos Highway)',
    location: 'Marcos Highway 2, Sto. Tomas Proper, Baguio City',
    contact: '(074) 422-2662',
    lat: 16.389030,
    lng: 120.575580,
  },
];

const userMarkerIcon = new L.Icon({
  iconUrl: '/images/leaflet/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/images/leaflet/marker-shadow.png',
  shadowSize: [41, 41],
});

const stationMarkerIcon = new L.Icon({
  iconUrl: '/images/leaflet/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/images/leaflet/marker-shadow.png',
  shadowSize: [41, 41],
});

function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
      role="alert">
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose}>×</button>
    </div>
  );
}


export default function BantayBantay() {
  const mapRef = useRef(null);
  const [userPos, setUserPos] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [selectedStation, setSelectedStation] = useState(null);
  const [complaint, setComplaint] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const tileLayerRef = useRef(null);

  // GPS prompt and map init
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('bantay-map').setView([16.4023, 120.5960], 13); // Default to Baguio
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }
    // Add station markers
    STATIONS.forEach(station => {
      const marker = L.marker([station.lat, station.lng], { icon: stationMarkerIcon })
        .addTo(mapRef.current)
        .on('click', () => setSelectedStation(station));
      marker.bindTooltip(station.name, { direction: 'top' });
    });
    // Prompt for GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setGpsEnabled(true);
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 15);
          L.marker([pos.coords.latitude, pos.coords.longitude], { icon: userMarkerIcon })
            .addTo(mapRef.current)
            .bindTooltip('Your Location', { direction: 'top' });
          setToast({ message: 'GPS enabled. Map centered to your location.', type: 'success' });
        },
        err => {
          setGpsEnabled(false);
          setToast({ message: 'GPS permission denied. Please enable location for full functionality.', type: 'error' });
        }
      );
    } else {
      setToast({ message: 'Geolocation is not supported by your browser.', type: 'error' });
    }
    // Clean up on unmount
    return () => mapRef.current && mapRef.current.remove();
  }, []);

  // Satellite view toggle
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    if (satellite) {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }).addTo(mapRef.current);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }
  }, [satellite]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast.message) {
      const t = setTimeout(() => setToast({ message: '', type: '' }), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Complaint submission handler
  const handleComplaintSubmit = async e => {
    e.preventDefault();
    if (!selectedStation || !complaint.trim()) {
      setToast({ message: 'Please select a station and enter your complaint.', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      // TODO: Replace with real API call
      await new Promise(res => setTimeout(res, 1000));
      setToast({ message: 'Complaint submitted successfully!', type: 'success' });
      setComplaint('');
      setSelectedStation(null);
    } catch (err) {
      setToast({ message: 'Failed to submit complaint. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Google Maps navigation
  const handleNavigate = () => {
    if (!selectedStation) return;
    const { lat, lng, name } = selectedStation;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 flex flex-col items-center shadow">
        <h1 className="text-2xl font-bold tracking-wide">Bantay-Bantay</h1>
        {/* GPS status indicator below title */}
        <div className="mt-2 flex items-center gap-2 justify-center">
          <span
            className={`inline-block w-3 h-3 rounded-full ${gpsEnabled ? 'bg-green-400' : 'bg-red-500'} border border-white`}
            title={gpsEnabled ? 'GPS Active' : 'GPS Inactive'}
          />
          <span className="text-xs md:text-sm font-medium">
            {gpsEnabled ? 'GPS Active' : 'GPS Inactive'}
          </span>
        </div>
      </header>

      {/* Toast notifications */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      {/* Instruction Panel */}
      <section className="bg-blue-100 text-blue-900 px-4 py-2 text-sm md:text-base">
        <p><b>How to use:</b> Enable GPS when prompted. Select a police station on the map to view details and submit a complaint. Use the navigation button for directions.</p>
      </section>


      {/* Map Division */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-1 min-h-[350px] rounded-lg shadow relative" style={{ minHeight: 350 }}>
          {/* Satellite toggle button: always visible, top-right of map, not page */}
          <div
            className="absolute top-3 right-3 z-[999] pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <button
              className={`px-3 py-1 rounded border shadow-lg text-xs font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${satellite ? 'bg-blue-700 text-white border-blue-800' : 'bg-white text-blue-700 border-blue-700'}`}
              style={{
                minWidth: 110,
                background: satellite ? '#1e40af' : 'rgba(255,255,255,0.95)',
                border: '2px solid',
                borderColor: satellite ? '#1e3a8a' : '#1e40af',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              }}
              onClick={() => setSatellite(s => !s)}
              type="button"
              title="Toggle Satellite View"
            >
              {satellite ? 'Map View' : 'Satellite View'}
            </button>
          </div>
          <div id="bantay-map" className="w-full h-[350px] md:h-full" style={{ minHeight: 350 }} />
        </div>

      {/* Station Detail Card/Modal */}
        {selectedStation && (
          <div className="w-full md:w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col gap-2 z-20">
            <h2 className="text-lg font-bold mb-1">{selectedStation.name}</h2>
            <div className="text-gray-700 text-sm mb-1"><b>Location:</b> {selectedStation.location}</div>
            <div className="text-gray-700 text-sm mb-1"><b>Contact:</b> {selectedStation.contact}</div>
            {/* Complaint Form */}
            <form onSubmit={handleComplaintSubmit} className="flex flex-col gap-2 mt-2">
              <textarea
                className="border rounded p-2 resize-none focus:ring focus:ring-blue-300"
                rows={3}
                placeholder="Describe your complaint..."
                value={complaint}
                onChange={e => setComplaint(e.target.value)}
                required
              />
              <div className="flex gap-2 mt-1">
                <button
                  type="submit"
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded disabled:opacity-50"
                  disabled={!selectedStation || !complaint.trim() || submitting}
                >
                  {submitting ? 'Sending...' : 'Send Complaint'}
                </button>
                <button
                  type="button"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
                  onClick={handleNavigate}
                >
                  Navigate
                </button>
              </div>
            </form>
            <button className="text-xs text-gray-500 mt-2 underline" onClick={() => setSelectedStation(null)}>Close</button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-2 text-xs mt-auto">
        Bantay-Bantay &copy; {new Date().getFullYear()} | For Baguio City residents. Report responsibly.
      </footer>
    </div>
  );
}

// Vite live reload troubleshooting:
// 1. Make sure you run `npm run dev` and access the app via the Vite dev server URL (e.g., http://localhost:5173).
// 2. If you use Laravel's built-in server, you may not get hot reload. Use Vite's dev server for React changes.
// 3. If changes do not appear, clear browser cache or disable service workers.
