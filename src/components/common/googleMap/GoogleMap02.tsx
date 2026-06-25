import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../../../styles/common/map/googleMap.scss";

const containerStyle = {
  width: "100%",
  height: "100%",
  minHeight:"350px",
  borderRadius:10,
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

interface GoogleMapViewProps {
  propertyLocation: { lat: number; lng: number } | null;
  propertyName: string;
}

const GoogleMap02: React.FC<GoogleMapViewProps> = ({
  propertyLocation,
  propertyName,
}) => {
  const gMapKey = import.meta.env.VITE_GOOGLE_MAPS_PUBLIC_KEY as string;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: gMapKey,
    libraries: ["places"],
  });

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={propertyLocation || defaultCenter}
      zoom={15}
    >
      {/* User Location Marker */}
      {propertyLocation && (
        <Marker position={propertyLocation} 
        // label={propertyName}
         />
      )}
    </GoogleMap>
  );
};

export default GoogleMap02;
