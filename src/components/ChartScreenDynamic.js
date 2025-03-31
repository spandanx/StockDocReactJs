// import React, {useState, useEffect} from 'react';
import React, { useState, useEffect, useRef } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import 'react-toastify/dist/ReactToastify.css';
import { IoRefreshSharp } from "react-icons/io5";
import { RiSettings4Fill } from "react-icons/ri";
import { MdRefresh } from "react-icons/md";

import { useLocation } from 'react-router-dom';
import { baseUrl, sftpBaseLocation, predictionFileListEndpoint, predictionEndpoint, chartDefaultUser, stockRefreshFrequency } from '../common/Properties';

import '../styles/PredictionSelection.css'
// import sellsound from '../data/mixkit-bell-notification-933.wav'
// import buysound from '../data/mixkit-clear-announce-tones-2861.wav'
// import { getSuddenSell, getSuddenBuy, getHeavyBuy, getHeavySell, getSuddenPercentageHike, getSuddenPercentageFall } from '../utilities/UTIL';

const ChartScreenDynamic = ({stock_name, stock_id, stockTokenGlobal, activeUserInfo, chartFrequency, chartFromDate, chartToDate, loadPrediction}) => {


  const [stockStockPromptScreenX, setStockStockPromptScreenX] = useState(100);
  const [stockStockPromptScreenY, setStockStockPromptScreenY] = useState(200);

  const [clickedStock, setClickedStock] = useState({});

  const location = useLocation();

  const [currentStockName, setCurrentStockName] = useState();
  const [currentStockId, setCurrentStockId] = useState();
  const [currentStockTokenGlobal, setCurrentStockTokenGlobal] = useState();
  
  const [predictionFileList, setPredictionFileList] = useState([]);
  const [selectedCurrentPredictionFile, setSelectedCurrentPredictionFile] = useState();
  const [predictionData, setPredictionData] = useState([]);

  const [stockDataRaw, setStockDataRaw] = useState([]);
  // const [stockData, setStockData] = useState({
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //   datasets: [{
  //     label: '# of Votes',
  //     data: [12, 19, 3, 5, 2, 3],
  //     borderColor: 'pink'
  //   },
  //   {
  //     label: '# of Votes',
  //     data: [6, 6, 6, 6, 6, 6],
  //     borderColor: 'blue'
  //   }
  // ]
  // });
const [stockData, setStockData] = useState(
  {});

  const stockOptions = {
    plugins: {
      annotation: {
        annotations: {
          line: {
            type: 'line',
            yMin: 16,
            yMax: 16,
            borderWidth: 2,
            borderColor: 'red'
          }
        }
      }
    }
  }


  useEffect(() => {
    // getStockList();
    console.log("Initiated Dynmaic Stock Page");
    console.log(stock_name, stock_id, stockTokenGlobal);
    console.log("Location Data");
    console.log("FROM UseState");
    
    // console.log(currentStockName, currentStockId, currentStockTokenGlobal);
    
    console.log(location);
    console.log("activeUserInfo");
    console.log(activeUserInfo);
    
    // setCurrentStockName(location.state?.stock_name != null ? );
    if (location.state != null){
      console.log("Found FROM location");
      if (location.state.stock_name != null){
        setCurrentStockName(location.state.stock_name);
      }
      if (location.state.stock_id != null){
        setCurrentStockId(location.state.stock_id);
      }
      if (location.state.stockTokenGlobal != null){
        setCurrentStockTokenGlobal(location.state.stockTokenGlobal);
      }
      // chartFrequency: chartFreqSet[currentFreqSet].chartFrequency, chartFromDate :chartFreqSet[currentFreqSet].chartFromDate, chartToDate: chartFreqSet[currentFreqSet].chartToDate
      console.log("Location", currentStockName, currentStockId, currentStockTokenGlobal);
    }
    else{
      console.log("Found from params");
      setCurrentStockName(stock_name);
      setCurrentStockId(stock_id);
      setCurrentStockTokenGlobal(stockTokenGlobal);
      console.log("Setting from params", stock_name, stock_id, stockTokenGlobal);
      console.log("Params", currentStockName, currentStockId, currentStockTokenGlobal);
    }
    
    getChartData();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Refresh every 2 minutes ', getCurrentStockName());
      getChartData();
    }, stockRefreshFrequency);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  const convertDataToChartWithPrediction = (stockData, predictionData) => {
    // console.log("Called convertDataToChartWithPrediction()");
    // console.log("StockData");
    // console.log(stockData);
    // console.log("predictionData");
    // console.log(predictionData);
    
    
    // let pred_data_formatted = predictionData.map((stData) => ({ x: stData.date, y: stData.predicted }));
    let prediction_labels = predictionData.map((stHist)=>stHist.date);
    let historical_labels = stockData.map((stHist)=>stHist.timestamp.split("T")[0]);
    let merged_label_set  = new Set([...historical_labels, ...prediction_labels] );
    // Convet the set beack to array 
    let all_labels = [...merged_label_set];
    // console.log("all_labels");
    // console.log(all_labels);
    let chart_data_with_prediction = {
      labels: all_labels,
      datasets: [{
        label: 'Prediction',
        data: predictionData.map((stHist) => ({ x: stHist.date, y: stHist.predicted })),
        borderColor: 'red'
      },
      {
        label: 'Historical',
        data: stockData.map((stHist) => ({ x: stHist.timestamp.split("T")[0], y: stHist.open })),
        borderColor: 'olivedrab',
        backgroundColor: 'palegreen'
      }
    ]
    }
    // console.log("chart_data_with_prediction");
    // console.log(chart_data_with_prediction);
    return chart_data_with_prediction;
  }

  const getTimeFromString = (dateString) => {
    let tm = dateString.split('T')[1].split('+')[0].split(':').slice(0, 2).join(':');
    let dt = dateString.split('T')[0];
    if (tm == "09:15"){
      return dt + " " + tm;
    }
    return tm;
  }

  const convertDataToChart = (chart_data_raw) => {
    console.log("Called convertDataToChart()", chart_data_raw);
    if (chart_data_raw == null || chart_data_raw == undefined || Object.prototype.toString.call(chart_data_raw) != '[object Array]'){
      console.log("Invalid chart_data_raw");
      return
    }
    
    //
    let historical_labels = chart_data_raw.map((stHist)=>stHist.timestamp.split("T")[0]);
    if (chartFrequency != "day"){
      console.log("Frequency is not day");
      historical_labels = chart_data_raw.map((stHist)=>getTimeFromString(stHist.timestamp));
      // historical_labels = chart_data_raw.map((stHist)=>stHist.timestamp);
    }
    else{
      console.log("Frequency is day");
    }
    //

    console.log("Converting Stocks");
    var chartData = 
    {
      labels: historical_labels,
      datasets: [
        {
          id:"A",
          label:'open',
          backgroundColor: 'palegreen',
          borderColor: 'olivedrab',
          data:chart_data_raw.map((stHist)=>stHist.open),
        }
      ]
    }
    // console.log(chartData);
    return chartData;

  }

  const getCurrentStockId = () => {
    if (location.state?.stock_id != null && location.state?.stock_id != undefined){
      return location.state.stock_id;
    }
    else if (currentStockId != null && currentStockId != undefined){
      return currentStockId
    }
    else if (stock_id != null && stock_id != undefined) {
      return stock_id
    }
    return ""
  }

  const getCurrentStockChartInfo = () => {
    // chartFrequency: chartFreqSet[currentFreqSet].chartFrequency, chartFromDate :chartFreqSet[currentFreqSet].chartFromDate, chartToDate: chartFreqSet[currentFreqSet].chartToDate
    if (location.state?.chartFrequency != null && location.state?.chartFrequency != undefined){
      return {chartFrequency: location.state.chartFrequency, chartFromDate: location.state.chartFromDate, chartToDate: location.state.chartToDate};
    }
    else {
      return {chartFrequency: chartFrequency, chartFromDate: chartFromDate, chartToDate: chartToDate};
    }
  }

  const getCurrentStockName = () => {
    if (location.state?.stock_name != null && location.state?.stock_name != undefined){
      return location.state.stock_name;
    }
    else if (currentStockName != null && currentStockName != undefined){
      return currentStockName
    }
    else if (stock_name != null && stock_name != undefined) {
      return stock_name
    }
    return ""
  }

  const getChartData = () => {
    // event.preventDefault();
    console.log("querying Stocks");
    let chartinfo = getCurrentStockChartInfo();
    let queryParams = {stock_id:getCurrentStockId(), frequency:chartinfo.chartFrequency, from_date:chartinfo.chartFromDate, to_date:chartinfo.chartToDate, user_id: (activeUserInfo && activeUserInfo.stock_username)? activeUserInfo.stock_username.trim() : "", oi: "1"}
    var queryUrl = `${baseUrl}/chart/?stock_id=${queryParams.stock_id}&frequency=${queryParams.frequency}&from_date=${queryParams.from_date}&to_date=${queryParams.to_date}&user_id=${queryParams.user_id}&oi=${queryParams.oi}`
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl, {
      method: 'get',
      headers: {'stock_authorization': (currentStockTokenGlobal != undefined? currentStockTokenGlobal: stockTokenGlobal)}
    })
        .then(response => response.json())
        .then(stocks => {
          // setStocks(stocks);
          console.log("stocks - ");
          console.log(stocks);
          // console.log(stockData.length);
          setStockDataRaw(stocks);
          setStockData(convertDataToChart(stocks));
          // console.log(stockData.length);
          // console.log(getStockArrayToObject(stocks));
        });
  }

  const displayPredictionDay = (full_path) => {
    if (full_path == undefined || full_path == null){
      return "";
    }
    console.log("Calling displayPredictionDay()");
    let full_path_splitted = full_path.split('/');
    console.log("full_path_splitted", full_path_splitted);
    let prediction_day_full = full_path.split('/')[full_path_splitted.length-1];
    console.log("prediction_day_full", prediction_day_full);
    let prediction_day_splitted = prediction_day_full.split("_");
    console.log("prediction_day_splitted", prediction_day_splitted);
    let prediction_day = prediction_day_splitted[0];
    console.log("prediction_day", prediction_day);
    // console.log(prediction_day);
    
    return prediction_day;
  }

  const getAvailablePredictionList = () => {
    // event.preventDefault();
    console.log("querying Stocks");
    var queryUrl = `${predictionFileListEndpoint}/?folder_path=${sftpBaseLocation + (currentStockName != undefined? currentStockName:stock_name) + '/predictions/'}`
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl, {
      method: 'get',
      headers: {'stock_authorization': (currentStockTokenGlobal != undefined? currentStockTokenGlobal: stockTokenGlobal)}
    })
        .then(response => response.json())
        .then(pred_list => {
          console.log("pred_list - ");
          console.log(pred_list);
          setPredictionFileList(pred_list);
          // console.log(getStockArrayToObject(stocks));
        });
  }

  const getPredictionData = () => {
    // event.preventDefault();
    console.log("querying Stocks");
    var queryUrl = `${predictionEndpoint}/?file_path=${selectedCurrentPredictionFile}`
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl, {
      method: 'get',
      headers: {'stock_authorization': (currentStockTokenGlobal != undefined? currentStockTokenGlobal: stockTokenGlobal)}
    })
        .then(response => response.json())
        .then(prediction => {
          // setStocks(stocks);
          console.log("prediction - ");
          console.log(prediction);
          // console.log();
          
          setPredictionData(prediction);
          setStockData(convertDataToChartWithPrediction(stockDataRaw, prediction));
          // setPredictionFileList(pred_list);
          // console.log(getStockArrayToObject(stocks));
        });
  }

  const predictionDropDown = () => {
    return (
      <div class="dropdown">
        <p>Load Predictions <IoRefreshSharp onClick={(event) => getAvailablePredictionList(event)}/></p>
        <p>Prediction List 
          <a data-mdb-button-init
            data-mdb-ripple-init data-mdb-dropdown-init class="btn dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-mdb-toggle="dropdown"
            aria-expanded="false">
          </a>
        </p>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <div class="dropdown mx-3">
              <button data-mdb-button-init
                data-mdb-ripple-init data-mdb-dropdown-init class="btn dropdown-toggle"
                type="button"
                id="dropdownMenuPredictionButton"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >{displayPredictionDay(selectedCurrentPredictionFile)}</button>
              <button data-mdb-button-init data-mdb-dropdown-init class="btn"
                type="button"
                aria-expanded="false"
                onClick={()=>getPredictionData()}
                disabled={selectedCurrentPredictionFile==undefined || selectedCurrentPredictionFile==null}
              >Show Prediction</button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuPredictionButton">
                  {(predictionFileList!=undefined && predictionFileList!=null && Object.prototype.toString.call(predictionFileList) == '[object Array]') ? predictionFileList.map((predFile) => 
                  <li><a class="dropdown-item" style={{"backgroundColor": predFile==selectedCurrentPredictionFile ? "green":""}} onClick={()=>setSelectedCurrentPredictionFile(predFile)}>{displayPredictionDay(predFile)}</a></li>
                  ) : <></>}
              </ul>
            </div>
          </li>
          {/* <li><a class="dropdown-item">Select Summary Model <MdRefresh style={{ color: "black"}} onClick={()=>initializeMLModels()}/></a></li> */}
        </ul>
      </div>
    )
  }
  

  function clicked2(evnt, stock_price_multiple_0_05){
    // console.log(evnt);
    console.log("function inline_click called");
    setStockStockPromptScreenX(evnt.native.x);
    setStockStockPromptScreenY(evnt.native.y);
    // console.log("ScreenX", stockStockPromptScreenX, "ScreenY", stockStockPromptScreenY);
    // console.log(evnt.native.screenX);
    // console.log("x", evnt.x, "y", evnt.y);
    // console.log(evnt.chart.chartArea);
    // left: 43.20703125, top: 66.4, right: 1096.79296875, bottom: 527.2, height: 460.8
    if (evnt.chart.chartArea.left <= evnt.x && evnt.x <= evnt.chart.chartArea.right && evnt.chart.chartArea.top <= evnt.y && evnt.y <= evnt.chart.chartArea.bottom){
      console.log("Inside chart area");
      let offset_y = evnt.chart.chartArea.bottom - evnt.y;
      let chart_pixel_height_percentage = evnt.chart.chartArea.height;
      // console.log("offset_y", offset_y);
      // console.log("chart_pixel_height_percentage", chart_pixel_height_percentage);
      let stock_price_value_range = evnt.chart.scales.y._valueRange;
      let stock_price_to_pixel_ratio = stock_price_value_range/chart_pixel_height_percentage;
      // console.log("stock_price_value_range", stock_price_value_range);
      let clicked_stock_price_exact = ((stock_price_to_pixel_ratio * offset_y) + evnt.chart.scales.y.min).toFixed(2);
      if (stock_price_multiple_0_05){
        let multiple_of_0_05 = Math.floor(clicked_stock_price_exact/0.05);
        clicked_stock_price_exact = (multiple_of_0_05*0.05).toFixed(2);
      }
      console.log(clicked_stock_price_exact);
      setClickedStock({"selected_price": clicked_stock_price_exact});
      
    }
    else{
      console.log("Outside");
    }
  };


  return (
    <div class="col-md-auto">
      <div class="row">
        {/* {console.log(getChartSize)} */}
        {/* chart.split(':')[1] */}
        {loadPrediction && <p>Reload Chart <IoRefreshSharp onClick={(event) => getChartData(event)}/></p>}
        {loadPrediction && predictionDropDown()}
        {(stockData != null && stockData!= undefined && Object.keys(stockData).length>0)? 
        <Chart type='line' data={stockData} 

        options={{
          onClick: (e) => clicked2(e, true),
          plugins: {
            title: {
              display: true,
              text: getCurrentStockName()
            }
          }
        }}
        /> :
        <p>Not Found {stockData != null && stockData!= undefined && Object.keys(stockData).length}</p>
        
        }
        </div>
        {(Object.keys(clickedStock).length>0)? 
          <div style={{position: 'absolute', left: stockStockPromptScreenX, top: stockStockPromptScreenY}}>{clickedStock.selected_price}</div>
          : <></>
        }
      </div>
  )
}

export default ChartScreenDynamic;