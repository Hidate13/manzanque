import React from "react";
import "../CallLog/CallLog.css";
import Services from "../../service/Services";
import { updateSpecialist } from "../../service/OnlineService";
import Alert from "react-s-alert";
import { Redirect } from "react-router-dom";

class CallLog extends React.Component {
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

  toggleEditMode = (callID) => {
    this.setState((prevState) => {
      const { editMode, activeEditID } = prevState;
  
      // Close the previously active edit mode
      if (activeEditID !== null && activeEditID !== callID) {
        editMode[activeEditID] = false;
      }
  
      const updatedEditMode = {
        ...editMode,
        [callID]: !editMode[callID],
      };
  
      // If switching to edit mode, save the current active edit ID
      const newActiveEditID = updatedEditMode[callID] ? callID : null;
  
      return {
        editMode: updatedEditMode,
        activeEditID: newActiveEditID,
      };
    });
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

    const handleUpdate = (callID) => {
      console.log(`Toggling edit mode for callID ${callID}`);
      const updateReq = {
        resolution: {
          resolutionDescription:
            this.state.query.resolution.resolutionDescription,
        },
      };

      console.log("Update Data ====>", updateReq);

      updateSpecialist(updateReq, callID)
        .then((response) => {
          Alert.success("Update successfully.");
          
          //fetch queries
          Services.getAllQueries().then((res) =>
          this.setState({ queries: res.data })
          );

          this.props.history.push("/log");
        })
        .catch((error) => {
          Alert.error(
            (error && error.message) ||
              "Oops! Something went wrong. Please try again!"
          );
        });
        
      // console.log(`Editing done for callID ${callID}`);
      this.toggleEditMode(callID);
    };

    

    function DoneBtn({ callID, handleUpdate, toggleEditMode}) {
      return (
        <>
          <button className="btn-done" onClick={() => handleUpdate(callID)}>
            Done
          </button>
          <button className="btn-cancel" onClick={() => toggleEditMode(callID)}>
              Cancel
           </button>
        </>
      );
    }

    function EditBtn({callID, toggleEditMode}) {

      // console.log(`Type of callID: ${typeof callID}, Value of callID:`, callID);
      return (
        <>
        
          <button className="btn-edit" onClick={() => toggleEditMode(callID)}>
            edit
          </button>
        </>
      );
    }

    return (
      <div className="row-table">
        <div className="row-title">
          <h1>Call Log</h1>
        </div>

        {
          /* this.props.authenticated ? */ <div className="table-outer">
            <table className="table-main" >
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
                  Serial  <br />
                  Number
                </th>
                <th>
                  Problem <br />
                  Type
                </th>
                <th >
                  Problem <br />
                  Description
                </th>
                <th>
                  logged <br />
                  Date
                </th>
                {this.props.currentUser.role === "Specialist" && (
                  <>
                    <th>
                      Resolution <br />
                      Description
                    </th>
                    <th>
                      Resolution <br />
                      Time
                    </th>
                    <th>Action</th>
                  </>
                )}
              </tr>
              {this.state.queries.map((query) => (
                <tr key={query.callID}>
                  {query.specialist.user_id.userName === this.props.currentUser.userName  &&  (
                    <>
                  <td>
                    {/* {console.log(query)} */}
                    {query.callID}
                  </td>
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
                  {this.props.currentUser.role === "Specialist" &&  (
                    <>
                      <td style={{ color: "blue" }}>
                        { !this.state.editMode[query.callID] ?(
                          
                          <span>{query.resolution.resolutionDescription !== "" ? 
                                        query.resolution.resolutionDescription : "NOT FINISHED"}</span>
                        ) : (
                          <input
                            style={{ width: "auto" }}
                            type="text"
                            name="query.resolution.resolutionDescription"
                            placeholder={query.resolution.resolutionDescription}
                            value={
                              this.state.query.resolution
                                .resolutionDescription || ""
                            }
                            onChange={(event) =>
                              this.resolutionChange(event, query.callID)
                            }
                            // Handle input change event if needed
                          />
                        )}
                      </td>
                      <td style={{ color: "blue" }}>
                        {query.resolution.resolutionTime
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
                        {this.state.editMode[query.callID] ? (
                          <DoneBtn
                          callID={query.callID}
                          handleUpdate={handleUpdate}
                          toggleEditMode={() => this.toggleEditMode(query.callID)}
                        />
                        ) : (
                          <EditBtn callID={query.callID}
                          toggleEditMode={() => this.toggleEditMode(query.callID)}
                          />
                        )}
                      </td>
                    </>
                  )}
                  </>
                  )}
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
export default CallLog;
