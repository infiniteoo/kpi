import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line, Doughnut, Radar } from "react-chartjs-2";
import { format, parseISO } from "date-fns";

const ActivityChart = ({ activity, chartType }) => {
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/excel");
        const filteredData = data.filter((item) => item.activity === activity);

        // Processing Dates and sorting user counts
        if (filteredData.length > 0) {
          const sortedData = [...filteredData].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          const earliestDate = parseISO(sortedData[0].date);
          const latestDate = parseISO(sortedData[sortedData.length - 1].date);

          /*     const formattedEarliestDate = format(earliestDate, "dd/MM/yyyy");
          const formattedLatestDate = format(latestDate, "dd/MM/yyyy"); */

          /*   setDateRange(
            `From ${formattedEarliestDate} to ${formattedLatestDate}`
          );
 */
          const userCounts = filteredData.reduce((acc, cur) => {
            const user = cur.user;
            if (user !== "NOUSER") acc[user] = (acc[user] || 0) + 1;
            return acc;
          }, {});

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
                label: `${activity} Count`,
                data: sortedUsers.data,
                backgroundColor: "rgba(75,192,192,0.6)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [activity]);

  const renderChart = () => {
    if (!chartData) return null;

    const options = {
      responsive: true,
      scales: {
        x: { beginAtZero: true, ticks: { font: { size: 14 } } },
        y: { beginAtZero: true, ticks: { font: { size: 14 } } },
      },
      plugins: {
        legend: { labels: { font: { size: 18 } } },
      },
    };

    switch (chartType) {
      case 0:
        return <Bar data={chartData} options={options} />;
      case 1:
        return <Pie data={chartData} options={options} />;
      case 2:
        return <Line data={chartData} options={options} />;
      case 3:
        return <Doughnut data={chartData} options={options} />;
      case 4:
        return <Radar data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "80vw",
        height: "80vh",
        marginBottom: "20px",
      }}
    >
      <h2>{activity}</h2>
      {renderChart()}
      {dateRange && (
        <div
          style={{ textAlign: "center", fontSize: "14px", paddingTop: "10px" }}
        >
          {dateRange}
        </div>
      )}
    </div>
  );
};

export default ActivityChart;
