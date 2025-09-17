import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function MedicinePastExpiryChart(props) {

    const medicalData = props.counter;

    const daysUntilExpiry = medicalData?.medicineExpiryStatsFuture?.daysUntilExpiry?.split(',') || [];
    const batchNumbers = medicalData?.medicineExpiryStatsFuture?.batchNumber?.split(',') || [];
  
    const chartData = daysUntilExpiry.map((days, index) => ({
      y: parseInt(days),
      batchNumber: batchNumbers[index],
      color: getBarColor(days),
    }));
    function getBarColor(days) {
        if (days <= 5) return '#1AACAC';
        if (days > 5 && days <= 10) return '#018f94';
        if (days > 10 && days <= 30) return '#FFA500';
        return '#FF0000';
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
            title: {
                enabled: true,
                text: 'Medicine Stock Wise No Of Days After Expiry'
            },
            labels: {
                y: 33,
                align: 'center',
                // rotation: -25,
                style: {
                    fontWeight: 'bold',
                    fontSize: '14px',
                }
            },
            categories: medicalData?.medicineExpiryStatsFuture?.medicineName?.split(',') || [] ,
        },
        yAxis: {
            title: {
                enabled: true,
                text: 'No Of Days After Expiry'
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
            headerFormat: '<b>{point.key}</b>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.y} {point.stackTotal}<br><b>Batch No</b><span style="color:{point.color}">\u25CF</span> {point.batchNumber}',
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
                data: chartData,
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