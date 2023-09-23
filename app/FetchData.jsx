import React from "react";
import axios from "axios";

const FetchData = () => {
  // fetch data from the server with axios
  axios.get("http://localhost:5000/api/excel").then(({ data }) => {
    // Distribute data to timelines A, B, or C based on your logic
    console.log(data[0]);
    console.log(data[1]);
    console.log(data[2]);
    console.log(data[3]);
    console.log(data[4]);

    /*  data
      .forEach((row, index) => {
        // log all three timelines
      })
      .catch((error) => {
        console.error("Error fetching the Excel data:", error);
      }); */

    return <div>FetchData</div>;
  });
};

export default FetchData;
