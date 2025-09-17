import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function EmployeesGenderChart(props) {

    const total = props?.employeesGenderStats
    // //for color
    const options = {
        chart: {
            height: '335px',
            renderTo: 'container',
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 1,
                beta: 19,
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
            categories:total?.genders?.map(item => item.name) || [],
        },
        yAxis: {
            title: {
                enabled: false
            }
        },
        tooltip: {
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
                colors: ['#FFB6C1',
                    '#0db19b',
                    '#EC7063',],

                // name: 'Number of Cases',
                data: total?.genders?.map(item => item.count),
                colorByPoint: true
            },

        ]

    }

    return (
        <>
            <div style={{ width: "auto", height: "310px" }} >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}

                />
            </div>
        </>);
}