const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
/////////////////////////////////
// FILES


// Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `This is what we know about the avocado. ${textIn}. \nCreated on ${Date.now()}`;
// // fs.writeFileSync("./txt/output.txt", textOut);
// // console.log(fs.readFileSync("./txt/output.txt", "utf-8"));


// // Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     // ERROR handling in node js
//     if (err) return console.log("ERROR: ERROR: ERROR: ERROR");
    
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log(data2);
//         fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//             console.log(data3);
//             fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//                 console.log("Your file has been written.");
//             });
//             console.log("Writing file...");
//         });
//     });
// });
// console.log("File is reading...");

//////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`);
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slug = dataObj.map(el => slugify(el.productName, {lower: true}));
console.log(slug);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true); 


    // overview page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {"Content-type": "text/html"});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join();
        const output = tempOverview.toString().replace(/{%PRODUCT_CARDS%}/, cardsHtml);
        res.end(output);

    // product page
    }else if (pathname === "/product") {
        res.writeHead(200, {"Content-type": "text/html"});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API
    }else if (pathname === "/api") {
        res.writeHead(200, {"content-type" : "application/api"});
        res.end(data);

    // Not found
    }else {
        res.writeHead(404, {
            "content-type": "html"
        });
        res.end("<h1>Page not found!</h1>");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log(`Listening on localhost, port 8000`);
});