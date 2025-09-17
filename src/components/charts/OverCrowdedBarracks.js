import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
import { useSelector } from 'react-redux';
highcharts3d(Highcharts);
export function OverCrowdedBarracks(props) {

  const userMeta = useSelector((state) => state.user);
  const isIG = userMeta?.role === 'Inspector General Prisons';
  const isDIG = userMeta?.role === 'DIG Prisons';
  const isAdmin = userMeta?.role === "Super Admin";

  const barrackOverCrowding  = props.barrackStats;

  var barrack = barrackOverCrowding?.currentPopulationOv?.split(',').slice(0, -1) || []
  var cPopulation = [];

  for (var i in barrack) {
    cPopulation.push(parseInt(barrack[i]));
  }
  var newData = barrackOverCrowding?.totalPopulationOv?.split(',').slice(0, -1) || []
  var tPopulation = [];

  for (var i in newData) {
    tPopulation.push(parseInt(newData[i]));
  }

  var prisonNames = barrackOverCrowding?.prisonNameOv?.split(',') || [];
  const noDataAvailable = !barrackOverCrowding?.barrackNameOv || !barrackOverCrowding?.barrackNameOv;
  const options = {
    chart: {
      responsive: true,
      height: '550px',
      renderTo: 'container',
      type: 'column',

    },
    credits: false,
    xAxis: {
      labels: {
        y: 55,
        align: 'center',
        rotation: -25,
        style: {
          fontWeight: 'bold',
          fontSize: '14px',
        }
      },
      categories: barrackOverCrowding?.barrackNameOv?.split(',').slice(0, -1) || [],
    },
    yAxis: {
      title: {
        enabled: false,
      },
      labels: {
        enabled: false
      }
    },
    tooltip: {
      formatter: function () {
        var prisonIndex = this.points[0]?.point?.index;
        if (prisonIndex === undefined || prisonNames[prisonIndex] === undefined) {
          return 'No data available';

        }
        else if (isIG || isDIG || isAdmin) {
          return ' <b>Barrack Name</b>: ' + this.x + '<br>' + ' <b>Prison</b>: ' + prisonNames[prisonIndex] + '<br>' + '<b>Current Population</b> : ' + this.points[0]?.y + '<br> <b>Capacity</b> :' + this.points[1]?.y;
        }
        else {
          return ' <b>Barrack Name</b>: ' + this.x + '<br>' + '<b>Capacity</b> : ' + this.points[0]?.y + '<br> <b>Current Population</b> :' + this.points[1]?.y;
        }
      },
      shared: true,
      backgroundColor: {
        linearGradient: [80, 10, 10, 80],
        stops: [
          [0, '#FFFFFF'],
          [1, '#E0E0E0']
        ],
      },
      headerFormat: `<b>{point.key}</b><br><br>`,
      pointFormat: `<span style="color:{point.color}">\u25CF</span> {series.name}: {point.y}`

    },
    title: false,

    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'top',
      itemStyle: { fontWeight: "400" }
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

        animation: {
          defer: 2000
        },
        size: '100%',

        depth: 40,
      }
    },

    series: [


      {
        // pointWidth: 80,

        data: cPopulation,
        dataLabels: {
          enabled: true,
          inside: false,
          style: {
            fontSize: '13px',
          }
        },
        borderColor: '#E71D36',
        // stacking: 'normal',
        color: '#E71D36',
        showInLegend: true,
        name: 'Current Population',

      },
      {
        data: tPopulation,
        dataLabels: {
          inside: true,
          enabled: true,
          style: {
            fontSize: '13px',
          }
        },
        // stacking: 'normal',
        color: '#D3D3D3',
        showInLegend: true,
        name: 'Capacity',

      },
    ]

  }

  return (
    <>
    {noDataAvailable ? (
      <h1 className='mt-5 mt-5 mx-5'>No overcrowded barracks</h1>
    ) : (
      <div style={{ width: "100%", height: "500px" }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    )}
  </>);
}