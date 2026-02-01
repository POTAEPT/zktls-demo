import { useState, useEffect } from 'react';
import Gun from 'gun';
import { type EmergencyRequest } from '../App';


const gun = Gun({
  peers: [
    'https://gun-manhattan.herokuapp.com/gun',
    'https://gun-us.herokuapp.com/gun',
    'https://gun-eu.herokuapp.com/gun'
  ]
});

export const useRelief = () => {
  const [sosList, setSosList] = useState<EmergencyRequest[]>([]);

  useEffect(() => {

    const channel = gun.get('relief-mesh-hackathon-v1');
    
    channel.map().on((data, id) => {

      console.log("📡 Received signal:", id, data);

   
      if (data && data.locationLat && data.locationLng) { 
        
        
        const newRequest: EmergencyRequest = {
          id: id,
          userName: data.userName || 'Anonymous',
          userAvatar: data.userAvatar || `https://i.pravatar.cc/150?u=${id}`,
          needs: data.needs ? JSON.parse(data.needs) : [],
          proximity: 'Calculating...',
          location: {
            lat: parseFloat(data.locationLat),
            lng: parseFloat(data.locationLng),
            address: data.locationAddress || 'Unknown Location'
          },

          timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: data.description || '',
          urgencyLevel: 'critical'
        };

        setSosList((prev) => {

          const exists = prev.find((item) => item.id === id);
          if (exists) return prev;


          return [newRequest, ...prev];
        });
      }
    });
  }, []);


  const sendSOS = (data: { 
    needs: string[], 
    details: string, 
    location: string, 
    lat: number, 
    lng: number 
  }) => {
    const id = crypto.randomUUID();
    const payload = {
      userName: 'Help Me!', 
      userAvatar: '',
      needs: JSON.stringify(data.needs),
      description: data.details,
      locationAddress: data.location,
      locationLat: data.lat,
      locationLng: data.lng,
      timestamp: Date.now()
    };

    gun.get('relief-mesh-hackathon-v1').get(id).put(payload);
    console.log("✅ SOS Broadcasted:", payload);
  };

  return { sosList, sendSOS };
};