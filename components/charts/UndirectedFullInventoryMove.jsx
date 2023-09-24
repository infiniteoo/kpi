import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import { format } from "date-fns"; // Install this library if not already, it will be used to format dates

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
  HorizontalBar,
} from "chart.js";

import { Bar, Pie, Line, Doughnut, Radar, Bubble } from "react-chartjs-2";

import axios from "axios";
import { PieController, ArcElement, Color } from "chart.js";

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

const UndirectedFullInventoryMove = () => {
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/excel");
        const filteredData = data.filter(
          (item) => item.activity === "Undirected Full Inventory Move"
        );

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
        const formattedEarliestDate = format(
          earliestDate,
          "MMMM do yyyy, h:mm a"
        );
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
              label: "Undirected Full Inventory Move",
              data: sortedUsers.data,
              backgroundColor: "rgba(75,192,192,0.6)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
              fontSize: 20,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ position: "relative", width: "80vw", height: "80vh" }}>
      {chartData ? (
        <>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 14, // adjust this value for x-axis labels
                    },
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 18, // adjust this value for y-axis labels
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 18, // adjust this value for legend labels
                    },
                  },
                },
              },
            }}
          />
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

export default UndirectedFullInventoryMove;
