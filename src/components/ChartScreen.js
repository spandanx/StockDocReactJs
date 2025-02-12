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

const ChartScreen = (props) => {


  const [stockStockPromptScreenX, setStockStockPromptScreenX] = useState(100);
  const [stockStockPromptScreenY, setStockStockPromptScreenY] = useState(200);

  const [clickedStock, setClickedStock] = useState({});

  const [stockData, setStockData] = useState({
    "labels": [
        "2024-08-12",
        "2024-08-13",
        "2024-08-14",
        "2024-08-16",
        "2024-08-19",
        "2024-08-20",
        "2024-08-21",
        "2024-08-22"
    ],
    "datasets": [
        {
            "label": "Prediction",
            "data": [
                {
                    "x": "2024-08-12",
                    "y": 522.35
                },
                {
                    "x": "2024-08-13",
                    "y": 582.75
                },
                {
                    "x": "2024-08-14",
                    "y": 571.2
                },
                {
                    "x": "2024-08-16",
                    "y": 560.05
                }
            ],
            "borderColor": "red"
        },
        {
            "label": "Historical",
            "data": [
                {
                    "x": "2024-08-19",
                    "y": 581.2
                },
                {
                    "x": "2024-08-20",
                    "y": 575
                },
                {
                    "x": "2024-08-21",
                    "y": 560.05
                },
                {
                    "x": "2024-08-22",
                    "y": 573.65
                }
            ],
            "borderColor": "olivedrab",
            "backgroundColor": "palegreen"
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
  }, []);
  // const getChartSize = Math.ceil(12/(props.type.split(',')).length);

  // const chart_data_raw = [
  //   {
  //       "timestamp": "2024-05-01T00:00:00+05:30",
  //       "open": 97.45,
  //       "high": 110.45,
  //       "low": 90.4,
  //       "close": 107.25,
  //       "volume": 2774901941,
  //       "open_interest": 0
  //   },
  //   {
  //       "timestamp": "2024-04-01T00:00:00+05:30",
  //       "open": 90.65,
  //       "high": 96.7,
  //       "low": 86.85,
  //       "close": 96.2,
  //       "volume": 1192263416,
  //       "open_interest": 0
  //   },
  //   {
  //       "timestamp": "2024-03-01T00:00:00+05:30",
  //       "open": 89,
  //       "high": 95.5,
  //       "low": 73.6,
  //       "close": 89.7,
  //       "volume": 1783019663,
  //       "open_interest": 0
  //   }];
  // var chartData = 
  // {
  //   labels: chart_data_raw.map((stHist)=>(stHist.timestamp.split("T"))),
  //   datasets: [
  //     {
  //       id:"A",
  //       label:'buy_qty',
  //       backgroundColor: 'palegreen',
  //       borderColor: 'olivedrab',
  //       data:chart_data_raw.map((stHist)=>stHist.high),
  //     },
  //     {
  //       id:"B",
  //       label:'sell_sty',
  //       backgroundColor: 'darkred',
  //       borderColor: 'firebrick',
  //       data:chart_data_raw.map((stHist)=>stHist.low),
  //     }
  //   ]
  // }
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
          data:chart_data_raw.map((stHist)=>stHist.high),
        },
        {
          id:"B",
          label:'sell_qty',
          backgroundColor: 'darkred',
          borderColor: 'firebrick',
          data:chart_data_raw.map((stHist)=>stHist.low),
        },

      ]
    }
    console.log(chartData);
    return chartData;

  }

  const getStockList = () => {
    // event.preventDefault();
    console.log("querying Stocks");
    
    let queryParams = {stock_id:"1276417", frequency:"30minute", from_date:"2024-11-25", to_date:"2025-01-24", user_id: "CCN088", oi: "1"}
    var queryUrl = `${baseUrl}/chart/?stock_id=${queryParams.stock_id}&frequency=${queryParams.frequency}&from_date=${queryParams.from_date}&to_date=${queryParams.to_date}&user_id=${queryParams.user_id}&oi=${queryParams.oi}`
    console.log("url - ");
    console.log(queryUrl);
    fetch(queryUrl)
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

  // const onClickSvg = e => {
  //   const { farthestViewportElement: svgRoot } = e.target;
  //   const dim = svgRoot.getBoundingClientRect();
  //   const x = e.clientX - dim.left;
  //   const y = e.clientY - dim.top;
  //   console.log(`x: ${x}, y: ${y}`);
  // };
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
        STOCK REFRESH
        <IoRefreshSharp onClick={(event) => getStockList(event)}/>
        {(Object.keys(stockData).length>0)? 
        <Chart type='line' data={stockData} 
        // onClick={(event)=>{console.log("Clicked"); console.log(event);}}
        // onClick={(event)=>clicked(event)}
        // onClick={(event) => {
        //   console.log(event);
        //   // console.log(event.view.screen);
        //   console.log(event.pageX, event.clientX, event.screenX);
        //   // console.log(event);
        //   console.log(event.pageY, event.clientY, event.screenY);
        //   // console.log(event.target.clientTop, event.target.clientHeight, event.target.clientLeft, event.target.width, event.target.height);
        //   console.log(event.target.offsetHeight, event.target.offsetLeft, event.target.offsetTop, event.target.offsetWidth);
        //   // console.log("outerHeight", event.view.outerHeight);
        //   // console.log("outerWidth", event.view.outerWidth);
        //   // console.log("innerHeight", event.view.innerHeight);
        //   // console.log("innerWidth", event.view.innerWidth);
        //   // console.log("offsetY", event.nativeEvent.offsetY);
        //   console.log("offsetX", event.nativeEvent.offsetX);
        //   }
        // }
        options={{
          onClick: (e) => clicked2(e, true),
          plugins: {
            title: {
              display: true,
              text: "custom"
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

export default ChartScreen;