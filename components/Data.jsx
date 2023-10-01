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
    const weights = {
      totalActions: 1,
      avgTimeBetweenActions: -0.5, // Negative because lower is better
      palletPicks: -0.4,
      undirectedFullInventoryMoves: -0.3,
      fluidLoads: -0.9,
      listPicks: -0.7,
      trailerLoads: -0.8,
      asnReceives: -0.6,

      // ... other weights ...
    };
    // Calculate scores for each user
    // Calculate scores for each user
    const scoredProfiles = Object.entries(profiles).map(([user, profile]) => {
      let score = 0;
      score += profile.totalActions * weights.totalActions;
      score +=
        convertToSeconds(profile.averageTimeBetweenActions) *
        weights.avgTimeBetweenActions;
      score += profile.palletPicks * weights.palletPicks;
      score +=
        profile.undirectedFullInventoryMoves *
        weights.undirectedFullInventoryMoves;
      score += profile.fluidLoads * weights.fluidLoads;
      score += profile.listPicks * weights.listPicks;
      score += profile.trailerLoads * weights.trailerLoads;
      score += profile.asnReceives * weights.asnReceives;
      // ... other scores ...
      return { user, score, ...profile };
    });

    const rankedProfiles = scoredProfiles.sort((a, b) => b.score - a.score);
    setUserProfiles(rankedProfiles);
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

  function convertToSeconds(timeStr) {
    const parts = timeStr.split(" ");
    let seconds = 0;
    parts.forEach((part) => {
      if (part.endsWith("m")) {
        seconds += parseInt(part) * 60; // convert minutes to seconds
      } else if (part.endsWith("s")) {
        seconds += parseInt(part); // add seconds
      }
    });
    return seconds;
  }

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
        {userProfiles.map((profile, index) => (
          <div
            key={profile.user}
            className="w-1/4 p-4 bg-white shadow-md rounded-md flex flex-col items-center"
          >
            <div className="flex items-center mb-4">
              <img
                src="/profile_placeholder.jpg"
                alt="Profile Placeholder"
                className="w-16 h-16 rounded-full"
              />
              <div className="ml-4 text-center">
                <h2 className="text-2xl font-bold">{profile.user}</h2>
                <p className="text-xl">
                  Rank: <strong>{index + 1}</strong>
                </p>
              </div>
            </div>
            {/* Displaying rank here */}
            <p>
              Total Actions: <strong>{profile.totalActions}</strong>
            </p>
            <p>
              Avg Time Between Actions:{" "}
              <strong>{profile.averageTimeBetweenActions}</strong>
            </p>
            <p>
              Pallet Picks: <strong>{profile.palletPicks}</strong>
            </p>
            <p>
              Undirected Full Inventory Moves:{" "}
              <strong>{profile.undirectedFullInventoryMoves}</strong>
            </p>
            <p>
              Fluid Loads: <strong>{profile.fluidLoads}</strong>
            </p>
            <p>
              List Picks: <strong>{profile.listPicks}</strong>
            </p>
            <p>
              Trailer Loads: <strong>{profile.trailerLoads}</strong>
            </p>
            <p>
              ASN Receives: <strong>{profile.asnReceives}</strong>
            </p>
          </div>
        ))}
        In this modification, index + 1 is used to display the rank because the
        index is zero-based. So, for the first user, the index will be 0, and we
        add 1 to display it as rank 1.
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
