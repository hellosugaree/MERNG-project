
import React from 'react';
import { Icon } from 'semantic-ui-react';
import '../App.css';


const Pagination = (props) => {

  const { activePage, itemsPerPage, itemCount, setActivePage } = props;
  
    // handler for pagination change, both button and numeric input to manually enter a page to display
    const handlePageChange = e => {
      // forward or back buttons clicked
      if (e.type === 'click') {
        // use currentTarget because a click in the nested icon within button will show up as target when clicked
        if (e.currentTarget.name === 'first') {
          return setActivePage(1);
        }
        if (e.currentTarget.name === 'minusFive') {
          return setActivePage(prevPage => Number.parseInt(prevPage) - 5);
        }
        if (e.currentTarget.name === 'previous') {
          return setActivePage(prevPage => Number.parseInt(prevPage) - 1);
        }
        if (e.currentTarget.name === 'next') {
          return setActivePage(prevPage => Number.parseInt(prevPage) + 1);
        }
        if (e.currentTarget.name === 'plusFive') {
          return setActivePage(prevPage => Number.parseInt(prevPage) + 5);
        }
        if (e.currentTarget.name === 'last') {
          return setActivePage(Math.ceil(itemCount / itemsPerPage));
        }
      }
      // numeric page input changed directly
      if (e.type === 'change') {
        const totalPages = Math.ceil(itemCount / itemsPerPage);
        // if user tries to input number larger than page count, set to last page
        if (e.target.value > totalPages) {
          setActivePage(totalPages);
        } else if (e.target.value < 1) {
          setActivePage(1);
        } else {
          setActivePage(e.target.value);
        }
      }
    };

  return (
  /* CONTAINER FOR PAGINATION and PAGE COUNT*/
  <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10}}>
    {/* PAGINATION BUTTONS CONTAINER*/}
    <div style={{border: '1px solid lightgrey', borderRadius: 5, display: 'flex', width: '100%', flexGrow: 1,  maxWidth: 500}}>
      <button 
        className='pagination-button'
        type='button' 
        name='first'
        onClick={handlePageChange}
        disabled={activePage === 1} 
      >
        <Icon name='fast backward' />
      </button>
      <button 
        onClick={handlePageChange}
        className='pagination-button'
        type='button' name='minusFive'
        disabled={activePage < 5}
      >
        <Icon name='backward' />
      </button>
      <button 
        onClick={handlePageChange}
        className='pagination-button'
        type='button' name='previous'
        disabled={activePage === 1}
      >
        <Icon name='step backward' />
      </button>    
        <input type='number' className='pagination-input' value={activePage} onChange={handlePageChange} onClick={e => e.target.select()} />
      <button 
        onClick={handlePageChange}
        className='pagination-button'
        type='button' name='next'
        disabled={activePage === Math.ceil(itemCount / itemsPerPage)} 
      >
        <Icon name='step forward' />
      </button>
      <button 
        onClick={handlePageChange}
        className='pagination-button'
        type='button' name='plusFive'
        disabled={Math.ceil(itemCount / itemsPerPage) - activePage < 5} 
      >
        <Icon name='forward' />
      </button>
      <button 
        onClick={handlePageChange}
        className='pagination-button'
        type='button' name='last'
        disabled={activePage === Math.ceil(itemCount / itemsPerPage)} 
      >
        <Icon name='fast forward' />
      </button>
    </div>
    <span style={{color: 'grey'}}>
      Total pages: {Math.ceil(itemCount / itemsPerPage)}
    </span>

  </div>
  );
}


export default Pagination;