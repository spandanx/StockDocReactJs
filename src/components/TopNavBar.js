import React, {useState, useEffect} from 'react'

import { useNavigate, useLocation } from "react-router-dom";
import {ToastContainer, toast } from 'react-toastify';
import { Form, Button, Alert } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

import { MdAccountCircle, MdContentCopy } from "react-icons/md";

import {pointerHover} from '../styles/cursor.js';

const TopNavBar = ({activeUser, setToken, setActiveUser, setStockTokenGlobal, stockTokenGlobal}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [accountName, setAccountName] = useState('');
  const [stockTokenLocal, setStockTokenLocal] = useState('');
  const [accountAddress, setAccountAddress] = useState('');

  useEffect(() => {
    console.log("Calling useEffect()");
    console.log("Initial location");
    // console.log(location);
    // loadSessionStorage();
  }, []);

  useEffect(()=>{
    console.log("Location pathname change Detected");
  }, [location.pathname]);


  const copyText = (text) => {
    console.log("Copied");
    navigator.clipboard.writeText(text);
    toast.info('Address Copied', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
      });
  }

  // const loadSessionStorage = async () => {
  //   console.log("calling loadSessionStorage()");
  //   let userData = JSON.parse(sessionStorage.getItem('userData'));
  //   if (userData == undefined || userData == null){
  //     console.log("userData is not present in session storage, routing to login page");
  //     navigate('/login');
  //   }
  //   else{
  //     console.log("userData is present in session storage");
  //     console.log(userData);
  //     let username = userData.activeuser;
  //     let token = userData.token;
  //     setActiveUser(username);
  //     setToken(token);
  //   }
  // }

  // const logout = () => {
  //   sessionStorage.removeItem('userData');
  //   setToken("");
  //   setActiveUser("");
  //   navigate('/login');
  // }

  return (
    <ul class="nav justify-content-between">
      <li class="nav-item">
        <a class="nav-link" style={{color:"grey"}}>StockDoc</a>
        <ToastContainer/>
      </li>
      
      <li class="nav-item">
        {(activeUser != undefined && activeUser != "") && 
          <div class="btn-group">
            <a type="button" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <MdAccountCircle color="grey" size="2em"/>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item fw-bold">Hi {activeUser}</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item fw-bold">Token: {stockTokenGlobal.substring(0,5) + ' ...'}</a>
              <div class="dropdown-divider"></div>
              {/* <input
                className='form-input'
                type='text'
                name='username'
                placeholder='Enter your stock token for the day...'
                value={stockTokenLocal}
                onChange={e => setStockTokenLocal(e.target.value)}
              />
              <div class="dropdown-divider"></div>
              <button type="reset" onClick={e => setStockTokenGlobal(e.target.value)}>Set Token</button> */}
              <Form onSubmit={e => {e.preventDefault(); setStockTokenGlobal(stockTokenLocal);}} className="login-form">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Stock Token</Form.Label>
                    <Form.Control
                    type="username"
                    placeholder="Enter stock token for the day..."
                    value={stockTokenLocal}
                    onChange={(e) => setStockTokenLocal(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="login-button">
                  Set Token
                </Button>
                </Form>
              {/* <a class="dropdown-item" style = {{color: "red"}} onClick={()=>logout()}>Logout</a> */}
            </div>
          </div>
          }
      </li>
      
    </ul>
  )
}

export default TopNavBar