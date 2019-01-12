const express = require("express");
const router = express.Router();
const Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appdaFHqyWFcRWHpj');

//assign home route
router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/posts", async (req, res) => {
  data = [];
  base('Posts').select({
    // fields: ['Selection Test', 'Salary Range 1'],
    // filterByFormula:
    maxRecords: 3,
    view: 'Grid view'
  }).firstPage(function (err, records) {
    if (err) { console.error(err); return; }
    res.json(records);
    // records.forEach(function (record, i) {
    //   console.log('Retrieved', record.get('Posts'));
    //   data.push(record.get('Vacancy Name'));
    // });
    // res.json({ data: data })
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.negotiate(err);
    }
    req.logout();
    res.redirect("/");
  });
});

module.exports = router;
