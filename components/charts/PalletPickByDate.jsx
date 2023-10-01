import React, { useState, useEffect } from "react";
import { parse } from "date-fns";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Registering the required pieces for Bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PalletPickByDate = ({ data }) => {
  const [chartData, setChartData] = useState(null);
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

  useEffect(() => {
    const filteredData = data.filter((item) => item.activity === "Pallet Pick");

    // Define the time ranges
    const timeRanges = ["Days", "Swing", "Nights"];

    // Initialize an object to hold the counts for each day and time range
    const counts = {};
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].forEach((day) => {
      counts[day] = {};
      timeRanges.forEach((range) => (counts[day][range] = 0));
    });

    filteredData.forEach((item) => {
      if (!item.date || !item.time) {
        console.error("Invalid date or time:", item);
        return;
      }
      const date = new Date(item.date);
      const day = date.toLocaleString("en-us", { weekday: "long" });
      /*  console.log("item.time", item.time); */
      // Parse the hour from item.time
      const timeString = `${item.date} ${item.time}`;
      const dateWithTime = parse(
        timeString,
        "MM/dd/yyyy hh:mm:ss a",
        new Date()
      );

      const hour = dateWithTime.getHours();

      /* console.log(`Hour: ${hour}`); // Log the parsed hour */

      let range;
      if (hour >= 6 && hour < 17) range = "Days";
      else if (hour >= 17 && hour < 20) range = "Swing";
      else range = "Nights";

      /*     console.log(`Range: ${range}`); // Log the determined range
      console.log(`Time String: ${timeString}`); // Log the timeString
      console.log(`Item Time: ${item.time}`); // Log the item.time */
      /*  console.log(`Date With Time: ${dateWithTime}`); // Log the dateWithTime */

      counts[day][range]++;
    });

    // Prepare the data for Chart.js
    const datasets = timeRanges.map((range, index) => ({
      label: range,
      data: Object.values(counts).map((count) => count[range]),
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace("0.6", "1"),
      borderWidth: 1,
    }));

    setChartData({
      labels: Object.keys(counts),
      datasets: datasets,
    });
  }, [data]);

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
            Pallet Picks by Day and Time
          </div>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    font: {
                      size: 18,
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
            }}
          />
        </>
      ) : null}
    </div>
  );
};

export default PalletPickByDate;
