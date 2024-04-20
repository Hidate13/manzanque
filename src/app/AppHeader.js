import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "./AppHeader.css";

class AppHeader extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
}
  render() {
    function MoreHeader(props) {
      return (
        <>
          <li>
            <NavLink to="/contactus">CONTACT US</NavLink>
          </li>
          <li>
            <NavLink to="/aboutus">ABOUT US</NavLink>
          </li>
        </>
      );
    }
    return (
      <header className="app-header">
        <div className="container">
          <div className="app-branding">
            <Link to="/" className="app-title">
              MAZANAQUE <span>LTD.</span>
            </Link>
          </div>
          <div className="app-options">
            <nav className="app-nav">
              {this.props.authenticated ? (
                <ul>
                  <li>
                    <NavLink to="/profile">PROFILE</NavLink>
                  </li>
                  {
                  this.props.currentUser.role === "Specialist" && (
                  <li>
                    <NavLink to="/log">LOG</NavLink>
                  </li>
                  )}
                  {
                  this.props.currentUser.role === "Operator" && (
                    <>
                    <li>
                      <NavLink to="/ticket">TICKET</NavLink>
                    </li>
                    <li>
                      <NavLink to="/callrecord">RECORD</NavLink>
                    </li>
                    </>
                  )}
                  <MoreHeader />
                  <li>
                    <a onClick={this.props.onLogout}>LOGOUT</a>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <NavLink to="/login">LOGIN</NavLink>
                  </li>
                  <li>
                    <NavLink to="/signup">SIGN UP</NavLink>
                  </li>
                  <MoreHeader />
                </ul>
              )}
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

export default AppHeader;
