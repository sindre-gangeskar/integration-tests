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
  await save(countries);
  res.json({ status: 'success', country: req.body });
})

router.put('/:name', async function (req, res, next) {
  let countryUpdated = false;

  countries = countries.map(country => {
    if (country.name === req.params.name) {
      countryUpdated = true;
      return req.body;  // Update the country with the new data
    }
    return country;  // Return the country unchanged
  });

  if (!countryUpdated) {
    return res.status(404).json({ message: 'Could not find country with specified name', statusCode: 404 });
  }

  await save(countries);
  res.json({ status: 'success', countryInfo: req.body });
});

router.delete('/:name', async function (req, res, next) {
  countries = countries.filter(x => x.name !== req.params.name)
  await save(countries);
  res.json({
    status: 'success',
    removed: req.params.name,
    newLength: countries.length
  });
})


module.exports = router;
