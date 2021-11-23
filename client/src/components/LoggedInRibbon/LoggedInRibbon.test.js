import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { GET_USER_BASIC_DATA } from '../../gql/gql';
import LoggedInRibbon from './';

const mockUser = {
  id: 'mockUserId',
  username: 'mockUsername'
};

const mockProfilePhotoUrl = '/img/icons/small/Rockfish-Small.png';

const mockSuccessfulQuery = {
  request: {
    query: GET_USER_BASIC_DATA,
    variables: {
      userId: mockUser.id,
    },
  },
  result: {
    data: {
      getUser: { 
        username: mockUser.username, 
        profilePhoto: {
          secure_url: mockProfilePhotoUrl,
        },
        createdAt: new Date().toISOString(),
        catches: [],
        catchCount: 0,
      },
    },
  },
};

const mockFailedQuery = {
  request: {
    query: GET_USER_BASIC_DATA,
    variables: {
      userId: mockUser.id,
    },
  },
  result: {
    error: new Error('Mock Error')
  },
};

jest.mock('../UserMenu', () => () => {
  return <div>Mock Menu</div>
});

const fireQuery = async () => {
  await act(() =>  new Promise(resolve => setTimeout(resolve, 0)));
};

describe('LoggedInRibbon', () => {
  const renderComponent = (query) => {
    render (
      <MemoryRouter >
        <MockedProvider 
          addTypename={false}
          mocks={[query]}
        >
          <LoggedInRibbon user={mockUser} />
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('renders username while query loading and after query resolves successfully', async () => {
    renderComponent(mockSuccessfulQuery);

    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    
    await fireQuery();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });

  it('renders a profile photo with the correct URL after query resolves successfully', async () => {
    renderComponent(mockSuccessfulQuery);

    await fireQuery();
    const profilePhoto = screen.getByRole('img', { name: 'profile' });
    expect(profilePhoto).toBeInTheDocument();
    expect(profilePhoto).toHaveAttribute('src', mockProfilePhotoUrl);
  });
  
  it('renders username if query fails', async () => {
    renderComponent(mockFailedQuery);

    await fireQuery();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });

  it('does not render a profile photo while query is loading or if query fails', async () => {
    renderComponent(mockFailedQuery);

    expect(screen.queryByRole('img', { name: 'profile' })).not.toBeInTheDocument();
    
    await fireQuery();
    expect(screen.queryByRole('img', { name: 'profile' })).not.toBeInTheDocument();
  });

  it('renders user menu after username is clicked and user menu disappears when document clicked while menu is open', () => {
    renderComponent(mockSuccessfulQuery);

    expect(screen.queryByText(/mock menu/i)).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText(mockUser.username));
    expect(screen.getByText(/mock menu/i)).toBeInTheDocument();

    fireEvent.click(document.body);
    expect(screen.queryByText(/mock menu/i)).not.toBeInTheDocument();
  });
});