import React, { useState, useEffect } from 'react';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter, VictoryLabel } from 'victory';
import { Card } from 'semantic-ui-react';
import WeatherCard from './WeatherCard';
import LoaderFish from './LoaderFish';
import GoogleMap from './GoogleMap';
import { useGoogleMap } from '../utilities/hooks';
import { DateTime, Duration } from 'luxon';

import '../App.css';

const selectLocationButton = document.createElement('button');
selectLocationButton.classList.add('custom-map-control-button');
selectLocationButton.innerHTML='Get Weather';


const staticData = {
  "@id": "https://api.weather.gov/gridpoints/SGX/18,33",
  "@type": "wx:Gridpoint",
  "updateTime": "2021-06-18T09:45:32+00:00",
  "validTimes": "2021-06-18T03:00:00+00:00/P7DT22H",
  "elevation": {
      "unitCode": "wmoUnit:m",
      "value": 0
  },
  "forecastOffice": "https://api.weather.gov/offices/SGX",
  "gridId": "SGX",
  "gridX": "18",
  "gridY": "33",
  "temperature": {
      "uom": "wmoUnit:degC",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT4H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-18T08:00:00+00:00/PT1H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT8H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT4H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT1H",
              "value": 17.22222222222222
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-18T23:00:00+00:00/PT3H",
              "value": 17.22222222222222
          },
          {
              "validTime": "2021-06-19T02:00:00+00:00/PT8H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-19T10:00:00+00:00/PT1H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T11:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT2H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T14:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-19T15:00:00+00:00/PT2H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT1H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T19:00:00+00:00/PT12H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-20T07:00:00+00:00/PT9H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-20T16:00:00+00:00/PT12H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-21T04:00:00+00:00/PT15H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-21T19:00:00+00:00/PT5H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT13H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-22T13:00:00+00:00/PT3H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-22T16:00:00+00:00/PT4H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-22T20:00:00+00:00/PT9H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-23T05:00:00+00:00/PT4H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT5H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-23T14:00:00+00:00/PT4H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT9H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-24T03:00:00+00:00/PT8H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-24T11:00:00+00:00/PT6H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-24T17:00:00+00:00/PT2H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-24T19:00:00+00:00/PT10H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-25T05:00:00+00:00/PT14H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-25T19:00:00+00:00/PT6H",
              "value": 16.666666666666668
          }
      ]
  },
  "dewpoint": {
      "uom": "wmoUnit:degC",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT1H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT6H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-18T13:00:00+00:00/PT2H",
              "value": 15
          },
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT9H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT2H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T02:00:00+00:00/PT5H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-19T07:00:00+00:00/PT10H",
              "value": 15
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT1H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT2H",
              "value": 15
          },
          {
              "validTime": "2021-06-19T20:00:00+00:00/PT10H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT3H",
              "value": 15
          },
          {
              "validTime": "2021-06-20T09:00:00+00:00/PT5H",
              "value": 14.444444444444445
          },
          {
              "validTime": "2021-06-20T14:00:00+00:00/PT7H",
              "value": 15
          },
          {
              "validTime": "2021-06-20T21:00:00+00:00/PT4H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-21T01:00:00+00:00/PT8H",
              "value": 15
          },
          {
              "validTime": "2021-06-21T09:00:00+00:00/PT13H",
              "value": 14.444444444444445
          },
          {
              "validTime": "2021-06-21T22:00:00+00:00/PT2H",
              "value": 15
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT1H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-22T01:00:00+00:00/PT3H",
              "value": 15
          },
          {
              "validTime": "2021-06-22T04:00:00+00:00/PT7H",
              "value": 14.444444444444445
          },
          {
              "validTime": "2021-06-22T11:00:00+00:00/PT4H",
              "value": 13.88888888888889
          },
          {
              "validTime": "2021-06-22T15:00:00+00:00/PT8H",
              "value": 14.444444444444445
          },
          {
              "validTime": "2021-06-22T23:00:00+00:00/PT4H",
              "value": 15
          },
          {
              "validTime": "2021-06-23T03:00:00+00:00/PT9H",
              "value": 14.444444444444445
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT1H",
              "value": 13.88888888888889
          },
          {
              "validTime": "2021-06-23T13:00:00+00:00/PT7H",
              "value": 14.444444444444445
          },
          {
              "validTime": "2021-06-23T20:00:00+00:00/PT7H",
              "value": 15
          },
          {
              "validTime": "2021-06-24T03:00:00+00:00/PT19H",
              "value": 14.444444444444445
          },
          {
              "validTime": "2021-06-24T22:00:00+00:00/PT7H",
              "value": 15
          },
          {
              "validTime": "2021-06-25T05:00:00+00:00/PT15H",
              "value": 14.444444444444445
          },
          {
              "validTime": "2021-06-25T20:00:00+00:00/PT3H",
              "value": 15
          },
          {
              "validTime": "2021-06-25T23:00:00+00:00/PT2H",
              "value": 15.555555555555555
          }
      ]
  },
  "maxTemperature": {
      "uom": "wmoUnit:degC",
      "values": [
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT12H",
              "value": 18.333333333333332
          },
          {
              "validTime": "2021-06-19T15:00:00+00:00/PT12H",
              "value": 17.77777777777778
          },
          {
              "validTime": "2021-06-20T15:00:00+00:00/PT12H",
              "value": 17.22222222222222
          },
          {
              "validTime": "2021-06-21T15:00:00+00:00/PT12H",
              "value": 17.22222222222222
          },
          {
              "validTime": "2021-06-22T15:00:00+00:00/PT12H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-23T15:00:00+00:00/PT12H",
              "value": 17.22222222222222
          },
          {
              "validTime": "2021-06-24T15:00:00+00:00/PT12H",
              "value": 17.77777777777778
          },
          {
              "validTime": "2021-06-25T15:00:00+00:00/PT12H",
              "value": 17.77777777777778
          }
      ]
  },
  "minTemperature": {
      "uom": "wmoUnit:degC",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT15H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT15H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-20T03:00:00+00:00/PT15H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT15H",
              "value": 15
          },
          {
              "validTime": "2021-06-22T03:00:00+00:00/PT15H",
              "value": 15
          },
          {
              "validTime": "2021-06-23T03:00:00+00:00/PT15H",
              "value": 15
          },
          {
              "validTime": "2021-06-24T03:00:00+00:00/PT15H",
              "value": 15
          },
          {
              "validTime": "2021-06-25T03:00:00+00:00/PT15H",
              "value": 15
          },
          {
              "validTime": "2021-06-26T03:00:00+00:00/PT6H",
              "value": 15
          }
      ]
  },
  "relativeHumidity": {
      "uom": "wmoUnit:percent",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 93
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT2H",
              "value": 96
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT1H",
              "value": 98
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT1H",
              "value": 96
          },
          {
              "validTime": "2021-06-18T08:00:00+00:00/PT1H",
              "value": 97
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT1H",
              "value": 98
          },
          {
              "validTime": "2021-06-18T10:00:00+00:00/PT1H",
              "value": 94
          },
          {
              "validTime": "2021-06-18T11:00:00+00:00/PT1H",
              "value": 96
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT1H",
              "value": 97
          },
          {
              "validTime": "2021-06-18T13:00:00+00:00/PT2H",
              "value": 93
          },
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT1H",
              "value": 94
          },
          {
              "validTime": "2021-06-18T16:00:00+00:00/PT2H",
              "value": 96
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT2H",
              "value": 94
          },
          {
              "validTime": "2021-06-18T20:00:00+00:00/PT1H",
              "value": 93
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-18T23:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT1H",
              "value": 93
          },
          {
              "validTime": "2021-06-19T01:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-19T02:00:00+00:00/PT1H",
              "value": 93
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-19T04:00:00+00:00/PT1H",
              "value": 94
          },
          {
              "validTime": "2021-06-19T05:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT3H",
              "value": 92
          },
          {
              "validTime": "2021-06-19T09:00:00+00:00/PT1H",
              "value": 93
          },
          {
              "validTime": "2021-06-19T10:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-19T11:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT1H",
              "value": 93
          },
          {
              "validTime": "2021-06-19T13:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-19T14:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-19T15:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-19T16:00:00+00:00/PT1H",
              "value": 93
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT1H",
              "value": 94
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-19T19:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-19T20:00:00+00:00/PT13H",
              "value": 92
          },
          {
              "validTime": "2021-06-20T09:00:00+00:00/PT5H",
              "value": 91
          },
          {
              "validTime": "2021-06-20T14:00:00+00:00/PT2H",
              "value": 92
          },
          {
              "validTime": "2021-06-20T16:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-20T17:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT2H",
              "value": 89
          },
          {
              "validTime": "2021-06-20T20:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-20T21:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-20T22:00:00+00:00/PT9H",
              "value": 92
          },
          {
              "validTime": "2021-06-21T07:00:00+00:00/PT2H",
              "value": 93
          },
          {
              "validTime": "2021-06-21T09:00:00+00:00/PT2H",
              "value": 92
          },
          {
              "validTime": "2021-06-21T11:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-21T13:00:00+00:00/PT2H",
              "value": 91
          },
          {
              "validTime": "2021-06-21T15:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-21T16:00:00+00:00/PT2H",
              "value": 91
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-21T19:00:00+00:00/PT3H",
              "value": 89
          },
          {
              "validTime": "2021-06-21T22:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-21T23:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT2H",
              "value": 94
          },
          {
              "validTime": "2021-06-22T02:00:00+00:00/PT2H",
              "value": 92
          },
          {
              "validTime": "2021-06-22T04:00:00+00:00/PT5H",
              "value": 91
          },
          {
              "validTime": "2021-06-22T09:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-22T10:00:00+00:00/PT1H",
              "value": 89
          },
          {
              "validTime": "2021-06-22T11:00:00+00:00/PT3H",
              "value": 88
          },
          {
              "validTime": "2021-06-22T14:00:00+00:00/PT2H",
              "value": 90
          },
          {
              "validTime": "2021-06-22T16:00:00+00:00/PT3H",
              "value": 91
          },
          {
              "validTime": "2021-06-22T19:00:00+00:00/PT1H",
              "value": 89
          },
          {
              "validTime": "2021-06-22T20:00:00+00:00/PT1H",
              "value": 88
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT1H",
              "value": 86
          },
          {
              "validTime": "2021-06-22T22:00:00+00:00/PT1H",
              "value": 87
          },
          {
              "validTime": "2021-06-22T23:00:00+00:00/PT1H",
              "value": 89
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/PT3H",
              "value": 90
          },
          {
              "validTime": "2021-06-23T03:00:00+00:00/PT3H",
              "value": 89
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT2H",
              "value": 90
          },
          {
              "validTime": "2021-06-23T08:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-23T10:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-23T11:00:00+00:00/PT3H",
              "value": 90
          },
          {
              "validTime": "2021-06-23T14:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-23T15:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-23T16:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-23T17:00:00+00:00/PT1H",
              "value": 89
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT1H",
              "value": 88
          },
          {
              "validTime": "2021-06-23T19:00:00+00:00/PT1H",
              "value": 89
          },
          {
              "validTime": "2021-06-23T20:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-23T21:00:00+00:00/PT5H",
              "value": 91
          },
          {
              "validTime": "2021-06-24T02:00:00+00:00/PT10H",
              "value": 90
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-24T13:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-24T14:00:00+00:00/PT3H",
              "value": 93
          },
          {
              "validTime": "2021-06-24T17:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-24T19:00:00+00:00/PT1H",
              "value": 89
          },
          {
              "validTime": "2021-06-24T20:00:00+00:00/PT2H",
              "value": 88
          },
          {
              "validTime": "2021-06-24T22:00:00+00:00/PT1H",
              "value": 89
          },
          {
              "validTime": "2021-06-24T23:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT2H",
              "value": 92
          },
          {
              "validTime": "2021-06-25T02:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-25T03:00:00+00:00/PT4H",
              "value": 90
          },
          {
              "validTime": "2021-06-25T07:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-25T08:00:00+00:00/PT2H",
              "value": 92
          },
          {
              "validTime": "2021-06-25T10:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-25T11:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-25T12:00:00+00:00/PT1H",
              "value": 89
          },
          {
              "validTime": "2021-06-25T13:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-25T14:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-25T15:00:00+00:00/PT1H",
              "value": 93
          },
          {
              "validTime": "2021-06-25T16:00:00+00:00/PT1H",
              "value": 92
          },
          {
              "validTime": "2021-06-25T17:00:00+00:00/PT1H",
              "value": 91
          },
          {
              "validTime": "2021-06-25T18:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-25T19:00:00+00:00/PT3H",
              "value": 89
          },
          {
              "validTime": "2021-06-25T22:00:00+00:00/PT2H",
              "value": 90
          },
          {
              "validTime": "2021-06-26T00:00:00+00:00/PT1H",
              "value": 92
          }
      ]
  },
  "apparentTemperature": {
      "uom": "wmoUnit:degC",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT13H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT4H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT1H",
              "value": 17.22222222222222
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-18T23:00:00+00:00/PT4H",
              "value": 17.22222222222222
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT7H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-19T10:00:00+00:00/PT1H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T11:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT2H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T14:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-19T15:00:00+00:00/PT2H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT1H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT1H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-19T19:00:00+00:00/PT12H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-20T07:00:00+00:00/PT9H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-20T16:00:00+00:00/PT12H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-21T04:00:00+00:00/PT16H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-21T20:00:00+00:00/PT4H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT14H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-22T14:00:00+00:00/PT1H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-22T15:00:00+00:00/PT5H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-22T20:00:00+00:00/PT9H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-23T05:00:00+00:00/PT4H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT5H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-23T14:00:00+00:00/PT4H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT9H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-24T03:00:00+00:00/PT9H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT5H",
              "value": 15.555555555555555
          },
          {
              "validTime": "2021-06-24T17:00:00+00:00/PT3H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-24T20:00:00+00:00/PT9H",
              "value": 16.666666666666668
          },
          {
              "validTime": "2021-06-25T05:00:00+00:00/PT14H",
              "value": 16.11111111111111
          },
          {
              "validTime": "2021-06-25T19:00:00+00:00/PT6H",
              "value": 16.666666666666668
          }
      ]
  },
  "heatIndex": {
      "uom": "wmoUnit:degC",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P7DT22H",
              "value": null
          }
      ]
  },
  "windChill": {
      "uom": "wmoUnit:degC",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P7DT22H",
              "value": null
          }
      ]
  },
  "skyCover": {
      "uom": "wmoUnit:percent",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 71
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT1H",
              "value": 66
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT2H",
              "value": 72
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT1H",
              "value": 69
          },
          {
              "validTime": "2021-06-18T08:00:00+00:00/PT1H",
              "value": 77
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT1H",
              "value": 74
          },
          {
              "validTime": "2021-06-18T10:00:00+00:00/PT1H",
              "value": 77
          },
          {
              "validTime": "2021-06-18T11:00:00+00:00/PT1H",
              "value": 74
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT1H",
              "value": 83
          },
          {
              "validTime": "2021-06-18T13:00:00+00:00/PT1H",
              "value": 79
          },
          {
              "validTime": "2021-06-18T14:00:00+00:00/PT1H",
              "value": 65
          },
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT1H",
              "value": 60
          },
          {
              "validTime": "2021-06-18T16:00:00+00:00/PT1H",
              "value": 72
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT1H",
              "value": 81
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT1H",
              "value": 75
          },
          {
              "validTime": "2021-06-18T19:00:00+00:00/PT1H",
              "value": 74
          },
          {
              "validTime": "2021-06-18T20:00:00+00:00/PT1H",
              "value": 73
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT1H",
              "value": 49
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT1H",
              "value": 52
          },
          {
              "validTime": "2021-06-18T23:00:00+00:00/PT1H",
              "value": 57
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT1H",
              "value": 60
          },
          {
              "validTime": "2021-06-19T01:00:00+00:00/PT1H",
              "value": 63
          },
          {
              "validTime": "2021-06-19T02:00:00+00:00/PT1H",
              "value": 49
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT1H",
              "value": 72
          },
          {
              "validTime": "2021-06-19T04:00:00+00:00/PT1H",
              "value": 69
          },
          {
              "validTime": "2021-06-19T05:00:00+00:00/PT1H",
              "value": 77
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT1H",
              "value": 73
          },
          {
              "validTime": "2021-06-19T07:00:00+00:00/PT1H",
              "value": 68
          },
          {
              "validTime": "2021-06-19T08:00:00+00:00/PT1H",
              "value": 74
          },
          {
              "validTime": "2021-06-19T09:00:00+00:00/PT1H",
              "value": 71
          },
          {
              "validTime": "2021-06-19T10:00:00+00:00/PT1H",
              "value": 73
          },
          {
              "validTime": "2021-06-19T11:00:00+00:00/PT1H",
              "value": 69
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT1H",
              "value": 73
          },
          {
              "validTime": "2021-06-19T13:00:00+00:00/PT1H",
              "value": 74
          },
          {
              "validTime": "2021-06-19T14:00:00+00:00/PT1H",
              "value": 59
          },
          {
              "validTime": "2021-06-19T15:00:00+00:00/PT1H",
              "value": 55
          },
          {
              "validTime": "2021-06-19T16:00:00+00:00/PT1H",
              "value": 74
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT1H",
              "value": 80
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT1H",
              "value": 70
          },
          {
              "validTime": "2021-06-19T19:00:00+00:00/PT1H",
              "value": 58
          },
          {
              "validTime": "2021-06-19T20:00:00+00:00/PT1H",
              "value": 45
          },
          {
              "validTime": "2021-06-19T21:00:00+00:00/PT1H",
              "value": 33
          },
          {
              "validTime": "2021-06-19T22:00:00+00:00/PT1H",
              "value": 37
          },
          {
              "validTime": "2021-06-19T23:00:00+00:00/PT1H",
              "value": 46
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT6H",
              "value": 50
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT12H",
              "value": 47
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT6H",
              "value": 26
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT6H",
              "value": 57
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT6H",
              "value": 50
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT6H",
              "value": 52
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT6H",
              "value": 50
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT6H",
              "value": 55
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT6H",
              "value": 68
          },
          {
              "validTime": "2021-06-22T12:00:00+00:00/PT6H",
              "value": 76
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT6H",
              "value": 67
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/PT6H",
              "value": 52
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT6H",
              "value": 48
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT6H",
              "value": 55
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT6H",
              "value": 49
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT12H",
              "value": 47
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT6H",
              "value": 55
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT6H",
              "value": 52
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT6H",
              "value": 43
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT6H",
              "value": 38
          },
          {
              "validTime": "2021-06-25T12:00:00+00:00/PT6H",
              "value": 49
          },
          {
              "validTime": "2021-06-25T18:00:00+00:00/PT6H",
              "value": 54
          },
          {
              "validTime": "2021-06-26T00:00:00+00:00/PT6H",
              "value": 29
          }
      ]
  },
  "windDirection": {
      "uom": "wmoUnit:degree_(angle)",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 180
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT1H",
              "value": 200
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT1H",
              "value": 170
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT1H",
              "value": 180
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT1H",
              "value": 190
          },
          {
              "validTime": "2021-06-18T08:00:00+00:00/PT1H",
              "value": 160
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT2H",
              "value": 140
          },
          {
              "validTime": "2021-06-18T11:00:00+00:00/PT2H",
              "value": 160
          },
          {
              "validTime": "2021-06-18T13:00:00+00:00/PT2H",
              "value": 170
          },
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT2H",
              "value": 180
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT2H",
              "value": 190
          },
          {
              "validTime": "2021-06-18T19:00:00+00:00/PT2H",
              "value": 200
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT1H",
              "value": 210
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT1H",
              "value": 230
          },
          {
              "validTime": "2021-06-18T23:00:00+00:00/PT1H",
              "value": 250
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT1H",
              "value": 270
          },
          {
              "validTime": "2021-06-19T01:00:00+00:00/PT2H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT2H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T05:00:00+00:00/PT2H",
              "value": 300
          },
          {
              "validTime": "2021-06-19T07:00:00+00:00/PT2H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T09:00:00+00:00/PT1H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T10:00:00+00:00/PT1H",
              "value": 270
          },
          {
              "validTime": "2021-06-19T11:00:00+00:00/PT1H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT1H",
              "value": 300
          },
          {
              "validTime": "2021-06-19T13:00:00+00:00/PT1H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T14:00:00+00:00/PT3H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT1H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT18H",
              "value": 280
          },
          {
              "validTime": "2021-06-20T12:00:00+00:00/PT6H",
              "value": 290
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT9H",
              "value": 280
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT9H",
              "value": 290
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT6H",
              "value": 300
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT15H",
              "value": 300
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT6H",
              "value": 290
          },
          {
              "validTime": "2021-06-23T03:00:00+00:00/PT15H",
              "value": 300
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT12H",
              "value": 300
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT9H",
              "value": 290
          },
          {
              "validTime": "2021-06-25T03:00:00+00:00/PT3H",
              "value": 300
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-25T18:00:00+00:00/PT3H",
              "value": 280
          },
          {
              "validTime": "2021-06-25T21:00:00+00:00/PT6H",
              "value": 290
          }
      ]
  },
  "windSpeed": {
      "uom": "wmoUnit:km_h-1",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT1H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT1H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT3H",
              "value": 7.408
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT8H",
              "value": 5.556
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT14H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-19T07:00:00+00:00/PT9H",
              "value": 7.408
          },
          {
              "validTime": "2021-06-19T16:00:00+00:00/PT5H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-19T21:00:00+00:00/PT3H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-20T03:00:00+00:00/PT3H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT12H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT3H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-20T21:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT3H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT12H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-21T21:00:00+00:00/PT3H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-22T03:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT3H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-22T09:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-22T12:00:00+00:00/PT6H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/PT6H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT6H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-23T15:00:00+00:00/PT3H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-23T21:00:00+00:00/PT3H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT6H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-24T09:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT6H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-24T21:00:00+00:00/PT3H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT3H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-25T03:00:00+00:00/PT3H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-25T09:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-25T12:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-25T15:00:00+00:00/PT6H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-25T21:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-26T00:00:00+00:00/PT3H",
              "value": 27.78
          }
      ]
  },
  "windGust": {
      "uom": "wmoUnit:km_h-1",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT2H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT2H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT4H",
              "value": 7.408
          },
          {
              "validTime": "2021-06-18T11:00:00+00:00/PT1H",
              "value": 5.556
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT4H",
              "value": 7.408
          },
          {
              "validTime": "2021-06-18T16:00:00+00:00/PT3H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-18T19:00:00+00:00/PT8H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT1H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-19T04:00:00+00:00/PT5H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-19T09:00:00+00:00/PT4H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-19T13:00:00+00:00/PT4H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT1H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT3H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-19T21:00:00+00:00/PT3H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-20T03:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT12H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-20T21:00:00+00:00/PT3H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT3H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT3H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-21T09:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-21T15:00:00+00:00/PT3H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-21T21:00:00+00:00/PT3H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT6H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT3H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-22T09:00:00+00:00/PT3H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-22T12:00:00+00:00/PT9H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT3H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/PT6H",
              "value": 33.336
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT3H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT3H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT9H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-23T21:00:00+00:00/PT3H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT3H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-24T03:00:00+00:00/PT3H",
              "value": 33.336
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT3H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-24T09:00:00+00:00/PT3H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT9H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-24T21:00:00+00:00/PT3H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT6H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT3H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-25T09:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-25T12:00:00+00:00/PT3H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-25T15:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-25T18:00:00+00:00/PT3H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-25T21:00:00+00:00/PT3H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-26T00:00:00+00:00/PT3H",
              "value": 27.78
          }
      ]
  },
  "weather": {
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": [
                  {
                      "coverage": null,
                      "weather": null,
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": "slight_chance",
                      "weather": "rain_showers",
                      "intensity": "light",
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": null,
                      "weather": null,
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": "patchy",
                      "weather": "fog",
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": 4.828032
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": null,
                      "weather": null,
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": "patchy",
                      "weather": "fog",
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": 8.04672
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": null,
                      "weather": null,
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": "patchy",
                      "weather": "fog",
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": 8.04672
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": null,
                      "weather": null,
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": "patchy",
                      "weather": "fog",
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": 8.04672
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": null,
                      "weather": null,
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": "patchy",
                      "weather": "fog",
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": 8.04672
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": null,
                      "weather": null,
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT12H",
              "value": [
                  {
                      "coverage": "patchy",
                      "weather": "fog",
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": 8.04672
                      },
                      "attributes": []
                  }
              ]
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/P1DT6H",
              "value": [
                  {
                      "coverage": null,
                      "weather": null,
                      "intensity": null,
                      "visibility": {
                          "unitCode": "wmoUnit:km",
                          "value": null
                      },
                      "attributes": []
                  }
              ]
          }
      ]
  },
  "hazards": {
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P3DT1H",
              "value": [
                  {
                      "phenomenon": "<None>",
                      "significance": null,
                      "event_number": null
                  }
              ]
          }
      ]
  },
  "probabilityOfPrecipitation": {
      "uom": "wmoUnit:percent",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": 0
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT12H",
              "value": 20
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/P4DT18H",
              "value": 0
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/P1DT12H",
              "value": 1
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/P1D",
              "value": 0
          }
      ]
  },
  "quantitativePrecipitation": {
      "uom": "wmoUnit:mm",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": 0
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT6H",
              "value": 0.508
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-20T12:00:00+00:00/P4DT18H",
              "value": 0
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-25T12:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-25T18:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-26T00:00:00+00:00/PT6H",
              "value": 0
          }
      ]
  },
  "iceAccumulation": {
      "uom": "wmoUnit:mm",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": 0
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-20T12:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-22T12:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT6H",
              "value": 0
          }
      ]
  },
  "snowfallAmount": {
      "uom": "wmoUnit:mm",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P3DT3H",
              "value": 0
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT6H",
              "value": 0
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT6H",
              "value": 0
          }
      ]
  },
  "snowLevel": {
      "uom": "wmoUnit:m",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": 4344.0096
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT3H",
              "value": 4354.068
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT3H",
              "value": 4290.9744
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT3H",
              "value": 4272.9912
          },
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT3H",
              "value": 4288.8408
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT3H",
              "value": 4265.0664
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT3H",
              "value": 4284.8784
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT3H",
              "value": 4241.9016
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT3H",
              "value": 4262.9328
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT3H",
              "value": 4322.064
          },
          {
              "validTime": "2021-06-19T09:00:00+00:00/PT3H",
              "value": 4297.0704
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT6H",
              "value": 4224.2232
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT6H",
              "value": 4132.1736
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT6H",
              "value": 4070.604
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT6H",
              "value": 3783.4824
          },
          {
              "validTime": "2021-06-20T12:00:00+00:00/PT6H",
              "value": 3674.9736
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT6H",
              "value": 3639.0072
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT6H",
              "value": 3629.8632
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT6H",
              "value": 3447.8976
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT6H",
              "value": 3319.8816
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT6H",
              "value": 3244.9008
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT6H",
              "value": 3285.1344
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT6H",
              "value": 3248.8632
          },
          {
              "validTime": "2021-06-22T12:00:00+00:00/PT6H",
              "value": 3191.8656
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT6H",
              "value": 3219.9072
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/PT6H",
              "value": 3225.0888
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT6H",
              "value": 3189.1224
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT6H",
              "value": 3157.1184
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT6H",
              "value": 3168.0912
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT6H",
              "value": 3276.9048
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT6H",
              "value": 3346.0944
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT6H",
              "value": 3322.9296
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT6H",
              "value": 3381.756
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT6H",
              "value": 3375.9648
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT6H",
              "value": 3385.1088
          },
          {
              "validTime": "2021-06-25T12:00:00+00:00/PT6H",
              "value": 3404.9208
          },
          {
              "validTime": "2021-06-25T18:00:00+00:00/PT6H",
              "value": 3417.1128
          },
          {
              "validTime": "2021-06-26T00:00:00+00:00/PT6H",
              "value": 3400.9584
          }
      ]
  },
  "ceilingHeight": {
      "values": []
  },
  "visibility": {
      "values": []
  },
  "transportWindSpeed": {
      "uom": "wmoUnit:km_h-1",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT1H",
              "value": 5.556
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT2H",
              "value": 3.704
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT2H",
              "value": 1.852
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT3H",
              "value": 3.704
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT2H",
              "value": 1.852
          },
          {
              "validTime": "2021-06-18T14:00:00+00:00/PT1H",
              "value": 0
          },
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT1H",
              "value": 1.852
          },
          {
              "validTime": "2021-06-18T16:00:00+00:00/PT2H",
              "value": 3.704
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT1H",
              "value": 5.556
          },
          {
              "validTime": "2021-06-18T19:00:00+00:00/PT3H",
              "value": 7.408
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT2H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT1H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-19T01:00:00+00:00/PT2H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT3H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT1H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-19T07:00:00+00:00/PT2H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-19T09:00:00+00:00/PT7H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-19T16:00:00+00:00/PT2H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT1H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-19T19:00:00+00:00/PT1H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-19T20:00:00+00:00/PT1H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-19T21:00:00+00:00/PT1H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-19T22:00:00+00:00/PT1H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-19T23:00:00+00:00/PT2H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-20T01:00:00+00:00/PT1H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-20T02:00:00+00:00/PT2H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-20T04:00:00+00:00/PT4H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-20T08:00:00+00:00/PT6H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-20T14:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-20T17:00:00+00:00/PT2H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-20T19:00:00+00:00/PT1H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-20T20:00:00+00:00/PT1H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-20T21:00:00+00:00/PT1H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-20T22:00:00+00:00/PT4H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-21T02:00:00+00:00/PT2H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-21T04:00:00+00:00/PT1H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-21T05:00:00+00:00/PT1H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT1H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-21T07:00:00+00:00/PT2H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-21T09:00:00+00:00/PT2H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-21T11:00:00+00:00/PT3H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-21T14:00:00+00:00/PT2H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-21T16:00:00+00:00/PT1H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-21T17:00:00+00:00/PT2H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-21T19:00:00+00:00/PT1H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-21T20:00:00+00:00/PT1H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-21T21:00:00+00:00/PT1H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-21T22:00:00+00:00/PT1H",
              "value": 33.336
          },
          {
              "validTime": "2021-06-21T23:00:00+00:00/PT1H",
              "value": 37.04
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT3H",
              "value": 38.892
          },
          {
              "validTime": "2021-06-22T03:00:00+00:00/PT2H",
              "value": 37.04
          },
          {
              "validTime": "2021-06-22T05:00:00+00:00/PT1H",
              "value": 33.336
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT1H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-22T07:00:00+00:00/PT2H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-22T09:00:00+00:00/PT1H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-22T10:00:00+00:00/PT2H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-22T12:00:00+00:00/PT6H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT1H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-22T19:00:00+00:00/PT1H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-22T20:00:00+00:00/PT1H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT1H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-22T22:00:00+00:00/PT1H",
              "value": 33.336
          },
          {
              "validTime": "2021-06-22T23:00:00+00:00/PT1H",
              "value": 35.188
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/PT1H",
              "value": 37.04
          },
          {
              "validTime": "2021-06-23T01:00:00+00:00/PT1H",
              "value": 40.744
          },
          {
              "validTime": "2021-06-23T02:00:00+00:00/PT1H",
              "value": 42.596
          },
          {
              "validTime": "2021-06-23T03:00:00+00:00/PT1H",
              "value": 44.448
          },
          {
              "validTime": "2021-06-23T04:00:00+00:00/PT1H",
              "value": 42.596
          },
          {
              "validTime": "2021-06-23T05:00:00+00:00/PT1H",
              "value": 40.744
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT1H",
              "value": 37.04
          },
          {
              "validTime": "2021-06-23T07:00:00+00:00/PT1H",
              "value": 35.188
          },
          {
              "validTime": "2021-06-23T08:00:00+00:00/PT1H",
              "value": 33.336
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT1H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-23T10:00:00+00:00/PT1H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-23T11:00:00+00:00/PT1H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT4H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-23T16:00:00+00:00/PT1H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-23T17:00:00+00:00/PT1H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT1H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-23T19:00:00+00:00/PT1H",
              "value": 33.336
          },
          {
              "validTime": "2021-06-23T20:00:00+00:00/PT1H",
              "value": 35.188
          },
          {
              "validTime": "2021-06-23T21:00:00+00:00/PT3H",
              "value": 37.04
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT2H",
              "value": 38.892
          },
          {
              "validTime": "2021-06-24T02:00:00+00:00/PT2H",
              "value": 37.04
          },
          {
              "validTime": "2021-06-24T04:00:00+00:00/PT1H",
              "value": 35.188
          },
          {
              "validTime": "2021-06-24T05:00:00+00:00/PT1H",
              "value": 31.484
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT1H",
              "value": 29.632
          },
          {
              "validTime": "2021-06-24T07:00:00+00:00/PT1H",
              "value": 27.78
          },
          {
              "validTime": "2021-06-24T08:00:00+00:00/PT1H",
              "value": 25.928
          },
          {
              "validTime": "2021-06-24T09:00:00+00:00/PT1H",
              "value": 24.076
          },
          {
              "validTime": "2021-06-24T10:00:00+00:00/PT2H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT1H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-24T13:00:00+00:00/PT1H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-24T14:00:00+00:00/PT1H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-24T15:00:00+00:00/PT2H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-24T17:00:00+00:00/PT2H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-24T19:00:00+00:00/PT1H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-24T20:00:00+00:00/PT1H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-24T21:00:00+00:00/PT2H",
              "value": 22.224
          },
          {
              "validTime": "2021-06-24T23:00:00+00:00/PT2H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-25T01:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-25T04:00:00+00:00/PT2H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT1H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-25T07:00:00+00:00/PT2H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-25T09:00:00+00:00/PT1H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-25T10:00:00+00:00/PT2H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-25T12:00:00+00:00/PT1H",
              "value": 14.816
          }
      ]
  },
  "transportWindDirection": {
      "uom": "wmoUnit:degree_(angle)",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 180
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT1H",
              "value": 200
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT1H",
              "value": 250
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT1H",
              "value": 0
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT1H",
              "value": 50
          },
          {
              "validTime": "2021-06-18T08:00:00+00:00/PT1H",
              "value": 60
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT1H",
              "value": 80
          },
          {
              "validTime": "2021-06-18T10:00:00+00:00/PT1H",
              "value": 90
          },
          {
              "validTime": "2021-06-18T11:00:00+00:00/PT1H",
              "value": 130
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT2H",
              "value": 170
          },
          {
              "validTime": "2021-06-18T14:00:00+00:00/PT1H",
              "value": 300
          },
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT1H",
              "value": 350
          },
          {
              "validTime": "2021-06-18T16:00:00+00:00/PT1H",
              "value": 320
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT1H",
              "value": 330
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT1H",
              "value": 260
          },
          {
              "validTime": "2021-06-18T19:00:00+00:00/PT1H",
              "value": 240
          },
          {
              "validTime": "2021-06-18T20:00:00+00:00/PT1H",
              "value": 250
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT2H",
              "value": 280
          },
          {
              "validTime": "2021-06-18T23:00:00+00:00/PT1H",
              "value": 300
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT6H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT2H",
              "value": 300
          },
          {
              "validTime": "2021-06-19T08:00:00+00:00/PT6H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T14:00:00+00:00/PT2H",
              "value": 300
          },
          {
              "validTime": "2021-06-19T16:00:00+00:00/PT11H",
              "value": 290
          },
          {
              "validTime": "2021-06-20T03:00:00+00:00/PT8H",
              "value": 280
          },
          {
              "validTime": "2021-06-20T11:00:00+00:00/PT16H",
              "value": 290
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT1H",
              "value": 300
          },
          {
              "validTime": "2021-06-21T04:00:00+00:00/PT4H",
              "value": 290
          },
          {
              "validTime": "2021-06-21T08:00:00+00:00/PT3H",
              "value": 280
          },
          {
              "validTime": "2021-06-21T11:00:00+00:00/PT3H",
              "value": 290
          },
          {
              "validTime": "2021-06-21T14:00:00+00:00/PT5H",
              "value": 300
          },
          {
              "validTime": "2021-06-21T19:00:00+00:00/PT7H",
              "value": 290
          },
          {
              "validTime": "2021-06-22T02:00:00+00:00/PT18H",
              "value": 300
          },
          {
              "validTime": "2021-06-22T20:00:00+00:00/PT8H",
              "value": 290
          },
          {
              "validTime": "2021-06-23T04:00:00+00:00/PT5H",
              "value": 300
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT1H",
              "value": 290
          },
          {
              "validTime": "2021-06-23T10:00:00+00:00/PT7H",
              "value": 300
          },
          {
              "validTime": "2021-06-23T17:00:00+00:00/PT23H",
              "value": 290
          },
          {
              "validTime": "2021-06-24T16:00:00+00:00/PT9H",
              "value": 280
          },
          {
              "validTime": "2021-06-25T01:00:00+00:00/PT4H",
              "value": 290
          },
          {
              "validTime": "2021-06-25T05:00:00+00:00/PT1H",
              "value": 280
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT2H",
              "value": 270
          },
          {
              "validTime": "2021-06-25T08:00:00+00:00/PT1H",
              "value": 260
          },
          {
              "validTime": "2021-06-25T09:00:00+00:00/PT1H",
              "value": 250
          },
          {
              "validTime": "2021-06-25T10:00:00+00:00/PT3H",
              "value": 260
          }
      ]
  },
  "mixingHeight": {
      "uom": "wmoUnit:m",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 68.8848
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT1H",
              "value": 75.8952
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT1H",
              "value": 80.1624
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT1H",
              "value": 95.0976
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT1H",
              "value": 102.4128
          },
          {
              "validTime": "2021-06-18T08:00:00+00:00/PT1H",
              "value": 100.584
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT1H",
              "value": 106.9848
          },
          {
              "validTime": "2021-06-18T10:00:00+00:00/PT2H",
              "value": 107.5944
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT1H",
              "value": 123.7488
          },
          {
              "validTime": "2021-06-18T13:00:00+00:00/PT1H",
              "value": 121.92
          },
          {
              "validTime": "2021-06-18T14:00:00+00:00/PT2H",
              "value": 125.2728
          },
          {
              "validTime": "2021-06-18T16:00:00+00:00/PT1H",
              "value": 124.968
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT1H",
              "value": 133.8072
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT1H",
              "value": 114.9096
          },
          {
              "validTime": "2021-06-18T19:00:00+00:00/PT1H",
              "value": 106.68
          },
          {
              "validTime": "2021-06-18T20:00:00+00:00/PT1H",
              "value": 104.8512
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT1H",
              "value": 111.252
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT1H",
              "value": 102.4128
          },
          {
              "validTime": "2021-06-18T23:00:00+00:00/PT1H",
              "value": 103.0224
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT1H",
              "value": 88.6968
          },
          {
              "validTime": "2021-06-19T01:00:00+00:00/PT1H",
              "value": 77.724
          },
          {
              "validTime": "2021-06-19T02:00:00+00:00/PT1H",
              "value": 82.296
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT1H",
              "value": 87.4776
          },
          {
              "validTime": "2021-06-19T04:00:00+00:00/PT1H",
              "value": 100.584
          },
          {
              "validTime": "2021-06-19T05:00:00+00:00/PT1H",
              "value": 100.2792
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT1H",
              "value": 95.7072
          },
          {
              "validTime": "2021-06-19T07:00:00+00:00/PT1H",
              "value": 89.6112
          },
          {
              "validTime": "2021-06-19T08:00:00+00:00/PT1H",
              "value": 90.5256
          },
          {
              "validTime": "2021-06-19T09:00:00+00:00/PT1H",
              "value": 97.536
          },
          {
              "validTime": "2021-06-19T10:00:00+00:00/PT1H",
              "value": 100.2792
          },
          {
              "validTime": "2021-06-19T11:00:00+00:00/PT1H",
              "value": 104.2416
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT1H",
              "value": 117.0432
          },
          {
              "validTime": "2021-06-19T13:00:00+00:00/PT2H",
              "value": 107.2896
          },
          {
              "validTime": "2021-06-19T15:00:00+00:00/PT1H",
              "value": 109.728
          },
          {
              "validTime": "2021-06-19T16:00:00+00:00/PT1H",
              "value": 104.8512
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT2H",
              "value": 0
          },
          {
              "validTime": "2021-06-19T19:00:00+00:00/PT1H",
              "value": 25.908
          },
          {
              "validTime": "2021-06-19T20:00:00+00:00/PT1H",
              "value": 51.5112
          },
          {
              "validTime": "2021-06-19T21:00:00+00:00/PT2H",
              "value": 77.4192
          },
          {
              "validTime": "2021-06-19T23:00:00+00:00/PT2H",
              "value": 77.1144
          },
          {
              "validTime": "2021-06-20T01:00:00+00:00/PT1H",
              "value": 74.676
          },
          {
              "validTime": "2021-06-20T02:00:00+00:00/PT1H",
              "value": 71.9328
          },
          {
              "validTime": "2021-06-20T03:00:00+00:00/PT1H",
              "value": 69.4944
          },
          {
              "validTime": "2021-06-20T04:00:00+00:00/PT1H",
              "value": 66.1416
          },
          {
              "validTime": "2021-06-20T05:00:00+00:00/PT1H",
              "value": 62.484
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT1H",
              "value": 59.1312
          },
          {
              "validTime": "2021-06-20T07:00:00+00:00/PT1H",
              "value": 63.7032
          },
          {
              "validTime": "2021-06-20T08:00:00+00:00/PT1H",
              "value": 68.58
          },
          {
              "validTime": "2021-06-20T09:00:00+00:00/PT1H",
              "value": 73.152
          },
          {
              "validTime": "2021-06-20T10:00:00+00:00/PT1H",
              "value": 91.44
          },
          {
              "validTime": "2021-06-20T11:00:00+00:00/PT1H",
              "value": 109.4232
          },
          {
              "validTime": "2021-06-20T12:00:00+00:00/PT1H",
              "value": 127.7112
          },
          {
              "validTime": "2021-06-20T13:00:00+00:00/PT1H",
              "value": 133.1976
          },
          {
              "validTime": "2021-06-20T14:00:00+00:00/PT1H",
              "value": 138.9888
          },
          {
              "validTime": "2021-06-20T15:00:00+00:00/PT1H",
              "value": 144.4752
          },
          {
              "validTime": "2021-06-20T16:00:00+00:00/PT1H",
              "value": 129.2352
          },
          {
              "validTime": "2021-06-20T17:00:00+00:00/PT1H",
              "value": 114.3
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT1H",
              "value": 99.06
          },
          {
              "validTime": "2021-06-20T19:00:00+00:00/PT1H",
              "value": 85.344
          },
          {
              "validTime": "2021-06-20T20:00:00+00:00/PT1H",
              "value": 71.3232
          },
          {
              "validTime": "2021-06-20T21:00:00+00:00/PT1H",
              "value": 57.6072
          },
          {
              "validTime": "2021-06-20T22:00:00+00:00/PT1H",
              "value": 62.484
          },
          {
              "validTime": "2021-06-20T23:00:00+00:00/PT1H",
              "value": 67.056
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT1H",
              "value": 71.9328
          },
          {
              "validTime": "2021-06-21T01:00:00+00:00/PT1H",
              "value": 93.8784
          },
          {
              "validTime": "2021-06-21T02:00:00+00:00/PT1H",
              "value": 116.1288
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT1H",
              "value": 138.0744
          },
          {
              "validTime": "2021-06-21T04:00:00+00:00/PT1H",
              "value": 153.3144
          },
          {
              "validTime": "2021-06-21T05:00:00+00:00/PT1H",
              "value": 168.2496
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT1H",
              "value": 183.4896
          },
          {
              "validTime": "2021-06-21T07:00:00+00:00/PT1H",
              "value": 175.5648
          },
          {
              "validTime": "2021-06-21T08:00:00+00:00/PT1H",
              "value": 167.9448
          },
          {
              "validTime": "2021-06-21T09:00:00+00:00/PT1H",
              "value": 160.02
          },
          {
              "validTime": "2021-06-21T10:00:00+00:00/PT1H",
              "value": 169.7736
          },
          {
              "validTime": "2021-06-21T11:00:00+00:00/PT1H",
              "value": 179.5272
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT1H",
              "value": 189.2808
          },
          {
              "validTime": "2021-06-21T13:00:00+00:00/PT1H",
              "value": 202.3872
          },
          {
              "validTime": "2021-06-21T14:00:00+00:00/PT1H",
              "value": 215.1888
          },
          {
              "validTime": "2021-06-21T15:00:00+00:00/PT1H",
              "value": 228.2952
          },
          {
              "validTime": "2021-06-21T16:00:00+00:00/PT1H",
              "value": 227.076
          },
          {
              "validTime": "2021-06-21T17:00:00+00:00/PT1H",
              "value": 226.1616
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT1H",
              "value": 224.9424
          },
          {
              "validTime": "2021-06-21T19:00:00+00:00/PT1H",
              "value": 221.5896
          },
          {
              "validTime": "2021-06-21T20:00:00+00:00/PT1H",
              "value": 217.932
          },
          {
              "validTime": "2021-06-21T21:00:00+00:00/PT1H",
              "value": 214.5792
          },
          {
              "validTime": "2021-06-21T22:00:00+00:00/PT1H",
              "value": 216.7128
          },
          {
              "validTime": "2021-06-21T23:00:00+00:00/PT1H",
              "value": 218.5416
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT1H",
              "value": 220.6752
          },
          {
              "validTime": "2021-06-22T01:00:00+00:00/PT1H",
              "value": 226.4664
          },
          {
              "validTime": "2021-06-22T02:00:00+00:00/PT1H",
              "value": 232.2576
          },
          {
              "validTime": "2021-06-22T03:00:00+00:00/PT1H",
              "value": 238.0488
          },
          {
              "validTime": "2021-06-22T04:00:00+00:00/PT1H",
              "value": 242.9256
          },
          {
              "validTime": "2021-06-22T05:00:00+00:00/PT1H",
              "value": 248.1072
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT1H",
              "value": 252.984
          },
          {
              "validTime": "2021-06-22T07:00:00+00:00/PT1H",
              "value": 248.1072
          },
          {
              "validTime": "2021-06-22T08:00:00+00:00/PT1H",
              "value": 243.5352
          },
          {
              "validTime": "2021-06-22T09:00:00+00:00/PT1H",
              "value": 238.6584
          },
          {
              "validTime": "2021-06-22T10:00:00+00:00/PT1H",
              "value": 239.268
          },
          {
              "validTime": "2021-06-22T11:00:00+00:00/PT1H",
              "value": 239.8776
          },
          {
              "validTime": "2021-06-22T12:00:00+00:00/PT1H",
              "value": 240.4872
          },
          {
              "validTime": "2021-06-22T13:00:00+00:00/PT1H",
              "value": 237.1344
          },
          {
              "validTime": "2021-06-22T14:00:00+00:00/PT1H",
              "value": 234.0864
          },
          {
              "validTime": "2021-06-22T15:00:00+00:00/PT1H",
              "value": 230.7336
          },
          {
              "validTime": "2021-06-22T16:00:00+00:00/PT1H",
              "value": 226.7712
          },
          {
              "validTime": "2021-06-22T17:00:00+00:00/PT1H",
              "value": 222.504
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT1H",
              "value": 218.5416
          },
          {
              "validTime": "2021-06-22T19:00:00+00:00/PT1H",
              "value": 199.9488
          },
          {
              "validTime": "2021-06-22T20:00:00+00:00/PT1H",
              "value": 181.0512
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT2H",
              "value": 162.4584
          },
          {
              "validTime": "2021-06-22T23:00:00+00:00/PT2H",
              "value": 162.1536
          },
          {
              "validTime": "2021-06-23T01:00:00+00:00/PT1H",
              "value": 178.308
          },
          {
              "validTime": "2021-06-23T02:00:00+00:00/PT1H",
              "value": 194.4624
          },
          {
              "validTime": "2021-06-23T03:00:00+00:00/PT1H",
              "value": 210.6168
          },
          {
              "validTime": "2021-06-23T04:00:00+00:00/PT1H",
              "value": 213.9696
          },
          {
              "validTime": "2021-06-23T05:00:00+00:00/PT1H",
              "value": 217.3224
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT1H",
              "value": 220.6752
          },
          {
              "validTime": "2021-06-23T07:00:00+00:00/PT1H",
              "value": 221.8944
          },
          {
              "validTime": "2021-06-23T08:00:00+00:00/PT1H",
              "value": 222.8088
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT1H",
              "value": 224.028
          },
          {
              "validTime": "2021-06-23T10:00:00+00:00/PT1H",
              "value": 228.6
          },
          {
              "validTime": "2021-06-23T11:00:00+00:00/PT1H",
              "value": 233.4768
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT1H",
              "value": 238.0488
          },
          {
              "validTime": "2021-06-23T13:00:00+00:00/PT2H",
              "value": 238.3536
          },
          {
              "validTime": "2021-06-23T15:00:00+00:00/PT1H",
              "value": 238.6584
          },
          {
              "validTime": "2021-06-23T16:00:00+00:00/PT1H",
              "value": 235.0008
          },
          {
              "validTime": "2021-06-23T17:00:00+00:00/PT1H",
              "value": 231.3432
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT1H",
              "value": 227.6856
          },
          {
              "validTime": "2021-06-23T19:00:00+00:00/PT1H",
              "value": 225.8568
          },
          {
              "validTime": "2021-06-23T20:00:00+00:00/PT1H",
              "value": 223.7232
          },
          {
              "validTime": "2021-06-23T21:00:00+00:00/PT1H",
              "value": 221.8944
          },
          {
              "validTime": "2021-06-23T22:00:00+00:00/PT1H",
              "value": 217.6272
          },
          {
              "validTime": "2021-06-23T23:00:00+00:00/PT1H",
              "value": 213.6648
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT1H",
              "value": 209.3976
          },
          {
              "validTime": "2021-06-24T01:00:00+00:00/PT1H",
              "value": 210.9216
          },
          {
              "validTime": "2021-06-24T02:00:00+00:00/PT1H",
              "value": 212.7504
          },
          {
              "validTime": "2021-06-24T03:00:00+00:00/PT1H",
              "value": 214.2744
          },
          {
              "validTime": "2021-06-24T04:00:00+00:00/PT1H",
              "value": 220.0656
          },
          {
              "validTime": "2021-06-24T05:00:00+00:00/PT1H",
              "value": 225.552
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT1H",
              "value": 231.3432
          },
          {
              "validTime": "2021-06-24T07:00:00+00:00/PT1H",
              "value": 231.9528
          },
          {
              "validTime": "2021-06-24T08:00:00+00:00/PT1H",
              "value": 232.2576
          },
          {
              "validTime": "2021-06-24T09:00:00+00:00/PT1H",
              "value": 232.8672
          },
          {
              "validTime": "2021-06-24T10:00:00+00:00/PT1H",
              "value": 234.0864
          },
          {
              "validTime": "2021-06-24T11:00:00+00:00/PT1H",
              "value": 235.3056
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT1H",
              "value": 236.5248
          },
          {
              "validTime": "2021-06-24T13:00:00+00:00/PT1H",
              "value": 239.8776
          },
          {
              "validTime": "2021-06-24T14:00:00+00:00/PT1H",
              "value": 243.2304
          },
          {
              "validTime": "2021-06-24T15:00:00+00:00/PT1H",
              "value": 246.5832
          },
          {
              "validTime": "2021-06-24T16:00:00+00:00/PT1H",
              "value": 238.3536
          },
          {
              "validTime": "2021-06-24T17:00:00+00:00/PT1H",
              "value": 230.124
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT1H",
              "value": 221.8944
          },
          {
              "validTime": "2021-06-24T19:00:00+00:00/PT1H",
              "value": 203.3016
          },
          {
              "validTime": "2021-06-24T20:00:00+00:00/PT1H",
              "value": 184.404
          },
          {
              "validTime": "2021-06-24T21:00:00+00:00/PT1H",
              "value": 165.8112
          },
          {
              "validTime": "2021-06-24T22:00:00+00:00/PT1H",
              "value": 158.496
          },
          {
              "validTime": "2021-06-24T23:00:00+00:00/PT1H",
              "value": 151.4856
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT4H",
              "value": 144.1704
          },
          {
              "validTime": "2021-06-25T04:00:00+00:00/PT1H",
              "value": 144.4752
          },
          {
              "validTime": "2021-06-25T05:00:00+00:00/PT1H",
              "value": 144.78
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT1H",
              "value": 145.0848
          },
          {
              "validTime": "2021-06-25T07:00:00+00:00/PT1H",
              "value": 151.1808
          },
          {
              "validTime": "2021-06-25T08:00:00+00:00/PT1H",
              "value": 157.5816
          },
          {
              "validTime": "2021-06-25T09:00:00+00:00/PT1H",
              "value": 163.6776
          },
          {
              "validTime": "2021-06-25T10:00:00+00:00/PT1H",
              "value": 163.068
          },
          {
              "validTime": "2021-06-25T11:00:00+00:00/PT1H",
              "value": 162.4584
          },
          {
              "validTime": "2021-06-25T12:00:00+00:00/PT1H",
              "value": 161.8488
          }
      ]
  },
  "hainesIndex": {
      "values": []
  },
  "lightningActivityLevel": {
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P7DT15H",
              "value": 1
          }
      ]
  },
  "twentyFootWindSpeed": {
      "uom": "wmoUnit:km_h-1",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT2H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT4H",
              "value": 5.556
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT8H",
              "value": 3.704
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT5H",
              "value": 5.556
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT2H",
              "value": 7.408
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT2H",
              "value": 5.556
          },
          {
              "validTime": "2021-06-19T02:00:00+00:00/PT2H",
              "value": 7.408
          },
          {
              "validTime": "2021-06-19T04:00:00+00:00/PT13H",
              "value": 5.556
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT4H",
              "value": 7.408
          },
          {
              "validTime": "2021-06-19T21:00:00+00:00/PT3H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT3H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-20T03:00:00+00:00/PT3H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT15H",
              "value": 9.26
          },
          {
              "validTime": "2021-06-20T21:00:00+00:00/PT3H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT3H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT3H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT3H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-21T09:00:00+00:00/PT3H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT3H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-21T15:00:00+00:00/PT3H",
              "value": 11.112
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT3H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-21T21:00:00+00:00/PT3H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT6H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT3H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-22T09:00:00+00:00/PT12H",
              "value": 12.964
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT3H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/PT6H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT6H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT9H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-23T21:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT6H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT6H",
              "value": 16.668
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT9H",
              "value": 14.816
          },
          {
              "validTime": "2021-06-24T21:00:00+00:00/PT3H",
              "value": 18.52
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT3H",
              "value": 20.372
          },
          {
              "validTime": "2021-06-25T03:00:00+00:00/PT3H",
              "value": 18.52
          }
      ]
  },
  "twentyFootWindDirection": {
      "uom": "wmoUnit:degree_(angle)",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT1H",
              "value": 180
          },
          {
              "validTime": "2021-06-18T04:00:00+00:00/PT1H",
              "value": 200
          },
          {
              "validTime": "2021-06-18T05:00:00+00:00/PT1H",
              "value": 170
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT1H",
              "value": 180
          },
          {
              "validTime": "2021-06-18T07:00:00+00:00/PT1H",
              "value": 190
          },
          {
              "validTime": "2021-06-18T08:00:00+00:00/PT1H",
              "value": 160
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT2H",
              "value": 140
          },
          {
              "validTime": "2021-06-18T11:00:00+00:00/PT2H",
              "value": 160
          },
          {
              "validTime": "2021-06-18T13:00:00+00:00/PT2H",
              "value": 170
          },
          {
              "validTime": "2021-06-18T15:00:00+00:00/PT2H",
              "value": 180
          },
          {
              "validTime": "2021-06-18T17:00:00+00:00/PT2H",
              "value": 190
          },
          {
              "validTime": "2021-06-18T19:00:00+00:00/PT2H",
              "value": 200
          },
          {
              "validTime": "2021-06-18T21:00:00+00:00/PT1H",
              "value": 210
          },
          {
              "validTime": "2021-06-18T22:00:00+00:00/PT1H",
              "value": 230
          },
          {
              "validTime": "2021-06-18T23:00:00+00:00/PT1H",
              "value": 250
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT1H",
              "value": 270
          },
          {
              "validTime": "2021-06-19T01:00:00+00:00/PT2H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T03:00:00+00:00/PT2H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T05:00:00+00:00/PT2H",
              "value": 300
          },
          {
              "validTime": "2021-06-19T07:00:00+00:00/PT2H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T09:00:00+00:00/PT1H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T10:00:00+00:00/PT1H",
              "value": 270
          },
          {
              "validTime": "2021-06-19T11:00:00+00:00/PT1H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT1H",
              "value": 300
          },
          {
              "validTime": "2021-06-19T13:00:00+00:00/PT1H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T14:00:00+00:00/PT3H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T17:00:00+00:00/PT1H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT18H",
              "value": 280
          },
          {
              "validTime": "2021-06-20T12:00:00+00:00/PT6H",
              "value": 290
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT9H",
              "value": 280
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT9H",
              "value": 290
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT6H",
              "value": 300
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT15H",
              "value": 300
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT6H",
              "value": 290
          },
          {
              "validTime": "2021-06-23T03:00:00+00:00/PT15H",
              "value": 300
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT12H",
              "value": 300
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT9H",
              "value": 290
          },
          {
              "validTime": "2021-06-25T03:00:00+00:00/PT3H",
              "value": 300
          }
      ]
  },
  "waveHeight": {
      "uom": "wmoUnit:m",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P1DT15H",
              "value": 0.6096
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/P1DT6H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/P1DT6H",
              "value": 1.2192
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT12H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT6H",
              "value": 1.2192
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/P1DT6H",
              "value": 1.524
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT12H",
              "value": 1.2192
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT6H",
              "value": 1.524
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT6H",
              "value": 1.2192
          },
          {
              "validTime": "2021-06-25T06:00:00+00:00/PT6H",
              "value": 0.9144
          }
      ]
  },
  "wavePeriod": {
      "uom": "nwsUnit:s",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P1DT3H",
              "value": 9
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/P1D",
              "value": 8
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/P1D",
              "value": 7
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/P1DT12H",
              "value": 6
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT12H",
              "value": 5
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/P2D",
              "value": 6
          }
      ]
  },
  "waveDirection": {
      "values": []
  },
  "primarySwellHeight": {
      "uom": "wmoUnit:m",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P1DT21H",
              "value": 0.6096
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/P2DT6H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT12H",
              "value": 0.6096
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT6H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/P1DT6H",
              "value": 1.2192
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT6H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT12H",
              "value": 1.2192
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT6H",
              "value": 0.9144
          }
      ]
  },
  "primarySwellDirection": {
      "uom": "wmoUnit:degree_(angle)",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": 280
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT6H",
              "value": 280
          },
          {
              "validTime": "2021-06-19T00:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-19T12:00:00+00:00/PT6H",
              "value": 300
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT6H",
              "value": 290
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT12H",
              "value": 300
          },
          {
              "validTime": "2021-06-20T12:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT12H",
              "value": 300
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT18H",
              "value": 300
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT18H",
              "value": 300
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT12H",
              "value": 290
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT12H",
              "value": 280
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT6H",
              "value": 290
          }
      ]
  },
  "secondarySwellHeight": {
      "uom": "wmoUnit:m",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/P3DT15H",
              "value": 0.6096
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/P1DT18H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT18H",
              "value": 0.6096
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT6H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT6H",
              "value": 0.6096
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT6H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT6H",
              "value": 0.6096
          }
      ]
  },
  "secondarySwellDirection": {
      "uom": "wmoUnit:degree_(angle)",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT9H",
              "value": 180
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT6H",
              "value": 190
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/P1DT12H",
              "value": 180
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/P5D",
              "value": 190
          }
      ]
  },
  "wavePeriod2": {
      "uom": "nwsUnit:s",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": 14
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT12H",
              "value": 13
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/P1DT18H",
              "value": 14
          },
          {
              "validTime": "2021-06-20T12:00:00+00:00/PT6H",
              "value": 17
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT6H",
              "value": 16
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT6H",
              "value": 17
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT18H",
              "value": 18
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT18H",
              "value": 17
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT18H",
              "value": 16
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT12H",
              "value": 15
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT18H",
              "value": 14
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT12H",
              "value": 13
          }
      ]
  },
  "windWaveHeight": {
      "uom": "wmoUnit:m",
      "values": [
          {
              "validTime": "2021-06-18T03:00:00+00:00/PT3H",
              "value": 0.21336
          },
          {
              "validTime": "2021-06-18T06:00:00+00:00/PT3H",
              "value": 0.12192
          },
          {
              "validTime": "2021-06-18T09:00:00+00:00/PT3H",
              "value": 0.09144
          },
          {
              "validTime": "2021-06-18T12:00:00+00:00/PT6H",
              "value": 0.12192
          },
          {
              "validTime": "2021-06-18T18:00:00+00:00/PT12H",
              "value": 0.18288
          },
          {
              "validTime": "2021-06-19T06:00:00+00:00/PT9H",
              "value": 0.1524
          },
          {
              "validTime": "2021-06-19T15:00:00+00:00/PT3H",
              "value": 0.18288
          },
          {
              "validTime": "2021-06-19T18:00:00+00:00/PT3H",
              "value": 0.21336
          },
          {
              "validTime": "2021-06-19T21:00:00+00:00/PT3H",
              "value": 0.33528
          },
          {
              "validTime": "2021-06-20T00:00:00+00:00/PT3H",
              "value": 0.51816
          },
          {
              "validTime": "2021-06-20T03:00:00+00:00/PT3H",
              "value": 0.39624
          },
          {
              "validTime": "2021-06-20T06:00:00+00:00/PT12H",
              "value": 0.3048
          },
          {
              "validTime": "2021-06-20T18:00:00+00:00/PT3H",
              "value": 0.33528
          },
          {
              "validTime": "2021-06-20T21:00:00+00:00/PT3H",
              "value": 0.51816
          },
          {
              "validTime": "2021-06-21T00:00:00+00:00/PT3H",
              "value": 0.70104
          },
          {
              "validTime": "2021-06-21T03:00:00+00:00/PT3H",
              "value": 0.57912
          },
          {
              "validTime": "2021-06-21T06:00:00+00:00/PT3H",
              "value": 0.4572
          },
          {
              "validTime": "2021-06-21T09:00:00+00:00/PT3H",
              "value": 0.39624
          },
          {
              "validTime": "2021-06-21T12:00:00+00:00/PT3H",
              "value": 0.4572
          },
          {
              "validTime": "2021-06-21T15:00:00+00:00/PT3H",
              "value": 0.39624
          },
          {
              "validTime": "2021-06-21T18:00:00+00:00/PT3H",
              "value": 0.48768
          },
          {
              "validTime": "2021-06-21T21:00:00+00:00/PT3H",
              "value": 0.6096
          },
          {
              "validTime": "2021-06-22T00:00:00+00:00/PT3H",
              "value": 0.79248
          },
          {
              "validTime": "2021-06-22T03:00:00+00:00/PT3H",
              "value": 0.70104
          },
          {
              "validTime": "2021-06-22T06:00:00+00:00/PT3H",
              "value": 0.57912
          },
          {
              "validTime": "2021-06-22T09:00:00+00:00/PT3H",
              "value": 0.51816
          },
          {
              "validTime": "2021-06-22T12:00:00+00:00/PT6H",
              "value": 0.4572
          },
          {
              "validTime": "2021-06-22T18:00:00+00:00/PT3H",
              "value": 0.51816
          },
          {
              "validTime": "2021-06-22T21:00:00+00:00/PT3H",
              "value": 0.70104
          },
          {
              "validTime": "2021-06-23T00:00:00+00:00/PT3H",
              "value": 0.94488
          },
          {
              "validTime": "2021-06-23T03:00:00+00:00/PT3H",
              "value": 0.9144
          },
          {
              "validTime": "2021-06-23T06:00:00+00:00/PT3H",
              "value": 0.762
          },
          {
              "validTime": "2021-06-23T09:00:00+00:00/PT3H",
              "value": 0.70104
          },
          {
              "validTime": "2021-06-23T12:00:00+00:00/PT3H",
              "value": 0.64008
          },
          {
              "validTime": "2021-06-23T15:00:00+00:00/PT3H",
              "value": 0.57912
          },
          {
              "validTime": "2021-06-23T18:00:00+00:00/PT3H",
              "value": 0.64008
          },
          {
              "validTime": "2021-06-23T21:00:00+00:00/PT3H",
              "value": 0.85344
          },
          {
              "validTime": "2021-06-24T00:00:00+00:00/PT3H",
              "value": 1.09728
          },
          {
              "validTime": "2021-06-24T03:00:00+00:00/PT3H",
              "value": 1.00584
          },
          {
              "validTime": "2021-06-24T06:00:00+00:00/PT3H",
              "value": 0.762
          },
          {
              "validTime": "2021-06-24T09:00:00+00:00/PT3H",
              "value": 0.70104
          },
          {
              "validTime": "2021-06-24T12:00:00+00:00/PT6H",
              "value": 0.57912
          },
          {
              "validTime": "2021-06-24T18:00:00+00:00/PT3H",
              "value": 0.64008
          },
          {
              "validTime": "2021-06-24T21:00:00+00:00/PT3H",
              "value": 0.85344
          },
          {
              "validTime": "2021-06-25T00:00:00+00:00/PT3H",
              "value": 1.03632
          },
          {
              "validTime": "2021-06-25T03:00:00+00:00/PT3H",
              "value": 0.94488
          }
      ]
  },
  "dispersionIndex": {
      "values": []
  },
  "pressure": {
      "values": []
  },
  "probabilityOfTropicalStormWinds": {
      "values": []
  },
  "probabilityOfHurricaneWinds": {
      "values": []
  },
  "potentialOf15mphWinds": {
      "values": []
  },
  "potentialOf25mphWinds": {
      "values": []
  },
  "potentialOf35mphWinds": {
      "values": []
  },
  "potentialOf45mphWinds": {
      "values": []
  },
  "potentialOf20mphWindGusts": {
      "values": []
  },
  "potentialOf30mphWindGusts": {
      "values": []
  },
  "potentialOf40mphWindGusts": {
      "values": []
  },
  "potentialOf50mphWindGusts": {
      "values": []
  },
  "potentialOf60mphWindGusts": {
      "values": []
  },
  "grasslandFireDangerIndex": {
      "values": []
  },
  "probabilityOfThunder": {
      "values": []
  },
  "davisStabilityIndex": {
      "values": []
  },
  "atmosphericDispersionIndex": {
      "values": []
  },
  "lowVisibilityOccurrenceRiskIndex": {
      "values": []
  },
  "stability": {
      "values": []
  },
  "redFlagThreatIndex": {
      "values": []
  }
}


// 33.4672,-117.6981
// water 33.408922,-117.838593

// return meta about a point
// https://api.weather.gov/points/33.408922%2C-117.838593


// if marine forecast not support message, hit the grid data for detailed marine data
// "forecastGridData": "https://api.weather.gov/gridpoints/LOX/164,13",


// successful response to first fetch should give various forecast urls
// properties: 
// forecast: "https://api.weather.gov/gridpoints/SGX/22,36/forecast"
// forecastGridData: "https://api.weather.gov/gridpoints/SGX/22,36"
// forecastHourly: "https://api.weather.gov/gridpoints/SGX/22,36/forecast/hourly"
// forecastOffice: "https://api.weather.gov/offices/SGX"
// forecastZone: "https://api.weather.gov/zones/forecast/PZZ775"

const WeatherFeed = (props) => {
  
  const defaultFetchStatus = { loading: true, error: null };
  const defaultWeatherData = { type: null, data: null };


  // temporary for getting the grid forecast going
  const [temps, setTemps] = useState(null);

  const [weatherData, setWeatherData] = useState({ type: null, data: null });
  const [fetchStatus, setFetchStatus] = useState(defaultFetchStatus);
  const [locationDetails, setLocationDetails] = useState({city: null, state: null})
  const { loadMap, apiStatus, basicControls, mapRef, mapContainerRef, center } = useGoogleMap();

  const controls = basicControls;

  controls.push({ position: 'BOTTOM_CENTER', element: selectLocationButton, listeners: [{event: 'click', callback: handleSelectLocationButtonClick}] });


  //https://api.weather.gov/gridpoints/SGX/44,52/forecast



  // type defaults to forecast. If forecast is unavailable, or we get a marine error in the second fetch, we will fetch and display grid forecastGridData
  const getForecastUrl = async (pos) => {
    setFetchStatus(defaultFetchStatus);
    setWeatherData(defaultWeatherData);
    let forecastUrl = { standard: null, grid: null };
    // status for the first api call to get the point data which should include forecast urls
    let error = null;
    await fetch(`https://api.weather.gov/points/${pos.lat},${pos.lng}`)
      .then (res => {
        if (!res.ok) {
          error = true;
        }    
        return res.json();      
      })
      .then (json => {
        // failed to get any data from first fetch
        if (error) {
          error = true;
          return null;
        }
        // setLocationDetails({city: jsonData.properties.relativeLocation.properties.city, state: jsonData.properties.relativeLocation.properties.state });
        forecastUrl = {standard: json.properties.forecast, grid: json.properties.forecastGridData}
      })  
      .catch(error => {
        // console.log(error);
        // setFetchStatus({loading: false, error: { message: 'Failed to retreive data from NOAA'} });
      });
    return { url: forecastUrl, error };
  };

  
  const getGridForecast = async gridUrl => {
    let fetchSuccess = false;
    await fetch(gridUrl)
      .then(response => {
        if (response.ok) {
          fetchSuccess = true;
        }
        return response.json()
      })
      .then(json => {
        if (fetchSuccess) {
          setFetchStatus({ loading: false, error: null });
          setWeatherData({ type: 'grid', data: json.properties });
          console.log(JSON.stringify(json.properties, null, 4))
          processGridData(json.properties);
        } else {
          // handle errors in grid forecast response
          if (json.status === 500) {
            setFetchStatus({ loading: false, error: { code: 500, message: 'Weather server error, please try again later' }})
          }
          if (json.status === 404) {
            setFetchStatus({ loading: false, error: { code: 404, message: 'Forecast unavailable for this location' } })
          }
        }
      })
      .catch(err => console.log(err));
  };

  const getForecast = async pos => {
    // first fetch request gets the appropriate forecast URL.
    const forecastUrl = await getForecastUrl(pos);
    console.log(forecastUrl);

    // no errors getting the url
    if (!forecastUrl.error) {
      // a standard forecast url is available
      const { standard, grid } = forecastUrl.url;
      if (standard) {
        await fetch(standard)
        .then (response => {
          return response.json()
        })
        .then (jsonData => {
          // periods forecast available
          if (jsonData.properties && jsonData.properties.periods) {
            setFetchStatus({ loading: false, error: false, type: 'periods' });
            setWeatherData({ type: 'periods', data: [...jsonData.properties.periods] });
          } else {
            // periods unavailable for this location, try grid
            if (grid) {
              getGridForecast(grid);
            } else {
              // grid url also unavailable, so can't get weather for this location
              setFetchStatus({loading: false, error: { message: 'Forecast unavailable for this location' } })
            }

          }
        })
        .catch(error => {
          console.log(`error: ${error}`)
          setFetchStatus({loading: false, error: true});
        });    
      } 
      // standard forecast url not available, check for grid url
      else if (grid) { 
        getGridForecast();
      } else {
        // no forecast urls available for this position, so cant get weather for this location
        setFetchStatus({ loading: false, error: { message: 'Forecast unavailable for this location' } });
      }    
    } else {
      // error getting forecast url
    }
  };

  // load the map
  useEffect(() => {
    loadMap();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      getForecast({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, error => console.log(error));

  }, []);

  function handleSelectLocationButtonClick() {
    getForecast(mapRef.current.getCenter().toJSON());
  }

  // function to flatten the grid data object into an array of days with all data types for each day
  function processGridData (forecastData = staticData) {
    // first construct and array with object dates for the next few days
    const today = DateTime.now();
    const days = [];
    const keysToMap = ['temperature', 'primarySwellDirection', 'primarySwellHeight', 'windWaveHeight', 'wavePeriod2', 'secondarySwellDirection', 'secondarySwellHeight', 'wavePeriod', 'waveHeight', 'weather', 'windGust', 'windSpeed', 'windDirection', 'skyCover' ];
    for (let i = 0; i <= 5; i++) {
      // add a day to today's date for each iteration
      const thisDay = today.plus({days: i}).toObject();
      days.push({ date: thisDay });
    }
    // remap the data so it's stored by date

    keysToMap.forEach(key => {
      // push an empty array for this forecast key into each day
      days.forEach(dayObject => dayObject[key] = []);
      // if there's data for this forecast component, then map it back to days
      if (forecastData[key].values.length > 0){
        forecastData[key].values.forEach(dataPoint => {

          // first get an array of date objects with a unique day
          // final processed data should look like this:
          /* 
          [
            { 
              date: {year, month, day},
              temperature: [{startTime, tempValue}, {startTime, tempValue}]
            }
          ] 
          */

          const [isoTime, isoDuration] = dataPoint.validTime.split('/');
          const startTime = DateTime.fromISO(isoTime);
          const durationInHours =  Duration.fromISO(isoDuration).shiftTo('hours').toObject().hours;
          console.log(`key: ${key}, time: ${JSON.stringify(isoTime)}, duration: ${JSON.stringify(durationInHours)}`);
          
          // if there is a duration longer than 1h, we need to create an array of new data points containing a new data point for each hour of the duration
          for (let i = 0; i <= durationInHours; i++) {
            // add an hour to the start time for every iteration to get a new hour timepoint so we can spread the data over the duration
            const currentInterval = startTime.plus({ hours: 1 * i }).toObject();
            // find the day in the days array that matches the current interval day
            const dayIndex = days.findIndex(item => item.date.year === startTime.year && item.date.day === startTime.day && item.date.month === startTime.month );
            if (dayIndex > -1) {
              // add the data to the appropriate day
              days[dayIndex].[key].push({ startTime: currentInterval, value: dataPoint.value });
            }  

          }


        });
      }
    });

    // set max and min temp for each day
    days.forEach(day => {
      if (day.temperature.length > 0) {
        // extract the temps for the day
        const dailyTemps = day.temperature.map(temperatureObject => temperatureObject.value)
        day.tempHigh = Math.max(...dailyTemps);
        day.tempLow = Math.min(...dailyTemps);
      }
    })
    setTemps(days);
  };

  function generateLineChart(data, label, unit, valueMultiplier = 1, valueAdded = 0) {
    const processedData = [];
    data.forEach(dataObject => {
      const hour = dataObject.startTime.hour;
      processedData.push({ hour: hour, value: dataObject.value * valueMultiplier + valueAdded });
      if (label==='swell height') {
        console.log(data);
      }
      // processedData.push({hour: new Date(DateTime.fromObject(dataObject.startTime).toISO()), value: dataObject.value});
    });
    //tickFormat={['12AM', '6AM', '12PM', '6PM', '12PM']}
    //domain={{x: [0, 23]}} tickCount={6}
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <span><b>{`${label} in ${unit}`}</b></span>
        <VictoryChart 
          height={150} 
          padding={{top: 10, left: 30, right: 30, bottom: 30}}
          minDomain={{ y: 0 }}
          maxDomain={{ y: Math.max(...processedData.map(object => object.value)) * 1.1 }}
        >
          <VictoryAxis 
            tickValues={[0, 6, 12, 18, 24]} 
            tickFormat={t => {
              switch (t) {
                case 0:
                return '12AM';
                break;
                case 6:
                  return '6AM';
                break;
                case 12:
                  return '12PM';
                break;
                case 18:
                  return '6PM';
                break;
                case 24:
                  return '12AM';
                break;
              }
            }}
            style={{
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 14, padding: 0}
            }} 
          />
          <VictoryAxis 
            dependentAxis={true}
            style={{
              padding: {top: 20, bottom: 50},
              axis: {stroke: "#756f6a"},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 14, padding: 0}
            }} 
          />
          <VictoryLine interpolation='monotoneX' x='hour' y='value' domain={{x: [0, 24]}} data={processedData}  />
          {/* <VictoryScatter x='hour' y='value' domain={{x: [0, 24]}} data={processedData}  /> */}

          {/* <VictoryLine x='hour' y='value' scale={{x: "time", y: "linear"}} data={processedData} /> */}
        </VictoryChart>
      </div>
    );
  }

  /*

            style={{
              axis: {stroke: "#756f6a"},
              axisLabel: {fontSize: 20},
              ticks: {stroke: "grey", size: 5},
              tickLabels: {fontSize: 15, padding: 5}
            }} 
  */




  return (
    <div style={{display: 'flex',  height: '100%', paddingRight: 75}}>

    <div className='map-container' style={{width: 300, height: 800}}>
      <div id='map' ref={mapContainerRef}>
        {(!apiStatus.loading && !apiStatus.errors) && 
          <GoogleMap 
            showCenterMarker={true}
            mapRef={mapRef} 
            mapContainer={mapContainerRef} 
            center={center}
            zoom={8} 
            controls={controls}
            options={{
              scaleControl: true,
              mapTypeControl: true,
              // scaleControlOptions: {
              //   position: window.google.maps.ControlPosition.TOP_LEFT
              // }
            }}
          />
        }
      </div>
    </div>

    <div style={{ width: 450, padding: '0px 10px', height: 800, overflowY: 'auto'}}>
      <button type='button' onClick={processGridData}>test log</button>

{/*       {fetchStatus.loading && !fetchStatus.error && <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}><LoaderFish/><h1>Loading forecast...</h1></div>}
      
      {!fetchStatus.loading && fetchStatus.error && 
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <h2>Error loading forecast...</h2>
          {fetchStatus.error.status === 500 && <h3>Weather server error</h3>}
          {fetchStatus.error.message && <h3>{fetchStatus.error.message}</h3>}
        </div>
      }
      
      {!fetchStatus.loading && !fetchStatus.error && weatherData.type === 'periods' && weatherData.data.slice(0,6).map(period => (
        <WeatherCard key={period.number} weatherImage={period.icon} forecastDay={period.name} shortForecast={period.shortForecast} forecastDescription={period.detailedForecast}/>
      ))}

      {!fetchStatus.loading && !fetchStatus.error && weatherData.type === 'grid' && 
        <div>{ JSON.stringify(weatherData.data, undefined, 4) }</div>
      } */}

      {temps && temps.map(date => 
        <Card fluid key={DateTime.fromObject(date.date).toISODate()} style={{border: '2px solid gray'}}>
          <Card.Content>
            <Card.Header>{DateTime.fromObject(date.date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}</Card.Header>
            {date.tempHigh && <div>High: {date.tempHigh*9/5+32}</div>}
            {date.tempLow && <div>Low: {date.tempLow*9/5+32}</div>}
            <div style={{display: 'flex', flexDirection: 'column'}}>
              {date.temperature.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px', margin: '5px 0px 5px 0px'}}>
                  {generateLineChart(date.temperature, 'temperature', 'deg F', 1.8, 32 )}
                </div>
              }
              {date.skyCover.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                  {generateLineChart(date.skyCover, 'Sky cover', '%')}
                </div>
              }              
              {date.windSpeed.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                 {generateLineChart(date.windSpeed, 'wind speed', 'km/h')}
                </div>
              }
              {date.primarySwellHeight.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                  {generateLineChart(date.primarySwellHeight, 'swell height', 'ft', 3.28084)}
                </div>
              }
              {date.windWaveHeight.length > 0 && 
                <div style={{border: '1px solid lightgray', borderRadius: '5px'}}>
                 {generateLineChart(date.windWaveHeight, 'wind wave height', 'ft', 3.28084)}
                </div>
              }
            </div>
          </Card.Content>
        </Card>  
      )}

    </div>

    </div>

  );
};

//2021-06-18T10:00:00.000-07:00

export default WeatherFeed;
//    const keysToMap = ['temperature', 'primarySwellDirection', 'primarySwellHeight', 'windWaveHeight', 'wavePeriod2', 'secondarySwellDirection', 'secondarySwellHeight', 'wavePeriod', 'waveHeight', 'weather', 'windGust', 'windSpeed', 'windDirection', 'skyCover' ];




/* 

            {date.windDirection.length > 0 && 
              <div>
                <span style={{padding: '0px 0px 5px 0px'}}>Wind Direction</span>
                <div style={{display: 'flex'}}>
                  {date.windDirection.map(dataObject => 
                    <div key={JSON.stringify(dataObject.startTime)} style={{display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                      <div style={{padding: '0px 5px', fontSize: 13}}>
                        {DateTime.fromObject(dataObject.startTime).toLocaleString(DateTime.TIME_SIMPLE)}
                      </div>
                      <div>
                        {dataObject.value}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{border: '1px solid grey'}}>
                {generateLineChart(date.windDirection, 'wind direction', 'deg')}
                </div>
                
              </div>
            }


// map the detailed temperatures
            {
              date.temperatures.map(tempObj => 
                <div key={DateTime.fromObject(tempObj.startTime).toString()}>
                  <div>{DateTime.fromObject(tempObj.startTime).toLocaleString(DateTime.TIME_SIMPLE)}</div>
                  <div>{tempObj.value} C</div>
                </div>
              )
            }



        <WeatherCard key={date.date}forecastDay={date.date} shortForecast={'placeholder'} 
          forecastDescription={() => {
            date.temperature.map(tempObj => 
              <div>
              <div>{tempObj.startTime.hours}:{tempObj.startTime.minutes}</div>
              <div>{tempObj.value} C</div>
              </div>
            )
          }} 
        /> 














              {date.windSpeed.length > 0 && 
                <div>
                  <span style={{padding: '0px 0px 5px 0px'}}>Wind speed</span>
                  <div style={{display: 'flex'}}>
                    {date.windSpeed.map(dataObject => 
                      <div key={JSON.stringify(dataObject.startTime)} style={{display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                        <div style={{padding: '0px 5px', fontSize: 13}}>
                          {DateTime.fromObject(dataObject.startTime).toLocaleString(DateTime.TIME_SIMPLE)}
                        </div>
                        <div>
                          {Math.round(dataObject.value/1.609)} mph
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                   {generateLineChart(date.windSpeed, 'wind speed', 'km/h')}
                  </div>

                </div>
              }





        */