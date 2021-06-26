import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { Card, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { CREATE_CATCH } from '../gql/gql'
import { useForm } from '../utilities/hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GET_CATCHES, GET_USER_BASIC_DATA } from '../gql/gql';
import AutoSearchInputClass from './AutoSearchInputClass';
import FormError from './FormError';

import '../App.css';

// create custom control elements to send to our map
// create a button to accept our location
const selectLocationButton = document.createElement('button');
selectLocationButton.classList.add('custom-map-control-button');
selectLocationButton.innerHTML='Accept catch location';

/*
  This form has 2 different ways of handling catch location
  1) default: 
  Catch location is null on form load 
  When the user clicks the catch location input field, a map will show up on the form and allow a user to select a location

  2) if props.catchLocation is specified:
  The catchLocation value will be controlled through props
  This is used when the user is creating a catch from the catch map
*/

const CreateCatchForm = props => {
  const { user } = useContext(AuthContext);
  // array to hold controls that will be added on mount

  // FORM RELATED STUFF DOWN HERE
  const initialValues = {
    species: '',
    fishingType: 'inshore',
    catchDate: new Date(),
    catchLength: '',
    notes: '',
    // if form is on the create catch page which already has a map, we'll take the map center from that, otherwise set as null
    catchLocation: props.catchLocation
  };

  const { errors, values, onSubmit, handleChange, handleDateChange, handleFormErrors, setValues } 
    = useForm(createCatchCallback, initialValues);

  // if catch location is controlled via props, update values when location changes
  useEffect(() => {
      setValues(prevValues => ({ ...prevValues, catchLocation: props.catchLocation }));
  }, [props.catchLocation, setValues])


  const [createCatch, { loading }] = useMutation(CREATE_CATCH, {
    options: () => ({ errorPolicy: 'all' }),
    update(cache, data) {
      // read the cached catches query
      const { getCatches : cachedCatchData } = cache.readQuery({
        query: GET_CATCHES    // our gql file used to make the query initially
      });

      // write catch to the caches catches data
      if (cachedCatchData) {
        cache.writeQuery({ 
          query: GET_CATCHES, 
          data: {
            getCatches: [data.data.createCatch, ...cachedCatchData]
          }
        }); 
      }

      // update user-specific catches query data
      const { getCatches : cachedUserCatchData } = cache.readQuery({
        query: GET_CATCHES,    // our gql file used to make the query initially
        variables: { catchesToReturn: 100, userId: user.id }
      });

      // write catch to the caches catches data
      if (cachedUserCatchData) {
        cache.writeQuery({ 
          query: GET_CATCHES,
          variables: { catchesToReturn: 100, userId: user.id }, 
          data: {
            getCatches: [data.data.createCatch, ...cachedUserCatchData]
          }
        }); 
      }

      // now update our user data query so our stats are updated
      const { getUser: cachedUser } = cache.readQuery({
        query: GET_USER_BASIC_DATA,
        variables: { userId: user.id },
      });
      // now update our user data query so our stats are updated
      if (cachedUser) {
        cache.writeQuery({
          query: GET_USER_BASIC_DATA,
          variables: { userId: user.id },
          data: {
            getUser: {
              ...cachedUser,
              catches: [...cachedUser.catches, data.data.createCatch],
              catchCount: cachedUser.catchCount + 1
            }
          }
        });
      }
      // clear the form
      setValues(initialValues);
      // run the callback from props if it exists
      if (props.onSuccessCallback) {
        props.onSuccessCallback(data.data.createCatch);
      }
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
        // outer form container
        <div style={{maxWidth: 400, justifyContent: 'center',  alignItems: 'center', display: 'flex', flexGrow: 1, ...props.style}}>
          {/* THE ACTUAL FORM CARD */}
          <div style={{display: 'flex', width: 300, flexGrow: 1}}>
              <Card fluid style={{padding: 10}}>
                <Card.Header content='Log a catch' style={{fontSize: 20, fontWeight: 'bold', padding: '10px 0px 10px 0px'}} textAlign='center' /> 
                <Form unstackable style={{ margin: '0px 5px 0px 5px' }} 
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
                    <Form.Field required width={16}>
                      <label>Catch location (select on map)</label>
                      <div style={{height: 40, padding: 10, margin: '0px 5px 0px 0px', display: 'flex', alignItems: 'center', border: '1px solid #DEDEDF', borderRadius: 5}}>
                        {props.catchLocation.lat.toFixed(5)}, {props.catchLocation.lng.toFixed(5)}
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

data:
  createCatch:
    catchDate: "2021-06-10T19:00:00.401Z"
    catchLength: null
    catchLocation: "{\"lat\":33.4999997,\"lng\":-117.747382}"
    createdAt: "2021-06-10T23:27:21.282Z"
    fishingType: "inshore"
    notes: null
    species: "Striped Bass"
    user: "609d7bf7352e8e7490d024ba"
    username: "1234"
ROOT_QUERY:
getCatches({"catchesToReturn":100,"userId":"609d7bf7352e8e7490d024ba"}): Array(19)
0: {__ref: "Catch:60c29fd95ce65714e411a829"}
1: {__ref: "Catch:60c2981d91024c64d0fc7901"}
2: {__ref: "Catch:60c29610145bce9720b7a9ea"}
3: {__ref: "Catch:60c28dfdab1eec97182837f7"}
4: {__ref: "Catch:60c22f9738bbb02e30a9f227"}
5: {__ref: "Catch:60c0fbc280e0cba284ec75e8"}
6: {__ref: "Catch:60c0fb0880e0cba284ec75e7"}
7: {__ref: "Catch:60c0fa1202c83d79bc5b7cdd"}
8: {__ref: "Catch:60c0f9e1582cdd6da02ae723"}
9: {__ref: "Catch:60c0df7f204fc667c027e650"}
10: {__ref: "Catch:60c0243ac7fd62339ca876b2"}
11: {__ref: "Catch:60bed8e65e1ad69af8481fda"}
12: {__ref: "Catch:60b65ad250674a9dec6d4734"}
13: {__ref: "Catch:60b5483a72139481ec4eddb9"}
14: {__ref: "Catch:60b1f0259682b585601b4380"}
15: {__ref: "Catch:60b1842d1c257e3f1841f1b8"}
16: {__ref: "Catch:60b1835839f80a4e6c29291f"}
17: {__ref: "Catch:60b15014ff4d382a74614ae6"}
18: {__ref: "Catch:60b14f89ff4d382a74614ae5"}
length: 19
__proto__: Array(0)
getCatches({}): Array(24)
0: {__ref: "Catch:60c29fd95ce65714e411a829"}
1: {__ref: "Catch:60c2981d91024c64d0fc7901"}
2: {__ref: "Catch:60c29610145bce9720b7a9ea"}
3: {__ref: "Catch:60c28dfdab1eec97182837f7"}
4: {__ref: "Catch:60c22f9738bbb02e30a9f227"}
5: {__ref: "Catch:60c0fbc280e0cba284ec75e8"}
6: {__ref: "Catch:60c0fb0880e0cba284ec75e7"}
7: {__ref: "Catch:60c0fa1202c83d79bc5b7cdd"}
8: {__ref: "Catch:60c0f9e1582cdd6da02ae723"}
9: {__ref: "Catch:60c0df7f204fc667c027e650"}
10: {__ref: "Catch:60c0243ac7fd62339ca876b2"}
11: {__ref: "Catch:60bed8e65e1ad69af8481fda"}
12: {__ref: "Catch:60b65ad250674a9dec6d4734"}
13: {__ref: "Catch:60b5483a72139481ec4eddb9"}
14: {__ref: "Catch:60b1f0259682b585601b4380"}
15: {__ref: "Catch:60b1842d1c257e3f1841f1b8"}
16: {__ref: "Catch:60b1835839f80a4e6c29291f"}
17: {__ref: "Catch:60b15014ff4d382a74614ae6"}
18: {__ref: "Catch:60b14f89ff4d382a74614ae5"}
19: {__ref: "Catch:60b13ad13628f961c88db1d6"}
20: {__ref: "Catch:60b13abc3628f961c88db1d5"}
21: {__ref: "Catch:60b13a9f3628f961c88db1d4"}
22: {__ref: "Catch:60b13a993628f961c88db1d3"}
23: {__ref: "Catch:60b13a8f3628f961c88db1d2"}
length: 24
__proto__: Array(0)
getPosts: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
getUser({"userId":"609d7bf7352e8e7490d024ba"}):
catchCount: 19
catches: Array(19)
0: "60c29fd95ce65714e411a829"
1: "60c2981d91024c64d0fc7901"
2: "60c29610145bce9720b7a9ea"
3: "60c28dfdab1eec97182837f7"
4: "60c22f9738bbb02e30a9f227"
5: "60c0fbc280e0cba284ec75e8"
6: "60c0fb0880e0cba284ec75e7"
7: "60c0fa1202c83d79bc5b7cdd"
8: "60c0f9e1582cdd6da02ae723"
9: "60c0df7f204fc667c027e650"
10: "60c0243ac7fd62339ca876b2"
11: "60bed8e65e1ad69af8481fda"
12: "60b65ad250674a9dec6d4734"
13: "60b5483a72139481ec4eddb9"
14: "60b1f0259682b585601b4380"
15: "60b1842d1c257e3f1841f1b8"
16: "60b1835839f80a4e6c29291f"
17: "60b15014ff4d382a74614ae6"
18: "60b14f89ff4d382a74614ae5"
length: 19
__proto__: Array(0)
createdAt: "2021-05-13T19:20:23.574Z"
username: "1234"
__typename: "User"
__typename: "Query"



  // // useEffect to monitor our geoloation position when updated from any getPosition() calls
  // useEffect(() => {
  //   console.log('position update detected in useEffect');
  //   // check if we have a position
  //   if (geolocationStatus.position) {
  //     // check if we already have a position marker
  //     if (currentPositionMarkerRef.current) {
  //       // current position marker exists, update the marker
  //       console.log('current pos marker already exists');
  //       currentPositionMarkerRef.current.setPosition(geolocationStatus.position);
  //     } else {
  //       console.log('current pos marker doesn\'t exist, creating new one');
  //       // current position marker doesn't exist, create a new marker
  //       currentPositionMarkerRef.current = new window.google.maps.Marker({
  //         position: geolocationStatus.position,
  //         map: mapRef.current
  //       });
  //       // center the map on current position
  //     }
  //     setCenter(geolocationStatus.position);      
  //   }
  //   if (geolocationStatus.errorMessage) {
  //     console.log('processing geolocation errors')
  //     if (infoWindowRef.current) {
  //       infoWindowRef.current.close();
  //     }
  //     infoWindowRef.current = new window.google.maps.InfoWindow({
  //       content: `<div id="content">
  //       <div><b>Location error</b></div><br/>
  //         <div>${geolocationStatus.errorMessage}</div>
  //         </div>`,
  //     });
  //     infoWindowRef.current.setPosition(mapRef.current.getCenter());
  //     infoWindowRef.current.open(mapRef.current);
  //   }
  // }, [geolocationStatus.position, geolocationStatus.errorMessage, currentPositionMarkerRef, mapRef, infoWindowRef])


  */
