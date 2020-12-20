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
