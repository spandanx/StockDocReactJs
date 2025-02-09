import CryptoJS from "crypto-js";

// const salt = "ajsPamkanAmMnam22";
// const baseUrl = "http://180.188.226.161:8000"
// const loginUrl = baseUrl + "/token/"
const sftpBaseLocation = "/home/gamma/stockdoc/"

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

export {sftpBaseLocation
};