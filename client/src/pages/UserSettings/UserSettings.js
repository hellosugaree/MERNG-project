import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "semantic-ui-react";
import { AuthContext } from "../../context/auth";
import { GET_USER_BASIC_DATA, CREATE_OR_UPDATE_PROFILE_PHOTO } from "../../gql/gql";
import LoaderFish from "../../components/LoaderFish";
import FileSelect from "../../components/FileSelect";
import "../../App.css";
import "./UserSettings.css"

function UserSettings(props) {

  const { user } = useContext(AuthContext);

  const [newProfilePictureData, setNewProfilePictureData] = useState(null);

  const {
    loading: loadingUserBasicData,
    data: userBasicData,
  } = useQuery(GET_USER_BASIC_DATA, {
    variables: { userId: user.id },
    onError: err => console.log(err),
  });


  console.log(userBasicData);
  const [createOrUpdateProfilePhoto, { loading }] = useMutation(CREATE_OR_UPDATE_PROFILE_PHOTO, {
    // options: () => ({ errorPolicy: 'all' }),
    update(cache, data) {
      const query = cache.readQuery({
        query: GET_USER_BASIC_DATA,
        variables: { userId: user.id },
      });
      // make sure the cached data exists
      if (query) {
        const { getUser: cachedUser } = query;
        // now update our user data query so our stats are updated
        if (cachedUser) {
          cache.writeQuery({
            query: GET_USER_BASIC_DATA,
            variables: { userId: user.id },
            data: {
              getUser: {
                ...cachedUser,
                profilePhoto: data.profilePhoto
              }
            }
          });
        }
      }
      setNewProfilePictureData(null);
    },
    onError(err) {
      console.log(err);
    }
  });



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
    console.log(newProfilePictureData);
    createOrUpdateProfilePhoto({ variables: { data: newProfilePictureData } });
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
                {userBasicData.getUser.profilePhoto ? (
                  <img 
                    className="profile-photo-preview"
                    alt="profile"
                    src={userBasicData.getUser.profilePhoto.secure_url}
                  />
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
                alt="profile"
                src={newProfilePictureData}
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
