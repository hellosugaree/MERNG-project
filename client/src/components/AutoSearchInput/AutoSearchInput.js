import _ from 'lodash'
import React, { useState } from 'react'
import { Search, Grid, Header, Segment, Label, Input } from 'semantic-ui-react'

const AutoSearchInput = (props) => {
  const source = [
    {
      "species": "Striped Bass",
      "aliases": ["Striper", "Stripper"]
    },
    {
      "species": "Surfperch (unknown)",
      "aliases": ['Surfperch', 'Surf Perch']
    },
    {
      "species": "Halibut",
      "aliases": ['Butt', 'Flattie', 'Barn Door']
    },
    {
      species: "Leopard Shark",
      aliases: ['Leopard']
    },
    {
      "species": "Tuna (unknown)",
      "aliases": []
    },
    {
      "species": "Albacore Tuna",
      "aliases": ["Albie"]
    },
    {
      "species": "Bigeye Tuna",
      "aliases": ["Big Eye tuna"]
    },
  
  ];

  const initialState = { isLoading: false, results: [], value: '' }
  const [state, setState] = useState(initialState);
  const { isLoading, value, results } = state;

  const handleResultSelect = (e, { result }) => {
    console.log('result select');
    setState(prevState => ({
      ...prevState,
      value: result.species,
      results: _.filter(source, (val) => val.species === result.species)
      }));
  };

  const handleSearchChange = (e, { value: input }) => {
    console.log(`input ${input}`);

    if (input === '') {
      console.log('reset state')
      setState(prevState => initialState);
    }

    setState(prevState => ({ ...prevState, isLoading: true, value: input }));
    
    setTimeout(() => {
      const re = new RegExp(_.escapeRegExp(state.value), 'i')
      const isMatch = (result) => {
        console.log('isMatch')
        console.log(result)
       return (re.test(result.aliases) || re.test(result.species))
      }
      const filteredResults = _.filter(source, isMatch);
      console.log(filteredResults);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        results: filteredResults
      }));
    }, 500)
  };

  const handleKeyPress = (e) => {
    console.log(props);
    props.someFunction();
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  }
  
  const resultsRenderer = (results) => <div><div>{results.species}</div><div>{results.aliases.map(alias => <span key={alias}>{alias} </span>)}</div></div>

  return (
    <Grid style={{marginBottom: 5}}>
      <Grid.Column width={12}>
        <Search
          onKeyPress={handleKeyPress}
          showNoResults={false}
          input={{ icon: 'search', iconPosition: 'left' }}
          loading={state.isLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={_.debounce(handleSearchChange, 500, {
            leading: true,
          })}
          resultRenderer={resultsRenderer}
          results={state.results}
          value={state.value}
        />
      </Grid.Column>
      <Grid.Column style={{maxHeight: 300, overflowY: 'auto'}} width={16}>
        <Segment>
          <Header>State</Header>
          <pre >
            {JSON.stringify({ isLoading, results, value }, null, 2)}
          </pre>
          <Header>Options</Header>
          <pre >
            {JSON.stringify(source, null, 2)}
          </pre>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default AutoSearchInput;
