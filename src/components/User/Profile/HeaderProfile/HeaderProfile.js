import React from "react";
import "./HeaderProfile.scss";
import { Button } from "semantic-ui-react";

function HeaderProfile(props) {
  const { getUser, auth, handlerModal } = props;
  return (
    <div className="header-profile">
      <h2>{getUser.username}</h2>
      {getUser.username === auth.username ? (
        <Button onClick={ ()=>handlerModal("settings") } >Ajustes</Button>
      ) : (
        <Button>Follow</Button>
      )}
    </div>
  );
}

export default HeaderProfile;