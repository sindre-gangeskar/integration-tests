const express = require("express");
const serverRoutes = require("./index");
const request = require("supertest");
const app = express();
const { save } = require("../custom");
const bodyParser = require("body-parser");

jest.mock("../countries.json", () => [
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
    }
]);

jest.mock("../custom", () => ({
    save: jest.fn()
}));

app.use(bodyParser.json());
app.use("/", serverRoutes);
let firstCountry;

describe("testing-server-routes", () => {
    test("POST / - success", async () => {
        let countryObj = {
            short: "IT",
            name: "Italy",
            capital: "Rome"
        };

        const { body } = await request(app).post("/").send(countryObj);
        expect(body).toEqual({
            status: "success",
            country: {
                short: "IT",
                name: "Italy",
                capital: "Rome"
            },
        });

        expect(save).toHaveBeenCalledWith([
            {
                short: "EN",
                name: "England",
                capital: "London"
            },
            {
                short: "DE",
                name: "Germany",
                capital: "Berlin"
            },
            {
                short: "PL",
                name: "Poland",
                capital: "Warsaw"
            },
            {
                short: "IT",
                name: "Italy",
                capital: "Rome"
            }
        ]);
    });

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
            }
        ]);
        firstCountry = body[ 0 ];
    });

    test("GET /England - success", async () => {
        const { body } = await request(app).get(`/${firstCountry.name}`);
        expect(body).toEqual(firstCountry);
    });

    test("PUT /Poland - success", async () => {
        let countryObj = {
            name: 'Poland',
            short: 'PL',
            capital: 'Cracow'
        }

        const response = await request(app).put('/Poland').send(countryObj);
        expect(response.body).toEqual({
            status: "success",
            countryInfo: {
                short: "PL",
                name: "Poland",
                capital: "Cracow"
            },
        });

        expect(save).toHaveBeenCalledWith(
            [
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
                    "capital": "Cracow"
                },
                {
                    "short": "IT",
                    "name": "Italy",
                    "capital": "Rome"
                }
            ])
        expect(response.statusCode).toBe(200);
    });

    test("DELETE /Poland - success", async () => {
        const response = await request(app).delete('/Poland');
        const { body, statusCode } = response;
        expect(body).toEqual({
            status: 'success',
            removed: 'Poland',
            newLength: 3
        })

        expect(save).toHaveBeenCalledWith([
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
                "short": "IT",
                "name": "Italy",
                "capital": "Rome"
            }
        ])

        expect(statusCode).toBe(201)
    })
});
