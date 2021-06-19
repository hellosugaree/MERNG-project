import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import '../App.css';

const getChildByType = (children, component) => {
  // array to store found children
  const results = [];
  React.Children.forEach(children, (child) => {
    if (component.name === child.type.name) {
      results.push(child);
    }
  });
  return results;
};


const MenuItem = () => null;


const DropdownMenu = props => {
  const { children } = props;


  // if (children) {
  //   // console.log(children);
  //   const child = getChildByType(children, Test);
  //   console.log(child);
  // }

  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const renderMenu = () => {
    const menuItems = getChildByType()
  }

  const renderMenuItems = () => {
    const items = getChildByType(children, MenuItem);
    return items.length > 0 
      ? items.map(item => <li>{item.props.children}</li>) 
      : null;
  }

  const closeFilterMenu = () => {
    console.log('close click handler')
    setShowFilterMenu(false);
    document.removeEventListener('click', closeFilterMenu);
  };

  const toggleDropdown = e => {
    // stop the event from propagating or it will immediately trigger our document clickhandler and keep itself closed
    e.stopPropagation();
    e.preventDefault();
    if (showFilterMenu === false) {
      setShowFilterMenu(() => true);
      document.addEventListener('click', closeFilterMenu);
    } else {
      closeFilterMenu();
    }
  }

  return (
    <div className='dropdown-menu'>
      <button onClick={toggleDropdown}>
        <span>{props.value || props.title || props.children}</span> 
        <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle down'/>
      </button>
    </div>
  );
};

DropdownMenu.MenuItem = MenuItem;

export default DropdownMenu;



/*


            <div className='dropdown-menu'>
                <button onClick={toggleDropdown}>
                  <span>Filters</span> 
                  <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle down'/></button>
                <ul style={{display: showFilterMenu ? 'block' : 'none'}}>
                {speciesList.length > 0 &&  
                  <li style={{position: 'relative'}}>
                    <span>Species</span>
                    <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle right'/>
                    <ul className='species-list' style={{position: 'absolute', top: 0, left: '100%'}}>
                    <li>
                      {filters.species.length > 0 ?
                        <button onClick={e => {e.stopPropagation(); setFilters(prevFilers => ({ ...prevFilers, species: [] }))}} className='species-button'>
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
                  <ul className='catch-date' style={{position: 'absolute', top: 0, left: '100%', minWidth: 175}}>
                      <li>
                        <button onClick={e => handleFilterClick(e, 'catchDate')} name='ALL_DATES' className='species-button'>
                          All dates
                          <Icon style={{display: filters.catchDate === 'ALL_DATES' ? '' : 'none', marginLeft: 'auto'}} name='check circle outline' color='green' />
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


          */