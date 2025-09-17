import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function EmployeesDepartmentChart(props) {

    const employeesDepartmentStats  = props.employeesDepartmentStats;
    var newwwdata = employeesDepartmentStats?.numberOfEmployees?.split(',') || []
    var numberArray = [];

    for (const i in newwwdata) {
        numberArray.push(parseInt(newwwdata[i]));
    }

    const options = {
        chart: {
            responsive: true,
            height: '490px',
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
                rotation: -25,
                style: {
                    fontWeight: 'bold',
                    fontSize: '16px',
                }
            },
            categories: employeesDepartmentStats?.departmentName?.split(',') || [],
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
                colors: [
                    '#0db49e',
                    '#00bfb1',
                    '#00d6d7',
                    '#00e1eb',

                    '#00daff',
                    '#00d5fb',
                    '#00bff4',
                    '#00a8e9',
                    '#2191d9',
                    '#4279c5',
                ],

                name: 'Number Of Employees',
                data: numberArray,
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