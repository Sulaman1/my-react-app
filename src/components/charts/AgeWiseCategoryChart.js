import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function AgeWiseCategoryChart(props) {
  
  const ageWiseStats  = props.prisonerAgeCategoryWiseStats;
  const newAge = ageWiseStats?.noOfPrisoners?.split(',') || []
  const age = [];

  for (const i in newAge) {
    age.push(parseInt(newAge[i]));
  }


  // //for color
  const dataNew = ageWiseStats?.noOfPrisoners?.split(',') || []

  const theColor = [];

  for (const i in dataNew) {
    if (dataNew[i] <= 10) { theColor.push('#055C9D') }
    else if (dataNew[i] > 10 && dataNew[i] <= 30) { theColor.push('#018f94') }
    else if (dataNew[i] > 30 && dataNew[i] <= 50) { theColor.push('orange') }
    else if (dataNew[i] > 50 && dataNew[i] <= 100) { theColor.push('#FF1654') }
    else if (dataNew[i] > 100) { theColor.push('red') }
  }
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
      categories: ageWiseStats?.ageCategory?.split(',') || [],
      //  categories: ['1-10', '11-20','21-30','31-40','41-50','51-60','61-70']
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
        color: '018f94',
        name: 'Number of prisoners',
        data: age,
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

