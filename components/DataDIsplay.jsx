import React, { useState } from "react";
import Loading from "./Loading";

import UndirectedFullInventoryMove from "./charts/UndirectedFullInventoryMove";
import PalletPick from "./charts/PalletPick";
import FluidLoadPalletPick from "./charts/FluidLoadPalletPick";

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

const DataDisplay = ({ data, userObject }) => {
  return (
    <div className="chart-container">
      {data ? (
        <>
          <UndirectedFullInventoryMove data={data} userObject={userObject} />
          <PalletPick data={data} userObject={userObject} />
          <FluidLoadPalletPick data={data} userObject={userObject} />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default DataDisplay;
