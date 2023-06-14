import express from 'express';
import path from 'path';
import fs from 'fs';

const port = process.env.PORT || 3003;
const app = express();

app.use(express.static("Public"));

app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/index.html");
})

app.get("/todos", (req, res) => {
    fs.promises.readFile(path.resolve("data.json"), "utf-8").then((todos) => {
        console.log(todos);
        res.send(todos);
    })
})

app.post("/todos", (req, res) => {
    //todos = req.body;
    fs.promises
        .writeFile(path.resolve("data.json"), JSON.stringify(req.body))
        .then(() => {
            res.send("Todos is received.")
        })
})


app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
});