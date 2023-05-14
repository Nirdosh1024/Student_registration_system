/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const exceltoJson = require("convert-excel-to-json");
const path = require("path");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const helmet = require("helmet");
const logger = require("morgan");


// import routes
const formRoute = require("./routes/formRoute");

// import multer config 
const upload = require("./config/multerConfig")

require('dotenv').config();

const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");

// importing express session
const session = require("express-session");

// requiring the passport config file here
require("./config/passport")(passport);



// helmet config
// app.use(helmet());

// logger config
app.use(logger('dev'));


// model imported
const newStudentModel = require("./Models/studentModel");
const Admin = require("./Models/adminModel");
const { stderr } = require("process");
const { accessSync } = require("fs");

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
  saveUninitialized: true,
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000
  }
}));


// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash setup
app.use(flash());

// Global variables 
app.use((req, res, next) => {
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash('error');
  next();
});


app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// require public folder
app.use(express.static("public"));


app.post("/", (req, res) => {
  console.log(req);
  res.status(201).json({
    statustell: "4000",
  });
});

app.get("/", (req, res) => {
  res.render("homepage");
});

app.post("/upload", upload, (req, res) => {
  if (!req.files) {
    res.json({ status: "NOT OKAY" });
  } else {
    const filepath = path.join(__dirname, "/uploads/studentData", `${req.files['excel'][0].originalname}`);
    importExceltoJson(filepath);
    res.json({ status: "OKAY" });
  }
});

app.get("/authentication", (req, res) => {
  res.render("login");
});


app.get("/dashboard", ensureAuthenticated, (req, res) => {
  const user = req.session.passport.user;

  const dataToBePassedToView = {
    name: user.name,
    JEERoll: user.JEERoll
  }

  console.log(dataToBePassedToView);

  if (req.user.dashboard_created) {
    res.render("dashboard", {
      dataToBePassedToView
    })
  }
  else {
    res.render("form", {
      dataToBePassedToView
    });
  }
});


//rendering registration form
app.get("/studentform", ensureAuthenticated, async (req, res) => {
  const id = req.session.passport.user._id

  const user = await newStudentModel.findById(id);

  const dataToBePassedToForm = {
    name: user.Name,
    JEERoll: user.ID,
    gender: user.Gender,
    dob: user.DOB,
    year: user.Year,
    branch: user.Branch,
    Phone_number: user.PhoneNumber,
    aadhar_number: user.AadharNumber,
    father_name: user.FatherName,
    mother_name: user.MotherName,
    email: user.Email

  }
  res.render("studentform", {
    dataToBePassedToForm
  })
})

//rendering documents
app.get("/docs", ensureAuthenticated, (req, res) => {
  const user = req.session.passport.user;

  const dataToBePassedToView = {
    name: user.name,
    JEERoll: user.JEERoll
  }

  res.render("docs", {
    dataToBePassedToView
  })
})

//rendering pending payment
app.get("/dues", ensureAuthenticated,  (req, res) => {
  const user = req.session.passport.user;
  
  const dataToBePassedToView = {
    name: user.name,
    JEERoll: user.JEERoll,
   
  }

  res.render("dues", {
    dataToBePassedToView
  })
})

//rendering registration status
app.get("/status", ensureAuthenticated,async (req, res) => {
  
  const id = req.session.passport.user._id

  const user = await newStudentModel.findById(id)

  const dataToBePassedToView = {
    name: user.name,
    JEERoll: user.JEERoll,
    formValidated: user.data_validated_by_admin
  }

  res.render("status", {
    dataToBePassedToView
  })
})


app.get("/layout", (req, res) => {
  res.render("layout")
})

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
//     console.log(admin)
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

app.get("/adminfeeform", ensureAuthenticated, (req, res) => {
  res.render("adminfeeform");
})

// app.post("/adminfeeform", (req,res) => {
//   res.json({ status: "OKAY" });
// })

app.post("/adminLogin", (req, res, next) => {
  passport.authenticate("local-admin", {
    successRedirect: "/admindashboard",
    failureRedirect: "/authentication",
    failureFlash: true
  })
    (req, res, next);
})




app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
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
          C: "Branch",
          D: "Rank",
        },
      },
    ],
  });

  // insert data in db

  insertData();

  async function insertData() {
    const students = [...exceldata.Sheet1];
    const salt = await bcrypt.genSalt(10);
    let s = [];
    if (salt) {
      for (let student of students) {
        const passwd = "Recs@" + student.Rank;
        const hasedPasswd = await bcrypt.hash(passwd, salt);
        if (hasedPasswd) {
          student.passwd = hasedPasswd;
          student.role = "student";
          student.dashboard_created = false;
          student.form_submitted = false;
        }
        s.push(student);
      }



      if (s.length) {
        newStudentModel
          .create([...s])
          .then((Data) => {
            console.log("uploaded data", Data);
            // mongoose.connection.close().then(() => {
            //   console.log("connection closed");
            // });
          })
          .catch((e) => {
            console.log("The error is on insert ", e);
          });
      }
    }
  }
}

app.use("/form-submit", formRoute);

app.use("/adminfeeform", require("./routes/adminformRoute"))
app.use("/studentform", require("./routes/studentformRoute"))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server has started at 5000");
});


