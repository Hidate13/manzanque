import React, { Component } from "react";
import "./Login.css";
import { checkingRole, login } from "../../service/OnlineService";
import { Link, Redirect } from "react-router-dom";
import Alert from "react-s-alert";

export const API_BASE_URL = "http://localhost:8080";
export const ACCESS_TOKEN = "accessToken";

class Login extends Component {
  componentDidMount() {
    // If the OAuth2 login encounters an error, the user is redirected to the /login page with an error.
    // Here we display the error and then remove the error query parameter from the location.
    if (this.props.location.state && this.props.location.state.error) {
      setTimeout(() => {
        Alert.error(this.props.location.state.error, {
          timeout: 5000,
        });
        this.props.history.replace({
          pathname: this.props.location.pathname,
          state: {},
        });
      }, 100);
    }
  }

  render() {
    if (this.props.authenticated && this.props.location.pathname !== "/profile") {
      return (
        <Redirect
          to={{
            pathname: "/profile",
            state: { from: this.props.location },
          }}
        />
      );
    }

    return (
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title">MANZANAQUE</h1>
          <div className="or-separator"></div>
          <LoginForm {...this.props} />
          <span className="signup-link">
            New user? <Link to="/signup">Sign up!</Link>
          </span>
        </div>
      </div>
    );
  }
}

//Social Login Form

//Local LoginForm
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      disabled: false,
      loginAttempts: 3,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  roleHandler = (event) => {
    const role = event.target.value;
    // console.log("test selectedRole:", selectedRole);
    this.setState({ role });
    // Reset expertise field when role changes
  };
  
  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: inputValue,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const loginRequest = Object.assign({}, this.state);

    // Check if the email is different from the previous attempt
    if (loginRequest.email !== this.state.previousEmail) {
      this.setState({ loginAttempts: 3, previousEmail: loginRequest.email });
    }

    checkingRole(loginRequest)
      .then((response) => {
        if (!response.valid) {
          throw new Error("Invalid Role");
        }
        return login(loginRequest);
      })
      .then((response) => {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        Alert.success("You're successfully logged in!");
        console.log("Access Token is " + response.accessToken);

        if (response.accessToken) {
          console.log(
            "In Login Form, Login JS URI Is " + "http://localhost:3000/profile"
          );
          window.location.replace("http://localhost:3000/profile");
        }
      })
      .catch((error) => {
        console.log("Error " + error.message);
        const attemptsLeft = this.state.loginAttempts - 1;
        if (attemptsLeft === 0) {
          this.setState({ disabled: true });

          // Set a timeout to unlock 3 minutes.
          const lockoutDuration = 3 * 60 * 1000; // 3 minutes in milliseconds
          setTimeout(() => {
            // Reset the login attempts and enable login
            this.setState({ loginAttempts: 3, disabled: false });
            Alert.success("Account Unlocked. You can try logging in again.");
          }, lockoutDuration);

          Alert.error(
            "No Login Attempts Available. Account locked for 3 minutes."
          );
        } else {
          this.setState({ loginAttempts: attemptsLeft });
          Alert.error(
            "Login Failed Now Only " +
              attemptsLeft +
              " Login Attempts Available"
          );
        }
      });
  }

  render() {
    const {  roles = ["Operator", "Specialist"], } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-item">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            disabled={this.state.disabled}
            required
          />
        </div>
        <div className="form-item">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            disabled={this.state.disabled}
            required
          />
        </div>
        <div className="form-item">
        <label>Role:</label>
              <select
                name="role"
                value={this.state.role || ""}
                onChange={this.roleHandler}
              >
                <option value="" disabled>
                  Select user role
                </option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
        </div>
        <div className="form-item">
          <button
            type="submit"
            className="btn btn-block btn-primary"
            disabled={this.state.disabled}
          >
            Login
          </button>
        </div>
      </form>
    );
  }
}

export default Login;
