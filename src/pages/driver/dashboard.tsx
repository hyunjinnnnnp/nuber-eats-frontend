import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { useMutation, useSubscription, gql } from "@apollo/client";
import { cookedOrders } from "../../__generated__/cookedOrders";
import { Title } from "../../components/title";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";
import { useHistory } from "react-router";

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      error
      ok
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-xl">🚘</div>;

export const Dashbord = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>(); //window.google already exist.
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
  //when the driver coords changes
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng, map, maps]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    //map: map that you have right now on the screen.
    //maps: google maps object
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 0.7,
          strokeWeight: 3,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  const { data: cookedOrdersData } = useSubscription<cookedOrders>(
    COOKED_ORDERS_SUBSCRIPTION
  );
  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      //ready to deliver
      makeRoute();
    }
  }, [cookedOrdersData]);
  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    { onCompleted }
  );
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };
  return (
    <div className="w-full">
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals //to move the position
          onGoogleApiLoaded={onApiLoaded} //interact with the map with functions
          defaultZoom={16}
          defaultCenter={{
            lat: 36.51,
            lng: 126.02,
          }}
          bootstrapURLKeys={{ key: "AIzaSyC4_TJcpaifkfDt3ee41WGHadqzwGdzq2I" }}
        >
          {/* child Component API >> marker */}
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Cooked Order
            </h1>
            <h4 className="text-center my-3 text-2xl font-medium">
              Pick it up soon! @{" "}
              {cookedOrdersData?.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={() => triggerMutation(cookedOrdersData?.cookedOrders.id)}
              className="btn w-full mt-5 block text-center"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <Title title="No orders yet" className="text-center" />
        )}
      </div>
    </div>
  );
};
