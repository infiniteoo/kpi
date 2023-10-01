import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import { format } from "date-fns";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Registering the required pieces for Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const FluidLoadPalletPick = ({ data, userObject }) => {
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState("");

  const colors = [
    "rgba(255, 99, 132, 0.6)", // red
    "rgba(54, 162, 235, 0.6)", // blue
    "rgba(255, 206, 86, 0.6)", // yellow
    "rgba(75, 192, 192, 0.6)", // green
    "rgba(153, 102, 255, 0.6)", // purple
    "rgba(255, 159, 64, 0.6)", // orange
    "rgba(129, 159, 64, 0.6)", // olive
    "rgba(209, 102, 221, 0.6)", // pink
    "rgba(100, 149, 237, 0.6)", // cornflower blue
    "rgba(144, 238, 144, 0.6)", // light green
    "rgba(255, 105, 180, 0.6)", // hot pink
    "rgba(218, 165, 32, 0.6)", // golden rod
  ];

  const options = {
    indexAxis: "y", // To make the bar chart horizontal.
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 18,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Count: ${context.parsed.x}`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const filteredData = data.filter((item) => item.activity === "Fluid Load");

    const userCounts = filteredData.reduce((acc, cur) => {
      const user = cur.user;
      if (user !== "NOUSER") {
        acc[user] = (acc[user] || 0) + 1;
      }
      return acc;
    }, {});
    let earliestDate =
      filteredData.length > 0 ? new Date(filteredData[0]?.date) : new Date();
    let latestDate =
      filteredData.length > 0 ? new Date(filteredData[0]?.date) : new Date();

    filteredData.forEach((item) => {
      const currentDate = new Date(item.date);
      if (currentDate < earliestDate) earliestDate = currentDate;
      if (currentDate > latestDate) latestDate = currentDate;
    });

    // Check if earliestDate and latestDate are valid dates before formatting.
    const formattedEarliestDate =
      earliestDate instanceof Date && !isNaN(earliestDate)
        ? format(earliestDate, "MMMM do yyyy, h:mm a")
        : "Invalid Date";

    const formattedLatestDate =
      latestDate instanceof Date && !isNaN(latestDate)
        ? format(latestDate, "MMMM do yyyy, h:mm a")
        : "Invalid Date";
    setDateRange(`${formattedEarliestDate} - ${formattedLatestDate}`);
    // Convert to array, sort, and create labels and data arrays.
    const sortedUsers = Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .reduce(
        (acc, [user, count]) => {
          acc.labels.push(user);
          acc.data.push(count);
          return acc;
        },
        { labels: [], data: [] }
      );

    setChartData({
      labels: sortedUsers.labels,
      datasets: [
        {
          label: "Fluid Load",
          data: sortedUsers.data,
          backgroundColor: colors, // Use the array of colors here
          borderColor: colors.map((color) => color.replace("0.6", "1")),
          borderWidth: 1,
          hoverBackgroundColor: colors.map((color) =>
            color.replace("0.6", "0.8")
          ),
          hoverBorderColor: colors.map((color) => color.replace("0.6", "1")),
          hoverBorderWidth: 2, // Increase border width on hover
        },
      ],
    });
  }, []);

  return (
    <div className="bg-gray-100 z-50">
      {chartData ? (
        <>
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              backgroundColor: "white",
            }}
          >
            Fluid Load
          </div>
          <Bar data={chartData} options={options} />{" "}
        </>
      ) : null}
    </div>
  );
};

export default FluidLoadPalletPick;
