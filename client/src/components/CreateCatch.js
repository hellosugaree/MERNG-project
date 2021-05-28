import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CATCH } from '../gql/gql'
import { AuthContext } from '../context/auth';
import { Form, Card, Grid } from 'semantic-ui-react';
import { useForm } from '../utilities/hooks';
import FormError from './FormError';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AutoSearchInputClass from './AutoSearchInputClass';

const CreateCatch = (props) => {
const { user } = useContext(AuthContext);
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



const searchSubmit = (e) => {
  
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
  localDate.setHours(12);
  localDate.setMinutes(0);
  localDate.setSeconds(0);
  const ISODate = localDate.toISOString();
  for (const key in values) console.log(`${key}: ${values[key]}`)

  // take our form inputs and feed them appropriately to the server
  const filteredInput = {...values};
  filteredInput.catchDate = ISODate;
  if (Number.parseInt(values.catchLength)) {
    console.log('found length')
    filteredInput.catchLength = values.catchLength;
  } else {
    delete filteredInput.catchLength;
  }
  console.log(filteredInput);
  // if (values.catchLocation){
  //   console.log('found catchlocation')
  //   filteredInput.catchLocation = values.catchLocation;
  // }
  // if (values.notes){
  //   console.log('found notes')
  //   filteredInput.notes = values.notes;
  // }
  // if (values.species){
  //   console.log('found species')
  //   filteredInput.species = values.species;
  // }
  const testValues = {species: "trout", fishingType: "offshore", catchLength: 3, catchDate: "adss", notes: "", catchLocation: "" };
  console.log(testValues);
  createCatch({ variables: testValues })
}

return (
  <div style={{margin: '10px auto 20px auto', maxWidth: 475}}>
    <Card fluid  >
      <Card.Header content='Log a catch' style={{fontSize: 20, fontWeight: 'bold', padding: '10px 0px 10px 0px'}} textAlign='center' /> 
      <Form style={{width: 450, margin: '5px auto 5px auto', padding: '0px 10px 0px 10px'}} 
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

        <Form.Group unstackable style={{marginBottom: 5}}>
          {/* SPECIES */}
          <Form.Field required width={8}>
            <label>Species</label>
            <AutoSearchInputClass
              passInputValueToParent={(value) => getChildValue(value)}
              controlledValue={values.species}
            />
            </Form.Field>
            <Form.Field width={4}>
              <Form.Input 
              type='number'
              label='Length (inches)'
              placeholder='Length'
              name='catchLength'
              value={values.catchLength}
              onChange={handleChange}
            />
            </Form.Field>
        </Form.Group>
        <Form.Group style={{marginBottom: 20}}>
        <Form.Checkbox 
          label='Unknown species'
          onClick={handleUnknownSpeciesClick}
          checked={values.species==='Unknown'}
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
          />
          <Form.Radio
            id='2'
            label='inshore'
            value='inshore'
            name='fishingType'
            checked={values.fishingType === 'inshore'}
            onClick={handleChange}
          />
          <Form.Radio
            id='3'
            label='offshore'
            value='offshore'
            name='fishingType'
            checked={values.fishingType === 'offshore'}
            onClick={handleChange}
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
        <button onClick={(e) =>{console.log(typeof values.catchLength); e.preventDefault(); console.log(values)}}>log val</button>

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