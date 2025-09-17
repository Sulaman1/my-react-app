import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highcharts3d from 'highcharts/highcharts-3d';
highcharts3d(Highcharts);

export function UtiChart(props) {
  const total = props.prisonerStats;

  const options = {
    chart: {
      margin: [0, 0, 0, 0],
      spacingTop: 0,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      type: 'pie',
    },
    credits: false,
    title: false,
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
      itemStyle: { color: 'black', fontWeight: '400', fontFamily: 'teragon-sans' },
    },
    plotOptions: {
      series: {
        states: {
          inactive: {
            opacity: 5,
          },
        },
      },
      pie: {
        size: '95%',
        innerSize: '70%',
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 0,
        dataLabels: {
            enabled: true,
            distance: -80,
            format: '<b>{point.name}</b>: ({point.y}) <br/>   {point.percentage:.1f} % ',
             style: {
            color: 'black',
            borderColor: 'black',
            fontSize: '13px', 
          },
        },
        showInLegend: true,
        connectorWidth: 10,

      },
    },
    xAxis: {
      categories: ['Convicted', 'UTP'],
    },
    series: [
      {
        type: 'pie',
        name: 'Total',
        colors: ['#3577f1', '#F45B5B'],
        data: [
          ['UTP', total?.totalUTP],
          ['Convicted', total?.totalConvicted],
        ],
      },
    ],
  };

  return (
    <>
      <div style={{ width: 'auto', height: '100%' }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </>
  );
}
