const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./connection/db");
const Joi = require("joi");
const axios = require("axios");

const app = express();
const port = 3001;

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("Welcome to Node js App");
  res.json({ message: "Welcome to Node js App" });
});

app.get("/api/fetch-cert", (req, res) => {
  // const sql = "SELECT * FROM user_requests";
  // db.query(sql, (err, result) => {
  //   if (err) {
  //     console.error("Error inserting into MySQL:", err);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   } else {
  //     console.log("Data inserted into MySQL:", result);
  //     res.json({ message: "Form submitted successfully" });
  //   }
  // });

  getCertifcateUrl = process.env.GET_CERT_URL + process.env.KEY;

  axios
    .get(getCertifcateUrl)
    .then((response) => {
      // Handle the response from the remote server
      // console.log("Data from remote server:", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data from remote server:", error.message);
    });
});

app.post("/api/submit-form", (req, res) => {
  console.log("in submit-form:");
  const certRequestSchema = Joi.object({
    addressTo: Joi.string().required(),
    purpose: Joi.string().min(50).required(),
    issuedOn: Joi.date().iso().required(),
    employeeId: Joi.number().required(),
  });

  const result = certRequestSchema.validate(req.body);
  if (result.error) {
    return res.status(404).json({
      error: result.error.details[0].message,
    });
  }

  const certFormRequest = result.value;

  const { addressTo, purpose, issuedOn, employeeId } = certFormRequest;

  const certFormData = {
    address_to: addressTo,
    purpose: purpose,
    issued_on: issuedOn,
    employee_id: employeeId,
  };

  console.log("Data certFormData:", certFormData);

  const sql =
    "INSERT INTO user_requests (address, purpose, issue_date, status) VALUES (?)";

  const values = [addressTo, purpose, issuedOn, employeeId];

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error inserting into MySQL:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Data inserted into MySQL:", result);
      // res.json({ message: "Form submitted successfully" });

      certifcateServerUrl = process.env.REQUEST_CERT_URL + process.env.KEY;
      axios
        .post(certifcateServerUrl, certFormData)
        .then((response) => {
          console.log("Response from remote server:", response.data);
        })
        .catch((error) => {
          console.error("Error sending POST request:", error.message);
        });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
