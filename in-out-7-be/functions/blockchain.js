const admin = require("firebase-admin");
const fetch = require("node-fetch");
const serviceAccount = require("./service-account.json");

//initialize firebase inorder to access its services
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://in-out-7-298618.firebaseio.com/",
  storageBucket: "in-out-7-298618.appspot.com"
});

// blockchain API details
const bApiUrl = "http://34.87.143.68:3000/api";
exports.bApiUrl = bApiUrl;

exports.queryBCOneParam = async (param, route, req, res) => {
  if (!(param in req.query)) {
    res.status(400).send("Need parameter ", param);
    return;
  }
  params = {};
  params[param] = req.query[param];

  fetch(bApiUrl + `/queries/${route}?` + new URLSearchParams(params), {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.addMedicalRecord = async (userType, req, res, options) => {
  let body = Object.assign({}, req.body);
  delete body[userType];
  body[`${userType}sWithAccess`] = [req.body[userType]];
  body["$class"] = "orange.medicalblocks.MedicalRecord";

  await exports.postJSON("/MedicalRecord", body, res, options);
};

exports.addInsuranceRecord = async (req, res) => {
  let body = Object.assign({}, req.body);
  body["$class"] = "orange.medicalblocks.InsuranceRecord";

  await exports.postJSON("/InsuranceRecord", body, res);
};

exports.getBC = async (route, req, res) => {
  fetch(bApiUrl + route, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.postJSON = async (route, body, res, options = {sand: true}) => {
  const headers = {
    "Content-Type": "application/json",
  };
  console.log(JSON.stringify(body));
  fetch(bApiUrl + route, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (options.sand) return res.status(200).send(data);
      else console.log(data);
      return true;
    })
    .catch((err) => {
      if (options.sand) res.status(500).send(err);
      console.log(err);
    });
};

exports.addEntity = async (entity, req, res) => {
  let body = req.body;
  console.log(body);
  body["$class"] = `orange.medicalblocks.${entity}`;
  console.log(body);

  await exports.postJSON(`/${entity}`, body, res);
};

exports.createUser = async (userType, collection, prefix, req, res) => {
  admin
    .auth()
    .createUser({
      email: req.body.email,
      emailVerified: false,
      displayName: req.body.name,
    })
    .then(async (userRecord) => {
      body = Object.assign({}, req.body);
      req.body = {};
      req.body[`${prefix}Id`] = userRecord.uid;
      req.body[`${prefix}Name`] = userRecord.displayName;
      await Promise.all([
        collection.doc(userRecord.uid).set(body),
        exports.addEntity(userType, req, res),
      ]);
      return true;
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};
