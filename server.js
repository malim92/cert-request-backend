const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json());

app.post('/api/submit-form', (req, res) => {
  const formData = req.body;

  console.log(formData);
  res.json({ message: 'Form submitted successfully' });
});

app.get('/', (req, res) => {
    console.log('Welcome to Node js App');
    res.json({ message: 'Welcome to Node js App' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
