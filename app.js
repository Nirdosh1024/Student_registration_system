const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const app = express()
const exceltoJson = require("convert-excel-to-json")
const path = require("path")

app.use(cors({
    origin:"http://localhost:3000/",
    credentials: true
}))

app.use(expressLayouts);
app.set("view engine","ejs");



app.use(express.json());
app.use(express.urlencoded({extended: true}));



// multer setup to upload files to the server
const storage = multer.diskStorage({
    destination: (req, file , cb) => {
        cb(null, "uploads")
    }, 
    filename: (req, file , cb)=> {
        const { originalname } = file
        cb(null,originalname); 
    }
})
const upload = multer({ storage });


app.post('/',(req,res) =>{
    console.log(req)
    res.status(201).json({
            "statustell":"4000"
    })
});



app.get('/',(req,res) =>{
    res.render('layout')
}

);

app.post("/upload", upload.single("excel"), (req, res) => {
    if(!req.file) {
        res.json({"status": "NOT OKAY"});
    } else {
        const filepath = path.join(__dirname,"/uploads",`${req.file.filename}`)
       importExceltoJson(filepath);
        res.json({"status": "OKAY"});
    }
});
 function importExceltoJson(filepath){
    const exceldata = exceltoJson({
        sourceFile: filepath,

        sheets:[{
            name:newstudent ,

        header: {
            rows: 1
        } ,   
        
        columnTokey: {
            A: 'ID',
            B: 'name',
            C: 'email',
            D: 'mobileno',
            E: 'branch',
            F: 'rank'
        }

        }] });
 
console.log(exceldata);
// insert data in db

mongoose.connect('mongodb://localhost/myapp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> {console.log("Mongo DB Connected....")
let dbo = db.db("exceldb");
    dbo.collection("newstudent").insertMany(exceldata.Newstudent, (err, res) => {
        if(err)  err;
        console.log("NUmber of data inserted: " + res.insertedCount);

        db.close();
    });
}
,(err)=>{
    console.log(err);
}
);

};
const PORT = process.env.PORT || 5000
app.listen(PORT,() => {
    console.log("Server has started at 5000")
})
