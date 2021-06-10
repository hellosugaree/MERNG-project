import React, { useState, useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader"
import GoogleMap from './GoogleMap';
import GoogleAutocomplete from './GoogleAutocomplete';
import useGeolocation from '../utilities/useGeolocation';
import { useMutation } from '@apollo/client';
import { CREATE_CATCH } from '../gql/gql'
import { Form, Card } from 'semantic-ui-react';
import { useForm } from '../utilities/hooks';
import FormError from './FormError';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AutoSearchInputClass from './AutoSearchInputClass';
import Modal from './Modal';


import '../App.css';

// create custom control elements to send to our map
// create a custom button for our map to get location
const getCurrentLocationButton = document.createElement('button');
getCurrentLocationButton.classList.add("custom-map-control-button");
getCurrentLocationButton.innerHTML='<i class="blue location arrow icon"></i>';
// create a button to accept our location
const selectLocationButton = document.createElement('button');
selectLocationButton.classList.add('custom-map-control-button');
selectLocationButton.innerHTML='Accept catch location';


const CreateCatchForm = props => {
  // array to hold controls that will be added on mount
  const controls = [];
  // create a controls array to pass to the GoogleMap component
  controls.push({ position: 'BOTTOM_CENTER', element: selectLocationButton, listeners: [{event: 'click', callback: handleSelectLocationButtonClick}] });
  controls.push({ position: 'RIGHT_CENTER', element: getCurrentLocationButton, listeners: [{event: 'click', callback: handleGetLocationButtonClick}] });

  // state to check when loader is loaded so we know when to render our map and autocomplete components
  const [apiStatus, setApiStatus] = useState({errors: null, loading: true});
  // pass this as a prop to our map--initial value is default center, and the map center will always auto update if we set coords here
  const [center, setCenter] = useState({ lat: 33.4672, lng: -117.6981 });

  // set up a ref for a marker to mark our current position on the map
  const currentPositionMarkerRef = useRef(null);

  // state for whether or not to display map
  const [showMap, setShowMap] = useState(false);

  // get our geolocation hook
  const { getPosition, geolocationStatus } = useGeolocation();

  const autocompleteInputRef = useRef();
  const autocompleteRef = useRef();
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const infoWindowRef = useRef();
  
  useEffect(() => {
    // if map hasn't been loaded already, and showMap is set to true, load map
    if (!window.google && showMap) {
      console.log('loading maps api');
      // load script on mount and set status of load accordingly
      const loader = new Loader({
        // apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
        version: "weekly",
        libraries: ["places"],
      });
      loader.load()
        .then(() => {
          console.log('API loaded')
          // set our status to loaded so we know when to render dependent components
          setApiStatus({loading: false, errors: null});
          // get our position
          getPosition();
        })
        .catch (err => {
          console.log(err);
          setApiStatus({loading: false, errors: err});
        });
    }
  }, [showMap, window.google]);


  // useEffect to monitor our geoloation position when updated from any getPosition() calls
  useEffect(() => {
    console.log('position update detected in useEffect');
    // check if we have a position
    if (geolocationStatus.position) {
      // check if we already have a position marker
      if (currentPositionMarkerRef.current) {
        // current position marker exists, update the marker
        console.log('current pos marker already exists');
        currentPositionMarkerRef.current.setPosition(geolocationStatus.position);
      } else {
        console.log('current pos marker doesn\'t exist, creating new one');
        // current position marker doesn't exist, create a new marker
        currentPositionMarkerRef.current = new window.google.maps.Marker({
          position: geolocationStatus.position,
          map: mapRef.current
        });
        // center the map on current position
      }
      setCenter(geolocationStatus.position);      
    }
    if (geolocationStatus.errorMessage) {
      console.log('processing geolocation errors')
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      infoWindowRef.current = new window.google.maps.InfoWindow({
        content: `<div id="content">
        <div><b>Location error</b></div><br/>
          <div>${geolocationStatus.errorMessage}</div>
          </div>`,
      });
      infoWindowRef.current.setPosition(mapRef.current.getCenter());
      infoWindowRef.current.open(mapRef.current);
    }
  }, [geolocationStatus.position, geolocationStatus.errorMessage, currentPositionMarkerRef, mapRef, infoWindowRef])


    // add listener to close info windows on map click
    useEffect(() => {
      if(mapRef.current) {
        console.log('adding listener')
        mapRef.current.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
        });
      }
    }, [mapRef.current, infoWindowRef]);
  
  // handler for accept catch location button on the map
  function handleSelectLocationButtonClick() {
    console.log(mapRef.current.getCenter().toJSON());
    // set catch location in our form control values
    setValues(prevValues => ({ ...prevValues, catchLocation: mapRef.current.getCenter().toJSON() }));
    setShowMap(false);
  }

  
  // handler for selecting place from autocomplete input
  function handlePlaceSelect() {
    console.log('place select callback')
    // get the place the user selected
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      // center our map on selected place
      mapRef.current.setCenter(place.geometry.location);
    }
  }


  function handleGetLocationButtonClick(event) {
    getPosition();
  }

  // function we pass to our child catch card to be executed when the catch location div is clicked to show/hide the map
  const handleCatchLocationClick = () => {
    // show the map, which will also hide the form
    setShowMap(true);
  }


  // FORM RELATED STUFF DOWN HERE
  const initialValues = {
    species: '',
    fishingType: 'inshore',
    catchDate: new Date(),
    catchLength: '',
    notes: '',
    catchLocation: null
  };

  const { errors, values, showModal, modalContent, onSubmit, handleChange, handleDateChange, handleFormErrors, setValues } 
    = useForm(createCatchCallback, initialValues);


  /*
  
     async createCatch (_, 
      { catchInput: 
        { species,
          fishingType,
          catchDate,
          catchLocation,
          catchLength,
          notes
        }
      }, 
      context) {
        console.log('Processing createCatch on server');

        // check context for authorization token in header
        const user = checkAuth(context);
        
        const { valid, errors } = validateCatchInput(species, fishingType, catchDate, catchLocation, catchLength);
        if (!valid) {
          throw new UserInputError('User input Error', errors);
        }
        console.log('passed catch validation')

        // create a new catch

        const newCatch = new Catch({
          username: user.username,
          user: user.id,
          species,
          fishingType,
          catchDate,
          catchLocation: catchLocation,
          createdAt: new Date().toISOString(),
          notes: notes || null,
          catchLength: catchLength || null
        });
        const userToUpdate = await User.findById(user.id);
        // handle users that were added before the catches field existed
        if (!userToUpdate.catches) {
          userToUpdate.catches = [];
        }
        // add the new catch to this user's catches
        userToUpdate.catches.unshift(newCatch.id);
        console.log(userToUpdate);
        console.log(newCatch);
        // save the newly created catch
        const catchSaved = await newCatch.save();
        // save the updated user
        await userToUpdate.save();
        console.log(catchSaved);
        return catchSaved;


  */

  const [createCatch, { loading }] = useMutation(CREATE_CATCH, {
    options: () => ({ errorPolicy: 'all' }),
    update(cache, data) {
      console.log(data);




      // clear the form
      setValues(initialValues);
    },
    onError(err) {
      // console.log(err.graphQLErrors)
      // console.log(err.networkError)
      // console.log(err.message);
      // console.log(err.extraInfo)
      handleFormErrors(err);
    }
  });

  // function to prevent form from submitting when enter is pressed in an input field
    const preventFormSubmitOnEnter = (event) => {
      if (event.code === 'Enter') {
        // prevent enter from submitting form
        event.preventDefault();
      }
    }


  // process values sent back from our search input and update them into the form state values
  const getChildValue = (value) => {
    setValues({...values, species: value})
  }

  // handle unknown species check box
  const handleUnknownSpeciesClick = (event) => {
    event.preventDefault();
    if (values.species==='Unknown') {
      return setValues(prevValues => ({...prevValues, species: ''}));
    }
    setValues(prevValues => ({...prevValues, species: 'Unknown'}));
  }

  // callback to use our mutation
  function createCatchCallback() {
    // we need to convert the date from our date selector to a date object.toISOString to store dates consistently
    // set the local time of catch to 12:00 then convert to ISO to store
    const localDate = new Date(values.catchDate);
    // set time to 12:00:00
    localDate.setHours(12); localDate.setMinutes(0); localDate.setSeconds(0);
    // converto to ISO String
    const ISODate = localDate.toISOString();
    for (const key in values) console.log(`${key}: ${values[key]}`)

    // take our form inputs and feed them appropriately to the server
    const filteredInput = {...values};
    filteredInput.catchDate = ISODate;

    if (Number.parseInt(values.catchLength)) {
      filteredInput.catchLength = Number.parseInt(values.catchLength);
    } else {
      console.log('invalid int')
      delete filteredInput.catchLength;
    }

    // const testValues = {species: "trout", fishingType: "offshore", catchLength: 3, catchDate: "adss", notes: "", catchLocation: "" };
    console.log(filteredInput);
    createCatch({ variables: filteredInput });
  }

  return (
        <div style={{display: 'flex', padding: 10, justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
          {/* OUR MAP AND AUTOCOMPLETE */}
          <div className='map-container' style={{display: showMap ? 'flex' : 'none', flexDirection: 'column', border: '2px solid green'}}>
            <input ref={autocompleteInputRef} type='text' placeholder='Enter a location to center the map' style={{height: 40}} />
            <div id='map' ref={mapContainerRef}>
              {apiStatus.loading && <h1>Loading map</h1>}
            </div>
            { // display our google API components only if the script has loaded without errors
              (!apiStatus.loading && !apiStatus.errors) && 
              <div>
                <GoogleMap 
                  mapRef={mapRef} 
                  mapContainer={mapContainerRef} 
                  center={center} 
                  controls={controls}
                />
                <GoogleAutocomplete autocomplete={autocompleteRef} autocompleteInput={autocompleteInputRef} onPlaceSelect={handlePlaceSelect} />
              </div>
            }
          </div>

          {/* THE ACTUAL FORM CARD */}
          <div style={{display: showMap ? 'none' : 'flex', width: 400}}>
            <div>
              <Modal 
                show={showModal}
                bodyContent={modalContent.body} headerContent={modalContent.header} 
                style={{borderRadius: 5, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}
              />

              <Card fluid style={{padding: 10}}>
                <Card.Header content='Log a catch' style={{fontSize: 20, fontWeight: 'bold', padding: '10px 0px 10px 0px'}} textAlign='center' /> 
                <Form unstackable fluid style={{ margin: '0px 5px 0px 5px' }} 
                error={errors ? true : false} onSubmit={onSubmit} className={loading ? 'loading' : ''}
                >
                  {/*  CALENDAR DATE SELECTOR */}
                  <Form.Group style={{marginBottom: 10}}>
                    <Form.Field required>
                      <label>Catch date</label>
                    <DatePicker
                      dateFormat='MM/dd/yyyy'
                      selected={values.catchDate} 
                      onChange={(date) => handleDateChange(date, 'catchDate')}
                      maxDate={new Date()}
                    />
                    </Form.Field>
                  </Form.Group>

                  <Form.Group style={{marginBottom: 5}}>
                    {/* SPECIES */}
                    <Form.Field required width={10} style={{marginTop: 5}}>
                      <label>Species</label>
                      <AutoSearchInputClass
                        passInputValueToParent={(value) => getChildValue(value)}
                        controlledValue={values.species}
                      />
                      </Form.Field>
                      {/* LENGTH */}
                      <Form.Field width={6} style={{marginTop: 5}}>
                        <Form.Input 
                          type='number'
                          label='Length (in)'
                          placeholder='Length'
                          name='catchLength'
                          min='1'
                          max='1200'
                          value={values.catchLength}
                          onChange={handleChange}
                          onKeyPress={preventFormSubmitOnEnter}

                        />
                      </Form.Field>
                  </Form.Group>
                  {/* UNKOWN SPECIES CHECKBOX */}
                  <Form.Group style={{marginBottom: 20}}>
                  <Form.Checkbox 
                    label='Unknown species'
                    onClick={handleUnknownSpeciesClick}
                    checked={values.species==='Unknown'}
                    onKeyPress={preventFormSubmitOnEnter}
                  />
                  </Form.Group>
                  {/* CATCH LOCATION */}
                  <Form.Group style={{marginBottom: 10}} >
                    <Form.Field required>
                      <label>Catch location</label>
                      <div onClick={handleCatchLocationClick} style={{height: 40, width: 300, padding: 10, display: 'flex', alignItems: 'center', border: '1px solid #DEDEDF', borderRadius: 5}}>
                        {values.catchLocation ? `${values.catchLocation.lat.toFixed(5)}, ${values.catchLocation.lng.toFixed(5)}` : 'Click to select location on map'}
                      </div>
                    </Form.Field>
                  </Form.Group>     

                  {/* RADIO BUTTONS FOR FISHING TYPE */}
                  <div className='field'>
                  <label>Fishing type</label>
                  <Form.Group inline style={{marginBottom: 10}}>
                    <Form.Radio
                      id='1'
                      label='onshore'
                      value='onshore'
                      name='fishingType'
                      checked={values.fishingType === 'onshore'}
                      onClick={handleChange}
                      onKeyPress={preventFormSubmitOnEnter}
                    />
                    <Form.Radio
                      id='2'
                      label='inshore'
                      value='inshore'
                      name='fishingType'
                      checked={values.fishingType === 'inshore'}
                      onClick={handleChange}
                      onKeyPress={preventFormSubmitOnEnter}

                    />
                    <Form.Radio
                      id='3'
                      label='offshore'
                      value='offshore'
                      name='fishingType'
                      checked={values.fishingType === 'offshore'}
                      onClick={handleChange}
                      onKeyPress={preventFormSubmitOnEnter}
                    />
                  </Form.Group>
                  </div>
          
                  {/* TEXT INPUT FOR NOTES */}
                  <Form.Group style={{marginBottom: 10}} >
                    <Form.Field width={16}>
                      <label>Notes</label>
                      <Form.TextArea
                        placeholder='notes'
                        type='text'
                        name='notes'
                        value={values.notes}
                        onChange={handleChange}
                        error={errors.errorFields && errors.errorFields.notes}
                      />
                    </Form.Field>
                  </Form.Group> 

                {Object.keys(errors).length > 0 && (<FormError errors={errors.errorMessages} />)}
                <Form.Group style={{display: 'block', marginBottom: 10}}>
                  <Form.Button style={{display: 'block', margin: '0px auto 0px auto'}} color='blue' type="submit">Submit</Form.Button>
                </Form.Group> 
              </Form>
              <button type='button' onClick={() => console.log(values)} > test log</button>
            </Card>
            </div>
          </div>
        </div>
  );
}


export default CreateCatchForm;


    /*
    {
      "address_components":
        [
          {
            "long_name":"San Francisco",
            "short_name":"SF",
            "types":["locality","political"]
          },
          {
            "long_name":"San Francisco County",
            "short_name":"San Francisco County",
            "types":["administrative_area_level_2","political"]
          },
          {
            "long_name":"California",
            "short_name":"CA",
            "types":["administrative_area_level_1","political"]
          },
            {
              "long_name":"United States",
              "short_name":"US",
              "types":["country","political"]
            }
          ],
      "geometry":
        {
          "location":
            {
              "lat":37.7749295,
              "lng":-122.4194155
            },
            "viewport":{"south":37.70339999999999,"west":-122.527,"north":37.812,"east":-122.3482}},
            "icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png",
            "name":"San Francisco",
            "html_attributions":[]
        }

    */

        
  /*

          // mark our position on the map
          currentPositionMarker.current = new window.google.maps.Marker({
            position: position,
            map: props.mapRef.current
          });
          // center our map on current position:
          props.mapRef.current.setCenter(position);
  */
