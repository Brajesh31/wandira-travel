import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);



const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: 'index',
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#6b7280',
                font: {
                    size: 12,
                },
            },
        },
        y: {
            beginAtZero: true,
            border: {
                display: false,
            },
            grid: {
                color: "#e5e7eb",
                drawBorder: false,
            },
            ticks: {
                color: '#6b7280',
                font: {
                    size: 12,
                },
                padding: 10,
            },
        },
    },
    plugins: {
        legend: {
            display: false,
            position: 'top',
            align: 'center',
            labels: {
                color: '#374151',
                font: {
                    size: 12,
                    weight: '500',
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
            },
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderWidth: 1,
            displayColors: false,
        },
    },
};

const BarChart = ({ dataPoints ,color="#8125f1" }) => {
    const labels = dataPoints.map(item => item.day);
    const totals = dataPoints.map(item => item.total);

    const data = {
        labels,
        datasets: [
            {
                label: "Total",
                data: totals,
                backgroundColor: color,
                borderRadius: 3,
            },
        ],
    };

    return (
        <div className="p-4 w-full">
            <div className="h-72 w-full lg:h-80">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default BarChart;