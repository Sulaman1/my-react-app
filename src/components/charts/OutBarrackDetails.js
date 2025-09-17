import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
// export function OutBarrackDetails(props) {
const outOfBarrackDetails = React.memo(props => {


    const checkOutDetails = props?.outOfBDetails;
    var newData = checkOutDetails?.outOfBarrackDetailsData?.split(',') || []
    var prisoners = [];

    for (const i in newData) {
        prisoners.push(parseInt(newData[i]));
    }

    const options = {
        chart: {
            responsive: true,
            height: '500px',
            renderTo: 'container',
            type: 'column',
        },
        credits: false,
        xAxis: {
            labels: {
                y: 50,
                align: 'center',

                style: {
                    fontWeight: 'bold',
                    fontSize: '14px',
                }
            },
            categories: checkOutDetails?.outOfBarrackDetailsLabels?.split(',') || [],
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
                size: '100%',
                dataLabels: {
                    enabled: true,
                    y: 40,
                    color: 'white',
                    borderColor: '#AAA',
                    style: {

                        fontSize: '17px',
                    },

                },
                depth: 40
            }
        },
        series: [
            {

                pointWidth: 40,
                borderRadius: 8,
                colors: [
                    '#f25241',
                    '#4279c5',
                    '#f2cf37',
                    '#f1963b',
                    '#018f94',
                    '#ea9207',
                ],

                name: 'Number Of prisoners',
                data: prisoners,
                colorByPoint: true
            },

        ]

    }

    return (
        <>
            <div style={{ width: "100%", height: "485px" }} >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}

                />
            </div>
        </>);
})
export default outOfBarrackDetails