import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashbord = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    //map: map that you have right now on the screen.
    //maps: google maps object
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
  };
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "95vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals //to move the position
          onGoogleApiLoaded={onApiLoaded} //interact with the map with functions
          defaultZoom={15}
          defaultCenter={{
            lat: 36.51,
            lng: 126.02,
          }}
          bootstrapURLKeys={{ key: "AIzaSyC4_TJcpaifkfDt3ee41WGHadqzwGdzq2I" }}
        ></GoogleMapReact>
      </div>
    </div>
  );
};
