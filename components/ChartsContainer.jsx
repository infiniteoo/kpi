import React from "react";
import ActivityChart from "./ActivityChart"; // Assuming you would separate ActivityChart in its own file

const activityTypes = [
  "Pallet Pick",
  "Fluid Load Pallet Pick",
  "Fluid Load",
  "Trailer Load",
  "Directed Full Inventory Move",
];

const ChartsContainer = () => {
  return (
    <div>
      {activityTypes.map((activity, index) => (
        <ActivityChart key={index} activity={activity} chartType={index % 5} />
      ))}
    </div>
  );
};

export default ChartsContainer;
