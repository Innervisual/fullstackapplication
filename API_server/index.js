const express = require("express");

const app = express();

app.post("/todo", (req, res) => {
    // Handle the request to create a new to-do item
  });
  

  app.listen(3000, () => {
    console.log("API server is listening on port 3000");
  });
  
  const axios = require("axios");

app.post("/todo", (req, res) => {
  // Send the request to the backend service
  axios.post("http://backend-service/todo", req.body)
    .then(response => {
      // Return the response from the backend service to the frontend
      res.send(response.data);
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error(error);
      res.sendStatus(500);
    });
});
