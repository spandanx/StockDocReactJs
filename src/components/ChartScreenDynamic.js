// import React, {useState, useEffect} from 'react';
import React, { useState, useEffect, useRef } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import 'react-toastify/dist/ReactToastify.css';
import { IoRefreshSharp } from "react-icons/io5";
// import sellsound from '../data/mixkit-bell-notification-933.wav'
// import buysound from '../data/mixkit-clear-announce-tones-2861.wav'
// import { getSuddenSell, getSuddenBuy, getHeavyBuy, getHeavySell, getSuddenPercentageHike, getSuddenPercentageFall } from '../utilities/UTIL';

const ChartScreenDynamic = ({stock_name, stock_id, stockTokenGlobal}) => {


  const [stockStockPromptScreenX, setStockStockPromptScreenX] = useState(100);
  const [stockStockPromptScreenY, setStockStockPromptScreenY] = useState(200);

  const [clickedStock, setClickedStock] = useState({});

  const [stockData, setStockData] = useState({
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'pink'
    },
    {
      label: '# of Votes',
      data: [6, 6, 6, 6, 6, 6],
      borderColor: 'blue'
    }
  ]
  });

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

  const baseUrl = "http://127.0.0.1:8000"

  useEffect(() => {
    // getStockList();
    console.log("Initiated");
    getChartData();
  }, []);

  const convertDataToChart = (chart_data_raw) => {
    console.log("Converting Stocks");
    var chartData = 
    {
      labels: chart_data_raw.map((stHist)=>(stHist.timestamp.split("T"))),
      datasets: [
        {
          id:"A",
          label:'buy_qty',
          backgroundColor: 'palegreen',
          borderColor: 'olivedrab',
          data:chart_data_raw.map((stHist)=>stHist.close),
        },
        // {
        //   id:"B",
        //   label:'sell_qty',
        //   backgroundColor: 'darkred',
        //   borderColor: 'firebrick',
        //   data:chart_data_raw.map((stHist)=>stHist.low),
        // },

      ]
    }
    console.log(chartData);
    return chartData;

  }

  const getChartData = () => {
    // event.preventDefault();
    console.log("querying Stocks");
    
    let queryParams = {stock_id:stock_id, frequency:"30minute", from_date:"2024-11-25", to_date:"2025-01-24", user_id: "CCN088", oi: "1"}
    var queryUrl = `${baseUrl}/chart/?stock_id=${queryParams.stock_id}&frequency=${queryParams.frequency}&from_date=${queryParams.from_date}&to_date=${queryParams.to_date}&user_id=${queryParams.user_id}&oi=${queryParams.oi}`
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl, {
      method: 'get',
      headers: {'stock_authorization': stockTokenGlobal}
    })
        .then(response => response.json())
        .then(stocks => {
          // setStocks(stocks);
          console.log("stocks - ");
          console.log(stocks);
          console.log(stockData.length);
          setStockData(convertDataToChart(stocks));
          console.log(stockData.length);
          // console.log(getStockArrayToObject(stocks));
        });
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
        <IoRefreshSharp onClick={(event) => getChartData(event)}/>
        {(Object.keys(stockData).length>0)? 
        <Chart type='line' data={stockData} 

        options={{
          onClick: (e) => clicked2(e, true),
          plugins: {
            title: {
              display: true,
              text: stock_name
            }
          }
        }}
        /> :
        <p>Not Found {Object.keys(stockData).length}</p>
        
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