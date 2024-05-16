const express = require('express');
const router = express.Router();
const request = require('supertest');
const indexRouter = require('./routes/index');
const app = express();
app.use('/', indexRouter);

/* Dummy data to test */
/* jest.mock('./countries.json', () => [
    {
        "short": "EN",
        "name": "England",
        "capital": "London"
    },
    {
        "short": "DE",
        "name": "Germany",
        "capital": "Berlin"
    },
    {
        "short": "PL",
        "name": "Poland",
        "capital": "Warsaw"
    },
    {
        "short": "IT",
        "name": "Italy",
        "capital": "Rome"
    },
    {
        "name": "Scotland",
        "short": "SC",
        "capital": "Edinburgh"
    }
]) */

/* Compare dummy data with request - must match dummy data exactly. */
let firstCountry;
describe("testing-server-routes", () => {
    test("GET / - success", async () => {
        const { body } = await request(app).get("/");
        expect(body).toEqual([
            {
                "short": "EN",
                "name": "England",
                "capital": "London"
            },
            {
                "short": "DE",
                "name": "Germany",
                "capital": "Berlin"
            },
            {
                "short": "PL",
                "name": "Poland",
                "capital": "Warsaw"
            },
            {
                "short": "IT",
                "name": "Italy",
                "capital": "Rome"
            },
            {
                "name": "Scotland",
                "short": "SC",
                "capital": "Edinburgh"
            }
        ]);
        firstCountry = body[ 0 ];
    });

    /* Test first country object in the get request */
    test('GET /England - Success', async () => {
        const { body } = await request(app).get(`/${firstCountry.name}`);
        expect(body).toEqual(firstCountry);
    })
});

