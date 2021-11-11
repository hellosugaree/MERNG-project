import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import { speciesData } from './species-data';

const initialState = { isLoading: false, results: [], value: '' }

export default class AutoSearchInputClass extends Component {
  constructor(props){
    super(props);
    this.state = initialState
  }

  handleResultSelect = (e, { result }) => {
    console.log(result.species);
    this.setState({
      value: result.species,
      results: _.filter(speciesData, (val) => val.species === result.species)
    }, 
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
        results: _.filter(speciesData, isMatch)
      })

    }, 300)
  };

  handleKeyPress = (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  }
  
  render() {
    const { isLoading, results } = this.state

    const resultsRenderer = ({species, aliases}) => <div><span style={{fontWeight: 'bold', fontSize: 15}}>{species}</span><div>{aliases.map(alias => <span style={{fontSize: 14}} key={alias}>{alias} </span>)}</div></div>

    return (
      <Search
        showNoResults={true}
        onKeyPress={this.handleKeyPress}
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
    )
  }
}