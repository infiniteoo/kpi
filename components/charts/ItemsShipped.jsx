import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import { format } from "date-fns";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  RadarController,
  RadialLinearScale,
} from "chart.js";

import { Doughnut } from "react-chartjs-2"; // Import Doughnut

import axios from "axios";
import { PieController, ArcElement } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  RadarController,
  RadialLinearScale
);

const itemsShipped = ({ data, userObject, isInModal }) => {
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

  useEffect(() => {
    if (!data) return; // Make sure data is available

    const itemCounts = data.reduce((acc, cur) => {
      const itemNumber = cur.itemNumber;
      if (itemNumber) {
        // Only count itemNumber that are not blank or undefined
        acc[itemNumber] = (acc[itemNumber] || 0) + 1;
      }
      return acc;
    }, {});

    // Sort itemCounts from highest to lowest count.
    const sortedEntries = Object.entries(itemCounts).sort(
      ([, a], [, b]) => b - a
    );

    // Convert sorted entries to labels and data arrays.
    const sortedItems = sortedEntries.reduce(
      (acc, [item, count]) => {
        acc.labels.push(item);
        acc.data.push(count);
        return acc;
      },
      { labels: [], data: [] }
    );

    setChartData({
      labels: sortedItems.labels,
      datasets: [
        {
          data: sortedItems.data,
          backgroundColor: colors.slice(0, sortedItems.data.length),
          borderColor: colors
            .slice(0, sortedItems.data.length)
            .map((color) => color.replace("0.6", "1")),
          borderWidth: 1,
        },
      ],
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
              position: "relative",
              zIndex: 50,
              backgroundColor: "white",
            }}
          >
            Item Numbers Shipped
          </div>
          <div
            style={{
              width: isInModal ? "600px" : "200px",
              height: isInModal ? "600px" : "200px",
              margin: "auto",
            }}
          >
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default itemsShipped;
