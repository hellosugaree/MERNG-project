import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import '../../App.css';

const BeachCard = (props) => {
  const { 
    NameMobileWeb, 
    LocationMobileWeb,
    DescriptionMobileWeb,
    COUNTY,
    LONGITUDE,
    LATITUDE,
    SNDY_BEACH,
    RKY_SHORE,
    Photo_1,
    Photo_2,
    Photo_3,
  } = props;

  return (
    <Card fluid>
      <Card.Content>
      <Card.Header>{NameMobileWeb}</Card.Header>
      <Card.Meta>County: {COUNTY}</Card.Meta>
      <Card.Meta>Coordinates: {LATITUDE}, {LONGITUDE}</Card.Meta>
      <Card.Meta>{SNDY_BEACH === 'Yes' && 'Sandy beach'}</Card.Meta>
      <Card.Meta>{RKY_SHORE === 'Yes' && 'Rocky shore'}</Card.Meta>
      {Photo_1 && <Image style={{margin: 2, objectFit: 'cover', height: 110, width: 110}} rounded  src={Photo_1} alt='Access location' />}
      {Photo_2 && <Image style={{margin: 2, objectFit: 'cover', height: 110, width: 110}} rounded  src={Photo_2} alt='Access location' />}
      {Photo_3 && <Image style={{margin: 2, objectFit: 'cover', height: 110, width: 110}} rounded  src={Photo_3} alt='Access location' />}
      {!Photo_1 && <Card.Meta textAlign='right'>No photo available</Card.Meta>}
      <Card.Description style={{marginTop: 4}} content={LocationMobileWeb}/>
      <Card.Description style={{marginTop: 4}} content={DescriptionMobileWeb}/>
      </Card.Content>
      {/* <div>{loc.LATITUDE}, {loc.LONGITUDE}</div> */}
    </Card>
  )
};

export default BeachCard;