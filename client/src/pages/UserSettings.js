import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { GET_USER_BASIC_DATA } from "../gql/gql";
import LoaderFish from "../components/LoaderFish";
import "../App.css";

function UserSettings(props) {
  const { user } = useContext(AuthContext);

  const {
    loading: loadingUserBasicData,
    data: userBasicData,
  } = useQuery(GET_USER_BASIC_DATA, {
    variables: { userId: user.id },
    onError: err => console.log(err),
  });

  // state for holding selected profile picture data for updating profilePicture
  const [newProfilePictureData, setNewProfilePictureData] = useState(null);

  const handleFileSelect = async file => {
    if (!file) {
      return setNewProfilePictureData(null);
    }
    async function generateFileData(file) {
      const readFile = file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };
      let fileData = null;
      try {
        fileData = readFile(file);
      } catch (err) {
        console.log(err);
      }
      const data = await fileData;
      return data;
    }

    // convert to an array of image data and update the state used to display previews and pass back to our form for the controlled image data value
    const fileData = await generateFileData(file);
    setNewProfilePictureData(fileData);
  };

  const cancelProfileUpload = () => {
    setNewProfilePictureData(null);
  };

  const uploadNewProfilePhoto = () => {
    // upload new profile photo
  };

  const renderFileSelect = () => {
    return !newProfilePictureData ? (
      <label className="file-input-label">
        New Profile Photo
        <input
          onChange={e => handleFileSelect(e.target.files[0])}
          type="file"
          name="images"
          accept="image/*"
          style={{ display: "none" }}
        />
      </label>
    ) : (
      <div>
        <Button
          onClick={uploadNewProfilePhoto}
          inline
          color="teal"
          type="button"
          style={{ fontSize: 20, padding: 10 }}
        >
          Accept
        </Button>
        <Button
          onClick={cancelProfileUpload}
          inline
          color="red"
          type="button"
          style={{ fontSize: 20, padding: 10 }}
        >
          Cancel
        </Button>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
      <h1 className="page-title">Preferences</h1>
      {loadingUserBasicData && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoaderFish />
          <div>Loading user preferences...</div>
        </div>
      )}
      {userBasicData && (
        <div
          style={{
            width: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 200,
              width: 200,
              borderRadius: "50%",
              border: "3px solid lightgray",
              marginBottom: 20,
              overFlow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {!newProfilePictureData && (
              <div>
                {userBasicData.getUser.preferences.profilePicture.asset_id ? (
                  <div>you have a profile picture</div>
                ) : (
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    No profile photo
                  </div>
                )}
              </div>
            )}
            {newProfilePictureData && (
              <img
                src={newProfilePictureData}
                alt="profile"
                style={{
                  minWidth: "100%",
                  minHeight: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
          <div>{renderFileSelect()}</div>
        </div>
      )}
    </div>
  );
}

export default UserSettings;
//  src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_150,h_100/${image.public_id}.jpg`}
