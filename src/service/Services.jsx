import axios from "axios";


const API_BASE_URL="http://localhost:8080/api";

class Services{

    getAllProblems(){
        console.log ("Problems Service, get all Problems method is working");
        return axios.get(API_BASE_URL + "/problems" );
    }

    getAllSoftwares(){
        console.log ("Softwares Service, get all Softwares method is working");
        return axios.get(API_BASE_URL + "/softwares");
    }

    getAllEquipments(){
        console.log ("Equipments Service, get all Equipments method is working");
        return axios.get(API_BASE_URL + "/equipments");
    }

    getAllSpecialists(){
        console.log ("specialists service, get all specialists method is working");
        return axios.get(API_BASE_URL + "/specialists");
    }
    

    getAllQueries(){
        console.log("call Log has been Loaded!");
        return axios.get(API_BASE_URL + "/getlogs")
    }


    deleteQuery(callID){
        console.log("Delete Query Success!");
        return axios.delete(API_BASE_URL + `/deletelog/${callID}`);
    }


    getQueryByid(callID){
        console.log(`Get Query By ID Success! id => ${callID}`);
        return axios.get(API_BASE_URL + `/getlog/${callID}`);
    }



}

export default new Services()
