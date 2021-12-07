
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import ModalPortal from './components/ModalPortal';
import Home from './pages/Home';
import TopBar from './components/TopBar';
import HomeSplashPage from './pages/HomeSplashPage';
import { RedirectAuthenticatedUsers, ProtectedRoute } from './utilities/AuthRoutes';
import './App.css';


function App() {

  return (
    <Router>
      <ModalPortal />
      <div style={{height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'}}>
        <TopBar />
        <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden'}}>
          <Switch>
          <RedirectAuthenticatedUsers redirectTo='/' exact path='/splash' component={HomeSplashPage}/>
          <ProtectedRoute redirectTo='/splash' path='/' component={Home}/>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;