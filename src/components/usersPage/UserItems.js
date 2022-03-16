import React from "react";
import "./userItems.scss";
import Avatar from "../utils/Avatar/Avatar";
import { Link } from "react-router-dom";
import Card from "../utils/Card/Card";

function UserItems({ id, image, name, placeCount }) {
  return (
    <li className="user_item">
      <Card className="user_item_content">
        <Link to={`/${id}/places`}>
          <div className="user_item_image">
            <Avatar
              image={`${process.env.REACT_APP_ASSET_URL}${image}`}
              alt={name}
            ></Avatar>
          </div>
          <div className="user_item_info">
            <h2>{name}</h2>
            <h3>
              {placeCount} {placeCount <= 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
}

export default UserItems;
