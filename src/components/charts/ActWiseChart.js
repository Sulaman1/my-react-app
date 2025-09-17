import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
ChartJS.register(...registerables);
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export function ActWiseChart(props) {

    const { actSections } = props.counter;

    //for color
    var dataNew = actSections?.numberOfCases?.split(',').slice(0, -1);

    const theColor = [];

    for (const i in dataNew) {
        if (dataNew[i] <= 10) { theColor.push('#055C9D') }
        else if (dataNew[i] > 10 && dataNew[i] <= 20) { theColor.push('#018f94') }
        else if (dataNew[i] > 20 && dataNew[i] <= 30) { theColor.push('orange') }
        else if (dataNew[i] > 30) { theColor.push('red') }
    }
    //for color
    const data = {
        labels: actSections?.acts?.split(',').slice(0, -1) || [],
        datasets: [
            {
                label: ['No Of Cases'],
                data: dataNew,
                backgroundColor: theColor,
                borderColor: theColor,
                borderWidth: 1,
            },

            {
                label: 'Number of prisoner',
                data: actSections?.numberOfPrisoner?.split(',') || [],
                backgroundColor: [
                    '#D3D3D3',
                ],
                borderColor: [
                    '#D3D3D3',
                ],
                borderWidth: 1,
            }
        ],

    };
    let delayed;

    const options = {

        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                // color: 'black',
                anchor: 'end',
                align: 'top',
                padding: -6,
                offset: 4,
                color: chart => {
                    return chart.dataset.borderColor[chart.dataIndex];
                },
                font: {
                    weight: 'bold',
                    size: 15
                },

            },
        },
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                }
                return delay;
            },
        },
        borderRadius: 8,

        layout: {
            padding: 1
        },

        scales: {
            y: {
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    stepSize: 4.5
                },
                title: {
                    display: true,
                    text: ['Total Prisoners'],
                    font: {
                        weight: 'bold',
                    }
                }
            },
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 25,
                    minRotation: 25,
                    font: {
                        weight: 'bold',
                        size: 16,
                    }

                },
            },

        }
    }

    return (
        <>

            <div style={{ width: "auto", height: "500px" }} >

                <Bar

                    plugins={[ChartDataLabels]}

                    data={data} options={options}
                />
            </div>
        </>);
}