import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react'
import '../../App.css';

const Dropdown = props => {

  const { onItemSelect, defaultIndex, disabled } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex ? defaultIndex : 0 );

  // set dropdown to default index if disabled
  useEffect(() => {
    if (disabled === true) {
      console.log(`disabled: ${disabled}`)
      setSelectedIndex(defaultIndex ? defaultIndex : 0)
    }
  }, [disabled, setSelectedIndex, defaultIndex])

  const toggleDropdown = e => {
    if (disabled) {
      return null;
    }
    e.stopPropagation();
    e.preventDefault();
    if (showDropdown === false) {
      setShowDropdown(() => true);
      document.addEventListener('click', closeFilterMenu);
    } else {
      closeFilterMenu();
    }
  }

  const closeFilterMenu = () => {
    console.log('close click handler')
    setShowDropdown(false);
    document.removeEventListener('click', closeFilterMenu);
  };
  
  const handleItemSelect = e => {
    if (onItemSelect) {
      onItemSelect(e);
    }
  };

  return (
    <div className='dropdown-menu' style={{...props.style, position: 'relative'}}>
      <button onClick={toggleDropdown} style={{color: disabled ? 'grey' : '', backgroundColor: disabled ? 'white' : '' }}>
        <span>{props.items[selectedIndex]}</span> 
        <Icon style={{marginRight: '0px', marginLeft: 'auto'}} size='small' name='triangle down'/></button>
        <ul className='species-list' style={{ display: showDropdown ? 'block' : 'none', position: 'absolute', width: 150,  }}>
          {props.items.map((item, index) => (
            <li key={item}>
              <button className='species-button' name={item} onClick={(e) => {setSelectedIndex(index); handleItemSelect(e)}} >
                {item}
              </button>                    
            </li>
          ))}      
        </ul>
    </div>  
  );
};

export default Dropdown;