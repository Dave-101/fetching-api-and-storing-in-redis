const express = require("express");
// const axios = require("axios");
const redis = require("redis");
// const fetch = require("node-fetch");
const app = express();

const redis_port = 6379;
const client = redis.createClient(redis_port);

client.on("error", (err) => {
    console.log(err);
})

// client.set("alldata", "value1");

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json());

app.post("/post", (req, res) => {

    const data = req.body;
    if (data == undefined) {
        res.status(400).send({
            "msg": "error!"
        })
    }
    else {
        res.send(data);
        var redisData = JSON.stringify(data);
        client.set(String(data.id), redisData);
    }
})

app.get("/get/:id", (req, res) => {
    const redisId = req.params.id;
    const val = client.get(redisId, (err, allData) => {
        if (err) {
            res.status(400).send(err);
        }
        if (allData) {
            // console.log(allData);
            res.status(200).send(JSON.parse(allData));
        }
    })
})

// app.get("/get", (req, res) => {

// })

// app.post("/postHset", (req, res) => {
//     const allData = req.body;
//     const key = req.body.id;
//     // console.log(key);
// console.log(allData)

//     client.hmset(key, [
//         'id', req.body.id,
//         'value', String(req.body.value),
//         'number', req.body.number
//        ], 
//        function(error, reply){
//         if(error){
//             console.log(error);
//         }
//         console.log(reply);
//         res.send(allData);
//     });
// })

app.get("/getAll", (req, res) => {
    var redis = require('redis'),
        client = redis.createClient();

    client.keys('*', function (err, keys) {
        if (err) return console.log(err);

        for (var i = 0, len = keys.length; i < len; i++) {
            console.log(keys[i]);
        }
    });
})

app.post('/call', function (req, res) {
    var newCall = {
        name: req.body.name,
        company: req.body.company,
        phone: req.body.phone,
        time: req.body.time,
        age: req.body.age
    };

    client.hmset(`${newCall.name}`, [
        'name=', newCall.name,
        'company=', newCall.company,
        'phone=', newCall.phone,
        'time=', newCall.time,
        'age=', newCall.age
    ], function (error, reply) {
        if (error) {
            console.log(error);
        }
        console.log(reply);
        res.send(newCall);
    });
});



app.listen(process.env.PORT || 3010, () => {
    console.log("Server is running...");
})