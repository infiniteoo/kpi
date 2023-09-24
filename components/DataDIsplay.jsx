import React, { useState } from "react";
import Loading from "./Loading";
import Modal from "./charts/Modal"; // Make sure to import your Modal component, create one if you don't have it already.

// Import your chart components
import UndirectedFullInventoryMove from "./charts/UndirectedFullInventoryMove";
import PalletPick from "./charts/PalletPick";
import FluidLoadPalletPick from "./charts/FluidLoadPalletPick";

const DataDisplay = ({ data, userObject }) => {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const charts = [
    <UndirectedFullInventoryMove data={data} userObject={userObject} />,
    <PalletPick data={data} userObject={userObject} />,
    <FluidLoadPalletPick data={data} userObject={userObject} />,
  ];

  if (!data) return <Loading />;

  return (
    <div className="flex flex-wrap justify-center w-full gap-8">
      <div className="w-1/4">
        <UndirectedFullInventoryMove data={data} userObject={userObject} />
      </div>
      <div className="w-1/4">
        <PalletPick data={data} userObject={userObject} />
      </div>
      <div className="w-1/4">
        <FluidLoadPalletPick data={data} userObject={userObject} />
      </div>
    </div>
    /*  <div className="chart-container">
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
       
          {charts[currentChartIndex]}
          <button
            onClick={() =>
              setCurrentChartIndex(
                (prevIndex) => (prevIndex + 1) % charts.length
              )
            }
          >
            Next
          </button>
          <button
            onClick={() =>
              setCurrentChartIndex(
                (prevIndex) => (prevIndex - 1 + charts.length) % charts.length
              )
            }
          >
            Previous
          </button>
        </Modal>
      )}
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
   
    </div>
  ); */
  );
};

export default DataDisplay;
