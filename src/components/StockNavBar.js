// import React, {useState, useEffect} from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { IoRefreshSharp } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChartScreen from './ChartScreen';
// import { getSuddenSell, getSuddenBuy, getHeavyBuy, getHeavySell, getSuddenPercentageHike, getSuddenPercentageFall } from '../utilities/UTIL';

const StockNavBar = (props) => {
// class Stock extends React.Component {
 
    const [stocks, setStocks] = useState(props.stockList);
    // const [stockChartDataSell, setStockChartDataSell] = useState({});

    // const timerId = setInterval(() => {
    //   console.log('Someone Scheduled me to run every 3 minutes');
    // }, 3*1000*60);

//     useEffect(() => {
//       console.log("Stock List change detected");
//       setStocks(props.stockList);

//      return () => {
//         console.log("Stock List change done");
//      }
// }, [props])

  const refreshInterval = "3 minutes";
  

//   useEffect(() => {
//       let reload = 0

//       if(refreshInterval === 'one minute'){
//           reload = 60
//       } else if(refreshInterval === '3 minutes'){
//           reload = 180
//       }

//       if (!reload) {
//           return
//       }
//       const autoRefresh = setInterval(() => {
//         console.log('Someone Scheduled me to run every 3 minutes - NEW');
//         if (stocks.length>0){
//           console.log("stock data");
//           prepare_chart_data(stocks);
//         }
//         else if (props.stockList.length>0){
//           console.log("props data");
//           prepare_chart_data(props.stockList);
//         }
        
//       }, reload * 1000)

//      return () => {
//         clearInterval(autoRefresh)
//      }
// }, [refreshInterval])


  return (
        <div class="form-group row my-3 justify-content-between">
            <div class="col-md-4">
            </div>
            <div class="col-md-auto">
              STOCK REFRESH
              <IoRefreshSharp/>
              CHART REFRESH
              <IoRefreshSharp/>
            </div>
            <div class="col-md-4">
            </div>
        </div>
  )
}

export default StockNavBar;