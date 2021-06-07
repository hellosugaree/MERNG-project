import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth';

// first function will redirect authenticated users to desired page when attempting to access specific routes
// takes a component as an argument, which is given an alias of Component so it can be rendered as a component
// ... rest for any any props to include in Route
export function RedirectAuthenticatedUsers({ component: Component, redirectTo: address , ...rest }) {
  // destructure user from context.user
  const { user } = useContext(AuthContext);
  // route will render a Redirect tag is user is logged in
  // or the component (first arg) if user not authenticated
  // used to prevent logged in users from accessing login and register pages
  return (
    <Route 
      { ...rest }
      render={routeProps => 
        user ? <Redirect to={address} /> : <Component {...routeProps} />
      }
    />
  );
};



// redirect unauthenticated users to address given or render specified component if authenticated
export function ProtectedRoute ({ component: Component, redirectTo: address, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route 
      { ...rest }
      render={routeProps =>
        user ? <Component { ...routeProps } /> : <Redirect to={address} />
      }
    />
  );

}
