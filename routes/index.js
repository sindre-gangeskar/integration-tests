var express = require('express');
var router = express.Router();
var countries = require('../countries.json');
var fs = require('fs');
var path = require('path');
var { save } = require('../custom.js');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(countries);
});

router.get('/:name', function (req, res, next) {
  const findCountry = countries.find(x => x.name === req.params.name)

  if (!findCountry) {
    res.status(404).json({ message: 'Could not find country with specified name', statusCode: 404 })
  }
  else res.json(findCountry);
})

router.post('/', async function (req, res, next) {
  countries.push(req.body);
  save(countries);
  res.json({ status: 'Success', country: req.body });
})

router.put('/:name', async function (req, res, next) {
  countries = countries.map(country => {
    if (country.name === req.params.name)
      return req.body;
    else return country;
  })
  save(countries);
})

router.delete('/:name', async function (req, res, next) {
  countries = countries.filter(x => x.name !== req.params.name)
  save(countries);
  res.json({
    status: 'Success',
    removed: req.params.name,
    newLength: countries.length
  });
})


module.exports = router;
