import React from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CATCH } from '../gql/gql'
import { Form, Card } from 'semantic-ui-react';
import { useForm } from '../utilities/hooks';
import FormError from './FormError';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AutoSearchInputClass from './AutoSearchInputClass';

const CreateCatch = (props) => {
  const { errors, values, onSubmit, handleChange, handleDateChange, handleFormErrors, setValues } 
    = useForm(createCatchCallback, {
      species: '',
      fishingType: 'inshore',
      catchDate: new Date(),
      catchLocation: '',
      catchLength: '',
      notes: ''
    });



  const [createCatch, { loading }] = useMutation(CREATE_CATCH, {
    options: () => ({ errorPolicy: 'all' }),
    update(cache, data) {
      console.log(data);
    },
    onError(err) {
      console.log(err.graphQLErrors)
      console.log(err.networkError)
      console.log(err.message);
      console.log(err.extraInfo)
      handleFormErrors(err);
    }
  });

  /*
  username: user.username,
            user: user.id,
            species,
            fishingType,
            catchDate,
            catchLocation: catchLocation || null,
            sessionId: sessionId || null,
            createdAt: new Date().toISOString()
            */


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
      <div style={{margin: '10px auto 10px auto', maxWidth: 400}}>
      <Card fluid style={{padding: 5}}>
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
          {/* CATCH LOCATION */}
          <Form.Group style={{marginBottom: 10}} >
            <Form.Field>
              <Form.Input 
                type='text'
                label='Catch location'
                placeholder='Catch location'
                name='catchLocation'
                value={values.catchLocation}
                onChange={handleChange}
                onKeyPress={preventFormSubmitOnEnter}
              />
            </Form.Field>
          </Form.Group>        
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
    </Card>
    </div>
  );

};


export default CreateCatch;


/*
      <button onClick={(e) =>{e.preventDefault(); console.log(values)}}>log val</button>


 
        <Form.Button onClick={() => console.log(values)} >log value</Form.Button>




*/