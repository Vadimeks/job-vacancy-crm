import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фікс для стандартных іконак Leaflet у React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function VacancyMap({ vacancies, onViewVacancy }) {
  // Групуем вакансіі па гарадах для адлюстравання адной кропкі на горад
  const groupedByCity = useMemo(() => {
    const groups = {};
    
    vacancies.forEach(v => {
      // Вызначаем імя горада для групавання
      const cityKey = v.location?.split(',')[0].split('(')[0].trim();
      
      // Бяром каардынаты з аб'екта вакансіі (з базы)
      if (v.locationCoords?.lat && v.locationCoords?.lng) {
        if (!groups[cityKey]) {
          groups[cityKey] = {
            coords: [v.locationCoords.lat, v.locationCoords.lng],
            items: []
          };
        }
        groups[cityKey].items.push(v);
      }
    });
    
    return groups;
  }, [vacancies]);

  return (
    <div className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-slate-50 relative z-0">
      <MapContainer 
        center={[52.0689, 19.4797]} // Цэнтр Польшчы
        zoom={6} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Object.entries(groupedByCity).map(([cityName, group]) => (
          <Marker key={cityName} position={group.coords}>
            <Popup className="custom-map-popup">
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-1">
                    📍 {cityName}
                  </h4>
                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {group.items.length}
                  </span>
                </div>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                  {group.items.map(vac => (
                    <div 
                      key={vac._id} 
                      onClick={() => onViewVacancy(vac)}
                      className="p-2 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-mono font-bold text-slate-400 group-hover:text-emerald-600">
                          {vac.vacancyCode}
                        </span>
                        <span className="text-[9px] font-black text-emerald-600 uppercase">
                          {vac.salary?.baseNetto ? `${vac.salary.baseNetto} ${vac.salary.currency || 'PLN'}` : ''}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 leading-tight line-clamp-2">
                        {vac.vacancydescription || vac.templateName}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                        🏢 {vac.agencyName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Легенда або падказка */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        Націсніце на маркер, каб убачыць вакансіі
      </div>
    </div>
  );
}