

export const API_BASE_URL = "http://localhost:8080";
export const ACCESS_TOKEN = "accessToken";

const request = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

//Get Current User Profile - Private Route
export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/api/user/me",
    method: "GET",
  });
  //return axios.get(API_BASE_URL + '/kyn/user/me');
}

//Post Login User - Public Route
export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/api/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function checkingRole(loginRequest) {
  const roleCheckUrl = `/api/checkUserRole?email=${loginRequest.email}&role=${loginRequest.role}`;
  console.log("test Backtick URL = " +roleCheckUrl);
  return request({
    url: API_BASE_URL + roleCheckUrl,
    method: "GET",
  });
}

//Post Ticket User - Public Route
export function ticket(ticketRequest) {
  console.log("request" + JSON.stringify(ticketRequest));
  return request({
    url: API_BASE_URL + "/api/logticket",
    method: "POST",
    body: JSON.stringify(ticketRequest),
  });
}

export function editTicket(ticketRequest, callID) {
  console.log("request" + JSON.stringify(ticketRequest));
  return request({
    url: API_BASE_URL + `/api/editedlog/${callID}`,
    method: "PUT",
    body: JSON.stringify(ticketRequest),
  });
}

//Signup
export function signup(signUpRequest) {
  console.log("request" + JSON.stringify(signUpRequest));
  return request({
    url: API_BASE_URL + "/api/register",
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
}


//Update Specialist
export function updateSpecialist(updateReq, callID){
  console.log("Update Specialist =====> " + JSON.stringify(updateReq)+ `/api/updatespecialist/${callID}`);
  callID = parseInt(callID, 10);
  
  return request({
    url: API_BASE_URL + `/api/updatespecialist/${callID}`,
    method: "PUT",
    body: JSON.stringify(updateReq),
  });
}