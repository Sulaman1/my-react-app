import React from "react";
import {
  Chart as ChartJS,
  registerables,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(...registerables);

export function PrisonWiseStatsChart(props) {
  const allStats = props.stats;
  const data = {
    labels: allStats?.prisons?.split(",")?.slice(0,-1) || [],

    datasets: [
      {
        type: "line",
        label: "Total Convicted",
        data: allStats?.convict?.split(",") || [],
        backgroundColor: ["#f25241"],
        borderColor: ["#f25241"],
        borderWidth: 4,
      },
      {
        type: "line",
        label: "Total Under Trial",
        data: allStats?.utp?.split(",") || [],
        backgroundColor: ["#4279c5"],
        borderColor: ["#4279c5"],
        borderWidth: 4,
      },
      {
        type: "line",
        label: "Juviniles",
        data: allStats?.juvinile?.split(",") || [],
        backgroundColor: ["#f2cf37"],
        borderColor: ["#f2cf37"],
        borderWidth: 4,
      },
      {
        label: ["Male"],
        data: allStats?.male?.split(",") || [],
        backgroundColor: ["#0ab39ce6"],
        borderColor: ["#0ab39ce6"],
        borderWidth: 1,
      },
      {
        label: ["Female"],
        data: allStats?.female?.split(",") || [],
        backgroundColor: ["#ffcfda"],
        borderColor: ["#ffcfdd"],
        borderWidth: 1,
      },
    ],
  };
  let delayed;
  const options = {
    interaction: {
      mode: "index",
    },
    maintainAspectRatio: false,
    responsive: true,

    plugins: {},
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    borderRadius: 1,
    layout: {
      padding: 1,
    },

    scales: {
      y: {
        title: {
          display: true,
          text: ["Total Prisons"],
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 25,
          minRotation: 25,
          font: {
            weight: "bold",
            size: 13,
          },
        },
      },
    },
  };

  return (
    <>
      <div style={{ width: "auto", height: "500px" }}>
        <Bar data={data} options={options} />
      </div>
    </>
  );
}
