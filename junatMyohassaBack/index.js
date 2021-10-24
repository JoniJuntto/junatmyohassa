const fetch = require("node-fetch");
const express = require("express");
const app = express();

//Added because express hitted the max limit when fetching all the trains
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

//kikkaillaan digitrafficin rajapinnoille sopivaan formaattiin päivä
const today = new Date();
console.log(today);
console.log(today.toISOString().split("T")[0], "kamoon");

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

    Object.keys(json.data.trainsByDepartureDate).forEach(function (prop) {
      json.data.trainsByDepartureDate[prop].timeTableRows.push(
        json.data.trainsByDepartureDate[prop].trainNumber
      );
    });

    console.log(json.data.trainsByDepartureDate.timeTableRows);
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

// to enable deep level flatten use recursion with reduce and concat
function flatten(input) {
  const stack = [...input];
  const result = [];
  while (stack.length) {
    // pop value from stack
    const next = stack.pop();
    if (Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      result.push(next);
    }
  }
  // reverse to restore input order
  return result.reverse();
}

function iterateObject(obj) {
  let inner_obj = {}; //Blankko objekti joka myöhemmin täytetään
  for (prop in obj) {
    if (typeof obj[prop] === "object") {
      iterateObject(obj[prop]);
    } else {
      // käydään läpi tota kasaa paskaa ja etitään allaolevia "avaimia" ja sen jälkeen
      // löydetyt avaimet ja niiden parit sit läpsästään yllä olevaan blankkoon
      if (
        prop === "trainNumber" ||
        prop === "scheduledTime" ||
        prop === "commuterLineid"
      ) {
        inner_obj[prop] = obj[prop];
      }
    }
  }
  arr.push(inner_obj); //Sitten pusketaan oliot funktion ulkopuolella luotuun arrayhin
}

app.get("/asema/:asema/", async (req, res) => {
  const asema = req.params.asema;
  console.log(req.params);
  try {
    const response = await fetch(`
    https://rata.digitraffic.fi/api/v1/live-trains/station/${asema}?arrived_trains=2&arriving_trains=2&departed_trains=2&departing_trains=2&include_nonstopping=false`);

    const data = await response.json();

    const trainNr = data.map((s) => s.trainNumber + ", " + s.commuterLineID);
    console.log(trainNr);

    const times = data.reduce(
      (r, { timeTableRows }) => [...r, ...timeTableRows],
      []
    );
    console.log(times);
    const { scheduledTime, differenceInMinutes } = times;
    console.log(scheduledTime, differenceInMinutes);

    res.send(data);
  } catch (error) {
    res.json(error);
  }
});
app.listen(3000, () => console.log("listening at 3000"));
