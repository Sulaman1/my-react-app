import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function MostIssuedItemsChart(props) {

  const mostIssuedItem  = props.counter;
  const newNumber = mostIssuedItem?.number?.split(',')?.slice(0,-1) || []
  const number = [];

  for (const i in newNumber) {
    number.push(parseInt(newNumber[i]));
  }


  // //for color
  const dataNew = mostIssuedItem?.number?.split(',') || []

  const theColor = [];

  for (const i in dataNew) {
    if (dataNew[i] <= 10) { theColor.push('#055C9D') }
    else if (dataNew[i] > 10 && dataNew[i] <= 30) { theColor.push('#018f94') }
    else if (dataNew[i] > 30 && dataNew[i] <= 50) { theColor.push('orange') }
    else if (dataNew[i] > 50 && dataNew[i] <= 100) { theColor.push('#FF1654') }
    else if (dataNew[i] > 100) { theColor.push('red') }
  }
  //for color


  const options = {
    chart: {
      responsive: true,
      height: '490px',
      renderTo: 'container',
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 1,
        beta: 3,
        depth: 50,
        viewDistance: 20
      },
    },
    credits: false,
    xAxis: {
      labels: {
        y: 30,
        align: 'center',
        rotation: -25,
        style: {
          fontWeight: 'bold',
          fontSize: '16px',
        }
      },
      categories: mostIssuedItem?.name?.split(',') || [],
    },
    yAxis: {
      title: {
        enabled: false
      }
    },
    tooltip: {
      backgroundColor: {
        linearGradient: [0, 0, 0, 60],
        stops: [
          [0, '#FFFFFF'],
          [1, '#E0E0E0']
        ],
      },
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: {point.y}  {point.stackTotal}',
    },
    title: false,

    legend: {
      enabled: false
    },
    plotOptions: {
      series: {

        states: {
          inactive: {
            opacity: 2
          }
        }
      },
      column: {
        colorByPoint: true,

        animation: {
          defer: 2000
        },
        size: '100%',
        dataLabels: {
          enabled: true,
          y: -8,
          style: {
            fontSize: '13px',
          }
        },
        depth: 40
      }
    },
    series: [
      {
        colors: [
          '#424B54',
          '#93A8AC',
          '#E2B4BD',
          '#9B6A6C',
          '#4E5166',
          '#7C90A0',
          '#B5AA9D',
          '#B9B7A7',
          '#747274',
          '#5F5AA2',
        ],

        name: 'Number Of Items',
        data: number,
        colors: theColor,

      },

    ]

  }

  return (
    <>
      <div style={{ width: "auto", height: "450px" }} >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}

        />
      </div>
    </>);
}