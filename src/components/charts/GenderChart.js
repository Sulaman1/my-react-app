import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function GenderChart(props) {



    const total = props?.speacialStats;
    const options = {
        chart: {
            responsive: true,
            height: '435px',
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
            categories: total?.genders?.map(item => item.name) || [],
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
            pointFormat: '<span style="color:{point.color}">\u25CF</span>{point.y}  {point.stackTotal}',
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
                borderColor: '#808080',

                pointWidth: 60,
                borderRadius: 5,
                colors: [
                    '#FFB6C1',
                    '#D3D3D3',
                    '#EC7063',
                    '#F5CBA7',
                    '#018f94',
                    '#ea9207',
                ],
                data: total?.genders?.map(item => item.count),
                colorByPoint: true
            },

        ]

    }

    return (
        <>
            <div style={{ width: "100%", height: "430px" }} >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}

                />
            </div>
        </>);
}