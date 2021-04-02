const express = require("express");
const axios = require("axios");
const redis = require("redis");
const fetch = require("node-fetch");
const app = express();

const redis_port = 6379;
const client = redis.createClient(redis_port);


client.on("error", (err) => {
    console.log(err);
})

app.get("/all", (req, res) => {

    try{
        fetch("https://jobs.github.com/positions.json")
        .then(resp => resp.json())
        .then(data => {
            res.send({
                message: "Data retrieved by postman",
                JOBS: data
            })
        })
    }
    catch(err){
        res.status(404).send({
            message: "Server Error!!!"
        })
        console.log(err);
    }

})

app.get("/jobs", (req, res) => {
    const searchTerm = req.query.search;
    fetch(`https://jobs.github.com/positions.json?search=${searchTerm}`)
    .then(resp => resp.json())
    .then(data => {
        const apiData = data[0];
        client.setex("datas", 8000, JSON.stringify(apiData));
        res.status(200).send({
            Jobs: apiData
        });
    })
});


// app.post("/", (req, res) => {

// })


app.listen(process.env.PORT || 3010, () => {
    console.log("Server is running...");
})