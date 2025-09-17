import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function HearingChart(props) {
    const hearing = props?.hearingStats;

    var hearings = hearing?.nextSevenDaysHearing?.split(',') || []
    var newHearings = [];

    for (const i in hearings) {
        newHearings.push(parseInt(hearings[i]));
    }
    //for color
    const theColor = [];

    for (const i in hearings) {
        if (hearings[i] <= 5) { theColor.push('#055C9D') }
        else if (hearings[i] > 5 && hearings[i] <= 10) { theColor.push('#018f94') }
        else if (hearings[i] > 10 && hearings[i] <= 20) { theColor.push('orange') }
        else if (hearings[i] > 20) { theColor.push('red') }
    }
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
                style: {
                    fontWeight: 'bold',
                    fontSize: '14px',
                }
            },
            categories: hearing?.nextSevenDays?.split(',') || [],
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
                colors: theColor,
                name: 'Number Of Hearings',
                data: newHearings,
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