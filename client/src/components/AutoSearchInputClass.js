import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'

const source = [
  {
    title: "Striped Bass",
    species: "Striped Bass",
    aliases: ["Striper", "Stripper"]
  },
  {
    title: "Surfperch (unknown)",
    species: "Surfperch (unknown)",
    aliases: ['Surfperch', 'Surf Perch']
  },
  {
    title: "Halibut",
    species: "Halibut",
    aliases: ['Butt', 'Flattie', 'Barn Door']
  },
  {
    title: "Leopard Shark",
    species: "Leopard Shark",
    aliases: ['Leopard']
  },
  {
    title: "Tuna (unknown)",
    species: "Tuna (unknown)",
    aliases: []
  },
  {
    title: "Albacore Tuna",
    species: "Albacore Tuna",
    aliases: ["Albie"]
  },
  {
     title: "Bigeye Tuna",
     species: "Bigeye Tuna",
     aliases: ["Big Eye tuna"]
  },
  {"title":"Barred sand bass","species":"Barred sand bass","aliases":[]},
  {"title":"Barred surfperch","species":"Barred surfperch","aliases":[]},
  {"title":"Bat ray","species":"Bat ray","aliases":[]},
  {"title":"Bigeye tuna","species":"Bigeye tuna","aliases":[]},
  {"title":"Black rockfish","species":"Black rockfish","aliases":[]},
  {"title":"Blue rockfish","species":"Blue rockfish","aliases":[]},
  {"title":"Blue shark","species":"Blue shark","aliases":[]},
  {"title":"Bluefin tuna","species":"Bluefin tuna","aliases":[]},
  {"title":"Bocaccio","species":"Bocaccio","aliases":[]},
  {"title":"Bonito shark","species":"Bonito shark","aliases":[]},
  {"title":"Brown smoothhound","species":"Brown smoothhound","aliases":[]},
  {"title":"Cabezon","species":"Cabezon","aliases":[]},
  {"title":"Calico Bass","species":"Calico Bass","aliases":[]},
  {"title":"California barracuda","species":"California barracuda","aliases":[]},
  {"title":"California corbina","species":"California corbina","aliases":[]},
  {"title":"California grunion","species":"California grunion","aliases":[]},
  {"title":"California lizardfish","species":"California lizardfish","aliases":[]},
  {"title":"California sheephead","species":"California sheephead","aliases":[]},
  {"title":"Canary rockfish","species":"Canary rockfish","aliases":[]},
  {"title":"Chilipepper","species":"Chilipepper","aliases":[]},
  {"title":"Chinook salmon","species":"Chinook salmon","aliases":[]},
  {"title":"Coho salmon","species":"Coho salmon","aliases":[]},
  {"title":"Common thresher shark","species":"Common thresher shark","aliases":[]},
  {"title":"Copper rockfish","species":"Copper rockfish","aliases":[]},
  {"title":"Cowcod","species":"Cowcod","aliases":[]},
  {"title":"Giant kelpfish","species":"Giant kelpfish","aliases":[]},
  {"title":"Giant sea bass","species":"Giant sea bass","aliases":[]},
  {"title":"Gray smoothhound","species":"Gray smoothhound","aliases":[]},
  {"title":"Greenspotted rockfish","species":"Greenspotted rockfish","aliases":[]},
  {"title":"Green sturgeon","species":"Green sturgeon","aliases":[]},
  {"title":"Halfmoon","species":"Halfmoon","aliases":[]},
  {"title":"Jack mackerel","species":"Jack mackerel","aliases":[]},
  {"title":"Jacksmelt","species":"Jacksmelt","aliases":[]},
  {"title":"Kelp bass","species":"Kelp bass","aliases":[]},
  {"title":"Kelp greenling","species":"Kelp greenling","aliases":[]},
  {"title":"King salmon","species":"King salmon","aliases":[]},
  {"title":"Lingcod","species":"Lingcod","aliases":[]},
  {"title":"Longfin sanddab","species":"Longfin sanddab","aliases":[]},
  {"title":"Pacific bonito","species":"Pacific bonito","aliases":[]},
  {"title":"Pacific hake","species":"Pacific hake","aliases":[]},
  {"title":"Pacific halibut","species":"Pacific halibut","aliases":[]},
  {"title":"Pacific mackerel","species":"Pacific mackerel","aliases":[]},
  {"title":"Pacific sanddab","species":"Pacific sanddab","aliases":[]},
  {"title":"Pacific staghorn sculpin","species":"Pacific staghorn sculpin","aliases":[]},
  {"title":"Pacific tomcod","species":"Pacific tomcod","aliases":[]},
  {"title":"Pacific whiting","species":"Pacific whiting","aliases":[]},
  {"title":"Petrale sole","species":"Petrale sole","aliases":[]},
  {"title":"Redtail surfperch","species":"Redtail surfperch","aliases":[]},
  {"title":"Rockfish widow","species":"Rockfish widow","aliases":[]},
  {"title":"Roncador stearnsii","species":"Roncador stearnsii","aliases":[]},
  {"title":"Round stingray","species":"Round stingray","aliases":[]},
  {"title":"Rubberlip seaperch","species":"Rubberlip seaperch","aliases":[]},
  {"title":"Sablefish","species":"Sablefish","aliases":[]},
  {"title":"Sargo","species":"Sargo","aliases":[]},
  {"title":"Sculpin","species":"Sculpin","aliases":[]},
  {"title":"Seriola dorsalis","species":"Seriola dorsalis","aliases":[]},
  {"title":"Seriola lalandi","species":"Seriola lalandi","aliases":[]},
  {"title":"Seriphus politus","species":"Seriphus politus","aliases":[]},
  {"title":"Shiner perch","species":"Shiner perch","aliases":[]},
  {"title":"Shortfin mako","species":"Shortfin mako","aliases":[]},
  {"title":"Shovelnose guitarfish","species":"Shovelnose guitarfish","aliases":[]},
  {"title":"Silver salmon","species":"Silver salmon","aliases":[]},
  {"title":"Silver surfperch","species":"Silver surfperch","aliases":[]},
  {"title":"Skipjack","species":"Skipjack","aliases":[]},
  {"title":"Spiny dogfish","species":"Spiny dogfish","aliases":[]},
  {"title":"Spotfin croaker","species":"Spotfin croaker","aliases":[]},
  {"title":"Spotted sand bass","species":"Spotted sand bass","aliases":[]},
  {"title":"Starry flounder","species":"Starry flounder","aliases":[]},
  {"title":"Starry rockfish","species":"Starry rockfish","aliases":[]},
  {"title":"Stereolepis gigas","species":"Stereolepis gigas","aliases":[]},
  {"title":"Striped marlin","species":"Striped marlin","aliases":[]},
  {"title":"Swordfish","species":"Swordfish","aliases":[]},
  {"title":"Vermilion rockfish","species":"Vermilion rockfish","aliases":[]},
  {"title":"Walleye surfperch","species":"Walleye surfperch","aliases":[]},
  {"title":"White croaker","species":"White croaker","aliases":[]},
  {"title":"White seabass","species":"White seabass","aliases":[]},
  {"title":"White sturgeon","species":"White sturgeon","aliases":[]},
  {"title":"Widow rockfish","species":"Widow rockfish","aliases":[]},
  {"title":"Yellowfin croaker","species":"Yellowfin croaker","aliases":[]},
  {"title":"Yellowfin tuna","species":"Yellowfin tuna","aliases":[]},
  {"title":"Yellowtail","species":"Yellowtail","aliases":[]},
  {"title":"Yellowtail rockfish","species":"Yellowtail rockfish","aliases":[]}
];
/* const fishNames = `Barred sand bass
Barred surfperch
Bat ray
Bigeye tuna
Black rockfish
Blue rockfish
Blue shark
Bluefin tuna
Bocaccio
Bonito shark
Brown smoothhound
Cabezon
California barracuda
California corbina
California grunion
California lizardfish
California sheephead
Canary rockfish
Chilipepper
Chinook salmon
Coho salmon
Common thresher shark
Copper rockfish
Cowcod
Giant kelpfish
Giant sea bass
Gray smoothhound
Greenspotted rockfish
Green sturgeon
Halfmoon
Jack mackerel
Jacksmelt
Kelp bass
Kelp greenling
King salmon
Lingcod
Longfin sanddab
Pacific bonito
Pacific hake
Pacific halibut
Pacific mackerel
Pacific sanddab
Pacific staghorn sculpin
Pacific tomcod
Pacific whiting
Petrale sole
Redtail surfperch
Rockfish widow
Roncador stearnsii
Round stingray
Rubberlip seaperch
Sablefish
Sargo
Sculpin
Seriola dorsalis
Seriola lalandi
Seriphus politus
Shiner perch
Shortfin mako
Shovelnose guitarfish
Silver salmon
Silver surfperch
Skipjack
Spiny dogfish
Spotfin croaker
Spotted sand bass
Starry flounder
Starry rockfish
Stereolepis gigas
Striped marlin
Swordfish
Vermilion rockfish
Walleye surfperch
White croaker
White seabass
White sturgeon
Widow rockfish
Yellowfin croaker
Yellowfin tuna
Yellowtail
Yellowtail rockfish`; */

const initialState = { isLoading: false, results: [], value: '' }

/*
  Notes: this one is a but of a pain to use in a controlled form...
  To get the input value to the parent form to keep it as a controlled form,
  we have to pass this component a function as a property named passInputValueToParent
  with each state update to value, we pass the updated value through the passInputValueToParent 
  as a callback in setState

  In order to get the values on the component controlled by the parent form's state, 
  we need to pass the value from the parent state back down as a property called controlledValue

*/

export default class AutoSearchInputClass extends Component {
  constructor(props){
    super(props);
    this.state = initialState
  }
  
/*  
  // process names function was used to turn a list into an array of json objects
  processNames = () => {
    const fishArr = fishNames.split('\n');
    const objArr = [];
    fishArr.forEach(val => {
      objArr.push({
        title: val,
        species: val,
        aliases: []
      });
    });
    objArr.forEach(obj => console.log(obj));
    let longStringOfObjects = '';
    objArr.forEach(obj => {
      longStringOfObjects += JSON.stringify(obj) + ',\n';
    })
    console.log(longStringOfObjects)
  } */


  // function is used to pass the search input up to the parent form so the input can be controlled


  // componentDidUpdate(_, nextState) {
  //   pass our updated value for the input to our parent (the form)
  //   this.props.passInputValueToParent(nextState.value);
  // }

  handleResultSelect = (e, { result }) => {
    console.log(result.species);
    this.setState({
      value: result.species,
      results: _.filter(source, (val) => val.species === result.species)
    }, 
      // pass our updated value for the input to our parent (the form) in the setState callback
     () => this.props.passInputValueToParent(this.state.value));

  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value }, 
      // pass our updated value for the input to our parent (the form) in the setState callback
      () => this.props.passInputValueToParent(this.state.value)
    );

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => (re.test(result.aliases) || re.test(result.species))
     
      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch)
      })

    }, 300)
  };

  handleKeyPress = (e) => {
    if (e.code === 'Enter') {
      // prevent enter from submitting form
      e.preventDefault();

    }
  }
  
  render() {
    const { isLoading, results } = this.state

    const resultsRenderer = ({species, aliases}) => <div><span style={{fontWeight: 'bold', fontSize: 15}}>{species}</span><div>{aliases.map(alias => <span style={{fontSize: 14}} key={alias}>{alias} </span>)}</div></div>

    return (
          <div>
          <Search
            onKeyPress={this.handleKeyPress}
            showNoResults={false}
            input={{ icon: 'search', iconPosition: 'left' }}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            resultRenderer={resultsRenderer}
            results={results}
            value={this.props.controlledValue}
          />
          </div>
    )
  }
}
       
/*
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

<div key={results.species}><div>{results.species}</div><div>{results.aliases.map(alias =><span key={alias}>{alias} </span>)}</div></div>

*/