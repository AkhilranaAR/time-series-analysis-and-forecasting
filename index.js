const timeseries = require("timeseries-analysis");
const fs = require("fs");
const readline = require('readline');
const express = require("express");
const path = require("path");
const { times } = require("underscore");
const app = express();


app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const writeDataToFile = async (num, input1, input2) => {
    fs.writeFile("inputDataFile", `Array ${num} : ${input1} Array 2 : ${input2}`, err => {
        if (err) {
            console.log("Error in writing data to inputDatafile");
        }
    });
};

// const writeDataToFile2 = async (num, input1, input2) => {
//     for (let i = 0; i < 100; i++) {
//         fs.writeFile("parsedData", `Array ${num} : ${input1} Array 2 : ${input2}`, err => {
//             if (err) {
//                 console.log("Error in writing data to inputDatafile");
//             }
//         });
//     }
// };

let data1 = [];
let data2 = [];

for (let i = 0; i < 15; i++) {
    // data.push({
    //     "date": event.toDateString(),
    //     "value": Math.floor(Math.random() * 10)
    // });
    let newArray = [];
    newArray.push(i + 1);
    newArray.push(Math.floor(Math.random() * 100) + 200);
    data1.push(newArray);
};


for (let i = 15; i < 30; i++) {
    let newArray2 = [];
    newArray2.push(i + 1);
    newArray2.push(Math.floor(Math.random() * 110) + 200);
    data2.push(newArray2);
};

// For user input:
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// rl.question('Enter the SLOC/day for 15 days: ', async (answer) => {
//     // TODO: Log the answer in a database
//     // console.log(`Thank you for your valuable feedback: ${answer}`);
//     // console.log(typeof answer);
//     // await answer;
//     data1 = answer.split(" ");
//     // console.log(data3);
//     rl.close();
// });

// Both data1 and data2 need to be initialised here: 

let beforeProcessedDataArray1 = [];
for (let i = 0; i < data1.length; i++) {
    // beforeProcessedDataArray1.push(data1[i][1]);
    const event = new Date(2021, 3, i + 1, 14, 39, 7);
    beforeProcessedDataArray1.push({
        "date": event.toDateString(),
        "value": data1[i][1]
    });
};
console.log(beforeProcessedDataArray1);
// let toString1 = beforeProcessedDataArray1.toString();
writeDataToFile(1, data1, data2);

// writeDataToFile2(1, data1, data2);


let beforeProcessedDataArray2 = [];
for (let i = 0; i < data2.length; i++) {
    // beforeProcessedDataArray1.push(data1[i][1]);
    const event = new Date(2021, 3, i + 1, 14, 39, 7);
    beforeProcessedDataArray2.push({
        "date": event.toDateString(),
        "value": data2[i][1]
    });
};
console.log(beforeProcessedDataArray2);
// writeDataToFile(2, data2);

let t1 = new timeseries.main(timeseries.adapter.fromDB(beforeProcessedDataArray1, {
    date: "date",
    value: "value"
}));

let t2 = new timeseries.main(timeseries.adapter.fromDB(beforeProcessedDataArray2, {
    date: "date",
    value: "value"
}));


let processedData1_ma = t1.ma().chart();
let processedData1_org = t1.ma({ period: 3 }).chart({ main: true });
let processeddata1_org_lwma = t1.ma({ period: 8 }).save('moving average').reset().lwma({ period: 6 }).save('LWMA').chart({ main: true });
let t1_ms_smoothing = t1.ma({
    period: 6
}).chart();
let t1_lwma_smoothing = t1.lwma({
    period: 6
}).chart();
let t1_noise_removed = t1.smoother({
    period: 10
}).chart();
let t1_min = t1.min();
let t1_max = t1.max();
let t1_mean = t1.mean();
let t1_std = t1.stdev();

// Forecasting on t1:
let t1_ARMaxEntropy = t1.ARMaxEntropy();
let t1_ARLeastSquare = t1.ARLeastSquare();
console.log(`ARMaxEntropy for Dataset 1: ${t1_ARMaxEntropy}`);
console.log(`ARLeastSquare for Dataset 1: ${t1_ARLeastSquare}`);


let processedData2_ma = t2.ma().chart();
let processedData2_org = t2.ma({ period: 3 }).chart({ main: true });
let processeddata2_org_lwma = t2.ma({ period: 8 }).save('moving average').reset().lwma({ period: 6 }).save('LWMA').chart({ main: true });
let t2_ms_smoothing = t2.ma({
    period: 6
}).chart();
let t2_lwma_smoothing = t2.lwma({
    period: 6
}).chart();
let t2_noise_removed = t2.smoother({
    period: 10
}).chart();
let t2_min = t2.min();
let t2_max = t2.max();
let t2_mean = t2.mean();
let t2_std = t2.stdev();

// Forecasting on t2:
// let nextValue = 6;
// let t2_ARMaxEntropy = t2.ARMaxEntropy({
//     data: t2.slice(0, nextValue - 1)
// });

// let forecast = 0;	// Init the value at 0.
// for (var i = 0; i < t2_ARMaxEntropy.length; i++) {	// Loop through the coefficients
//     forecast -= t2[nextValue - i][1] * t2_ARMaxEntropy[i];
//     // Explanation for that line:
//     // t.data contains the current dataset, which is in the format [ [date, value], [date,value], ... ]
//     // For each coefficient, we substract from "forecast" the value of the "N - x" datapoint's value, multiplicated by the coefficient, where N is the last known datapoint value, and x is the coefficient's index.
// }
// console.log("forecast", forecast);


let t2_ARMaxEntropy = t2.ARMaxEntropy();
let t2_ARLeastSquare = t2.ARLeastSquare();
console.log(`ARMaxEntropy for Dataset 2: ${t2_ARMaxEntropy}`);
console.log(`ARLeastSquare for Dataset 2: ${t2_ARLeastSquare}`);


let sinWave = new timeseries.main(timeseries.adapter.sin({ cycles: 4 })).chart();


app.get("/", (req, res) => {
    res.render("home.ejs", {
        processedData1_ma: processedData1_ma,
        processedData1_org: processedData1_org,
        processedData1_org_lwma: processeddata1_org_lwma,
        t1_min: t1_min,
        t1_max: t1_max,
        t1_mean: t1_mean,
        t1_std: t1_std,
        t1_ms_smoothing: t1_ms_smoothing,
        t1_lwma_smoothing: t1_lwma_smoothing,
        t1_noise_removed: t1_noise_removed,
        sinWave: sinWave,
        t1_ARMaxEntropy: t1_ARMaxEntropy,
        t1_ARLeastSquare: t1_ARLeastSquare,
        // 
        // 
        processedData2_ma: processedData2_ma,
        processedData2_org: processedData2_org,
        processedData2_org_lwma: processeddata2_org_lwma,
        t2_min: t2_min,
        t2_max: t2_max,
        t2_mean: t2_mean,
        t2_std: t2_std,
        t2_ms_smoothing: t2_ms_smoothing,
        t2_lwma_smoothing: t2_lwma_smoothing,
        t2_noise_removed: t2_noise_removed,
        sinWave: sinWave,
        t2_ARMaxEntropy: t2_ARMaxEntropy,
        t2_ARLeastSquare: t2_ARLeastSquare
    });
});

app.listen(8080, () => {
    console.log("Listening on Port: 8080");
})


// console.log(data1);
// console.log(data2);

// *******************************************************************
// Could have used d3.js or Data-driven document for such graphical representation as its more easier to implement.
// *******************************************************************
// google.charts.load('current', { packages: ['corechart', 'line'] });
// google.charts.setOnLoadCallback(drawBasic);

// google.charts.load('current', { packages: ['corechart', 'line'] });
// google.charts.setOnLoadCallback(drawBasic2);

// function drawBasic() {

//     var data = new google.visualization.DataTable();
//     data.addColumn('number', 'Days');
//     data.addColumn('number', 'SLOC/day');
//     // const newData=[
//     //         [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
//     //         [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
//     //         [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
//     //         [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
//     //         [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
//     //         [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
//     //         [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
//     //         [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
//     //         [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
//     //         [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
//     //         [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
//     //         [66, 70], [67, 72], [68, 75], [69, 80]
//     //       ];

//     data.addRows(data1);

//     var options = {
//         hAxis: {
//             title: 'Day of the month'
//         },
//         vAxis: {
//             title: 'SLOC'
//         }
//     };

//     var chart = new google.visualization.LineChart(document.getElementById('chart_div_1'));

//     chart.draw(data, options);
// }

// function drawBasic2() {

//     var data = new google.visualization.DataTable();
//     data.addColumn('number', 'Days');
//     data.addColumn('number', 'SLOC/day');

//     data.addRows(data2);

//     var options = {
//         hAxis: {
//             title: 'Day of the month'
//         },
//         vAxis: {
//             title: 'SLOC'
//         }
//     };

//     var chart = new google.visualization.LineChart(document.getElementById('chart_div_2'));

//     chart.draw(data, options);
// }
// *************************************************************
// *************************************************************
// *************************************************************

// let t = new timeseries.main(timeseries.adapter.fromDB(data, {
//     date: "date",
//     value: "value"
// }));

// let processed_data = t.ma().output();
// for (let i in data) {
//     console.log(`Serial Number: ${i} --- Random Number: ${processed_data[i][1]} --- Full Data at the index ${i} is ${processed_data[i]}`);
// };

// let chart_url = t.ma({ period: 14 }).chart({ main: true });
// console.log(chart_url);


// **********************************************************
// let data = [
//     [date, value],
//     [date, value],
//     [date, value],
//     ...
// ];

// Unfiltered data out of MongoDB:
// var data = [{
//     "_id": "53373f538126b69273039245",
//     "adjClose": 26.52,
//     "close": 26.52,
//     "date": "2013-04-15T03:00:00.000Z",
//     "high": 27.48,
//     "low": 26.36,
//     "open": 27.16,
//     "symbol": "fb",
//     "volume": 30275400
// },
// {
//     "_id": "53373f538126b69273039246",
//     "adjClose": 26.92,
//     "close": 26.92,
//     "date": "2013-04-16T03:00:00.000Z",
//     "high": 27.11,
//     "low": 26.4,
//     "open": 26.81,
//     "symbol": "fb",
//     "volume": 27365900
// },
// {
//     "_id": "53373f538126b69273039247",
//     "adjClose": 26.63,
//     "close": 26.63,
//     "date": "2013-04-17T03:00:00.000Z",
//     "high": 27.2,
//     "low": 26.39,
//     "open": 26.65,
//     "symbol": "fb",
//     "volume": 26440600
// },
// ...
// ];

// Load the data:
// var t     = new timeseries.main(timeseries.adapter.fromDB(data, {
// date:   'date',     // Name of the property containing the Date (must be compatible with new Date(date) )
// value:  'close'     // Name of the property containign the value. here we'll use the "close" price.
// }));