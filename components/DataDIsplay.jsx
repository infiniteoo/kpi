import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import Modal from "./charts/Modal";
import { format } from "date-fns";
import UndirectedFullInventoryMove from "./charts/UndirectedFullInventoryMove";
import PalletPick from "./charts/PalletPick";
import FluidLoadPalletPick from "./charts/FluidLoadPalletPick";
import TrailerLoad from "./charts/TrailerLoad";

const DataDisplay = ({ data, userObject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState(null);
  const [dateRange, setDateRange] = useState("");

  useEffect(() => {
    if (!data || data.length === 0) return;

    let earliestDate = new Date();
    let latestDate = new Date("1970-01-01");

    data.forEach((item) => {
      const currentDate = new Date(item.date);
      if (currentDate < earliestDate) earliestDate = currentDate;
      if (currentDate > latestDate) latestDate = currentDate;
    });

    // Formatting the dates
    const formattedEarliestDate = format(earliestDate, "MMMM do yyyy, h:mm a");
    const formattedLatestDate = format(latestDate, "MMMM do yyyy, h:mm a");

    setDateRange(`${formattedEarliestDate} - ${formattedLatestDate}`);

    const userCounts = data.reduce((acc, cur) => {
      const user = cur.user;
      if (user !== "NOUSER") {
        acc[user] = (acc[user] || 0) + 1;
      }
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
  }, [data]);

  const charts = [
    <UndirectedFullInventoryMove data={data} userObject={userObject} />,
    <PalletPick data={data} userObject={userObject} />,
    <FluidLoadPalletPick data={data} userObject={userObject} />,
  ];

  const openModalWithChart = (chart) => {
    setCurrentChart(chart);
    setIsModalOpen(true);
  };
  if (!data) return <Loading />;

  return (
    <>
      <div className=""> {dateRange}</div>
      <div className="flex flex-wrap justify-center w-full gap-8">
        <div
          className="w-1/4 chart-card"
          onClick={() =>
            openModalWithChart(
              <UndirectedFullInventoryMove
                data={data}
                userObject={userObject}
              />
            )
          }
        >
          <UndirectedFullInventoryMove data={data} userObject={userObject} />
        </div>
        <div
          className="w-1/4 chart-card"
          onClick={() =>
            openModalWithChart(
              <PalletPick data={data} userObject={userObject} />
            )
          }
        >
          <PalletPick data={data} userObject={userObject} />
        </div>
        <div
          className="w-1/4 chart-card"
          onClick={() =>
            openModalWithChart(
              <FluidLoadPalletPick data={data} userObject={userObject} />
            )
          }
        >
          <FluidLoadPalletPick data={data} userObject={userObject} />
        </div>
        <div
          className="w-1/4 chart-card"
          onClick={() =>
            openModalWithChart(
              <TrailerLoad data={data} userObject={userObject} />
            )
          }
        >
          <TrailerLoad data={data} userObject={userObject} />
        </div>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>{currentChart}</Modal>
        )}
      </div>
    </>
  );
};

export default DataDisplay;
