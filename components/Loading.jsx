import { useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loading = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  return (
    <div className="flex-col">
      <PacmanLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />

      <h1 className="loading-text text-5xl mt-10 items-center text-center justify-center text-gray-500">
        Loading...
      </h1>
    </div>
  );
};

export default Loading;
