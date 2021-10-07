const fetch = require("node-fetch");
const express = require("express");
const app = express();

//kikkaillaan digitrafficin rajapinnoille sopivaan formaattiin päivä
const today = new Date();
const date = today.toLocaleDateString();
const finalform = date.split("/").reverse().join("-");

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
app.get("/graphfetch", async (req, res) => {
  const query = ` 
{
  trainsByDepartureDate(
    departureDate: "${finalform}", 
    where: {and: [ {operator: {shortCode: {equals: "vr"}}}, {commuterLineid: {equals: "P"}}]}, 
    orderBy: {trainNumber: DESCENDING}) 
  {
    trainNumber
    departureDate
    commuterLineid
    timeTableRows {
      station {
        name
        uicCode
      }
    }
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
