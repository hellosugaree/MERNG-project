
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css'; // after semantic import so we can override default semantic-ui styles
// components
import ModalPortal from './components/ModalPortal';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Preferences from './pages/Preferences';
// import MenuBar from './components/MenuBar';
import TopBar from './components/TopBar';
import CreatePost from './components/CreatePost';
import HomeSplashPage from './pages/HomeSplashPage';
import CreateCatchForm from './components/CreateCatchForm';
import UserCatchesMap from './pages/UserCatchesMap';
import BeachAccessLocations from './components/BeachAccessLocations';
import { RedirectAuthenticatedUsers, ProtectedRoute } from './utilities/AuthRoutes';


/* wrap entire App in auth provider to give access to context across components for managing auth, etc */

/*

*/
function App() {

  return (
      <Router>
        {/* <div style={{margin: '0px auto 0px auto', maxWidth: 1200, border: '10px solid purple', boxSizing: 'border-box'}}> */}
          <ModalPortal />
          <div style={{height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'}}>
            {/* <div style={{display: 'flex', border: '3px dashed blue', boxSizing: 'border-box'}}> */}
            {/* <div style={{height: 50, backgroundColor: 'white', boxSizing: 'border-box' }}>
            <MenuBar />
            </div> */}
            <TopBar />
            {/* <div style={{height: 100, border: '3px solid black', boxSizing: 'border-box'}}/> */}
            {/* <div className='menu-spacer' style={{height: 50, position: 'fixed'}}/> */}
            <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden'}}>
              <Switch>
              <Route exact path='/splash' component={HomeSplashPage} />
              <Route exact path='/googlemap' component={CreateCatchForm} />    
              <Route exact path='/test' component={BeachAccessLocations} /> 
              <ProtectedRoute exact path='/mapcatches' component={UserCatchesMap} /> 
              <RedirectAuthenticatedUsers redirectTo='/' exact path='/register' component={Register} />
              <RedirectAuthenticatedUsers redirectTo='/' exact path='/login' component={Login} />
              <ProtectedRoute redirectTo='/login' exact path='/preferences' component={Preferences} />
              <ProtectedRoute redirectTo='/login' exact path='/post' component={CreatePost} />
              <ProtectedRoute redirectTo='/splash' path='/' component={Home}/>
              </Switch>
            </div>
            {/* </div> */}
          </div>
          
          {/* </div> */}
      </Router>
  );
}

export default App;
// </AuthProvider><Route exact path='/register' component={Register} />