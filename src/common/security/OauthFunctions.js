import {healthCheckUrl} from '../../common/Properties';

const checkAndUpdateToken = async () => {
    console.log("Calling healthCheck");
    let fetchNewTokenFlag = false;
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    let username = userData.activeuser;
    let password = userData.password;
    // console.log(userData);
    await fetch(healthCheckUrl,
      {
        method: 'get',
        headers: {
          'Content-Type':'application/json',
          'Authorization': token.token_type + " " + token.access_token
        }
      }
    )
    .then(response => {
      // console.log(response.status);
      // console.log("response.headers");
      // console.log(...response.headers);
      // console.log(response.headers.has('reason'));
      // console.log(response.status == "403");
      // console.log(response.headers.get('reason') == "TOKEN_EXPIRED");
      if (response.status == "403" && response.headers.has('reason') && response.headers.get('reason') == "TOKEN_EXPIRED"){
        console.log("Need to fetch token");
        if (password == undefined || password == null){
          console.log("Keep me signed in was not enabled, navigating to login screen");
          setTokenExpired(true);
        }
        else {
          console.log("Going to fetch new token");
          fetchNewTokenFlag = true;
        }
        // generateTokenAndLogin();
      }

      // response.headers.forEach((value, key) => console.log("header:", key, 'value:', value));
      return response.json()})
    .then(data => {
      console.log("HealthCheck data");
      console.log(data);
    })
    .catch(error => {
      console.log("ERROR - HealthCheck failed");
      console.log(error);
  });
}

export {checkAndUpdateToken};