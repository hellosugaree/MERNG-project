import React, { useState, useEffect } from 'react';
import { Dropdown, Checkbox } from 'semantic-ui-react';
import { sortOptions, countyDropdownOptions } from './helpers'
import '../../App.css';
import './BeachAccessLocations.css';

const Filters = (props) => {

  const { 
    filteredAccessLocations,
    setDisplayFilters,
    displayFilters,
  } = props;

  const [loadingSearchInName, setLoadingSearchInName] = useState(false);

  // update state for filter toggles
  const handleFilterToggle = (e, checked, name) => {
    setDisplayFilters(prevFilters => ({ ...prevFilters, [name]: checked, applied: false }));
  };
  const handleCountyChange = (e, value) => {
    setDisplayFilters(prevFilters => ({ ...prevFilters, county: value, applied: false }));
  };
  const handlePagesToDisplayInputChange = event => {
    let inputValue = event.target.value;
    if (inputValue < 1) inputValue = 1;
    if (inputValue > 50) inputValue = 50;
    setDisplayFilters({...displayFilters, itemsPerPage: inputValue});
  };
  // handle our filter by name input change
  const handleSearchInNameChange = (e) => {
    // setLoadingSearchInName(true);
    setDisplayFilters({...displayFilters, searchInName: e.target.value})
  };
  // handle change for sort dropdown
  const handleSortDropdownChange = (event, { value }) => {
    setDisplayFilters({...displayFilters, sortDropdownValue: value, applied: false});
  }
  

  return (
    <div className='flex column align filter-container'>
      {/* SORT DROPDOWN */}
      <div className='sort-by'>
        <span style={{marginRight: 10, fontSize: 16}}>Sort by</span>
        <Dropdown 
          inline 
          style={{fontSize: 16}} 
          options={sortOptions}
          onChange={handleSortDropdownChange} 
          value={displayFilters.sortDropdownValue}
        />
      </div>
    
        <div className='flex relative' style={{width: 250}}>
          {/* TEXT INPUT TO FILTER NAMES */}
          <input
            className='name-search-input'
            // disabled={!filteredAccessLocations ? true : false }
            placeholder='Name contains' 
            type='text' 
            name='searchInName' 
            value={displayFilters.searchInName} 
            onChange={handleSearchInNameChange} 
          /> 
          <div 
            className='animate-spinner'
            style={{
              display: loadingSearchInName ? '' : 'none',
              position: 'absolute',
              borderRadius: '50%', border: '6px solid #898A8A', borderTop: '6px solid lightblue',
              right: 2, bottom: 2, 
              height: 26, width: 26,
              zIndex: 100
            }} 
          />
        </div>

        <div className='dropdown-container'>
          <Dropdown
            style={{flexGrow: 1, textAlign: 'center'}}               
            inline
            options={countyDropdownOptions}
            name='county'
            onChange={(e, { value }) => handleCountyChange(e, value)}
            value={displayFilters.county}
          />
        </div>

      {/* FILTER ATTRIBUTE CHECKBOXES */}
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}> 
        <div className='toggle-container'>
          <Checkbox className='filter-toggle' toggle name='hasBoating' label='Boating' checked={displayFilters.hasBoating} onChange={(e, { checked, name }) => handleFilterToggle(e, checked, name)}/>
          <Checkbox className='filter-toggle' toggle name='hasCampground' label='Campground' checked={displayFilters.hasCampground} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>

      
          <Checkbox className='filter-toggle' toggle name='isSandy' label='Sandy shore' checked={displayFilters.isSandy} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>
          <Checkbox className='filter-toggle' toggle name='isRocky' label='Rocky shore' checked={displayFilters.isRocky} onChange={(e, { checked, name }) =>  handleFilterToggle(e, checked, name)}/>
        </div>
      </div>
      <div className='items-per-page-container' >
        <label>Items per page</label>
        <input 
          style={{maxWidth: 40, padding: 2, fontSize: 16,textAlign: 'center'}} 
          type='number' value={displayFilters.itemsPerPage} 
          onChange={handlePagesToDisplayInputChange} 
          onClick={e => e.target.select()}
        />
      </div>
    </div>
  );

}

export default Filters;