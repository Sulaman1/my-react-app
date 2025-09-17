import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, registerables } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(...registerables);
export function PrisonerTypeChart(props) {
    const total = props?.prisonerTypes;

    const data = {
        labels: total?.prisonerType?.split(',') || [],
        datasets: [
            {
                label: '# of Votes',
                data: total?.numberOfPrisoners?.split(',') || [],

                backgroundColor: [
                    '#f25241',
                    '#4279c5',
                    '#f2cf37',
                    '#43903d',
                    '#018f94',
                    '#ea9207',
                    '#ea2607',
                ],
                borderColor: [
                    '#FFFFFF',
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
                        return Math.round(value / context.chart.getDatasetMeta(0).total * 100) + "%";
                    }
                    else {
                        value = "";
                        return value;
                    }
                },
                color: 'white',
                anchor: 'end',
                align: 'start',
                // offset: -20,
                font: {
                    size: 17,
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



    return (
        <>
            <Pie
                plugins={[ChartDataLabels]}
                data={data} options={options}
            />
        </>
    )
}