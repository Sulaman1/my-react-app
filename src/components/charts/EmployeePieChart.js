import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function EmployeePieChart(props) {

    const total = props?.employeeStats;

    const options = {
        chart: {
            margin: [0, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0,
            }
        },
        credits: false,
        title: false,
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },

        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            itemStyle: { color: "black", fontWeight: "400", fontFamily: "teragon-sans" }
        },
        plotOptions: {
            series: {
                states: {
                    inactive: {
                        opacity: 5
                    }
                }
            },
            pie: {
                size: '95%',
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 50,
                dataLabels: {
                    distance: -65,
                    style: {
                        fontSize: '13px',
                        color: 'white',
                        borderColor: 'white',
                    },
                    enabled: true,
                    format: '<b>{point.name}</b>: ({point.y}) <br/>   {point.percentage:.1f} % '
                },
                showInLegend: true
            }
        },
        xAxis: {
            categories: ['Inside', 'Outside'],
        },
        series: [{
            type: 'pie',
            name: 'Total',
            colors: [
                '#0ab39c',
                '#4279c5'],
            data: [
                ['Inside', total?.totalInsidePrison],

                ['Outside', total?.totalOutsidePrison],


            ],
        }]
    }

    return (
        <>
            <div style={{ width: "auto", height: "100%" }} >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}

                />
            </div>
        </>);
}