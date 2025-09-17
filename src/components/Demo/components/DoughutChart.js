import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);
export function DoughutChart(props) {
    const chart = props.total;
    const data = {
        labels: ['TODAYS COURT HEARING', 'TOMMOROWS HEARING', 'YESTERDAYS HEARING'],
        datasets: [
            {
                label: '# of Votes',
                data: [chart?.todaysHearing , chart?.tommorowsHearing, chart?.yesterdaysHearing],
                backgroundColor: [
                    '#f25241',
                    '#4279c5',
                    '#f2cf37',
                    '#43903d',
                    '#018f94',
                    '#ea9207',
                ],
                borderColor: [
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',
                    '#FFFFFF',

                ],
                borderWidth: 1,
            },
        ],
    };
    let delayed;
    const options = {
        maintainAspectRatio: true,
        plugins: {


            datalabels: {
                formatter: function (value, context) {
                    if (value > 0) {
                        const newData = Math.round(value / context.chart.getDatasetMeta(0).total * 100) + "%";
                        return '(' + (value) + ')' + ' ' + newData;
                    }
                    else {
                        value = "";
                        return value;
                    }
                },

                color: 'white',
                anchor: 'center',
                font: {
                    size: 18,
                    weight: 'bold'
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
    };

    return <Doughnut
        data={data}
        plugins={[ChartDataLabels]}
        options={options}
    />;
}