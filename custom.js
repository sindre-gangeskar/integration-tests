const fs = require('fs');
const path = require('path');

function save(countries) {
    fs.writeFile(
        path.join(__dirname, '.', './countries.json'),
        JSON.stringify(countries, null, 2), error => {
            if (error) throw error;
        }
    )
}

module.exports = { save };