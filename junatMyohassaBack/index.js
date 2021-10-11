const fetch = require("node-fetch");
const express = require("express");
const app = express();

//Added because express hitted the max limit when fetching all the trains
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

//kikkaillaan digitrafficin rajapinnoille sopivaan formaattiin päivä
const today = new Date();
console.log(today);
const date = today.toLocaleDateString("en-US", {
  year: "numeric",
  day: "2-digit",
  month: "2-digit",
});
console.log(date);
const finalform = date.split("/").reverse().join("-");
console.log(finalform);

//Hakee kaikkki tämän päivän junat
app.get("/kaikki", async (req, res) => {
  try {
    const response = await fetch(
      `https://rata.digitraffic.fi/api/v1/trains/${finalform}`
    );
    const json = await response.json();
    res.json(json);
  } catch (error) {
    res.json(error);
  }
});

//mielivaltanen haku graphql rajapinnasta
app.get("/graphfetch/:id", async (req, res) => {
  const id = req.params.id;

  const query = `

{
  trainsByDepartureDate(
    departureDate: "${finalform}",
    where: {and: [ {operator: {shortCode: {equals: "vr"}}}, {commuterLineid: {equals: "${id}"}}]},
    orderBy: {trainNumber: DESCENDING})
  {
    trainNumber
    departureDate
    trainLocations{
      location
    }
    commuterLineid
  }
}
`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept-Encoding": " gzip" },
    body: JSON.stringify({ query }),
  };

  try {
    const response = await fetch(
      "https://rata.digitraffic.fi/api/v2/graphql/graphql",
      options
    );
    const json = await response.json();
    res.json(json.data);
  } catch (error) {
    res.json(error);
  }
});

/* Hakee junat jotka kulkevat valitsemien asemien välillä. Esim /HKI/MRL
    Linkki lyhennekoodeihin : https://rata.digitraffic.fi/api/v1/metadata/stations */
app.get("/:mist/:mihin", async (req, res) => {
  const mist = req.params.mist;
  const mihin = req.params.mihin;
  console.log(req.params);

  try {
    const response = await fetch(`
    https://rata.digitraffic.fi/api/v1/live-trains/station/${mist}/${mihin}`);
    const json = await response.json();
    res.json(json);
  } catch (error) {
    res.json(error);
  }
});

app.listen(3000, () => console.log("listening at 3000"));
