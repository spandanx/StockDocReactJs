// import React, {useState, useEffect} from 'react';
import React, { useState, useEffect, useRef } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/StockList.css'
import { IoRefreshSharp } from "react-icons/io5";
import { RiShareForwardFill } from "react-icons/ri";
import ChartScreenDynamic from "./ChartScreenDynamic";
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDate, baseUrl, listType } from '../common/Properties';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import ToggleButton from 'react-bootstrap/ToggleButton';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import sellsound from '../data/mixkit-bell-notification-933.wav'
// import buysound from '../data/mixkit-clear-announce-tones-2861.wav'
// import { getSuddenSell, getSuddenBuy, getHeavyBuy, getHeavySell, getSuddenPercentageHike, getSuddenPercentageFall } from '../utilities/UTIL';

const StockList = ({stockTokenGlobal, activeUserInfo, givenListType}) => {

  const [stockData, setStockData] = useState([]);
  //   const [stockData, setStockData] = useState([
  //   {
  //     "tradingsymbol_with_exchange": "NSE_EQ_IRCON",
  //     "quantity": 10,
  //     "last_price": 170.19,
  //     "average_price": 190.1,
  //     "current_value": 10701.90,
  //     "profit_and_loss": -201.05,
  //     "net_change": -1.05,
  //     "day_change": -5.37,
  //     "symbol": "IRCON",
  //     "exchange": "NSE",
  //     "instrument_token": 1276417,
  //     "total_price": 10718.91
  // },
  // {
  //     "tradingsymbol_with_exchange": "BSE_EQ_RVNL",
  //     "quantity": 10,
  //     "last_price": 395.35,
  //     "average_price": 403.02,
  //     "current_value": 1620.93,
  //     "profit_and_loss": -31.4,
  //     "net_change": -0.78,
  //     "day_change": 0,
  //     "symbol": "RVNL",
  //     "exchange": "BSE",
  //     "instrument_token": 138918148,
  //     "total_price": 1620.93
  // },
  // {
  //     "tradingsymbol_with_exchange": "NSE_EQ_HUDCO",
  //     "quantity": 16,
  //     "last_price": 219.84,
  //     "average_price": 203.25,
  //     "current_value": 13517.44,
  //     "profit_and_loss": 265.44,
  //     "net_change": 1.31,
  //     "day_change": -0.74,
  //     "symbol": "HUDCO",
  //     "exchange": "NSE",
  //     "instrument_token": 5331201,
  //     "total_price": 13517.44
  // }
  // ]);

  const today = new Date()
  const oneDayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
  const twoDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate()-2);
  const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
  const oneMonthsAgo = new Date(today.getFullYear(), today.getMonth()-1, today.getDate()-1);
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()-1);
  // const chartDefaultFromDate = formatDate(startDate);
  // const chartDefaultToDate = formatDate(today);
  const [currentFreqSet, setCurrentFreqSet] = useState("2 Day");

  const stockQtyFilter = ["Greater than 1"];
  const stockAmountFilter = ["Greater than 1k", "Greater than 10k", "Lesser than 10k"];
  const [qtyFilter, setQtyFilter] = useState("Greater than 1");
  const [amtFilter, setAmtFilter] = useState("Greater than 1k");
  const chartFreqSet = {
    "1 Day": 
    {
      chartFrequency: "5minute", chartFromDate: formatDate(oneDayAgo), chartToDate: formatDate(today)
    },
    "2 Day":
    {
      chartFrequency: "30minute", chartFromDate: formatDate(twoDaysAgo), chartToDate: formatDate(today)
    },
    "7 Day":
    {
      chartFrequency: "30minute", chartFromDate: formatDate(sevenDaysAgo), chartToDate: formatDate(today)
    },
    "30 Day":
    {
      chartFrequency: "day", chartFromDate: formatDate(oneMonthsAgo), chartToDate: formatDate(today)
    },
    "6 Month":
    {
      chartFrequency: "day", chartFromDate: formatDate(sixMonthsAgo), chartToDate: formatDate(today)
    }
  }

  const navigate = useNavigate();
  const location = useLocation();

  const [activeStockList, setActiveStockList] = useState([]);
  const [sortOnCol, setSortOnCol] = useState("");

  useEffect(() => {
    // getStockList();
    console.log("Initiated Stocklist");
    // setActiveStockList(stockData);
    // getHoldings();
    // getChartByType();
  }, []);

  useEffect(()=>{
    console.log("Location pathname change Detected - Stocklist");
    // loadSessionStorage();
    getChartByType();
  }, [location.pathname]);


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

  const navigate_to_stock_page = (stock_name, stock_id, stockTokenGlobal) => {
    console.log("Clicked navigate_to_stock_page");
    console.log(stock_name, stock_id, stockTokenGlobal);
    navigate('/dynamic-chart', {state: {stock_name: stock_name, stock_id: stock_id, stockTokenGlobal: stockTokenGlobal, activeUserInfo: activeUserInfo, chartFrequency: chartFreqSet[currentFreqSet].chartFrequency, chartFromDate :chartFreqSet[currentFreqSet].chartFromDate, chartToDate: chartFreqSet[currentFreqSet].chartToDate}});
  }

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
              <td><ChartScreenDynamic stock_name={stockItem["symbol"]} stock_id={stockItem["instrument_token"]} stockTokenGlobal={stockTokenGlobal} activeUserInfo={activeUserInfo} chartFrequency={chartFreqSet[currentFreqSet].chartFrequency} chartFromDate={chartFreqSet[currentFreqSet].chartFromDate} chartToDate={chartFreqSet[currentFreqSet].chartToDate} loadPrediction={false}/></td>
              <td><RiShareForwardFill onClick={(evnt)=>navigate_to_stock_page(stockItem["symbol"], stockItem["instrument_token"], stockTokenGlobal)}/></td>
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
    console.log("querying Stock holdings");
    
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
          console.log(stocks.length);
          

          if (Object.prototype.toString.call(stocks) === '[object Array]' && stocks !== null){
            console.log("Found stocks");
            setStockData([]);
            setActiveStockList([]);

            setStockData(stocks);
            setActiveStockList(filterStocksOnCondition(stocks, qtyFilter, amtFilter));
            console.log(activeStockList.length);
          }
          else{
            console.log("Stocks not found!");
          }
          // setActiveStockList(stocks);
          console.log(stockData.length);
          // console.log(getStockArrayToObject(stocks));
        });
    }

    const getPositions = () => {
      // event.preventDefault();
      console.log("querying Stock Positions");
      
      var queryUrl = `${baseUrl}/positions`
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

            if (Object.prototype.toString.call(stocks) === '[object Array]' && stocks !== null){
              console.log("Found stocks");
              setStockData([]);
              setActiveStockList([]);
              
              // setStockData(stocks);
              setActiveStockList(filterStocksOnCondition(stocks, qtyFilter, amtFilter));
              console.log(activeStockList.length);
            }
            else{
              console.log("Stocks not found!");
            }
            // setActiveStockList(stocks);
            console.log(stockData.length);
            // console.log(getStockArrayToObject(stocks));
          });
      }
      const getMergedStocks = () => {
        // event.preventDefault();
        console.log("querying merged stocks");
        
        var queryUrl = `${baseUrl}/merged-stocks`
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
              if (Object.prototype.toString.call(stocks) === '[object Array]' && stocks !== null){
                console.log("Found stocks");
                // setStockData([]);
                setActiveStockList([]);

                setStockData(stocks);
                setActiveStockList(filterStocksOnCondition(stocks, qtyFilter, amtFilter));
                console.log(activeStockList.length);
              }
              else{
                console.log("Stocks not found!");
              }
              // setActiveStockList(stocks);
              // console.log(getStockArrayToObject(stocks));
            });
        }
  
  const fetchCurrentFreqSet = (chartItem) => {
    setCurrentFreqSet(chartItem);
    setActiveStockList([]);
    getHoldings();
  }

  const freqSet = () => {
    console.log("Calling freqSet()");
    console.log(Object.keys(chartFreqSet));
      return <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            {Object.keys(chartFreqSet).map((chartItem, idx) => (
              <li class="nav-item">
                <a class={'nav-link' + (currentFreqSet==chartItem ? ' active' : '')} 
                style={{color: (currentFreqSet==chartItem ? 'green' : 'grey'), textDecoration: (currentFreqSet==chartItem ? 'underline' : 'none')}}
                onClick={()=>fetchCurrentFreqSet(chartItem)}>{chartItem}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  }

  const filterStocksOnCondition = (stocks, qty_item, amt_item) => {
    // console.log(qty_item, amt_item);

    // console.log(Object.prototype.toString.call(variable) === '[object Array]');
    // var arr1 = [
    //   {"name": "abc", "cde": "abd"}
    // ]
    // console.log(Object.prototype.toString.call(arr1));

    // var obj1 = {"name": "abc", "cde": "abd"};
    // console.log(Object.prototype.toString.call(obj1));
    
    // if (stockData.length == 0)
    
    let filteredStocks = stocks.filter((stockItem) => {
      console.log(stockItem);
      let eligible = true;
      if (qty_item == "Greater than 1"){
        eligible = eligible & (stockItem.quantity > 1) ? true: false;
        // console.log("Greater than 1", eligible);
      }
      else{
        eligible = eligible & true;
        // console.log("QTY Else", eligible);
      }
      //"Greater than 10k", "Lesser than 10k"
      if (amt_item == "Greater than 1k"){
        eligible = eligible & (stockItem.total_price > 1000) ? true: false;
        // console.log("Greater than 1k", eligible);
      }
      else if (amt_item == "Greater than 10k"){
        eligible = eligible & (stockItem.total_price > 10000) ? true: false;
        // console.log("Greater than 10k", eligible);
      }
      else if (amt_item == "Lesser than 10k"){
        eligible = eligible & (stockItem.total_price <= 10000) ? true: false;
        // console.log("Lesser than 10k", eligible);
      }
      else {
        eligible = eligible & true;
        // console.log("Amt Else", eligible);
      }
      return eligible;
    });
    // console.log("filteredStocks");
    // console.log(filteredStocks);
    return filteredStocks;
  }

  const filterStockQty = (qty_item, amt_item) => {
    console.log("filterStockQty() called");
    if (qtyFilter == qty_item){
      setQtyFilter("");
    }
    else{
      setQtyFilter(qty_item);
    }
    setActiveStockList(filterStocksOnCondition(qty_item, amt_item));
  }

  const filterStockAmount = (qty_item, amt_item) => {
    console.log("filterStockAmount() called");
    if (amtFilter == amt_item){
      setAmtFilter("");
    }
    else{
      setAmtFilter(amt_item);
    }
    setActiveStockList(filterStocksOnCondition(qty_item, amt_item));
  }

  const filters = () => {
      return <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Quantity
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                {stockQtyFilter.map((qty_item)=>(
                  <li><a class={"dropdown-item" + (qty_item == qtyFilter ? " active": "")} onClick={()=>{filterStockQty(qty_item, amtFilter)}}>{qty_item}</a></li>
                ))}
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Amount
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                {stockAmountFilter.map((amt_item) => (
                    <li><a class={"dropdown-item" + (amt_item == amtFilter ? " active": "")} onClick={()=>filterStockAmount(qtyFilter, amt_item)}>{amt_item}</a></li>
                )
              )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  }
  const getChartByType = () => {
    if (givenListType == listType.HOLDINGS){
      console.log("Fetching Holdings");
      getHoldings();
    }
    else if (givenListType == listType.POSITIONS){
      console.log("Fetching Positions");
      getPositions();
    }
    else if (givenListType == listType.MERGED){
      console.log("Fetching Merged Stocks");
      getMergedStocks();
    }
  }

  return (
    <div class="col-md-auto">
      <div class="row">
      <div class="col-md-3">
      <a onClick={(event)=>getChartByType()}>HOLDING REFRESH <IoRefreshSharp/></a>
      </div>
      <div class="col-md-3">
        {filters()}
      </div>
      <div class="col-md-6">
        {freqSet()}
      </div>
      </div>
      <div class="row">
        {showStockList()}
      </div>
    </div>
  )
}

export default StockList;