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
// const userCollection = "users";
const medicalRecordCollection = db.collection("medicalRecord");
const userCollection = db.collection("users");
const requestsCollection = db.collection("requests");
const hospitalCollection = db.collection("hospital");
const providerCollection = db.collection("provider");
const dCenterCollection = db.collection("dCenter");

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
// hospital add invoices and medical records
//
app.post("/hospital/invoice/", async (req, res) => {
  await bc.addEntity("Invoice", req, res);
});

// app.post(
//   "/hospital/medicalRecord/",
//   upload.single("recordFile"),
//   async (req, res) => {
//     console.log(req);
//     console.log(req.file);
//     // console.log(req.files.recordFile);
//     res.send("yay");
//     // await bc.addMedicalRecord("hospital", req, res);
//   }
// );
const FieldValue = admin.firestore.FieldValue;

app.post("/hospital/medicalRecord", async (req, res) => {
  res1 = await medicalRecordCollection.add({
    uid: req.body.owner,
    name: req.body.doctorName,
    hospital: req.body.hospitalId,
    date: FieldValue.serverTimestamp(),
  });
  console.log(res1.id);
  req.body["mRecordId"] = res1.id;
  req.body["$class"] = "orange.medicalblocks.MedicalRecord";
  req.body["owner"] = "resource:orange.medicalblocks.User#" + req.body.owner;
  req.body.hospital = req.body.hospitalId;
  delete req.body.hospitalId;
  console.log(req.body);
  await bc.addMedicalRecord("hospital", req, res, {sand: false});
  res.send({id: res1.id});
});

app.post("/hospital/medicalRecord/addUrl", async (req, res) => {
  const recRef = medicalRecordCollection.doc(req.body.id);

  const res1 = await recRef.set(
    {
      url: req.body.url,
    },
    {merge: true}
  );
  res.status(200).send("done");
});

app.get("/provider/get/:id", async (req, res) => {
  await bc.getBC(`/InsuranceProvider/${req.params.id}`, req, res);
});
app.get("/provider/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "iProvider",
    "IProviderAccessedMedicalRecords",
    req,
    res
  );
});
app.get("/provider/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "iProvider",
    "IProviderAccessedInsuranceRecords",
    req,
    res
  );
});
app.post("/provider/insuranceRecord/", async (req, res) => {
  await bc.addInsuranceRecord(req, res);
});
app.get("/provider/invoice/", async (req, res) => {
  await bc.queryBCOneParam("iProvider", "IProviderAccessedInvoices", req, res);
});

app.get("/dCenter/get/:id", async (req, res) => {
  await bc.getBC(`/DiagCenter/${req.params.id}`, req, res);
});
app.get("/dCenter/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam(
    "dCenter",
    "DCenterAccessedMedicalRecords",
    req,
    res
  );
});
app.post("/dCenter/medicalRecord/", async (req, res) => {
  await bc.addMedicalRecord("dCenter", req, res);
});

//USER VIEWS
app.get("/user/get/:id", async (req, res) => {
  const doc = await db.collection("users").doc(req.params.id).get();
  if (!doc.exists) {
    console.log("User does not exist!");
  } else {
    res.send(doc.data());
  }
  // await bc.getBC(`/User/${req.params.id}`, req, res);
});
app.post("/user/add", async (req, res) => {
  let postData = {
    $class: "orange.medicalblocks.User",
    userId: req.body.uid,
  };
  await bc.postJSON("/User", postData, res);
});
app.get("/user/medicalRecord/", async (req, res) => {
  await bc.queryBCOneParam("user", "UserMedicalRecords", req, res);
});

// VIEWS
async function sendSnapshot(snapshot, res) {
  if (snapshot.empty) {
    res.send([]);
    return;
  }
  const arr = [];
  snapshot.forEach((doc) => {
    arr.push({id: doc.id, data: doc.data()});
  });
  res.send(arr);
}
app.get("/user/views/medicalRecord/:userId", async (req, res) => {
  const snapshot = await medicalRecordCollection
    .where("uid", "==", req.params.userId)
    .get();
  await sendSnapshot(snapshot, res);
});
app.get("/user/views/requests/pending/:userId", async (req, res) => {
  const snapshot = await requestsCollection
    .where("ownerId", "==", req.params.userId)
    .where("accessStatus", "==", false)
    .where("revokedStatus", "==", false)
    .get();
  await sendSnapshot(snapshot, res);
});
app.get("/user/views/requests/granted/:userId", async (req, res) => {
  const snapshot = await requestsCollection
    .where("ownerId", "==", req.params.userId)
    .where("accessStatus", "==", true)
    .where("revokedStatus", "==", false)
    .get();
  await sendSnapshot(snapshot, res);
});
app.get("/user/views/requests/revoked/:userId", async (req, res) => {
  const snapshot = await requestsCollection
    .where("ownerId", "==", req.params.userId)
    .where("accessStatus", "==", false)
    .where("revokedStatus", "==", true)
    .get();
  await sendSnapshot(snapshot, res);
});
app.get("/hospital/views/requests/pending/:hospitalId", async (req, res) => {
  const snapshot = await requestsCollection
    .where("hospital", "==", req.params.hospitalId)
    .where("accessStatus", "==", false)
    .where("revokedStatus", "==", false)
    .get();
  await sendSnapshot(snapshot, res);
});
app.get("/hospital/views/requests/granted/:hospitalId", async (req, res) => {
  const snapshot = await requestsCollection
    .where("hospital", "==", req.params.hospitalId)
    .where("accessStatus", "==", true)
    .where("revokedStatus", "==", false)
    .get();
  await sendSnapshot(snapshot, res);
});
//Get mRecord details with ID
app.get("/user/views/mRecordId/:mRecordId", async (req, res) => {
  const snapshot = await medicalRecordCollection
    .doc(req.params.mRecordId)
    .get();
  res.send(snapshot.data());
});
//Get Hospital Name from UID
app.get("/user/views/getHospitalName/:hId", async (req, res) => {
  const snapshot = await hospitalCollection.doc(req.params.hId).get();
  res.send(snapshot.data());
});

// app.get("/user/medicalRecord/", async (req, res) => {
//   await bc.queryBCOneParam("user", "UserMedicalRecords", req, res);
// });
app.get("/user/insuranceRecord/", async (req, res) => {
  await bc.queryBCOneParam("user", "UserInsuranceRecords", req, res);
});
app.get("/user/invoice/", async (req, res) => {
  await bc.queryBCOneParam("user", "UserInvoices", req, res);
});
app.get("/user/getUid/", async (req, res) => {
  if ("phoneNumber" in req.query) {
    admin
      .auth()
      .getUserByPhoneNumber("+" + req.query.phoneNumber)
      .then((userRecord) => {
        console.log(`Successfully fetched user data:  ${userRecord.toJSON()}`);
        res.status(200).send(userRecord);
        return true;
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
        res.status(500).send(error);
      });
  } else {
    res.status(400).send("Not enough parameters");
  }
});

app.get("/admin/getBioData/:uid", async (req, res) => {
  const userRef = db.collection("users").doc(req.params.uid);
  const doc = await userRef.get();
  if (!doc.exists) {
    console.log("No such document!");
  } else {
    res.send(doc.data().credentials);
    console.log("Document data:", doc.data().credentials);
  }
});

// admin
app.get("/admin/hospital", async (req, res) => {
  await bc.getBC("/Hospital", req, res);
});

app.get("/admin/getCustomToken", async (req, res) => {
  if (!("uid" in req.query)) {
    res.status(400).send("Need uid");
    return;
  }
  admin
    .auth()
    .createCustomToken(req.query.uid)
    .then((customToken) => {
      // Send token back to client
      res.status(200).send(customToken);
      return;
    })
    .catch((error) => {
      console.log("Error creating custom token:", error);
      res.status(500).send(error);
    });
});

app.post("/admin/hospital", async (req, res) => {
  await bc.createUser("Hospital", hospitalCollection, "h", req, res);
});

app.get("/admin/diagCenter", async (req, res) => {
  await bc.getBC("/DiagCenter", req, res);
});

app.post("/admin/diagCenter", async (req, res) => {
  await bc.createUser("DiagCenter", dCenterCollection, "dCentre", req, res);
});

app.get("/admin/iProvider", async (req, res) => {
  await bc.getBC("/InsuranceProvider", req, res);
});

app.post("/admin/iProvider", async (req, res) => {
  await bc.createUser("InsuranceProvider", providerCollection, "i", req, res);
});

// medical record access
async function grantAccess(body, res) {
  body["$class"] = "orange.medicalblocks.GrantAccess";

  await bc.postJSON("/GrantAccess", body, res);
}
async function revokeAccess(body, res) {
  body["$class"] = "orange.medicalblocks.RemoveAccess";

  await bc.postJSON("/RemoveAccess", body, res);
}
app.post("/grantAccess", async (req, res) => {
  const requestId = req.body.requestId;
  const requestRef = requestsCollection.doc(requestId);
  const request = (await requestRef.get()).data();
  request.accessStatus = true;
  request.ackDateTime = admin.firestore.Timestamp.now();
  console.log(request);
  await requestRef.update(request);
  const bRequest = {};
  const required = {
    mRecord: null,
    iRecord: null,
    hospital: null,
    iProvider: null,
    dCenter: null,
  };
  for (const p in request) {
    if (p in required) bRequest[p] = request[p];
    else if (p === "hospital")
      bRequest[p] = "orange.medicalblocks.Hospital#" + request[p];
    else if (p === "mRecord")
      bRequest[p] = "orange.medicalblocks.MedicalRecord#" + request[p];
  }
  await grantAccess(bRequest, res);
});
app.post("/revokeAccess", async (req, res) => {
  const requestId = req.body.requestId;
  const requestRef = requestsCollection.doc(requestId);
  const request = (await requestRef.get()).data();
  request.revokedStatus = true;
  request.accessStatus = false;
  request.revokeDateTime = admin.firestore.Timestamp.now();
  console.log(request);
  await requestRef.update(request);
  const bRequest = {};
  const required = {
    mRecord: null,
    iRecord: null,
    hospital: null,
    iProvider: null,
    dCenter: null,
  };
  for (const p in request) {
    if (p in required) bRequest[p] = request[p];
  }
  await revokeAccess(bRequest, res);
});
app.post("/requestAccess", async (req, res) => {
  console.log("Requesting access", req.body);
  req.body.reqDateTime = admin.firestore.Timestamp.now();
  req.body.accessStatus = false;
  req.body.revokedStatus = false;
  let added = await requestsCollection.add(req.body);
  res.send({id: added.id});
});

// trusted contacts
app.get("/user/trustedContacts/:userId", async (req, res) => {
  const userId = req.params.userId;

  const user = (await userCollection.doc(userId).get()).data();
  const trustedContactsRefs = [];
  user.trustedContacts.forEach(tuid => {
    trustedContactsRefs.push(userCollection.doc(tuid).get());
  });
  const trustedContactsObjs = await Promise.all(trustedContactsRefs);
  const trustedContacts = trustedContactsObjs.map(x => {
    let data = x.data();
    return {
      name: data.name,
      uid: data.uid
    }
  });
  res.send(trustedContacts);
});
app.post("/user/trustedContact/", async (req, res) => {
  const userId = req.body.userId;
  const contactId = req.body.contactId;

  const userRef = userCollection.doc(userId);
  const user = (await userRef.get()).data();
  if ("trustedContacts" in user) {
    user.trustedContacts.push(contactId);
  } else {
    user.trustedContacts = [contactId];
  }
  userRef
    .set(user)
    .then(() => {
      res.send("Added contact");
      return;
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.post("/user/trustedContact/revoke", async (req, res) => {
  const userId = req.body.userId;
  const contactId = req.body.contactId;

  const userRef = userCollection.doc(userId);
  const user = (await userRef.get()).data();
  if ("trustedContacts" in user) {
    user.trustedContacts = user.trustedContacts.filter((tc) => tc !== contactId);
  } else {
    user.trustedContacts = [];
  }
  userRef
    .set(user)
    .then(() => {
      res.send("Removed contact");
      return;
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/user/trustedBy/:userId", async (req, res) => {
  const userId = req.params.userId;

  const users = await userCollection
    .where("trustedContacts", "array-contains", userId)
    .get();

  if (users.empty) {
    res.send("No matching documents.");
    return;
  }

  const arr = [];
  users.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    arr.push({id: doc.id, data: doc.data});
  });
  res.send(arr);
});

app.post("/medicalRecord/verifyHash", async (req, res) => {
  let hash = req.body.hash;
  let fileId = req.body.fileId;

  fetch(bc.bApiUrl + `/MedicalRecord/${fileId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      let actualHash = data.mRecordHash;
      console.log(hash, actualHash);
      if (actualHash === hash) {
        res.status(200).send({matched: true});
        return true;
      } else {
        res.status(201).send({matched: false});
        return false;
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
