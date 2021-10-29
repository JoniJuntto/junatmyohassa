const fetch = require("node-fetch");
const express = require("express");
const app = express();

//Added because express hitted the max limit when fetching all the trains
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

//kikkaillaan digitrafficin rajapinnoille sopivaan formaattiin päivä
const today = new Date();

const finalform = today.toISOString().split("T")[0];

console.log(finalform);

//Hakee kaikkki tämän päivän junat
app.get("/kaikki", async (req, res) => {
  try {
    const response = await fetch(
      `https://rata.digitraffic.fi/api/v1/trains/${finalform}`
    );
    const json = await response.json();
    res.json(json);
    console.log("tämä tapahtui");
  } catch (error) {
    res.json(error);
  }
});

//mielivaltanen haku graphql rajapinnasta
app.get("/graphfetch/:id", async (req, res) => {
  const id = req.params.id;

  const query = `
{
  trainsByDepartureDate(departureDate: "${finalform}", 
    where: {timeTableRows:{contains:{station:{shortCode:{equals:"${id}"}}}}}
    ) {
    trainNumber
    commuterLineid
    
    timeTableRows(where: {and: [ {station: {shortCode: {equals: "${id}"}}}, {type: {equals: "DEPARTURE"}}]})
      {
      type
      differenceInMinutes
      scheduledTime
      station {
        shortCode
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

    res.json(json.data.trainsByDepartureDate);
  } catch (error) {
    res.json(error);
  }
});
/* Hakee junat jotka kulkevat valitsemien asemien välillä. Esim /HKI/MRL
    Linkki lyhennekoodeihin : https://rata.digitraffic.fi/api/v1/metadata/stations */
app.get("asemienvali/:mist/:mihin", async (req, res) => {
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

app.get("/asema/:asema/", async (req, res) => {
  const asema = req.params.asema;
  console.log(req.params);
  try {
    const response = await fetch(`
    https://rata.digitraffic.fi/api/v1/live-trains/station/${asema}?arrived_trains=2&arriving_trains=2&departed_trains=2&departing_trains=2&include_nonstopping=false`);

    const data = await response.json();

    res.send(data);
  } catch (error) {
    res.json(error);
  }
});

/* Hakee junan sijainnin junan numerolla */
app.get("/sijainti/:junanumero", async (req, res) => {
  const junanumero = req.params.junanumero;
  console.log(req.params);
  console.log("Trying to get trains location")

  try {
    const response = await fetch(`
    https://rata.digitraffic.fi/api/v1/train-locations/latest/${junanumero}`);
    const json = await response.json();
    res.json(json);
    console.log("Train location received " + json[0].location.coordinates);
  } catch (error) {
    res.json(error);
  }
});



app.listen(3000, () => console.log("listening at 3000"));

