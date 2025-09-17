import React, { useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);
export function DiseasesBarChart(props) {

    const stats  = props.counter;
    const newNumber = stats?.numberOfPatientsByMedicalInfo?.split(',')?.slice(0,-1) || []
    const numberofMedicalInfo = [];
  
    for (const i in newNumber) {
        numberofMedicalInfo.push(parseInt(newNumber[i]));
    }
  
    const newNumberofHospital = stats?.numberOfPatientsByHospitalAdmission?.split(',')?.slice(0,-1) || []
    const newNumberofHospitalAdmision = [];
  
    for (const i in newNumberofHospital) {
        newNumberofHospitalAdmision.push(parseInt(newNumberofHospital[i]));
    }
  
  
    // //for color
    const dataNew = stats?.numberOfPatientsByHospitalAdmission?.split(',') || []
  
    const theColor = [];
  
    for (const i in dataNew) {
      if (dataNew[i] <= 10) { theColor.push('#055C9D') }
      else if (dataNew[i] > 10 && dataNew[i] <= 30) { theColor.push('#018f94') }
      else if (dataNew[i] > 30 && dataNew[i] <= 50) { theColor.push('orange') }
      else if (dataNew[i] > 50 && dataNew[i] <= 100) { theColor.push('#FF1654') }
      else if (dataNew[i] > 100) { theColor.push('red') }
    }

    const dataNewcolors = stats?.numberOfPatientsByMedicalInfo?.split(',') || []
  
    const theColorMed = [];
  
    for (const i in dataNewcolors) {
      if (dataNewcolors[i] <= 10) { theColorMed.push('orange') }
      else if (dataNewcolors[i] > 10 && dataNewcolors[i] <= 30) { theColorMed.push('#FF1654 ') }
      else if (dataNewcolors[i] > 30 && dataNewcolors[i] <= 50) { theColorMed.push('$055C9D') }
      else if (dataNewcolors[i] > 50 && dataNewcolors[i] <= 100) { theColorMed.push('#018f94') }
      else if (dataNewcolors[i] > 100) { theColorMed.push('red') }
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
                text: 'Diseases wise Number of Prisoners affected'
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
            
      categories: stats?.diseaseName?.split(',') || [],
        },
        yAxis: {
            title: {
                enabled: true,
                text: 'Number Of Prisoners Affected'
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
            enabled: true,
            align: 'center',
            verticalAlign: 'top',
            itemStyle: { fontWeight: "400" }
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
                borderRadius: 10,
                colors: theColorMed,
                name: 'No Of patients by medical info',
                data: numberofMedicalInfo,
                colorByPoint: true
            },
            {
                borderRadius: 10,
                colors: theColor,
                name: 'No Of patients by Hospital Admission',
                data:newNumberofHospitalAdmision,
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