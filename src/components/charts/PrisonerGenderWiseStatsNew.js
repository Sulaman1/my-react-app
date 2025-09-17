import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function PrisonerGenderWiseStatsNew(props) {
    // Extract and organize the stats
    const stats = [
        { name: 'Total Juvenile', value: props.prisonerStats?.totalJuvinilePrisoner || 0 },
        { name: 'Male Juvenile', value: props.prisonerStats?.maleJuvinilePrisoner || 0 },
        { name: 'Female Juvenile', value: props.prisonerStats?.femaleJuvinilePrisoner || 0 },
        { name: 'Total Male', value: props.prisonerStats?.totalMalePrisoner || 0 },
        { name: 'Total Female', value: props.prisonerStats?.totalFemalePrisoner || 0 }
    ];

    // Color mapping based on values
    const getColor = (value) => {
        if (value <= 10) return '#055C9D';
        if (value <= 30) return '#018f94';
        if (value <= 50) return 'orange';
        if (value <= 100) return '#FF1654';
        return 'red';
    };

    const options = {
        chart: {
            responsive: true,
            height: '490px',
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
            categories: stats.map(item => item.name),
            labels: {
                y: 30,
                align: 'center',
                rotation: -25,
                style: {
                    fontWeight: 'bold',
                    fontSize: '16px',
                }
            }
        },
        yAxis: {
            title: {
                enabled: false
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
            pointFormat: '<span style="color:{point.color}">\u25CF</span> Count: {point.y}',
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
        series: [{
            name: 'Prisoners',
            data: stats.map(item => ({
                y: item.value,
                color: getColor(item.value)
            }))
        }]
    };

    return (
        <div style={{ width: "100%", height: "450px" }} >
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
}