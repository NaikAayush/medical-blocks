const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const bc = require("./blockchain");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
// const cors = require("cors");

//initialize express server
const app = express();
const main = express();

//add the path to receive request and set json as bodyParser to process the body
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));
app.use(cors({origin: true}));

// app.use(decodeIDToken);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

//initialize the database and the collection
const db = admin.firestore();

//define google cloud function name
exports.webApi = functions.https.onRequest(main);

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeIDToken(req, res) {
  if (
    "authorization" in req.headers &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      res.status(401).send(err);
    }
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.get("/medicalRecord/get/:id", async (req, res) => {
  await bc.getBC(`/MedicalRecord/${req.params.id}`, req, res);
});
app.get("/insuranceRecord/:id", async (req, res) => {
  await bc.getBC(`/InsuranceRecord/${req.params.id}`, req, res);
});
app.get("/invoice/:id", async (req, res) => {
  await bc.getBC(`/Invoice/${req.params.id}`, req, res);
});

// hospital get
app.get("/hospital/get/:id", async (req, res) => {
  await bc.getBC(`/Hospital/${req.params.id}`, req, res);
});
app.get("/hospital/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "hospital",
    "HospitalAccessedMedicalRecords",
    req,
    res
  );
});
app.get("/hospital/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "hospital",
    "HospitalAccessedInsuranceRecords",
    req,
    res
  );
});
app.get("/hospital/invoice/", async (req, res) => {
  await bc.queryBCOneParam("hospital", "HospitalInvoices", req, res);
});

