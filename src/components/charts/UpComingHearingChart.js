import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function UpComingHearingChart(props) {
  

  const hearing = props.hearing;

  var hearings =  hearing?.courtHearings?.split(',') || []
  var newHearings = [];

  for (const i in hearings) {
      newHearings.push(parseInt(hearings[i]));
  }
  const options = {
    chart: {
      responsive: true,
      height: '290px',
      renderTo: 'container',
      type: 'bar',
    },
    credits: false,
    xAxis: {
      labels: {

        align: 'center',

        style: {
          fontWeight: 'bold',
          fontSize: '14px',
        }
      },
      categories: hearing?.courts?.split(',') || []
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
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.y}  {point.stackTotal}',
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
      bar: {
        colorByPoint: true,

        animation: {
          defer: 2000
        },

        dataLabels: {
          enabled: true,
          style: {

            fontSize: '13px',
          }
        },
        depth: 40
      }
    },
    series: [
      {
        pointWidth: 22,
        borderRadius: 7,
        colors: [
          '#f25241',
          '#4279c5',
          '#f2cf37',
          '#43903d',
          '#018f94',
          '#ea9207',
          '#ea9202',
        ],

        name: 'Number Of Hearings',
        data: newHearings,
        colorByPoint: true
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