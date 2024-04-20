import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import AppHeader from '../app/AppHeader';
import Home from '../home/Home';
import AboutUsComponent from "../user/aboutus/aboutus";
import ContactUsComponent from '../user/contactus/contactus';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup'
import Ticket from '../components/Ticket/Ticket'
import Profile from '../user/profile/Profile';
import NotFound from '../app/NotFound';
import LoadingIndicator from '../app/LoadingIndicator';
import { getCurrentUser } from '../service/OnlineService';
import PrivateRoute from '../app/PrivateRoute';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import '../app/App.css';
import AppFooter from './AppFooter';
import CallLog from '../components/CallLog/CallLog';
import EditLog from '../components/EditLog/EditLog';

import { Redirect } from "react-router-dom";
import CallRecord from '../components/CallRecord/CallRecord';

export const ACCESS_TOKEN = 'accessToken';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      currentUser: "",
      loading: false
    }

    this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async loadCurrentlyLoggedInUser() {
  this.setState({
    loading: true,
  });

  try {
    const response = await getCurrentUser();
    this.setState({
      currentUser: response,
      authenticated: true,
      loading: false,
    });
  } catch (error) {
    this.setState({
      loading: false,
    });
    console.error('Error loading user:', error);
  }
}

  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      authenticated: false,
      currentUser: null
    });
    <Redirect
          to={{
            pathname: "/",
            state: { from: this.props.location },
          }}
        />
    Alert.success("You're safely logged out!");
  }

  async componentDidMount() {
    try {
      // Check if the component is already mounted before updating state
      if (!this._isMounted) {
        this._isMounted = true;
        await this.loadCurrentlyLoggedInUser();
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  componentWillUnmount() {
    // Set _isMounted to false when the component is unmounted
    this._isMounted = false;
  }

  render() {
    if(this.state.loading) {
      return <LoadingIndicator />
    }

    return (
      <div className="app">
        <div className="app-top-box">
          <AppHeader authenticated={this.state.authenticated} onLogout={this.handleLogout}  currentUser={this.state.currentUser}/>
        </div>
        <div className="app-body">
          <Switch>
            <Route exact path="/" component={Home}></Route>           
            <PrivateRoute path="/profile" authenticated={this.state.authenticated} currentUser={this.state.currentUser} component={Profile}></PrivateRoute>
            <Route path="/login"  render={(props) => <Login authenticated={this.state.authenticated} {...props} />}></Route>
            <Route path="/signup" render={(props) => <Signup authenticated={this.state.authenticated} {...props} />}></Route>
            <Route path="/ticket" render={(props) => <Ticket authenticated={this.state.authenticated} {...props} currentUser={this.state.currentUser}/>}></Route>
            <Route path="/editlog" render={(props) => <EditLog authenticated={this.state.authenticated} {...props} currentUser={this.state.currentUser}/>}></Route>
            <Route path="/log" render={(props) => <CallLog authenticated={this.state.authenticated} {...props} currentUser={this.state.currentUser}/>}></Route>
            <Route path="/callrecord" render={(props) => <CallRecord authenticated={this.state.authenticated} {...props} currentUser={this.state.currentUser}/>}></Route>
            <Route path="/contactus" component={ContactUsComponent}></Route>
            <Route path="/aboutus" component={AboutUsComponent}></Route> 
            <Route component={NotFound}></Route>
          </Switch>
        </div>
        <div className="app-bot-box">
          <AppFooter/>
        </div>
        <Alert stack={{limit: 3}} 
          timeout = {3000}
          position='top-right' effect='slide' offset={65} />
      </div>
    );
  }
}

export default App;
