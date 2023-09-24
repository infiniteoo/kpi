import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { format } from "date-fns"; // Install this library if not already, it will be used to format dates
import UndirectedFullInventoryMove from "./charts/UndirectedFullInventoryMove";
import PalletPick from "./charts/PalletPick";

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

const DataDisplay = ({ data, userObject }) => {
  const [dateRange, setDateRange] = useState("");

  return (
    <div className="chart-container">
      {data ? (
        <>
          <UndirectedFullInventoryMove
            data={data}
            userObject={userObject}
            dateRange={dateRange}
          />
          <PalletPick
            data={data}
            userObject={userObject}
            dateRange={dateRange}
          />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default DataDisplay;
