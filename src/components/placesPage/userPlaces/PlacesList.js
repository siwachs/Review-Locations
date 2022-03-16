import React from "react";
import "./placeList.scss";
import Card from "../../utils/Card/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../utils/Button/Button";

function PlacesList(props) {
  if (props.items.length === 0) {
    return (
      <div className="center places_list">
        <Card>
          <h2>No Place Found. Share One?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place_list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          desc={place.desc}
          address={place.address}
          uid={place.uid}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        ></PlaceItem>
      ))}
    </ul>
  );
}

export default PlacesList;
