import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { makeRequest } from "../function/fetchChargingAPI"

const defaultCenter = {
    lat: 51.507351,
    lng: -0.127758
  };
const CHARGE_POINT_URL = `https://pacific-river-24502.herokuapp.com/http://chargepoints.dft.gov.uk/api/retrieve/registry/lat/${defaultCenter.lat}/long/${defaultCenter.lng}/dist/2/format/json`
// const CHARGE_POINT_URL = `https://pacific-river-24502.herokuapp.com/http://chargepoints.dft.gov.uk/api/retrieve/registry/lat/51.507351/long/-0.127758/dist/10/format/json`
const numberOfMarkers = 10
let chargerLocationArray = []

async function prepareChargingData() {
    const chargerData = await makeRequest(CHARGE_POINT_URL)
    const topMarkers = await getTopMarkers(chargerData, numberOfMarkers)
    console.log("CREATE LOCATION ARRAY", createLocationArray(topMarkers))
    chargerLocationArray = createLocationArray(topMarkers)
}

function getTopMarkers(chargerObj, numberOfMarkers) {
    console.log("TOP MARKERS", chargerObj.ChargeDevice.splice(0, numberOfMarkers))
    return chargerObj.ChargeDevice.splice(0, numberOfMarkers)
}

function createLocationArray(topMarkers) {
    return topMarkers.map(p => {
          return {
              lat: parseFloat(p.ChargeDeviceLocation.Latitude),
              lng: parseFloat(p.ChargeDeviceLocation.Longitude)
          }
     })
}

const MapContainer = () => {
  // const [cats] = useCats();
  const [ selected, setSelected ] = useState({});
  const [ currentPosition, setCurrentPosition ] = useState();
  const [map, setMap] = React.useState(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  })

  function geolocationCallback(position) {
      const currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      setCurrentPosition(currentPosition)
      return currentPosition
  }

  function navigatorUnsuccessful(error) {
      console.log("ERROR", error)
  }

  const mapStyles = {
    height: "80vh",
    width: "80%",
    margin: 'auto'
  };

  useEffect(() => {
      navigator.geolocation.getCurrentPosition(geolocationCallback, navigatorUnsuccessful);
      prepareChargingData();
  }, [])

  // useEffect(() => {
  //     console.log("CURRENT POSITION", currentPosition)
  //     const CHARGE_POINT_URL = currentPosition ? `https://pacific-river-24502.herokuapp.com/http://chargepoints.dft.gov.uk/api/retrieve/registry/lat/${currentPosition.lat}/long/${currentPosition.lng}/dist/2/format/json` : null
  //     if (CHARGE_POINT_URL) prepareChargingData(CHARGE_POINT_URL, numberOfMarkers);
  // }, [currentPosition])

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(defaultCenter);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
      setMap(null)
    }, [])

  return isLoaded && currentPosition ? (
        <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={7}
            center={currentPosition}
            onLoad={onLoad}
            >
            {console.log(chargerLocationArray)}
            {chargerLocationArray.length > 0 && chargerLocationArray.map((charger, index) => {
              return (
                <div className='marker'>
                <Marker
                  key={`marker-${index}`}
                  position={charger}
                />
                </div>
              )
            })}
        </GoogleMap>
  ) : <></>
}

export default MapContainer;
