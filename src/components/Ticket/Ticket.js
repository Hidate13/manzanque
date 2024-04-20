import React, { Component } from "react";
import "./Ticket.css";
import { Redirect } from "react-router-dom";
import { ticket } from "../../service/OnlineService";
import Alert from "react-s-alert";
import Services from "../../service/Services";
// import axios from 'axios';

export const API_BASE_URL = "http://localhost:8080";

class Ticket extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
}
  render() {
    if (
      this.props.authenticated &&
      this.props.location.pathname !== "/ticket"
    ) {
      return (
        <Redirect
          to={{
            pathname: "/ticket",
            state: { from: this.props.location },
          }}
        />
      );
    }

    return (
      <div className="ticket-container">
        <div className="ticket-content">
          <h1 className="ticket-title">HELPDESK TICKET </h1>

          <div className="or-separator">
            {/* <span className="or-text">OR</span> */}
          </div>
          <TicketForm {...this.props} />
        </div>
      </div>
    );
  }
}

//Local Ticket Form
class TicketForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      selectedDepartment: "",
      selectedTitle:"",
      validationMessage: "",
      operator: {
        user_id: {
          usersId: this.props.currentUser.usersId,
          userName: this.props.currentUser.userName,
          role: this.props.currentUser.role,
        },
      },     
      caller: {
        callerName: "",
        jobTitle:"",
        department:"",
      },
      equipment: {
        equipmentType: "",
        equipmentMake: "",
      },
      software: {
        softwareName: "",
        serialNumber: "",
      },
      problem: {
        problemid:"",
        problemType: "",
        problemDescription: "",
      },
      resolution: {
        resolutionDescription: "",
      },
      specialist: {
        specialist_ID:"",
        expertise:"",
        user_id:{
          usersId: "",
          userName: "",
          role: "",
        }
      },
      softwares: [],
      equipments: [],
      problems: [],
      callers: [],
      specialists : [] ,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {

    Services.getAllSoftwares().then((res) =>
      this.setState({ softwares: res.data })
    );

    Services.getAllEquipments().then((res) =>
      this.setState({ equipments: res.data })
    );

    Services.getAllSpecialists().then((res) =>
      this.setState({ specialists: res.data })
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    // console.log("Caller Name:", this.state.caller.callerName);
    // console.log("test:", inputValue);
    // Check if the input field is for 'callerName'
    if (inputName === "callerName" && inputValue.length > 16) {
      // Truncate the input value to maximum 16 characters
      alert("callerName cannot exceed 16 characters.");
      return;
    }

    // Check if the input field is for 'SerialNumber'
    if (inputName === "serialNumber" && inputValue.length < 14) {
      this.setState({
        isValid: false,
        validationMessage: "SerialNumber length should be 14 characters.",
      });
    } else if (inputName === "serialNumber" && inputValue.length > 14) {
      this.setState({
        isValid: false,
        validationMessage: "SerialNumber length more than 14 characters.",
      });
    } else {
      this.setState({
        isValid: true,
        validationMessage: "",
      });
    }

    const stateObject =
      inputName === "callerName"
        ? "caller"
        : inputName === "softwareName"
        ? "software"
        : inputName === "serialNumber"
        ? "software"
        : null;

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
      this.setState((prevState) => ({
        ...prevState,
        [inputName]: inputValue,
      }));
    }
  }

  callerHandler = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    console.log("inputValue:", inputValue);
    console.log("inputName:", inputName);
    // Update the state based on the input field
    const stateObject =
      inputName === "department"
        ? "caller"
        : inputName === "jobTitle"
        ? "caller"
        : null;

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
  };

  specialistHandler = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
  
    // Update the state based on the input field
    if (inputName === "specialist.user_id.userName") {
      const selectedSpecialist = this.state.specialists.find(
        (specialist) => specialist.user_id.userName === inputValue
      );
  
      if (selectedSpecialist) {
        const { usersId, userName, role } = selectedSpecialist.user_id;
  
        this.setState((prevState) => ({
          ...prevState,
          specialist: {
            ...prevState.specialist,
            user_id: {
              usersId,
              userName,
              role,
            },
            expertise: selectedSpecialist.expertise,
          },
        }));
      }
    } else {
      // Handle other fields if needed
      this.setState({
        [inputName]: inputValue,
      });
    }
  };
  
  problemTypeHandler = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    const stateObject = "problem";
    // console.log("name selectedProblemType:", inputName);
    // console.log("value selectedProblemType:", inputValue);
    // console.log("state   selectedProblemType:", this.state.problem.problemType);

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
  };

  handleDescriptionChange = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    const stateObject = "problem";

    // console.log("problem desc:", this.state.problem.problemDescription);
    // console.log("test:", inputValue);
    // console.log("test:", inputName);
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
  };

  equipmentMakeHandler = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    const stateObject =
          inputName === "equipmentMake"
        ? "equipment"
        : inputName === "equipmentType"
        ? "equipment"
        : null;

    // console.log("equipment desc:", this.state.equipment.equipmentMake);
    // console.log("test:", inputValue);
    // console.log("test:", inputName);

    if (stateObject) {
      this.setState((prevState) => ({
        ...prevState,
        [stateObject]: {
          ...prevState[stateObject],
          [inputName]: inputValue,
        },
      }));
    } else {
      this.setState({
        [inputName]: inputValue,
      });
    }
  };

  handleSubmit(event) {
    event.preventDefault();


    const ticketRequest = Object.assign({}, this.state);

    ticket(ticketRequest)
      .then((response) => {
        Alert.success("Your Ticket is successfully created!");
        this.props.history.push("/ticket");
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  }

  render() {
    const {
      isValid,
      validationMessage,
      isValidChar,
      validationMessageChar,
      departments = ["HR", "Finance", "IT", "Marketing"],
      titles = ["Manager", "Staff"],
      problemTypes = [
        "Hardware Issue",
        "Software Bug",
        "Network Problem",
        "Other",
      ],
      
    } = this.state;
    const mergeEquipmentMakes = [...new Set(this.state.equipments.map(equipment => equipment.equipmentMake))];
    const mergeSoftwareName = [...new Set(this.state.softwares.map(software => software.softwareName))];
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-item-wrapper">
          <div className="form-item-wrapper-left">
            <div className="form-item">
              <label>Name:</label>
              <input
                type="text"
                name="callerName"
                className="form-control"
                placeholder="Name"
                minLength={8}
                value={this.state.caller.callerName}
                onChange={this.handleInputChange}
                required={true}
              />
            </div>
            <div className="form-item">
              <label>Department:</label>
              <select
                name="department"
                value={this.state.caller.department || ""}
                onChange={this.callerHandler}
              >
                <option value="" disabled>
                  Select a department
                </option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label>Job Title:</label>
              <select
                name="jobTitle"
                value={this.state.caller.jobTitle || ""}
                onChange={this.callerHandler}
              >
                <option value="" disabled>
                  Select a job title
                </option>
                {titles.map((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label>Software Name:</label>
              <select
                name="softwareName"
                value={this.state.software.softwareName}
                onChange={this.handleInputChange}
              >
                <option value="" disabled>
                  Select a software
                </option>
                {mergeSoftwareName.map((softwareName, index) => (
                  <option key={index} value={softwareName}>
                    {softwareName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label>Serial Number:</label>
              <select
                name="serialNumber"
                value={this.state.software.serialNumber}
                onChange={this.handleInputChange}
              >
                <option value="" disabled>
                  Select a Serial Number
                </option>
                {this.state.softwares.map((software, index) => (
                  <option key={index} value={software.serialNumber}>
                    {software.serialNumber}
                  </option>
                ))}
              </select>
            </div>
            <span id="message" style={{ color: "red" }}>
              {!isValid && <p style={{ color: "red" }}>{validationMessage}</p>}
              {!isValidChar && (
                <p style={{ color: "red" }}>{validationMessageChar}</p>
              )}
            </span>
            
          </div>
          <div className="vertical-sparator"></div>

          <div className="form-item-wrapper-right">
            <div className="form-item">
              <label>Equipment Type:</label>
              <select
                name="equipmentType"
                value={this.state.equipment.equipmentType}
                onChange={this.equipmentMakeHandler}
              >
                <option value="" disabled>
                  Select an equipment type
                </option>
                {this.state.equipments.map((equipment, index) => (
                  <option key={index} value={equipment.equipmentType}>
                    {equipment.equipmentType}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label>Equipment Make:</label>
              <select
                name="equipmentMake"
                value={this.state.equipment.equipmentMake}
                onChange={this.equipmentMakeHandler}
              >
                <option value="" disabled>
                  Select an equipment make
                </option>
                {mergeEquipmentMakes.map((equipmentMake, index) => (
                  <option key={index} value={equipmentMake}>
                    {equipmentMake}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label>Problem Type:</label>
              <select
                name="problemType"
                value={this.state.problem.problemType}
                onChange={this.problemTypeHandler}
              >
                <option value="" disabled>
                  Select a problem type
                </option>
                {problemTypes.map((problemType, index) => (
                  <option key={index} value={problemType}>
                    {problemType}
                  </option>
                ))}
              </select>
            </div>
            {/* {
              this.state.specialist.specialist_ID === this.state.users.usersId
              ? specialistName = this.state.users.userName : specialistName = "Not Found"

            } */}
            <div className="form-item">
              <label>Assignment the Specialist :</label>
              <select
                name="specialist.user_id.userName"
                value={this.state.specialist.user_id.userName}
                onChange={this.specialistHandler}
              >
                <option value="" disabled>
                  Select a Specialist
                </option>
                {this.state.specialists.map((specialist, index) => (
                  <option key={index} value={specialist.user_id.userName}>
                    {specialist.user_id.usersId} {" || "}
                    {specialist.user_id.userName} {" 👉 "}
                    {specialist.expertise}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-item">
              <label>Problem Description:</label>
              <textarea
                name="problemDescription"
                value={this.state.problem.problemDescription}
                onChange={this.handleDescriptionChange}
                rows={4}
                cols={50}
                placeholder="Enter problem description..."
              />
            </div>
          </div>
        </div>
        <div className="form-item">
          <button type="submit" className="btn btn-block btn-primary">
            Submit
          </button>
        </div>
      </form>
    );
  }
}

export default Ticket;
