import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import '../../App.css';

const Filters = (props) => {
  const { 
    speciesList, 
    setFilters, 
    defaultFilters,
    filters 
  } = props;

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isDefault, setIsDefault] = useState(true);

  const closeFilterMenu = () => {
    setShowFilterMenu(false);
    document.removeEventListener('click', closeFilterMenu);
  };

  // update whether or not filters are default after change for conditionally rendered clear filters button
  useEffect (() => {
    let isDefault = true;
    // check if filters default
    if (filters.species.length !== 0 || filters.catchDate !== 'ALL'){
      isDefault = false;
    }
    setIsDefault(isDefault);
  }, [filters]);

  // toggle show and hide for dropdown menu
  const toggleDropdown = e => {
    // stop the event from propagating or it will immediately trigger our document clickhandler and keep itself closed
    e.stopPropagation();
    e.preventDefault();
    if (showFilterMenu === false) {
      setShowFilterMenu(() => true);
      // document.addEventListener('click', closeFilterMenu);
    } else {
      closeFilterMenu();
    }
  }

  // update our filters object when the user clicks a filter
  const handleFilterClick = (e, property) => {
    // property is passed as an argument to the onClick handler from the filter button component
    // clear all filters 
    if (property === 'clear') {
      return setFilters({...defaultFilters, apply: true});
    }
    const valueToFilter = e.target.name;
    // handle species filters
    if (property === 'species') {
      // prevent a species filter click from closing the dropdown so the user can select multiple species
      e.stopPropagation();
      if (filters.species.indexOf(valueToFilter) > -1) {
        // species already being filtered, toggle it off
        let newSpeciesArray = filters.species.slice();
        newSpeciesArray.splice(filters.species.indexOf(valueToFilter), 1);
        setFilters(prevFilters => ( { ...prevFilters, apply: true, species: newSpeciesArray} ));
      } else {
        setFilters(prevFilters => ({ ...prevFilters, apply: true, species: [...prevFilters.species, valueToFilter]}));
      }
    }
    if (property === 'catchDate') {
      // dont change filters if we click the same date so we dont refilter the data for no reason
      if (filters.catchDate !== e.target.name ){
        setFilters(prevFilters => ({ ...prevFilters, apply: true, catchDate: e.target.name }))
      }
    }
  }

  return (
    <div className='dropdown-menu'>
    <button onClick={toggleDropdown}>
      <span>Filters</span> 
      <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle down'/></button>
    <ul style={{display: showFilterMenu ? 'block' : 'none'}}>
      <li>
        <button style={isDefault ? {backgroundColor: 'white'} : {}} disabled={isDefault} onClick={(e) => handleFilterClick(e, 'clear')} className='species-button'>
          {isDefault ? 'Select filters' : 'Clear Filters'}
        </button>                    
      </li>
      <hr style={{margin: 0}} />
      {speciesList.length > 0 &&  
        <li style={{position: 'relative'}}>
          <span>Species</span>
          <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle right'/>
          <ul className='species-list' style={{position: 'absolute', top: 0, left: '100%'}}>
            {/* SPECIES FILTER BUTTONS */}
              <li>
              {filters.species.length > 0 ?
                <button onClick={e => handleFilterClick(e, 'clear')} className='species-button'>
                  Clear species filters
                </button>
                :
                <button className='species-button' style={{backgroundColor: 'white'}}>Select species</button>
              }
              </li>
            <hr style={{margin: 0, padding: 0}} />
            {speciesList.map(species => 
              <li key={species}>
                <button onClick={e => handleFilterClick(e, 'species')} name={species} className='species-button'>
                  {species}
                  <Icon style={{display: filters.species.indexOf(species) > -1 ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
                </button>
              </li>
            )
            }
          </ul>
        </li>
      }
      <li style={{position: 'relative'}}>
        <span>Catch date</span>
        <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle right'/>
        <ul className='catch-date'>
            <li>
              <button onClick={e => handleFilterClick(e, 'catchDate')} name='ALL' className='species-button'>
                All dates
                <Icon style={{display: filters.catchDate === 'ALL' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
              </button>
            </li>
            <li>
              <button onClick={e => handleFilterClick(e, 'catchDate')} name='TODAY' className='species-button'>
                  Today
                  <Icon style={{display: filters.catchDate === 'TODAY' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
              </button>
            </li>
            <li>
              <button onClick={e => handleFilterClick(e, 'catchDate')} name='WEEK' className='species-button'>
                  Past week
                  <Icon style={{display: filters.catchDate === 'WEEK' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
              </button>
            </li>
            <li>
              <button onClick={e => handleFilterClick(e, 'catchDate')} name='MONTH' className='species-button'>
                  Past month
                  <Icon style={{display: filters.catchDate === 'MONTH' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
              </button>
            </li>                    
            <li>
              <button onClick={e => handleFilterClick(e, 'catchDate')} name='YEAR' className='species-button'>
                  Past Year
                  <Icon style={{display: filters.catchDate === 'YEAR' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
              </button>
            </li>       
        </ul>
      </li>
    </ul>
</div>  
  );
};

export default Filters;