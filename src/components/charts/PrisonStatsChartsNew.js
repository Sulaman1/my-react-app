import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function PrisonStatsChartsNew(props) {

    const  actSections  = props.actWiseStats;
    const sections = actSections?.numberOfCases?.split(',')?.slice(0, -1)
    const cases = [];
    for (const i in sections) {
        cases.push(parseInt(sections[i]));
    }

    const numberOfPrisoner = actSections?.numberOfPrisoner?.split(',')?.slice(0, -1)
    const prisoners = [];

    for (const i in numberOfPrisoner) {
        prisoners.push(parseInt(numberOfPrisoner[i]));
    }
    //for color
    const dataNew = actSections?.numberOfCases?.split(',')?.slice(0, -1);

    const theColor = [];

    for (const i in dataNew) {
        if (dataNew[i] <= 10) { theColor.push('#055C9D') }
        else if (dataNew[i] > 10 && dataNew[i] <= 30) { theColor.push('#018f94') }
        else if (dataNew[i] > 30 && dataNew[i] <= 50) { theColor.push('orange') }
        else if (dataNew[i] > 50 && dataNew[i] <= 100) { theColor.push('#FF1654') }
        else if (dataNew[i] > 100) { theColor.push('red') }
    }
    //for color


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
            categories: actSections?.acts?.split(',')
        },
        yAxis: {
            title: {
                enabled: false,
                // text: 'Total Prisoners',

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

                colors: theColor,
                name: 'Number of Cases',
                data: cases,

            },
            {

                colors: ['#d3d3d3'],
                name: 'Number of Prisoners',
                data: prisoners,

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