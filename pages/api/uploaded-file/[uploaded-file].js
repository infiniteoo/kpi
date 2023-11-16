export default async function (req, res) {
  try {
    console.log("entered api/uploaded-file", req.file);

    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    let uploadedFile = req.file;

    const filePath = req.file.path; // Get the path of the uploaded file
    const workbook = XLSX.readFile(filePath); // Read the uploaded file

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const excelData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
    });

    if (excelData.length > 0 && Array.isArray(excelData[0])) {
      excelData.shift(); // Remove the header row if it exists
    }

    const formattedData = excelData.map((row) => {
      const parts = row[0].split(" ");
      const [date, time] = parts;
      const [meridian, ...userParts] = parts[2].split("\n"); // Split the meridian and user using '\n'
      const user = userParts.join(" ").trim(); // Join the user parts back together and trim any extra spaces

      let strippedUser = (user.match(/[A-Z]+/g) || []).join("");
      const [activity, operation] = row[1].split("\n");
      const item = row[2];
      let warehouse = "";
      let strippedItem = "";
      let choppedItem = "";

      if (item === 3006 || item.includes("3006")) {
        warehouse = "3006";
      }

      if (typeof item === "string" && item.includes("3006")) {
        strippedItem = item.replace("3006", "");
        if (strippedItem.includes("\n")) {
          finalStrippedItem = strippedItem.replace("\n", "");
        } else {
          finalStrippedItem = strippedItem;
        }
        choppedItem = finalStrippedItem.replace(/\s+/g, "");
      }

      const quantity = row[3];
      const moveUOM = row[4];

      const lpnData = row[5];
      let lpn = "";
      let destinationLPN = "";
      if (typeof lpnData === "string" && lpnData.includes("\n")) {
        lpn = lpnData.split("\n")[0];
        destinationLPN = lpnData.split("\n")[1];
      } else {
        lpn = lpnData;
      }

      let subLPNdata = row[6];
      let subLPN = "";
      let destinationSubLPN = "";

      if (typeof subLPNdata === "string" && subLPNdata.includes("\n")) {
        subLPN = subLPNdata.split("\n")[0];
        destinationSubLPN = subLPNdata.split("\n")[1];
      } else {
        subLPN = subLPNdata;
      }

      let detailLPNData = row[7];
      let detailLPN = "";
      let destinationDetailLPN = "";

      if (typeof detailLPNData === "string" && detailLPNData.includes("\n")) {
        detailLPN = detailLPNData.split("\n")[0];
        destinationDetailLPN = detailLPNData.split("\n")[1];
      } else {
        detailLPN = detailLPNData;
      }

      let sourceLocationData = row[8];
      let sourceLocation = "";
      let destinationLocation = "";

      if (
        typeof sourceLocationData === "string" &&
        sourceLocationData.includes("\n")
      ) {
        sourceLocation = sourceLocationData.split("\n")[0];
        destinationLocation = sourceLocationData.split("\n")[1];
      } else {
        sourceLocation = sourceLocationData;
      }

      let sourceAreaData = row[9];
      let sourceArea = "";
      let destinationArea = "";

      if (typeof sourceAreaData === "string" && sourceAreaData.includes("\n")) {
        sourceArea = sourceAreaData.split("\n")[0];
        destinationArea = sourceAreaData.split("\n")[1];
      } else {
        sourceArea = sourceAreaData;
      }

      return {
        date,
        time: `${time} ${meridian}`,
        user: strippedUser,
        activity,
        operation,
        itemNumber: choppedItem,
        warehouse,
        quantity,
        moveUOM,
        lpn,
        destinationLPN,
        subLPN,
        destinationSubLPN,
        detailLPN,
        destinationDetailLPN,
        sourceLocation,
        destinationLocation,
        sourceArea,
        destinationArea,
      };
    });
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    res.json(formattedData); // Send the processed data back to the client
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("Error processing file");
  }

  const filePath = path.join(process.cwd(), "uploads", uploadedFile);
}
