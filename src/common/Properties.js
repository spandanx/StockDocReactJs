import CryptoJS from "crypto-js";

const salt = "asjajaj00aanansAm44";
const sftpBaseLocation = "/home/gamma/stockdoc/"
const baseUrl = "http://localhost:8002"
const predictionFileListEndpoint = baseUrl + "/list-prediction-files";
const predictionEndpoint = baseUrl + '/prediction';
const loginUrl = baseUrl + "/token/"
const registerUrl = baseUrl + "/users/register/"
const healthCheckUrl = baseUrl + "/healthcheck/"
const updateStockTokenUrl = baseUrl + "/users/update-stock-token/"
const accountInfoUrl = baseUrl + "/users/self-info/"

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


const chartDefaultFrequency = "day";
// const chartDefaultUser = "";
const today = new Date()
const startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()-1);
const chartDefaultFromDate = formatDate(startDate);
const chartDefaultToDate = formatDate(today);
console.log(chartDefaultFromDate, chartDefaultToDate);

//"2024-11-25"

const encryptData = (text) => {
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        salt
    ).toString();
        console.log("encryptData() - input - ", text, " Output -  ", data);
        return data;
    };

const decryptData = (text) => {
    console.log("Calling decryptData()");
    console.log(text);
    console.log(salt);
    const bytes = CryptoJS.AES.decrypt(text, salt);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log("decryptData() - input - ", text, " Output -  ", data);
    return data;
};

const getAccountInfo = (username, accountInfoUrl, setStockTokenGlobal, setActiveUserInfo) => {
    console.log("Called getAccountInfo()", username);
    // event.preventDefault();

    var queryUrl = `${accountInfoUrl}?current_user=${username}`
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl, {
        method: 'get',
        })
        .then(response => response.json())
        .then(accInfo => {
            console.log(accInfo);
            setStockTokenGlobal(accInfo.stock_token);
            setActiveUserInfo(accInfo);
        });
}

const loadSessionStorage = async (username, accountInfoUrl, setStockTokenGlobal, setActiveUser, setToken, setActiveUserInfo) => {
    console.log("calling loadSessionStorage()");
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData == undefined || userData == null){
      console.log("userData is not present in session storage, routing to login page");
    //   navigate('/login');
        return {"login_status": "LOGGED_OUT"}
    }
    else{
      console.log("userData is present in session storage");
      console.log(userData);
      let username = userData.activeuser;
      let token = userData.token;
      setActiveUser(username);
      setToken(token);
      getAccountInfo(username, accountInfoUrl, setStockTokenGlobal, setActiveUserInfo);
      // navigate('/chart');
      return {"login_status": "LOGGED_IN"}
    }
  }

export {encryptData, decryptData, sftpBaseLocation, baseUrl, predictionFileListEndpoint, predictionEndpoint, chartDefaultFromDate, chartDefaultToDate, chartDefaultFrequency,
    loginUrl, registerUrl, healthCheckUrl, updateStockTokenUrl, accountInfoUrl, loadSessionStorage, getAccountInfo, formatDate
};