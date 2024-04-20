import React, { Component } from "react";
import "./Signup.css";
import { Link, Redirect } from "react-router-dom";
import { signup } from "../../service/OnlineService";
import Alert from "react-s-alert";

export const API_BASE_URL = "http://localhost:8080";

class Signup extends Component {
  render() {
    if (this.props.authenticated && this.props.location.pathname !== "/") {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: { from: this.props.location },
          }}
        />
      );
    }

    return (
      <div className="signup-container">
        <div className="signup-content">
          <h1 className="signup-title">MANZANAQUE</h1>
          <div className="or-separator"></div>
          <SignupForm {...this.props} />
          <span className="login-link">
            Already have an account? <Link to="/login">Login!</Link>
          </span>
        </div>
      </div>
    );
  }
}

//Local SignUp Form
class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      password: "",
      role: "",
      specialist: {
        expertise: "",
      },
      isValid: true,
      validationMessage: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    const pwdReg = RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);

    // Check if the input field is for 'username'
    if (inputName === "userName" && inputValue.length > 20) {
      // Truncate the input value to maximum 20 characters
      alert("Username cannot exceed 20 characters.");
    }
    // Check if the input field is for 'Passowrd'
    if (inputName === "password" && inputValue.length < 8) {
      this.setState({
        isValid: false,
        validationMessage:
          "Password length should be between 8 and 20 characters.",
      });
    } else if (inputName === "password" && inputValue.length > 20) {
      this.setState({
        isValid: false,
        validationMessage: "Password length more than 20 characters.",
      });
    } else {
      this.setState({
        isValid: true,
        validationMessage: "",
      });
    }

    if (inputName === "password" && !pwdReg.test(inputValue)) {
      this.setState({
        isValidChar: false,
        validationMessageChar:
          "Password no special character, at least input a special character .",
      });
    } else {
      this.setState({
        isValidChar: true,
        validationMessageChar: "",
      });
    }

    this.setState({
      [inputName]: inputValue,
    });
  }

  roleHandler = (event) => {
    const role = event.target.value;
    // console.log("test selectedRole:", selectedRole);
    this.setState({ role });
  };

  expertiseHandler = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    const stateObject = "specialist";
    // console.log("name Specialist:", inputName);
    // console.log("value Specialist:", inputValue);
    // console.log("state   Specialist:", this.state.specialist.expertise);

    // Update the state based on the input field
    if (stateObject) {
      this.setState((prevState) => ({
        ...prevState,
        [stateObject]: {
          ...prevState[stateObject],
          [inputName]: inputValue,
        },
      }));
    } else {
      // Handle other fields if needed
      this.setState({
        [inputName]: inputValue,
      });
    }

    // Reset the expertise field to an empty string when the role changes
    if (inputName === "role" && inputValue !== "Specialist") {
      this.setState({
        expertise: "",
      });
    }
  };

  handleSubmit(event) {
    event.preventDefault();

    const signUpRequest = Object.assign({}, this.state);
    console.log("test output ===>   "+ signUpRequest);

    signup(signUpRequest)
      .then((response) => {
        Alert.success(
          "You're successfully registered. Please login to continue!"
        );
        this.props.history.push("/login");
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  }

  handleExpertiseChange = (event) => {
    this.setState({ expertise: event.target.value });
  };

  render() {
    const {
      isValid,
      validationMessage,
      isValidChar,
      validationMessageChar,
      role,
      roles = ["Operator", "Specialist"],
      specialists = [
        "Hardware Issue",
        "Software Issue",
        "Network Issue",
      ],
    } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-item">
          <input
            type="text"
            name="userName"
            className="form-control"
            placeholder="Name"
            minLength={8}
            value={this.state.userName}
            onChange={this.handleInputChange}
            required={true}
          />
        </div>
        <div className="form-item">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required={true}
          />
        </div>
        <div className="form-item">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            minLength={8}
            value={this.state.password}
            onChange={this.handleInputChange}
            required={true}
          />
        </div>
        <span id="message" style={{ color: "red" }}>
          {!isValid && <p style={{ color: "red" }}>{validationMessage}</p>}
          {!isValidChar && (
            <p style={{ color: "red" }}>{validationMessageChar}</p>
          )}
        </span>
        {/* Render expertise field only if the selected role is 'Specialist' */}
        {role === "Specialist" && (
          <div className="form-item">
              <label htmlFor="expertise">Select Expertise:</label>
              <select
                id="expertise"
                name="expertise"
                value={this.state.specialist.expertise}
                onChange={this.expertiseHandler}
              >
                {specialists.map((expertise) => (
                  <option key={expertise} value={expertise}>
                    {expertise}
                  </option>
                ))}
              </select>

              <p>Selected Expertise: {this.state.selectedExpertise}</p>
          </div>
        )}
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
          <button type="submit" className="btn btn-block btn-primary">
            Sign Up
          </button>
        </div>
      </form>
    );
  }
}

export default Signup;
