var express = require("express");
var path = require("path");
var compiler = require("compilex");
var ejs = require("ejs");
var fs = require("fs");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var option = { status: true };
compiler.init(option);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/compilecode", function (req, res) {
    var code = req.body.code;
    var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;

    if (lang === "C" || lang === "C++") {
        var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
        if (inputRadio === "true") {
            compiler.compileCPPWithInput(envData, code, input, function (data) {
                renderOutputPage(res, data);
            });
        } else {
            compiler.compileCPP(envData, code, function (data) {
                renderOutputPage(res, data);
            });
        }
    }
    else if (lang === "Python") {
        var envData = { OS: "windows" };
        if (inputRadio === "true") {
            compiler.compilePythonWithInput(envData, code, input, function (data) {
                renderOutputPage(res, data);
            });
        } else {
            compiler.compilePython(envData, code, function (data) {
                renderOutputPage(res, data);
            });
        }
    }
    else if (lang === "Java") {
        var envData = { OS: "windows" };
        if (inputRadio === "true") {
            compiler.compileJavaWithInput(envData, code, input, function (data) {
                renderOutputPage(res, data);
            });
        } else {
            compiler.compileJava(envData, code, function (data) {
                renderOutputPage(res, data);
            });
        }
    }
});


function renderOutputPage(res, codeOutput) {
    if (typeof codeOutput === 'object') {
        codeOutput = JSON.stringify(codeOutput);
    }

    ejs.renderFile(path.join(__dirname, "views", "compilecode.ejs"), { codeOutput: codeOutput }, function (err, html) {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            fs.writeFileSync("output.html", html);
            res.send(html);
        }
    });
}

app.get("/fullStat", function (req, res) {
    compiler.fullStat(function (data) {
        res.send(data);
    });
});

app.listen(8000, function () {
    console.log("Server is running on port 8000");
});



