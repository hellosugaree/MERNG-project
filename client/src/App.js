import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css'; // after semantic import so we can override default semantic-ui styles
// components
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Preferences from './pages/Preferences';
import MenuBar from './components/MenuBar';
import CreatePost from './components/CreatePost';
import CreateCatch from './components/CreateCatch';
import { RedirectAuthenticatedUsers, ProtectedRoute } from './utilities/AuthRoutes';
//other imports
import { Container } from 'semantic-ui-react';
import { AuthProvider } from './context/auth';
import React, { useContext } from 'react';
import { AuthContext } from './context/auth';

/* wrap entire App in auth provider to give access to context across components for managing auth, etc */
function App() {
  const context = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <div style={{margin: '0px auto 0px auto', maxWidth: 1200}}>
          <div style={{height: '100vh', overflow: 'hidden'}}>
          <MenuBar />
          <Route exact path='/' component={Home} />
          <Route exact path='/logcatch' component={CreateCatch} />
          <RedirectAuthenticatedUsers redirectTo='/' exact path='/register' component={Register} />
          <RedirectAuthenticatedUsers redirectTo='/' exact path='/login' component={Login} />
          <ProtectedRoute redirectTo='/login' exact path='/preferences' component={Preferences} />
          <ProtectedRoute redirectTo='/login' exact path='/post' component={CreatePost} />
          </div>
          
          </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
// </AuthProvider><Route exact path='/register' component={Register} />