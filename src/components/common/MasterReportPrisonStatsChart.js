import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'; // ✅ Import auto-bundle
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the plugin with Chart.js
ChartJS.register(ChartDataLabels);

const MasterReportPrisonStatsChart = ({ reportStats }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!reportStats || !reportStats.data || !reportStats.data.length) return;

    // Destroy existing chart before creating new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const statsData = reportStats.data[0];

    // Filter object entries
    const entries = Object.entries(statsData).filter(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        key !== '' &&
        typeof value === 'number' &&
        !key.includes('Id') &&
        !key.toLowerCase().includes('percentage')
    );

    // Labels
    const labels = entries.map(([key]) =>
      key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    );

    const values = entries.map(([_, value]) => value);

    const total = values.reduce((a, b) => a + b, 0);

    // Filter small values
    const filteredData = values
      .map((val, idx) => {
        const percent = (val / total) * 100;
        if (percent >= 1) {
          return {
            label: labels[idx],
            value: val,
          };
        }
        return null;
      })
      .filter(Boolean);

    const filteredLabels = filteredData.map((item) => item.label);
    const filteredValues = filteredData.map((item) => item.value);

    const backgroundColors = [
      '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
      '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab',
      '#8cd17d', '#b6992d', '#499894', '#d37295', '#fabfd2',
      '#b07aa1', '#d4a6c8', '#6b4c9a', '#fd7f6f'
    ];

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: filteredLabels,
        datasets: [
          {
            label: 'Prison Statistics',
            data: filteredValues,
            backgroundColor: backgroundColors.slice(0, filteredValues.length),
            borderColor: backgroundColors.slice(0, filteredValues.length),
            borderWidth: 1,
            barThickness: 20,
            borderRadius: {
              topRight: 10,
              bottomRight: 10,
              topLeft: 0,
              bottomLeft: 0,
            },
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 80,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grace: '50%',
          },
          y: {
            categoryPercentage: 0.1,
            barPercentage: 0.5,
            ticks: {
              padding: 15,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Prison System Overview (Bars ≥ 1%)',
            font: {
              size: 18,
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'nearest',
            intersect: false,
            callbacks: {
              label: function (context) {
                const value = context.raw;
                return `${value}`;
              },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: function (value) {
              return `${value}`;
            },
            font: {
              weight: 'bold',
            },
            color: '#000',
          },
        },
      },
    });

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [reportStats]);

  return (
    <div
      className="chart-container"
      style={{ width: '100%', height: '600px', padding: '20px' }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MasterReportPrisonStatsChart;
