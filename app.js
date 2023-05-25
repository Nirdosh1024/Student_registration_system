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
const updateModel = require("./Models/updateModel")
const { stderr } = require("process");
const { accessSync } = require("fs");
const { error } = require("console");

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
    const batch = req.body.batch
    const filepath = path.join(__dirname, "/uploads/studentData", `${req.files['excel'][0].filename}`);
    importExceltoJson(filepath,batch);
    res.json({ status: "OKAY" });
  }
});

app.get("/authentication", (req, res) => {
  res.render("login");
});

app.get("/guidelines", (req, res) => {
  res.render("guideline");
});

app.get("/helpingdesk", (req, res) => {
  res.render("helpdesk");
});

app.get("/academicFAQs", (req, res) => {
  res.render("faqs");
});


app.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const user = req.session.passport.user;
  
  const updateFullData = await updateModel.find()
  const updateData = updateFullData[0].update
 
 

  const dataToBePassedToView = {
    name: user.name,
    JEERoll: user.JEERoll
  }

  //console.log(dataToBePassedToView);

  if (req.user.dashboard_created) {
    res.render("dashboard", {
      dataToBePassedToView , updateData
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
  console.log(user)

  const dataToBePassedToForm = {
    name: user.Name,
    JEERoll: user.ID,
    gender: user.gender,
    dob: user.DOB,
    branch: user.Branch,
    Phone_number: user.phoneNumber,
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
app.get("/docs", ensureAuthenticated, async (req, res) => {
  const user = req.session.passport.user;


  const id = req.session.passport.user._id

  const userFullData = await newStudentModel.findById(id)

const docArray = {}

for(let i of userFullData.document){
docArray[i.doc_name] = i._id
}

//console.log(docArray)

  const dataToBePassedToView = {
    name: user.name,
    JEERoll: user.JEERoll
  
  }

  res.render("docs", {
    dataToBePassedToView,docArray
  })
})

//rendering pending payment
app.get("/dues", ensureAuthenticated,  async (req, res) => {
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
    name: user.Name,
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

app.get("/admindashboard", ensureAuthenticated, async (req, res) => {
  const id = req.session.passport.user._id;
  const admin =  await Admin.findById(id)
  const dataToBePassedToView = {
    name: admin.ID
  }
  res.render("admindashboard",{dataToBePassedToView});
})

app.get("/adminfeeform", ensureAuthenticated, (req, res) => {
  res.render("adminfeeform");
})

app.get("/adminupdate" , ensureAuthenticated , (req,res) => {
  res.render("adminUpdate")
})
// app.post("/adminfeeform", (req,res) => {
//   res.json({ status: "OKAY" });
// })

app.post("/adminupdate"  , async (req,res) => {
  const updateObj =  req.body

  console.log(req.body)
  if(req.body){
    const data = updateModel.find();
    if(data)
    {await updateModel.updateOne({},{$push : { update : updateObj}}).
   then(() => {
    res.send({status :"okay"})
      console.log("data is saved")}).catch((error) => {
        console.log("Error saving data" , error)
      })}
    else{
      await updateModel.create(updateObj).then((result) =>{console.log("data is saved",result)}).catch((err) => {console.log(err)})
    }
  }
})

app.get("/viewdata", ensureAuthenticated, async (req,res) => {

  const id = req.session.passport.user._id;
  const admin =  await Admin.findById(id)
  const role = admin.ID;


  const subData = await newStudentModel.find({ accept_terms: true});
  
  await newStudentModel.count({accept_terms :true}).then( (count) => {
    console.log('Number of entries:', count);
    const rowcol = {
      rows : count  ,
      cols : 6
    }
  
    res.render("studentDataFullView", {
      rowcol,
      collections: subData,
      role: role
    })
    }).catch((err) => { {
      console.error('Error:', err);
    }});
})

app.get("/viewdata/viewmore" , async (req ,res) => {
  
  const id = req.query.id;

  const student = await newStudentModel.findOne({ID: id})
  const datatoviewmore = {
    gender : student.gender,
    dob : student.DOB,
    phoneNum : student.phoneNumber,
    email : student.Email,
    aadhar : student.AadharNumber,
    sem : student.semester,
    father_name : student.FatherName,
    mother_name : student.MotherName,
    parentphn : student.parent_phn,
    parentEmail : student.parent_email,
    category : student.category,
    income : student.income,
    address : student.address,
    gaurdian : student.gaurdian_name,
    gaurdianphn : student.gaurdian_phn,
    gaurdianadd : student.gaurdian_address,
    jeerank : student.JEE_rank,
    jeepercent : student.JEE_percentile,
    hosteler : student.hosteller,
    roomno : student.room_no,
  }

  //console.log(datatoviewmore)
  res.send(datatoviewmore);
})

app.get("/viewdata/viewFeeDetails", async (req, res) => {
    const id = req.query.id;

    const student = await newStudentModel.findOne({ID: id});

    const dataToFeeDetails = {
      fees: student.fees,
      document: student.document,
      semester: student.semester
    }

    res.send(dataToFeeDetails);
})

app.post("/adminLogin", (req, res, next) => {
  passport.authenticate("local-admin", {
    successRedirect: "/admindashboard",
    failureRedirect: "/authentication",
    failureFlash: true
  })
    (req, res, next);
})

app.get("/download/:id" , ensureAuthenticated, async (req,res) => {
   const Id = req.params.id;
   console.log(typeof Id)
   //
   await newStudentModel.find({document:{$elemMatch:{_id : Id }}},{"document.$" : 1}).then((filedata) => {
  const file = filedata[0].document  
  const filePath = file[0].filepath
  const fileName = file[0].filename
  
  res.download(filePath , fileName, (err)=> {
    if(err){
      res.send(err)
    }
  })


   }).catch((error)=>{
    res.send({ msg : "file does not exist"})
   })
   
   
})

// app.get("/fakeview" , (req, res) => {
//   res.render("viewMorePopup")
// })
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/authentication');
});






function importExceltoJson(filepath,batch) {
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

  insertData(batch);

  async function insertData(batch) {
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
          student.batch = batch;
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


