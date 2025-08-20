import { useEffect, useRef, useState, useCallback, memo } from 'react';
import L from 'leaflet';

// Fix Leaflet CSS issues in Vite
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// Custom map styles like Divar
const customMapStyle = `
  .custom-map-container {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 2px solid #e5e7eb;
    position: relative;
  }
  
  .custom-map-container .leaflet-container {
    border-radius: 16px;
    font-family: 'Vazirmatn', sans-serif;
  }
  
  .custom-map-container .leaflet-control-zoom {
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .custom-map-container .leaflet-control-zoom a {
    background: white;
    color: #374151;
    border: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .custom-map-container .leaflet-control-zoom a:hover {
    background: #f3f4f6;
    color: #1f2937;
    transform: scale(1.05);
  }
  
  .custom-map-container .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: none;
  }
  
  .custom-map-container .leaflet-popup-content {
    font-family: 'Vazirmatn', sans-serif;
    margin: 12px 16px;
    font-size: 14px;
    color: #374151;
  }
  
  .custom-map-container .leaflet-popup-tip {
    background: white;
  }
  
  .custom-map-container .leaflet-marker-icon {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
`;

const CustomMap = memo(({ 
  center = [35.6892, 51.3890], 
  zoom = 10, 
  title = '', 
  className = '', 
  onLocationSelect,
  searchQuery = '',
  province = '',
  city = ''
}) => {
  // Ensure center coordinates are numbers
  const safeCenter = [
    typeof center[0] === 'number' ? center[0] : parseFloat(center[0]) || 35.6892,
    typeof center[1] === 'number' ? center[1] : parseFloat(center[1]) || 51.3890
  ];
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Custom marker icon
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 18px;
      ">
        📍
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!mapRef.current) return;
    
    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = customMapStyle;
    document.head.appendChild(style);

    // Create map instance
    const map = L.map(mapRef.current, {
      center: safeCenter,
      zoom: zoom,
      zoomControl: true,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: true,
      tap: true
    });

    // Add custom tile layer (like Divar style)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 5
    }).addTo(map);

    // Add marker
    const marker = L.marker(safeCenter, { icon: customIcon }).addTo(map);
    markerRef.current = marker;

    // Add popup to marker
    if (title) {
      marker.bindPopup(`
        <div style="text-align: center; font-family: 'Vazirmatn', sans-serif;">
          <div style="font-weight: bold; color: #1f2937; margin-bottom: 4px;">${title}</div>
          <div style="font-size: 12px; color: #6b7280;">
            ${safeCenter[0].toFixed(6)}, ${safeCenter[1].toFixed(6)}
          </div>
        </div>
      `);
    }

    // Handle map clicks
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      // Update marker position
      marker.setLatLng([lat, lng]);
      
      // Update popup
      if (title) {
        marker.bindPopup(`
          <div style="text-align: center; font-family: 'Vazirmatn', sans-serif;">
            <div style="font-weight: bold; color: #1f2937; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 12px; color: #6b7280;">
              ${lat.toFixed(6)}, ${lng.toFixed(6)}
            </div>
          </div>
        `);
      }
      
      // Call callback
      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }
    });

    // Add custom controls
    const customControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      
      onAdd: function() {
        const container = L.DomUtil.create('div', 'custom-map-control');
        container.innerHTML = `
          <div style="
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 8px;
            margin: 10px;
            font-family: 'Vazirmatn', sans-serif;
            font-size: 12px;
            color: #374151;
            border: 1px solid #e5e7eb;
          ">
            <div style="font-weight: bold; margin-bottom: 4px;">📍 موقعیت انتخاب شده</div>
            <div style="color: #6b7280;">${safeCenter[0].toFixed(6)}, ${safeCenter[1].toFixed(6)}</div>
          </div>
        `;
        return container;
      }
    });

    map.addControl(new customControl());
    mapInstanceRef.current = map;
    setIsMapReady(true);

    return map;
  }, [safeCenter, zoom, title, onLocationSelect, customIcon]);

  // Handle search query changes (like Divar neighborhood search)
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !searchQuery) return;

    const searchLocation = async () => {
      try {
        // Build search query with proper hierarchy
        let searchTerm = searchQuery;
        if (city) searchTerm += `, ${city}`;
        if (province) searchTerm += `, ${province}`;
        searchTerm += ', Iran';
        
        // Search for location using OpenStreetMap Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.length > 0) {
          const location = data[0];
          const newCenter = [parseFloat(location.lat), parseFloat(location.lon)];
          
          // Check if map and marker are available
          if (mapInstanceRef.current && markerRef.current) {
            // Update map center and marker with smooth animation
            mapInstanceRef.current.flyTo(newCenter, 16, {
              duration: 1.5,
              easeLinearity: 0.25
            });
            
            // Update marker immediately
            if (markerRef.current) {
              markerRef.current.setLatLng(newCenter);
              
              // Update popup
              if (title) {
                markerRef.current.bindPopup(`
                  <div style="text-align: center; font-family: 'Vazirmatn', sans-serif;">
                    <div style="font-weight: bold; color: #1f2937; margin-bottom: 4px;">${title}</div>
                    <div style="font-size: 12px; color: #6b7280;">${searchQuery}</div>
                    <div style="font-size: 10px; color: #9ca3af;">
                      ${newCenter[0].toFixed(6)}, ${newCenter[1].toFixed(6)}
                    </div>
                  </div>
                `);
              }
              
              // Call callback immediately
              if (onLocationSelect) {
                onLocationSelect({ lat: newCenter[0], lng: newCenter[1] });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error searching location:', error);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchLocation, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, province, city, isMapReady, title, onLocationSelect]);

  // Handle province/city changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || (!province && !city)) return;

    const updateLocation = async () => {
      try {
        // Build search term with proper hierarchy
        let searchTerm = '';
        if (city && province) {
          searchTerm = `${city}, ${province}, Iran`;
        } else if (province) {
          searchTerm = `${province}, Iran`;
        } else {
          return;
        }
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.length > 0) {
          const location = data[0];
          const newCenter = [parseFloat(location.lat), parseFloat(location.lon)];
          const newZoom = city ? 12 : 8;
          
          // Check if map and flyTo method are available
          if (mapInstanceRef.current && typeof mapInstanceRef.current.flyTo === 'function') {
            // Smooth animation to new location
            mapInstanceRef.current.flyTo(newCenter, newZoom, {
              duration: 1.5,
              easeLinearity: 0.25
            });
            
            // Update marker immediately
            if (markerRef.current) {
              markerRef.current.setLatLng(newCenter);
              
              // Update popup with location info
              if (title) {
                const locationName = city ? `${city}, ${province}` : province;
                markerRef.current.bindPopup(`
                  <div style="text-align: center; font-family: 'Vazirmatn', sans-serif;">
                    <div style="font-weight: bold; color: #1f2937; margin-bottom: 4px;">${title}</div>
                    <div style="font-size: 12px; color: #6b7280;">${locationName}</div>
                    <div style="font-size: 10px; color: #9ca3af;">
                      ${newCenter[0].toFixed(6)}, ${newCenter[1].toFixed(6)}
                    </div>
                  </div>
                `);
              }
            }
            
            // Call callback immediately
            if (onLocationSelect) {
              onLocationSelect({ lat: newCenter[0], lng: newCenter[1] });
            }
          } else {
            // Fallback: set view without animation
            mapInstanceRef.current.setView(newCenter, newZoom);
            if (markerRef.current) {
              markerRef.current.setLatLng(newCenter);
              
              // Update popup with location info
              if (title) {
                const locationName = city ? `${city}, ${province}` : province;
                markerRef.current.bindPopup(`
                  <div style="text-align: center; font-family: 'Vazirmatn', sans-serif;">
                    <div style="font-weight: bold; color: #1f2937; margin-bottom: 4px;">${title}</div>
                    <div style="font-size: 12px; color: #6b7280;">${locationName}</div>
                    <div style="font-size: 10px; color: #9ca3af;">
                      ${newCenter[0].toFixed(6)}, ${newCenter[1].toFixed(6)}
                    </div>
                  </div>
                `);
              }
            }
            if (onLocationSelect) {
              onLocationSelect({ lat: newCenter[0], lng: newCenter[1] });
            }
          }
        }
      } catch (error) {
        console.error('Error updating location:', error);
        setHasError(true);
      }
    };

    updateLocation();
  }, [province, city, isMapReady, onLocationSelect, title]);

  // Initialize map on mount
  useEffect(() => {
    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initializeMap]);

  // Error fallback UI
  if (hasError) {
    return (
      <div 
        className={`custom-map-container ${className}`}
        style={{ 
          height: '100%', 
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: '48px' }}>🗺️</div>
        <div style={{ 
          fontSize: '16px', 
          color: '#6b7280', 
          textAlign: 'center',
          fontFamily: 'Vazirmatn, sans-serif'
        }}>
          خطا در بارگذاری نقشه
        </div>
        <button 
          onClick={() => {
            setHasError(false);
            if (mapInstanceRef.current) {
              mapInstanceRef.current.remove();
              mapInstanceRef.current = null;
            }
            initializeMap();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Vazirmatn, sans-serif'
          }}
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`custom-map-container ${className}`}
      style={{ 
        height: '100%', 
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    />
  );
});

export default CustomMap;
