var express = require('express');
    app = express(),
    http = require("http").Server(app).listen(4000),
    upload = require("express-fileupload")



app.use(upload())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dashboard.ejs')
})

app.post("/", function(req,res) {
    if(req.files) {
        var file = req.files.filename,
            filename = file.name;
        file.mv("./upload" + filename, function(err) {
            if (err) {
            res.send("error occured")
            }
            else {
                res.send("Successful upload")
            }
        })
    }
})