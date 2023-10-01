import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import Modal from "./charts/Modal";
import UndirectedFullInventoryMove from "./charts/UndirectedFullInventoryMove";
import PalletPick from "./charts/PalletPick";
import FluidLoadPalletPick from "./charts/FluidLoadPalletPick";
import TrailerLoad from "./charts/TrailerLoad";
import ListPick from "./charts/ListPick";
import ItemsShipped from "./charts/ItemsShipped";
import NonTrustedASNUndirectedReceive from "./charts/NonTrustedASNUndirectedReceive";
import { calculateUserProfiles } from "../utils/userProfiles";

import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns";

const DataDisplay = ({ data, userObject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState(null);
  const [dateRange, setDateRange] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [filteredData, setFilteredData] = useState(data || []);
  const [selectedDay, setSelectedDay] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});

  useEffect(() => {
    const profiles = calculateUserProfiles(userObject);
    setUserProfiles(profiles);
  }, [userObject]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Sort the data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Find the start date of the first week and the end date of the last week
    let startDate = startOfWeek(new Date(sortedData[0].date));
    const endDate = endOfWeek(new Date(sortedData[sortedData.length - 1].date));

    const calculatedWeeks = [];

    // Iterate over each week between the start and end dates
    while (startDate <= endDate) {
      const weekEndDate = endOfWeek(new Date(startDate));
      calculatedWeeks.push({
        start: new Date(startDate),
        end: new Date(weekEndDate),
      });
      startDate = addWeeks(new Date(startDate), 1); // Move to the next week
    }

    setWeeks(calculatedWeeks);
  }, [data]);

  useEffect(() => {
    if (selectedDay !== null) {
      setFilteredData(
        filteredData.filter(
          (item) => format(new Date(item.date), "MMMM do yyyy") === selectedDay
        )
      );
    } else {
      // Reset to the data of the selected week or all data if no week is selected
      setFilteredData(
        selectedWeek !== null
          ? data.filter(
              (item) =>
                new Date(item.date) >= weeks[selectedWeek].start &&
                new Date(item.date) <= weeks[selectedWeek].end
            )
          : data
      );
    }
  }, [selectedDay, selectedWeek, data]);

  const openModalWithChart = (chart) => {
    setCurrentChart(chart);
    setIsModalOpen(true);
  };

  if (!filteredData || filteredData.length === 0) return <Loading />;

  return (
    <>
      <div className="flex justify-around space-x-4 mb-4 mt-5">
        <div></div>
        <div></div>
        <div className="flex flex-row  space-x-4 mb-4">
          <div>
            <select
              onChange={(e) => {
                if (e.target.value === "all") {
                  setSelectedWeek(null);
                  setSelectedDay(null);
                } else {
                  setSelectedWeek(Number(e.target.value));
                  setSelectedDay(null);
                }
              }}
              defaultValue="placeholder" // Set the default value to the placeholder value
            >
              <option value="placeholder" disabled hidden>
                Select Week
              </option>
              <option value="all">Show All</option>
              {weeks.map((week, index) => (
                <option key={index} value={index}>
                  {format(week.start, "MMMM do yyyy")} -{" "}
                  {format(week.end, "MMMM do yyyy")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedDay || "placeholder"} // Bind the value to selectedDay
              onChange={(e) =>
                setSelectedDay(e.target.value === "all" ? null : e.target.value)
              }
            >
              <option value="placeholder" disabled hidden>
                Select Day
              </option>
              <option value="all">Show All</option>
              {/* Populate the dropdown with the unique days from the filteredData */}
              {[
                ...new Set(
                  filteredData.map((item) =>
                    format(new Date(item.date), "MMMM do yyyy")
                  )
                ),
              ]
                .sort((a, b) => new Date(a) - new Date(b))
                .map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-2">
        <h1 className="text-2xl font-bold text-center">Overall User Stats</h1>
      </div>

      <div
        className="flex flex-wrap justify-center w-full gap-8 relative z-50"
        style={{ zIndex: 50, position: "relative" }}
      >
        <div
          style={{ zIndex: 50, position: "relative" }}
          className="w-1/4 chart-card relative z-50"
          onClick={() =>
            openModalWithChart(
              <UndirectedFullInventoryMove
                data={filteredData}
                userObject={userObject}
              />
            )
          }
        >
          <UndirectedFullInventoryMove
            data={filteredData}
            userObject={userObject}
          />
        </div>
        <div
          className="w-1/4 chart-card relative z-50"
          onClick={() =>
            openModalWithChart(
              <PalletPick data={filteredData} userObject={userObject} />
            )
          }
        >
          <PalletPick data={filteredData} userObject={userObject} />
        </div>
        <div
          className="w-1/4 chart-card relative z-50"
          onClick={() =>
            openModalWithChart(
              <ListPick data={filteredData} userObject={userObject} />
            )
          }
        >
          <ListPick data={filteredData} userObject={userObject} />
        </div>
        <div
          className="w-1/4 chart-card relative z-50"
          onClick={() =>
            openModalWithChart(
              <FluidLoadPalletPick
                data={filteredData}
                userObject={userObject}
              />
            )
          }
        >
          <FluidLoadPalletPick data={filteredData} userObject={userObject} />
        </div>

        <div
          className="w-1/4 chart-card relative z-50"
          onClick={() =>
            openModalWithChart(
              <TrailerLoad data={filteredData} userObject={userObject} />
            )
          }
        >
          <TrailerLoad data={filteredData} userObject={userObject} />
        </div>
        <div
          className="w-1/4 chart-card relative z-50"
          onClick={() =>
            openModalWithChart(
              <NonTrustedASNUndirectedReceive
                data={filteredData}
                userObject={userObject}
              />
            )
          }
        >
          <NonTrustedASNUndirectedReceive
            data={filteredData}
            userObject={userObject}
          />
        </div>
      </div>

      <div className="flex justify-center mb-2 mt-10">
        <h1 className="text-2xl font-bold text-center">Individual Profiles</h1>
      </div>
      <div
        className="flex flex-wrap justify-center w-full gap-8 relative z-50"
        style={{ zIndex: 50, position: "relative" }}
      >
        {Object.keys(userProfiles).map((user) => (
          <div key={user} className="w-1/4 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-2">{user}</h2>
            <p>Total Actions: {userProfiles[user].totalActions}</p>
            <p>
              Average Time Between Actions:{" "}
              {userProfiles[user].averageTimeBetweenActions} ms
            </p>
            <p>Pallet Picks: {userProfiles[user].palletPicks}</p>
            <p>
              Undirected Full Inventory Moves:{" "}
              {userProfiles[user].undirectedFullInventoryMoves}
            </p>
            <p>Fluid Loads: {userProfiles[user].fluidLoads}</p>
            <p>List Picks: {userProfiles[user].listPicks}</p>
            <p>Trailer Loads: {userProfiles[user].trailerLoads}</p>
            <p>ASN Receives: {userProfiles[user].asnReceives}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-2 mt-10">
        <h1 className="text-2xl font-bold text-center">Inventory Stats</h1>
      </div>
      <div
        className="flex flex-wrap justify-center w-full gap-8 relative z-50"
        style={{ zIndex: 50, position: "relative" }}
      >
        <div
          className="w-1/4 chart-card relative z-50"
          onClick={() =>
            openModalWithChart(
              <ItemsShipped
                data={filteredData}
                userObject={userObject}
                isInModal={true}
              />
            )
          }
        >
          <ItemsShipped data={filteredData} userObject={userObject} />
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>{currentChart}</Modal>
      )}
    </>
  );
};

export default DataDisplay;
