import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function PrisonerStatsChart(props) {

    const options = {
        chart: {
            responsive: true,
            height: '483px',
            renderTo: 'container',
            type: 'column',

        },
        credits: false,
        xAxis: {
            labels: {
                y: 33,
                align: 'center',
                // rotation: -25,
                style: {
                    fontWeight: 'bold',
                    fontSize: '14px',
                }
            },
            categories: ['Released', 'Bail', 'Expired', 'Total', 'Total', 'Total', 'Total', 'Total', 'Total', 'Total', 'Total', 'Total', 'Total'],
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
            column: {
                colorByPoint: true,

                animation: {
                    defer: 2000
                },
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
                borderRadius: 2,
                colors: [
                    '#f25241',
                    '#4279c5',
                    '#f2cf37',
                    '#43903d',
                    '#018f94',
                    '#ea9207',
                    '#ea9202',
                ],

                // name: 'Number Of Employees',
                data: [61, 23, 43, 45, 24, 36, 36, 36, 36, 36, 36, 36, 36],
                colorByPoint: true
            },

        ]

    }

    return (
        <>
            <div style={{ width: "auto", height: "490px" }} >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}

                />
            </div>
        </>);
}