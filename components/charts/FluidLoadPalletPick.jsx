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

import { Line } from "react-chartjs-2"; // Import Line instead of Bar

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
    responsive: true,
    tension: 0.4, // Add this line to enable bezier curves
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
            return `Count: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
        pointStyle: "circle",
        backgroundColor: colors.map((color) => color.replace("0.6", "1")), // Solid color for points
        hoverBackgroundColor: "rgba(0,0,0,0.9)", // Different color when a user hovers over a point
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
    let earliestDate = new Date(filteredData[0]?.date); // assuming date is a field in your data
    let latestDate = new Date(filteredData[0]?.date);

    filteredData.forEach((item) => {
      const currentDate = new Date(item.date); // replace 'date' with your actual date field
      if (currentDate < earliestDate) earliestDate = currentDate;
      if (currentDate > latestDate) latestDate = currentDate;
    });

    // Formatting the dates
    const formattedEarliestDate = format(earliestDate, "MMMM do yyyy, h:mm a");
    const formattedLatestDate = format(latestDate, "MMMM do yyyy, h:mm a");

    setDateRange(`From ${formattedEarliestDate} to ${formattedLatestDate}`);
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
          borderColor: colors.map((color) => color.replace("0.6", "1")), // Replace the alpha value with 1 for border
          borderWidth: 1,
          hoverBackgroundColor: colors.map((color) =>
            color.replace("0.6", "0.8")
          ), // Use a slightly higher alpha for hover background
          hoverBorderColor: colors.map((color) => color.replace("0.6", "1")), // Use a solid color for hover border
          hoverBorderWidth: 2, // Increase border width on hover
        },
      ],
    });
  }, []);

  return (
    <div style={{ width: "80vw", height: "80vh" }}>
      {chartData ? (
        <>
          <div
            style={{
              textAlign: "right",
              fontSize: "18px",
              paddingRight: "50px",
              marginTop: "50px",
            }}
          >
            Fluid Load
          </div>
          <Line data={chartData} options={options} />
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              paddingTop: "5px",
            }}
          >
            {dateRange}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default FluidLoadPalletPick;
