import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function CountryWiseStatsChart(props) {

  const countryWiseStats  = props.countryWise;
  const newCountry = countryWiseStats?.numberOfPrisoner?.split(',') || []
  const country = [];

  for (const i in newCountry) {
    country.push(parseInt(newCountry[i]));
  }


  // //for color
  const dataNew = countryWiseStats?.numberOfPrisoner?.split(',') || []

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
      height: '450px',
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

        style: {
          fontWeight: 'bold',
          fontSize: '16px',
        }
      },
      categories: countryWiseStats?.countryName?.split(',') || []
    },
    yAxis: {
      title: {
        enabled: false,

      }
    },
    tooltip: {
      backgroundColor: {
        linearGradient: [80, 10, 10, 80],
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
        colors: theColor,
        name: 'Number of prisoners',
        data: country,
      },
    ]

  }

  return (
    <>
      <div style={{ width: "100%", height: "450px" }} >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}

        />
      </div>
    </>);
}