import React, { useState, useEffect } from "react";
import PlacesList from "./PlacesList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../../hooks/http_hook";
import ErrorModal from "../../model/ErrorModal";
import LoadingSpinner from "../../utils/Spinner/LoadingSpinner";

function UserPlaces() {
  const uid = useParams().uid;
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${uid}`
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {}
    }
    fetchData();
  }, [sendRequest, uid]);

  const placeDelete = (deletePlaceId) => {
    setLoadedPlaces((prevState) =>
      prevState.filter((place) => place.id !== deletePlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlacesList
          items={loadedPlaces}
          onDeletePlace={placeDelete}
        ></PlacesList>
      )}
    </React.Fragment>
  );
}

export default UserPlaces;
