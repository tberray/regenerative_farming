const XLSX = require('xlsx')
const fs = require('fs');
const http = require('http');
const fastcsv = require("fast-csv");
const { resourceLimits } = require('worker_threads');

const testOutput = [
    {name: 'John', email: 'John@gmail.com', age: 10},
    {name: 'Max', email: 'Max@gmail.com', age: 20},
    {name: 'Dak', email: 'Dak@gmail.com', age: 30}
]
module.export = {convertJsonToExcel}

// function convertJsonTOCSV() {
//   var ws = fs.createWriteStream("public/data.csv");
//   fastcsv
//     .write(testOutput,{headers: true})
//     .on("finish", function() {
//         //result.send("Exported")
//     })
//     .pipe(ws)
// }
// convertJsonTOCSV()
function convertJsonToExcel() {
    const workSheet = XLSX.utils.json_to_sheet(testOutput);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "testOutput");
    //Generate buffer

    XLSX.write(workBook, {bookType:'xlsx', type:'buffer'})

    //Binary string
    XLSX.write(workBook, {bookType:'xlsx', type:'binary'});
    XLSX.writeFile(workBook, 'outputData.xlsx');
    console.log("In convert Json function")
}

// const download = (url, dest, cb) => {
//     const file = fs.createWriteStream(dest);

//     const request = http.get(url, (response) => {
//         // check if response is success
//         if (response.statusCode !== 200) {
//             return cb('Response status was ' + response.statusCode);
//         }

//         response.pipe(file);
//     });

//     // close() is async, call cb after close completes
//     file.on('finish', () => file.close(cb));

//     // check for request error too
//     request.on('error', (err) => {
//         fs.unlink(dest);
//         return cb(err.message);
//     });

//     file.on('error', (err) => { // Handle errors
//         fs.unlink(dest); // Delete the file async. (But we don't check the result) 
//         return cb(err.message);
//     });
// };
