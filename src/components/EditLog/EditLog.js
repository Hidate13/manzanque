import React, { Component } from "react";
import "../EditLog/EditLog.css";
import { Redirect, withRouter } from "react-router-dom";
import Alert from "react-s-alert";
import { editTicket } from "../../service/OnlineService";
import Services from "../../service/Services";

export const API_BASE_URL = "http://localhost:8080";

class EditLog extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    if (
      this.props.authenticated &&
      this.props.location.pathname !== "/editlog"
    ) {
      return (
        <Redirect
          to={{
            pathname: "/editlog",
            state: { from: this.props.location },
          }}
        />
      );
    }

    return (
      <div className="ticket-container">
        <div className="ticket-content">
          <h1 className="ticket-title">EDIT TICKET </h1>

          <div className="or-separator"></div>
          <TicketForm {...this.props} />
        </div>
      </div>
    );
  }
}

class TicketForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      selectedDepartment: "",
      selectedTitle: "",
      validationMessage: "",
      // operator: {
      //   user_id: {
      //     usersId: this.props.currentUser.usersId,
      //     userName: this.props.currentUser.userName,
      //     role: this.props.currentUser.role,
      //   },
      // },
      query: {},
      softwares: [],
      equipments: [],
      problems: [],
      callers: [],
      specialists: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { location } = this.props;
    const callID = location.state && location.state.callID;

    console.log("Call ID:", callID);

    Services.getQueryByid(callID).then((res) =>
      this.setState({ query: res.data })
    );

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

    // if (inputName === "callerName" && inputValue.length > 16) {
    //   // Truncate the input value to maximum 16 characters
    //   alert("callerName cannot exceed 16 characters.");
    //   return;
    // }

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

    console.log(inputName + " <==== input name");
    console.log(inputValue + " <==== input value");
    this.setState((prevState) => {
      if (inputName === "softwareName" || inputName === "serialNumber") {
        return {
          ...prevState,
          query: {
            ...prevState.query,
            software: {
              ...prevState.query.software,
              [inputName]: inputValue,
            },
          },
        };
      } else {
        return {
          ...prevState,
          [inputName]: inputValue,
        };
      }
    });
  }

  callerHandler = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    // Update the state based on the input field
    this.setState((prevState) => {
      if (
        inputName === "department" ||
        inputName === "jobTitle" ||
        inputName === "callerName"
      ) {
        return {
          ...prevState,
          query: {
            ...prevState.query,
            caller: {
              ...prevState.query.caller,
              [inputName]: inputValue,
            },
          },
        };
      } else {
        return {
          ...prevState,
          [inputName]: inputValue,
        };
      }
    });
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
          query: {
            ...prevState.query,
            specialist: {
              ...prevState.query.specialist,
              user_id: {
                usersId,
                userName,
                role,
              },
              expertise: selectedSpecialist.expertise,
            },
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
    this.setState((prevState) => {
      if (inputName === "problemType" || inputName === "problemDescription") {
        return {
          ...prevState,
          query: {
            ...prevState.query,
            problem: {
              ...prevState.query.problem,
              [inputName]: inputValue,
            },
          },
        };
      } else {
        return {
          ...prevState,
          [inputName]: inputValue,
        };
      }
    });
  };

  equipmentMakeHandler = (event) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState((prevState) => {
      if (inputName === "equipmentMake" || inputName === "equipmentType") {
        return {
          ...prevState,
          query: {
            ...prevState.query,
            equipment: {
              ...prevState.query.equipment,
              [inputName]: inputValue,
            },
          },
        };
      } else {
        return {
          ...prevState,
          [inputName]: inputValue,
        };
      }
    });
  };

  handleSubmit(event, callID, currentUser) {
    event.preventDefault();

    console.log("currentUser===> "+currentUser);
    // Create the payload without the outer query wrapper
    // const ticketRequest = {
    //   callID: callID,
    //   operator: {
    //     user_id: {
    //       usersId: currentUser.usersId,
    //       userName: currentUser.userName,
    //       role: currentUser.role,
    //     },
    //   },
    //   caller: {
    //     callerID: this.state.query.caller.callerID,
    //     callerName: this.state.query.caller.callerName,
    //     jobTitle: this.state.query.caller.jobTitle,
    //     department: this.state.query.caller.department,
    //   },
    //   equipment: {
    //     equipmentID: this.state.query.equipment.equipmentID,
    //     equipmentType: this.state.query.equipment.equipmentType,
    //     equipmentMake: this.state.query.equipment.equipmentMake,
    //   },
    //   software: {
    //     softwareID: this.state.query.software.softwareID,
    //     softwareName: this.state.query.software.softwareName,
    //     serialNumber: this.state.query.software.serialNumber,
    //   },
    //   problem: {
    //     problemID: this.state.query.problem.problemID,
    //     problemType: this.state.query.problem.problemType,
    //     problemDescription: this.state.query.problem.problemDescription,
    //   },
    //   resolution: {
    //     resolutionID: this.state.query.resolution.resolutionID,
    //     resolutionDescription: this.state.query.resolution.resolutionDescription,
    //   },
    //   specialist: {
    //     specialist_ID: this.state.query.specialist.specialistID,
    //     expertise: this.state.query.specialist.expertise,
    //     user_id: {
    //       usersId: this.state.query.specialist.user_id.usersId,
    //       userName: this.state.query.specialist.user_id.userName,
    //       role: this.state.query.specialist.user_id.role,
    //     },
    //   },
    // };
    const ticketRequest = Object.assign({}, this.state.query);
    //  console.log( "Checking from fucntion to API the callID ==> " +callID)

    editTicket(ticketRequest, callID)
      .then((response) => {
        Alert.success("Your Ticket is successfully Edited!");
        this.props.history.push("/callrecord");
      })
      .catch((error) => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });

    // <Redirect
    //   to={{
    //     pathname: "/callrecord",
    //     state: { from: this.props.location },
    //   }}
    // />;
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
    const mergeEquipmentMakes = [
      ...new Set(
        this.state.equipments.map((equipment) => equipment.equipmentMake)
      ),
    ];
    const mergeSoftwareName = [
      ...new Set(this.state.softwares.map((software) => software.softwareName)),
    ];
    return (
      
      <form onSubmit={(event) => this.handleSubmit(event, this.props.location.state.callID, this.props.currentUser)}>
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
                value={
                  this.state.query.caller
                    ? this.state.query.caller.callerName
                    : "N/A"
                }
                onChange={this.callerHandler}
                required={true}
              />
            </div>
            <div className="form-item">
              <label>Department:</label>
              <select
                name="department"
                value={
                  this.state.query.caller
                    ? this.state.query.caller.department
                    : ""
                }
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
                value={
                  this.state.query.caller
                    ? this.state.query.caller.jobTitle
                    : ""
                }
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
                value={
                  this.state.query.software
                    ? this.state.query.software.softwareName
                    : ""
                }
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
                value={
                  this.state.query.software
                    ? this.state.query.software.serialNumber
                    : ""
                }
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
              <label>Equipment Make:</label>
              <select
                name="equipmentMake"
                value={
                  this.state.query.equipment
                    ? this.state.query.equipment.equipmentMake
                    : ""
                }
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
              <label>Equipment Type:</label>
              <select
                name="equipmentType"
                value={
                  this.state.query.equipment
                    ? this.state.query.equipment.equipmentType
                    : ""
                }
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
              <label>Problem Type:</label>
              <select
                name="problemType"
                value={
                  this.state.query.problem
                    ? this.state.query.problem.problemType
                    : ""
                }
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
                value={
                  this.state.query.specialist
                    ? this.state.query.specialist.user_id.userName
                    : ""
                }
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
                value={
                  this.state.query.problem
                    ? this.state.query.problem.problemDescription
                    : ""
                }
                onChange={this.problemTypeHandler}
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

export default withRouter(EditLog);
