import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function VisitorTrendChart(props) {

    // const { visitorDailyStats } = props.visitor;
    const visitorDailyStats  = props.visitorStats;

    var barrack = visitorDailyStats?.visitors?.split(',') || []
    var visitorCount = [];

    for (var i in barrack) {
        visitorCount.push(parseInt(barrack[i]));
    }

    const options = {
        chart: {
            height: '500px',
            renderTo: 'container',
            type: 'line',

        },
        credits: false,
        xAxis: {
            labels: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '13px',
                }
            },
            categories: visitorDailyStats?.dates?.split(','),
        },
        yAxis: {
            title: {
                enabled: true,
                text: 'Visitors'
            }
        },
        tooltip: {
            headerFormat: '<b>{point.key}</b><br>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: {point.y}  {point.stackTotal}',
        },
        title: false,

        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'top',
            itemStyle: { color: "black", fontWeight: "400", fontFamily: "teragon-sans" }
        },
        plotOptions: {
            series: {

                states: {
                    inactive: {
                        opacity: 2
                    }
                }
            },
            line: {

                animation: {
                    defer: 2000
                },
                size: '100%',
                dataLabels: {
                    enabled: true,
                    crop: false,
                    overflow: 'none',
                    formatter: function () {
                        if (this.y === 0) {
                            return '';
                        }
                        return this.y;
                    },
                    style: {
                        fontSize: '13px'
                    }
                }
            }
        },
        series: [
            {
                name: 'Total Visitors',
                color: '#f25241',
                // name: 'Number of Cases',
                data: visitorCount,
            }
        ]

    }

    return (
        <>
            <div style={{ width: "auto", height: "500px" }} >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}

                />
            </div>
        </>);
}