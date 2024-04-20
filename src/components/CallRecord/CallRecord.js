import React from "react";
import Services from "../../service/Services";
import "../CallRecord/CallRecord.css";

import { Redirect } from "react-router-dom";

class CallRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queries: [],
      query: {
        callID: "",
        resolution: {
          resolutionDescription: "",
        },
      },
      editMode: {},
    };
    // console.log("Testing Name output " + this.props.currentUser.userName);
  }

  componentDidMount() {
    Services.getAllQueries().then((res) =>
      this.setState({ queries: res.data })
    );
  }

  resolutionChange = (event, callID) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    // Check if the inputName is the complete name
    if (inputName === "query.resolution.resolutionDescription") {
      this.setState((prevState) => ({
        ...prevState,
        query: {
          ...prevState.query,
          resolution: {
            ...prevState.query.resolution,
            resolutionDescription: inputValue,
          },
        },
      }));
    } else {
      // Handle other fields if needed
      this.setState({
        [inputName]: inputValue,
      });
    }
  };

  handleEdit = (callID) => {
    console.log(`Go to edit callID =>  ${callID}`);
    let q = "do you want to Edit Call";
    if (window.confirm(q) === true) {
      q = "You pressed OK!";
      this.props.history.push({
        pathname: "/editlog",
        state: { callID: callID },
      });
    } else {
      q = "You canceled!";
    }
    // Services.getQueryByid(callID);
  };

  render() {
    // const {editMode} = this.state;

    if (
      this.props.authenticated &&
      this.props.location.pathname !== "/log" &&
      (this.props.currentUser.role === null ||
        this.props.currentUser.role === "")
    ) {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: { from: this.props.location },
          }}
        />
      );
    }

    const handleDelete = (callID) => {
      console.log(`Delete for callID ${callID}`);
      let q = "do you want to Delete Call";
      if (window.confirm(q) === true) {
        q = "You pressed OK!";
        Services.deleteQuery(callID)
        .then(() => {
          // Reload the page after successful deletion
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting query:", error);
          // Handle error if needed
        });
      } else {
        q = "You canceled!";
      }
    };

    function Buttons({ callID, handleDelete, handleEdit }) {
      return (
        <>
          <button className="btn-edit" onClick={() => handleEdit(callID)}>
            Edit
          </button>
          <button className="btn-delete" onClick={() => handleDelete(callID)}>
            Delete
          </button>
        </>
      );
    }

    return (
      <div className="row-table">
        <div className="row-title">
          <h1>
            <span>Call</span> Record
          </h1>
        </div>

        {
          /* this.props.authenticated ? */ <div className="table-outer">
            <table className="table-main">
              {/*================ start Header is Table =====================*/}
              <tr className="table-header">
                <th>
                  Call <br />
                  ID
                </th>
                <th>
                  Caller <br />
                  Name
                </th>
                <th>
                  Caller <br />
                  Department
                </th>
                <th>
                  Caller <br />
                  Job Title
                </th>
                <th>
                  Equipent <br />
                  Make
                </th>
                <th>
                  Equipment <br />
                  Type
                </th>
                <th>
                  Software <br />
                  Name
                </th>
                <th>
                  Serial <br />
                  Number
                </th>
                <th>
                  Problem <br />
                  Type
                </th>
                <th>
                  Problem <br />
                  Description
                </th>
                <th>
                  logged <br />
                  Date
                </th>
                <th>
                  Specialist <br />
                  Name
                </th>
                <th>
                  Resolution <br />
                  Description
                </th>
                <th>
                  Resolution <br />
                  Time
                </th>
                <th>Action</th>
              </tr>
              {/*================== end header is Table ====================*/}

              {this.state.queries.map((query) => (
                <tr key={query.callID}>
                  <td>{query.callID}</td>
                  <td>{query.caller ? query.caller.callerName : "N/A"}</td>
                  <td>{query.caller ? query.caller.department : "N/A"}</td>
                  <td>{query.caller ? query.caller.jobTitle : "N/A"}</td>
                  <td>
                    {query.equipment ? query.equipment.equipmentMake : "N/A"}
                  </td>
                  <td>
                    {query.equipment ? query.equipment.equipmentType : "N/A"}
                  </td>
                  <td>
                    {query.software ? query.software.softwareName : "N/A"}
                  </td>
                  <td>
                    {query.software ? query.software.serialNumber : "N/A"}
                  </td>
                  <td>{query.problem ? query.problem.problemType : "N/A"}</td>
                  <td>
                    {query.problem ? query.problem.problemDescription : "N/A"}
                  </td>
                  <td>
                    {query.callTime
                      ? new Date(query.callTime).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td>
                    {query.specialist
                      ? query.specialist.user_id.userName
                      : "N/A"}
                  </td>
                  <td>
                    <span>
                      {query.resolution &&
                      query.resolution.resolutionDescription !== null
                        ? query.resolution.resolutionDescription
                        : "NOT FINISHED"}
                    </span>
                  </td>
                  <td>
                    {query.resolution &&
                    query.resolution.resolutionTime !== null
                      ? new Date(
                          query.resolution.resolutionTime
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "NOT FINISHED"}
                  </td>
                  <td>
                    <Buttons
                      callID={query.callID}
                      handleDelete={handleDelete}
                      handleEdit={() => this.handleEdit(query.callID)}
                    />
                  </td>
                </tr>
              ))}
            </table>
          </div> /* :
            (
              <h1 style={{ textAlign:"center",  color:"red"}}> PLEASE LOGIN TO ACCESS THIS PAGE !</h1>
            ) */
        }
      </div>
    );
  }
}

export default CallRecord;
