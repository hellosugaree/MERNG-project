import React from 'react';
import LoaderFish from '../../components/LoaderFish';

const MapStatus = (props) => {
  const { apiStatus, loadingUserCatches, userCatchesError } = props;

  return (apiStatus.loading || loadingUserCatches || userCatchesError) ? 
    <div style={{zIndex: 100, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
      {(apiStatus.loading || loadingUserCatches) && <LoaderFish />}
      {apiStatus.loading && <div style={{fontSize: 16, fontWeight: 'bold', zIndex: 100}}>Loading Map...</div>}
      {loadingUserCatches && <div style={{fontSize: 16, fontWeight: 'bold', zIndex: 100}}>Loading Catches...</div>}
      {userCatchesError && <div style={{fontSize: 16, fontWeight: 'bold',  zIndex: 100}}>Sorry, failed to load catch data from server. Please try again later...</div>}
    </div>
    : null;
  
};

export default MapStatus;