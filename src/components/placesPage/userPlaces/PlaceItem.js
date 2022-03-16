import React, { useState, useContext } from "react";
import Card from "../../utils/Card/Card";
import "./placeItem.scss";
import Button from "../../utils/Button/Button";
import Modal from "../../model/Modal";
import Map from "../../utils/GoogleMap/Map";
import { AuthContext } from "../../utils/Context/Auth_Context";
import { useHttpClient } from "../../../hooks/http_hook";
import ErrorModal from "../../model/ErrorModal";
import LoadingSpinner from "../../utils/Spinner/LoadingSpinner";

function PlaceItem(props) {
  const [showMap, setShowMap] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMap = () => {
    setShowMap(true);
  };

  const closeMap = () => {
    setShowMap(false);
  };

  const showDeleteWarning = () => {
    setShowDel(true);
  };

  const cancelDelete = () => {
    setShowDel(false);
  };

  const deleteObject = async () => {
    setShowDel(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${auth.token}` }
      );
      props.onDelete(props.id);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <Modal
        show={showMap}
        onCancel={closeMap}
        header={props.address}
        contentClass={`place-item__modal-content`}
        footerClass={`place-item__modal-actions`}
        footer={<Button onClick={closeMap}>CLOSE</Button>}
      >
        <div className="map_container">
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>
      <Modal
        show={showDel}
        onCancel={cancelDelete}
        header="Are you sure?"
        footerClass={`place-item__modal-actions`}
        footer={
          <React.Fragment>
            <Button onClick={cancelDelete} inverse>
              CANCEL
            </Button>
            <Button onClick={deleteObject} danger>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you Want to delete that Object? It can't be undo after.</p>
      </Modal>
      <li className="place_item">
        <Card className="place_item_content">
          {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <div className="place_item_image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}${props.image}`}
              alt={props.title}
            ></img>
          </div>
          <div className="place_item_info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.desc}</p>
          </div>
          <div className="place_item_actions">
            <Button onClick={openMap} inverse>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && auth.uid === props.uid && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && auth.uid === props.uid && (
              <Button onClick={showDeleteWarning} danger>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
}

export default PlaceItem;
