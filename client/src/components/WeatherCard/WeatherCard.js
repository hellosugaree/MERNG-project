import React from 'react';
import { Card, Image } from 'semantic-ui-react';

const WeatherCard = (props) => {
  return (
      <Card fluid>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src={props.weatherImage}
          />
          <Card.Header>{props.forecastDay}</Card.Header>
          <Card.Meta>{props.shortForecast}</Card.Meta>
          <Card.Description>{props.forecastDescription}</Card.Description>
        </Card.Content>
      </Card>
  );
};

export default WeatherCard;