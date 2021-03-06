import "./Profile.scss";
import React, { useState } from "react";

import { Grid, Image } from "semantic-ui-react";

import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../../gql/user";
import ImageNotFound from "../../../assets/avatar.png";

import UserNotFound from "../../UserNotFound";
import ModalBasic from "../../Modal/ModalBasic";
import AvatarForm from "../AvatarForm/AvatarForm";
import HeaderProfile from "./HeaderProfile";
import SettingsForm from "../SettingsForm";
import Followers from "./Followers";

export default function Profile(props) {
  const { username, totalPublicationsFetch } = props;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [childrenModal, setChildrenModal] = useState(null);

  const userDataFetch = useQuery(GET_USER, {
    variables: {
      username,
    },
  });

  const { data, loading, error } = userDataFetch;
  const { auth } = useAuth();
  // Validaciones
  if (loading) return null;
  if (error) return <UserNotFound />;
  const { getUser } = data;
  // *handlerModal
  const handlerModal = (type) => {
    switch (type) {
      case "avatar":
        setTitleModal("Cambiar foto de perfil");
        setChildrenModal(
          <AvatarForm setShowModal={setShowModal} auth={auth} />
        );
        setShowModal(true);
        break;
      case "settings":
        setTitleModal("");
        setChildrenModal(
          <SettingsForm
            setShowModal={setShowModal}
            setTitleModal={setTitleModal}
            setChildrenModal={setChildrenModal}
            getUser={getUser}
          />
        );
        setShowModal(true);

      default:
        break;
    }
  };

  return (
    <>
      <Grid className="profile">
        <Grid.Column width={5} className="profile__left">
          <Image
            src={getUser.avatar ? getUser.avatar : ImageNotFound}
            avatar
            onClick={() =>
              getUser.username === auth.username && handlerModal("avatar")
            }
          />
        </Grid.Column>

        <Grid.Column width={11} className="profile__right">
          <HeaderProfile
            getUser={getUser}
            auth={auth}
            handlerModal={handlerModal}
          />

          <div>
            <Followers
              username={username}
              handlerModal={handlerModal}
              totalPublicationsFetch={totalPublicationsFetch}
            />
          </div>

          <div className="other">
            <p className="name">{getUser.name}</p>

            {getUser.siteweb && (
              <a target="__blank" href={getUser.siteweb}  className="siteWeb">
                {getUser.siteweb}
              </a>
            )}

            {getUser.description && (
              <p className="description">{getUser.description}</p>
            )}
          </div>
        </Grid.Column>
      </Grid>

      <ModalBasic show={showModal} setShow={setShowModal} title={titleModal}>
        {childrenModal}
      </ModalBasic>
    </>
  );
}
