import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button } from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import { GET_USER_BASIC_DATA } from "../../gql/gql";
import LoaderFish from "../../components/LoaderFish";
import FileSelect from "../../components/FileSelect";
import "../../App.css";
import "./UserSettings.css"

function UserSettings(props) {
  const { user } = useContext(AuthContext);

  const {
    loading: loadingUserBasicData,
    data: userBasicData,
  } = useQuery(GET_USER_BASIC_DATA, {
    variables: { userId: user.id },
    onError: err => console.log(err),
  });

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



  return (
    <div className="fit">
      <h1 className="page-title">Preferences</h1>
      {loadingUserBasicData && (
        <div className="loader-container" >
          <LoaderFish />
          <div>Loading user preferences...</div>
        </div>
      )}
      {userBasicData && (
        <div className="profile-photo-select-container" >
          <div className="profile-photo-container" >
            {!newProfilePictureData && (
              <div className="profile-photo-status-container">
                {userBasicData.getUser.preferences.profilePicture.asset_id ? (
                  <div>
                    you have a profile picture
                  </div>
                ) : (
                  <div>
                    No profile photo
                  </div>
                )}
              </div>
            )}
            {newProfilePictureData && (
              <img
                className="profile-photo-preview"
                src={newProfilePictureData}
                alt="profile"
              />
            )}
          </div>
          <div>
            <FileSelect 
              handleFileSelect={handleFileSelect}
              handleAccept={uploadNewProfilePhoto}
              handleCancel={cancelProfileUpload}
              data={newProfilePictureData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSettings;
//  src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_150,h_100/${image.public_id}.jpg`}
