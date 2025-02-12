import CryptoJS from "crypto-js";

const salt = "asjajaj00aanansAm44";
const sftpBaseLocation = "/home/gamma/stockdoc/"
const baseUrl = "http://127.0.0.1:8000"
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
const chartDefaultUser = "CCN088";
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


export {encryptData, decryptData, sftpBaseLocation, baseUrl, predictionFileListEndpoint, predictionEndpoint, chartDefaultFromDate, chartDefaultToDate, chartDefaultFrequency, chartDefaultUser,
    loginUrl, registerUrl, healthCheckUrl, updateStockTokenUrl, accountInfoUrl
};