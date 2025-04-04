import logo from './logo.svg';
import './App.css';
import ChartScreen from './components/ChartScreen';
import StockNavBar from './components/StockNavBar';
import TopNavBar from './components/TopNavBar';
import StockList from './components/StockList';
import React, { useState} from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {ToastContainer, toast } from 'react-toastify';

import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link
} from "react-router-dom";


function App() {

  // const [stockChartDataAll, setStockChartDataAll] = useState({});
  // const [stockList, setStockList] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [activeUser, setActiveUser] = useState('ABC');
  const [stockTokenGlobal, setStockTokenGlobal] = useState('');
  

  const setToken = (token) => {
    console.log("Setting Token", token);
    setAuthToken(token);
  }

  return (
    <>
    <Router>
    <TopNavBar activeUser={activeUser} setToken={setToken} setActiveUser={setActiveUser} setStockTokenGlobal={setStockTokenGlobal} stockTokenGlobal={stockTokenGlobal}/>
    <div class="form-horizontal container" role="form" id="light">
        <div class="form-group row my-3 justify-content-between">
          <ToastContainer/>
          {/* <div class="col-md-2">
            {stockList.map((stock)=>(
              <p>{stock.name}</p>
            ))}
          </div> */}
        </div>
        <Navbar bg="secondary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            Navbar
            </Navbar.Brand>
          <Nav className="me-auto text-white">
            <Nav.Link as={Link} to="/chart">
              AllChart
            </Nav.Link>
            <Nav.Link as={Link} to="/holdings">
              Holdings
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
        <div class="form-group row my-3 justify-content-between">
          {/* <StockNavBar updateStockList={setStockList} updateStockChartData={setStockChartDataAll} stockList={stockList} stockChartDataAll={stockChartDataAll}/> */}
          <StockNavBar/>
          {/* {Object.keys(stockChartDataAll).length} */}
        </div>
        <div class="form-group justify-content-between">
          <Routes>
            {/* <Route path="/" element={<StockList stockArray={stockList}/>}/> */}
            <Route path="/" element={<ChartScreen/>}/>
            <Route path="/chart" element={<ChartScreen/>}/>
            <Route path="/holdings" element={<StockList stockTokenGlobal={stockTokenGlobal}/>}/>
            
            {/* <Route path="/"/> */}
          </Routes>
        </div>
    </div>
    </Router>
    </>
  );
}

export default App;