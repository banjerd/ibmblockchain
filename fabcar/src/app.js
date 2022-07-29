'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());


app.get('/queryAllCars', (req, res) => {
    network.queryAllCars()
        .then((response) => {
            console.log(response);
            let carsRecord = JSON.parse(response);
            res.send(carsRecord);
        });
});

app.get('/querySingleCar', (req, res) => {
    console.log(req.query);
    network.querySingleCar(req.query.key)
        .then((response) => {
            let carsRecord = JSON.parse(response);
            res.send(carsRecord);
        });
});

app.post('/createCar', (req, res) => {
    console.log(req.body);
    network.createCar(req.body)
        .then((response) => {
            res.send(response);
        });
});

app.post('/changeCarOwner', (req, res) => {
    network.changeCarOwner(req.body.key, req.body.newOwner)
        .then((response) => {
            res.send(response);
        });
});

network.EventaddBlockListener();

app.listen(process.env.PORT || 8084);
