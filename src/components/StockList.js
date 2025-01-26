// import React, {useState, useEffect} from 'react';
import React, { useState, useEffect, useRef } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/StockList.css'
import { IoRefreshSharp } from "react-icons/io5";
import ChartScreenDynamic from "./ChartScreenDynamic"
// import sellsound from '../data/mixkit-bell-notification-933.wav'
// import buysound from '../data/mixkit-clear-announce-tones-2861.wav'
// import { getSuddenSell, getSuddenBuy, getHeavyBuy, getHeavySell, getSuddenPercentageHike, getSuddenPercentageFall } from '../utilities/UTIL';

const StockList = ({stockTokenGlobal}) => {

  const [stockData, setStockData] = useState([
    {
      "tradingsymbol_with_exchange": "BSE_EQ_IREDA",
      "quantity": 101,
      "last_price": 194.9,
      "average_price": 197.88,
      "current_value": 19684.9,
      "profit_and_loss": -300.5,
      "net_change": -1.52,
      "day_change": -0.99,
      "symbol": "IREDA",
      "exchange": "BSE",
      "instrument_token": 139270660,
      "total_price": 19684.9
  },
  {
      "tradingsymbol_with_exchange": "NSE_EQ_NTPCGREEN",
      "quantity": 171,
      "last_price": 112.32,
      "average_price": 114.73,
      "current_value": 19206.72,
      "profit_and_loss": -412.11,
      "net_change": -3.59,
      "day_change": -0.75,
      "symbol": "NTPCGREEN",
      "exchange": "NSE",
      "instrument_token": 6957057,
      "total_price": 19206.72
  },
  {
      "tradingsymbol_with_exchange": "NSE_EQ_HUDCO",
      "quantity": 16,
      "last_price": 219.84,
      "average_price": 203.25,
      "current_value": 3517.44,
      "profit_and_loss": 265.44,
      "net_change": 1.31,
      "day_change": -0.74,
      "symbol": "HUDCO",
      "exchange": "NSE",
      "instrument_token": 5331201,
      "total_price": 3517.44
  }
  ]);

  const baseUrl = "http://127.0.0.1:8000";

  const [activeStockList, setActiveStockList] = useState([]);
  const [sortOnCol, setSortOnCol] = useState("");

  useEffect(() => {
    // getStockList();
    console.log("Initiated");
    setActiveStockList(stockData);
  }, []);

  // const showStockList = () => {
  //   return (
  //     <div style={{"overflow-y": "scroll"}}>
  //       <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
  //       {stockData.map((stockItem)=>(
  
  //       <div class="d-flex align-items-center">
  //         {console.log(stockItem)}
  //         <div class="p-2 bd-highlight">
  //           <a class="nav-link" style={{color:"darkgrey"}}>{stockItem.tradingsymbol} </a>
  //         </div>
  //         <div class="p-2 bd-highlight">
  //           <a class="nav-link">{stockItem.last_price}</a>
  //         </div>
  //       </div>
  //       ))}
  //       <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
  //       <hr style={{ color: "white", backgroundColor: "grey", height: "2px" }} />
  //     </div>
  //   )
  // }
  const showStockList = () => {
    // let columns = ["Instrument", "Qty.", "Avg. cost", "LTP", "Cur. val", "P&L", "Net chg.", "Day chg."];
    let stock_col_native_mapping = {
      "Instrument": "tradingsymbol_with_exchange",
      "Qty.": "quantity", 
      "Avg. cost": "average_price", 
      "LTP": "last_price", 
      "Cur. val": "current_value", 
      "P&L": "profit_and_loss", 
      "Net chg.": "net_change", 
      "Day chg.": "day_change"
    }
    // stock_col_native_mapping.map((key_, val_) => {
    //   console.log(key_, val_);
    // });
    const sortStockList = (key) => {
      console.log("called sortStockList()", key);
      // console.log(sortOnCol.split(':')[0], sortOnCol.split(':')[1]);
      let ascending = "true";
      if (sortOnCol.length == 0){
        console.log("111");
        ascending = "true";
        setSortOnCol(key + ":" + "ASC");
      }
      else if (sortOnCol.split(':')[0] != key){
        console.log("222");
        ascending = "true";
        setSortOnCol(key + ":" + "ASC");
      }
      else if (sortOnCol.split(':')[0] == key && sortOnCol.split(':')[1] == "ASC"){
        console.log("333");
        ascending = "false";
        setSortOnCol(key + ":" + "DESC");
      }
      else{
        console.log("444");
        ascending = "NO";
        setSortOnCol("");
      }
      console.log(ascending, sortOnCol);
      if (ascending == "NO"){
        console.log("NO SORT");
        setActiveStockList(stockData);
      }
      else if (ascending == "true"){
        const newStockData = [...activeStockList].sort((a, b) => (a[key] > b[key] ? 1 : -1));
        setActiveStockList(activeStockList);
      }
      else if (ascending == "false"){
        const newStockData = [...activeStockList].sort((a, b) => (a[key] > b[key] ? 1 : -1));
        setActiveStockList(newStockData);
    }
  }

    return (
      <div style={{"overflow-y": "scroll"}}>
        <table class="table table-light">
          <thead>
            <tr>
            {Object.entries(stock_col_native_mapping).map((row_, i_) => (
              <th scope="col" onClick={(evnt)=>{sortStockList(row_[1], true)}}>{row_[0]}</th>
            ))}
            </tr>
          </thead>
          {(Object.keys(activeStockList).length>0)? 
          <tbody>
            {activeStockList.map((stockItem)=>(
            <tr>
              {Object.entries(stock_col_native_mapping).map((row_, i_) => (
                <td>{stockItem[row_[1]]}</td>
              ))}
              <td><ChartScreenDynamic stock_name={stockItem["symbol"]} stock_id={stockItem["instrument_token"]}/></td>
            </tr>
            ))}
          </tbody>
          :
          <></>
          }
        </table>
      </div>
    )
  }
  const getHoldings = () => {
    // event.preventDefault();
    console.log("querying Stocks");
    
    var queryUrl = `${baseUrl}/holdings`
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl, {
        method: 'get',
        headers: {'stock_authorization': stockTokenGlobal},
        })
        .then(response => response.json())
        .then(stocks => {
          // setStocks(stocks);
          console.log("stocks - ");
          console.log(stocks);
          console.log(stockData.length);
          setStockData(stocks);
          setActiveStockList(stocks);
          console.log(stockData.length);
          // console.log(getStockArrayToObject(stocks));
        });
    }

  return (
    <div class="col-md-auto">
      <div class="row">
      <a onClick={(event)=>getHoldings()}>HOLDING REFRESH <IoRefreshSharp/></a>
        {showStockList()}
      </div>
    </div>
  )
}

export default StockList;