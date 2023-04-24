/** @format */

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express();
const exceltoJson = require("convert-excel-to-json");
const path = require("path");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const passport = require("passport");



require('dotenv').config();

const { ensureAuthenticated, forwardAuthenticated }  = require("./config/auth");

// importing express session
const session = require("express-session");

// requiring the passport config file here
require("./config/passport")(passport);


// model imported
const newStudentModel = require("./Models/studentModel");
const Admin = require("./Models/adminModel");
const { stderr } = require("process");

app.use(
  cors({
    origin: "http://localhost:5000/",
    credentials: true,
  })
);

mongoose
    .connect("mongodb://localhost/studentdatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongo DB Connected....");
    })
    .catch((e) => {
      console.log("The error is when connected", e);
    });


// initialising an express session to store authentication credentials
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));


// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash setup
app.use(flash());

// Global variables 
app.use((req, res, next) => {
  res.locals.errors =  req.flash('error')
  next();
});


app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// multer setup to upload files to the server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  },
});
const upload = multer({ storage });

app.post("/", (req, res) => {
  console.log(req);
  res.status(201).json({
    statustell: "4000",
  });
});

app.get("/", (req, res) => {
  res.render("layout");
});

app.post("/upload", upload.single("excel"), (req, res) => {
  if (!req.file) {
    res.json({ status: "NOT OKAY" });
  } else {
    const filepath = path.join(__dirname, "/uploads", `${req.file.filename}`);
    importExceltoJson(filepath);
    res.json({ status: "OKAY" });
  }
});

app.get("/authentication", (req, res) => {
  res.render("login");
});


app.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard");
});



app.post("/login", (req, res, next) => {
    passport.authenticate('local-student', {
      successRedirect: "/dashboard",
      failureRedirect: "/authentication",
      failureFlash: true
    })(req, res, next);
});

// app.post("/adminLogin", (req, res) => {
//   const { UserID, password } = req.body; 
//   Admin.findOne({ID: UserID}).then(async (admin) => {
//     console.log("Function is reaching here");
//     const password = await hashedPassword(UserID)
//     admin.Passwd = password
//     admin.
//     save().then((admin) => {
//       console.log("password is successfully saved")
//     })
//   }).catch((e) => {
//     console.error(e);
//   })
//   res.json({status: "OKAY"});
// })

// async function hashedPassword(UserID){
//   const salt = await bcrypt.genSalt(10);
//   if (salt){
//     const password = UserID + '@841'
//     const hashedPass= await bcrypt.hash(password,salt);
//     return hashedPass;
//   } 
// }

app.get("/admindashboard", ensureAuthenticated, (req, res) => {
  res.render("admindashboard");
})

app.post("/adminLogin", (req, res, next) => {
  passport.authenticate("local-admin", {
    successRedirect: "/admindashboard",
    failureRedirect: "/authentication",
    failureFlash: true
  })(req, res, next);
})


app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if(err) {
      return next(err);
    }
  });
  res.redirect('/authentication');
});

function importExceltoJson(filepath) {
  const exceldata = exceltoJson({
    sourceFile: filepath,

    sheets: [
      {
        name: "Sheet1",

        header: {
          rows: 1,
        },

        columnToKey: {
          A: "ID",
          B: "Name",
          C: "Email",
          D: "Mobileno",
          E: "Branch",
          F: "Rank",
        },
      },
    ],
  });

  console.log(exceldata);
  // insert data in db

  insertData();

  async function insertData() {
    const students = [...exceldata.Sheet1];
    const salt = await bcrypt.genSalt(10);
    let s = [];
    if (salt) {
      for (let student of students) {
        const passwd = student.Rank + student.Branch;
        console.log(passwd);
        const hasedPasswd = await bcrypt.hash(passwd, salt);
        if (hasedPasswd) {
          student.passwd = hasedPasswd;
          student.role = "student";
        }
        s.push(student);
      }

    

      if (s.length) {
        newStudentModel
          .create([...s])
          .then((Data) => {
            console.log("uploaded data", Data);
            mongoose.connection.close().then(() => {
              console.log("connection closed");
            });
          })
          .catch((e) => {
            console.log("The error is on insert ", e);
          });
      }
    }
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server has started at 5000");
});
