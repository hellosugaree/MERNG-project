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
import HomeSplashPage from './pages/HomeSplashPage';
import MapContainer from './components/MapContainer';
import BeachAccessLocations from './components/BeachAccessLocations';
import { RedirectAuthenticatedUsers, ProtectedRoute } from './utilities/AuthRoutes';
//other imports
import { AuthProvider } from './context/auth';
import React from 'react';

/* wrap entire App in auth provider to give access to context across components for managing auth, etc */
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <div style={{margin: '0px auto 0px auto', maxWidth: 1200, border: '10px solid purple', boxSizing: 'border-box'}}> */}
          <div style={{height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'}}>
            {/* <div style={{display: 'flex', border: '3px dashed blue', boxSizing: 'border-box'}}> */}
            <div style={{height: 50, backgroundColor: 'white', boxSizing: 'border-box' }}>
            <MenuBar />
            </div>
            {/* <div style={{height: 100, border: '3px solid black', boxSizing: 'border-box'}}/> */}
            {/* <div className='menu-spacer' style={{height: 50, position: 'fixed'}}/> */}
            <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden'}}>
              <ProtectedRoute redirectTo='/splash' exact path='/' component={Home}/>
              <Route exact path='/splash' component={HomeSplashPage} />
              <Route exact path='/logcatch' component={CreateCatch} />
              <Route exact path='/googlemap' component={MapContainer} />    
              <Route exact path='/test' component={BeachAccessLocations} /> 
              <RedirectAuthenticatedUsers redirectTo='/' exact path='/register' component={Register} />
              <RedirectAuthenticatedUsers redirectTo='/' exact path='/login' component={Login} />
              <ProtectedRoute redirectTo='/login' exact path='/preferences' component={Preferences} />
              <ProtectedRoute redirectTo='/login' exact path='/post' component={CreatePost} />
            </div>
            {/* </div> */}
          </div>
          
          {/* </div> */}
      </Router>
    </AuthProvider>
  );
}

export default App;
// </AuthProvider><Route exact path='/register' component={Register} />