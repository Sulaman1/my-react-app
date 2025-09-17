import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, registerables } from 'chart.js';
import { PolarArea, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(...registerables);
export function PolarAreaChart(props) {

    const polo = props.polar;
    const data = {
        labels: ['HC', 'hepatitisB', 'HIV', 'TB', 'Total Combination Case', 'Total Special Treatment'],
        datasets: [
            {
                label: '# of Votes',
                data: [polo?.specialTreatmentStats?.hc || 3, polo?.specialTreatmentStats?.hepB || 2, polo?.specialTreatmentStats?.hiv || 5, polo?.specialTreatmentStats?.tb || 7, polo?.specialTreatmentStats?.totalCombinationCase || 2, polo?.specialTreatmentStats?.totalSpecialTreatment || 3],
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
        plugins: {
            datalabels: {
                formatter: function (value, context) {
                    if (value > 0) {
                        return Math.round(value * 1) + '%';
                    }
                    else {
                        value = "";
                        return value;
                    }
                },

                color: 'white',
                anchor: 'center',
                // align: 'top',
                // offset: 24,
                font: {
                    size: 15,
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
        plugins={[ChartDataLabels]}
        data={data} options={options}

    />;
}