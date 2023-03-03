const express = require("express");
const axios = require("axios");
const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

/*app.post("/todo", (req, res) => {
  axios.post("http://localhost:3000/todo", req.body)
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});
*/
app.listen(3002, () => {
  console.log("API server is listening on port 3002");
});

app.get("/todo", (req, res) => {
  axios.get("http://localhost:5000/todos")
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});
/*app.post("/todo", (req, res) => {
  axios.post("http://backend-service/todo", req.body)
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});
*/