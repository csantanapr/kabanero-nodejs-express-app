const app = require('express')()

app.get('/', (req, res) => {
  res.send("Hello from Appsody 2");
});

module.exports.app = app;
