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
const fs = require("fs");


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
const unverifiedData = require("./Models/unverifiedDocsModel");

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
    importExceltoJson(filepath, batch);
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

app.get("/documents-download", (req, res) => {
  res.redirect("docs");
})


app.get("/dashboard", ensureAuthenticated, async (req, res) => {
 
  const id = req.session.passport.user._id;
  
  const user = await newStudentModel.findById(id)
  const updateFullData = await updateModel.find()

  let updateData;
  if(updateFullData.length > 0) {
    updateData = updateFullData[0].update
  } else {
    updateData = [];
  }
  
  const dataToBePassedToView = {
    name: user.Name,
    JEERoll: user.ID,
    validatedByAdmin: user.data_validated_by_admin
  }

  //console.log(dataToBePassedToView);

  if (req.user.dashboard_created) {
    res.render("dashboard", {
      dataToBePassedToView, updateData
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
    email: user.Email,
    validatedByAdmin : user.data_validated_by_admin

  }
  res.render("studentform", {
    dataToBePassedToForm
  })
})

//rendering documents
app.get("/docs", ensureAuthenticated, async (req, res) => {
  


  const id = req.session.passport.user._id

  const userFullData = await newStudentModel.findById(id)

  const docArray = {}

  for (let i of userFullData.document) {
    docArray[i.doc_name] = i._id
  }

  //console.log(docArray)

  const dataToBePassedToView = {
    name: userFullData.Name,
    JEERoll: userFullData.ID,
    validatedByAdmin : userFullData.data_validated_by_admin
  }

  res.render("docs", {
    dataToBePassedToView, docArray
  })
})

//rendering pending payment
app.get("/dues", ensureAuthenticated, async (req, res) => {
  const id  = req.session.passport.user._id;
  const user = await newStudentModel.findById(id);

  const dataRaw = await unverifiedData.findOne({ ID: user.ID });
  

  let feeRemaining;

  if(user.data_validated_by_admin > 1 && user.data_validated_by_admin < 3) {
      feeRemaining = user.fees.pending_fee;
  } else {
      feeRemaining = dataRaw.fees.pending_fee;
  }


  console.log(feeRemaining);

  const dataToBePassedToView = {
    name: user.Name,
    JEERoll: user.ID,
    validatedByAdmin : user.data_validated_by_admin,
    feePaidDetail: user.fee_type,
    pendingFee: feeRemaining
  }

  res.render("dues", {
    dataToBePassedToView
  })
})

//rendering registration status
app.get("/status", ensureAuthenticated, async (req, res) => {

  const id = req.session.passport.user._id

  const user = await newStudentModel.findById(id)
  const dataFromRawAfterVerified = await unverifiedData.findOne({ ID: user.ID });

  // user.validated can have three values i.e 1 which means it's pending, 2 which means it is successfully
  // validated by all admins and finally 3 if it is rejected by any of the admin

  if(user.rejected_by_accounts || user.rejected_by_dean_acad || user.rejected_by_warden ) {
    user.data_validated_by_admin = 3;
  }

  if(user.verified_by_accounts && user.verified_by_dean_acad && user.verified_by_warden) {
    user.data_validated_by_admin = 2;
  }

  if((!user.verified_by_accounts && !user.verified_by_dean_acad && !user.verified_by_warden) && (!user.rejected_by_accounts && !user.rejected_by_dean_acad && !user.rejected_by_warden) && user.accept_terms) {
    user.data_validated_by_admin = 1;
  } 

  user.save().then(() => console.log("User Saved")).catch((err) => console.log(err));

  if(user.data_validated_by_admin === 2) {
    user.fees = dataFromRawAfterVerified.fees;
    user.document = dataFromRawAfterVerified.document;
    user.save().then(() => console.log("Data From Unverified data merged into student model collections")).catch((err) => console.error(err));
    unverifiedData.deleteOne({ ID: user.ID }).then(() => console.log("Data deleted from raw storage")).catch((err) => console.error(err));
  }


  const dataToBePassedToView = {
    name: user.Name,
    JEERoll: user.JEERoll,
    formValidated: user.data_validated_by_admin
  }

  res.render("status", {
    dataToBePassedToView
  })
})


app.get("/layout", ensureAuthenticated, (req, res) => {
  res.render("layout")
})

app.post("/login", (req, res, next) => {
  passport.authenticate('local-student', {
    successRedirect: "/dashboard",
    failureRedirect: "/authentication",
    failureFlash: true
  })(req, res, next);
});

app.get("/admin-creation", (req, res) => {
  res.render("test")
})


app.post("/admin-creation", async (req, res) => {
  const { UserID } = req.body; 

  const password = await hashedPassword(UserID);
  
  const newAdmin = new Admin({
    ID: UserID,
    role: "admin",
    Passwd: password
  })

  newAdmin.save().then(() => console.log("admin saved")).catch((err) => console.log(err));

  res.json({status: "OKAY"});
})

async function hashedPassword(UserID){
  const salt = await bcrypt.genSalt(10);
  if (salt){
    const password = UserID + '@841'
    const hashedPass= await bcrypt.hash(password,salt);

    return hashedPass;
  } 
}

app.get("/admindashboard", ensureAuthenticated, async (req, res) => {
  const id = req.session.passport.user._id;
  const admin = await Admin.findById(id)
  const dataToBePassedToView = {
    name: admin.ID
  }
  res.render("admindashboard", { dataToBePassedToView });
})

app.get("/adminfeeform", ensureAuthenticated, (req, res) => {
  res.render("adminfeeform");
})

app.get("/adminupdate", ensureAuthenticated, (req, res) => {
  res.render("adminUpdate")
})
// app.post("/adminfeeform", (req,res) => {
//   res.json({ status: "OKAY" });
// })

app.post("/adminupdate", ensureAuthenticated, async (req, res) => {
  const updateObj = req.body

  console.log(req.body)
  if (req.body) {
    const data = updateModel.find();
    if (data) {
      await updateModel.updateOne({}, { $push: { update: updateObj } }).
        then(() => {
          res.send({ status: "okay" })
          console.log("data is saved")
        }).catch((error) => {
          console.log("Error saving data", error)
        })
    }
    else {
      await updateModel.create(updateObj).then((result) => { console.log("data is saved", result) }).catch((err) => { console.log(err) })
    }
  }
})

app.get("/viewdata", ensureAuthenticated, async (req, res) => {

  const id = req.session.passport.user._id;
  const admin = await Admin.findById(id)
  const role = admin.ID;

  const subData = await newStudentModel.find({ accept_terms: true });

  const filteredDataForAccounts = subData.filter((data, index) => !data.verified_by_accounts && !data.rejected_by_accounts)

  const filteredDataForRECDeanAcad = subData.filter((data, index) => !data.verified_by_dean_acad && !data.rejected_by_dean_acad)

  const filteredDataForWardens = subData.filter((data, index) => !data.verified_by_warden && !data.rejected_by_warden)

  if (role === "RECAccounts") {
    res.render("studentDataFullView", {
      collections: filteredDataForAccounts,
      role: role
    })
  }
  else if (role === "RECDeanAcad") {
    res.render("studentDataFullView", {
      collections: filteredDataForRECDeanAcad,
      role: role
    })
  } else if(role === "BH1Warden") {
    // const filteredDataForBH1Warden = filteredDataForWardens.filter(doc => doc.hostel === "BH1")
    const filteredDataForBH1Warden = filteredDataForWardens;
    res.render("studentDataFullView", {
      collections: filteredDataForBH1Warden,
      role: role
    })
  } else if(role === "BH2Warden") {
    const filteredDataForBH2Warden = filteredDataForWardens.filter(doc => doc.hostel === "BH2")
    res.render("studentDataFullView", {
      collections: filteredDataForBH2Warden,
      role: role
    })
  } else if(role === "BH3Warden") {
    const filteredDataForBH3Warden = filteredDataForWardens.filter(doc => doc.hostel === "BH3")
    res.render("studentDataFullView", {
      collections: filteredDataForBH3Warden,
      role: role
    })
  } else if(role === "GHWarden") {
    const filteredDataForGHWarden = filteredDataForWardens.filter(doc => doc.hostel === "GH")
    res.render("studentDataFullView", {
      collections: filteredDataForGHWarden,
      role: role
    })
  }
})

app.get("/viewverifieddata", ensureAuthenticated, async (req, res) => {
  const id = req.session.passport.user._id;
  const admin = await Admin.findById(id)
  const role = admin.ID;

  if(role === "RECAccounts") {
    const studentData = await newStudentModel.find({ verified_by_accounts: true });
    res.render("verifiedstudentdata", {
      studentData: studentData,
      role: role
    });
  } else if(role === "RECDeanAcad") {
    const studentData = await newStudentModel.find({ verified_by_dean_acad: true });
    res.render("verifiedstudentdata", {
      studentData: studentData,
      role: role
    });
  } else if(role === "RECDSW" || role === "Director") {
    const studentData = await newStudentModel.find({ verified_by_accounts: true, verified_by_dean_acad: true, verified_by_warden: true });
    res.render("verifiedstudentdata", {
      studentData: studentData,
      role: role
    })
  } else if(role === "BH1Warden") {
    const studentData = await newStudentModel.find({ verified_by_warden: true, hostel: "BH1" });
    res.render("verifiedstudentdata", {
      studentData: studentData,
      role: role
    })
  } else if(role === "BH2Warden") {
    const studentData = await newStudentModel.find({ verified_by_warden: true, hostel: "BH2" });
    console.log(studentData)
    res.render("verifiedstudentdata", {
      studentData: studentData,
      role: role
    })
  } else if(role === "BH3Warden") {
    const studentData = await newStudentModel.find({ verified_by_warden: true, hostel: "BH3" });
    res.render("verifiedstudentdata", {
      studentData: studentData,
      role: role
    })
  } else if(role === "GHWarden") {
    const studentData = await newStudentModel.find({ verified_by_warden: true, hostel: "GH" });
    res.render("verifiedstudentdata", {
      studentData: studentData,
      role: role
    })
  }
})

app.get("/viewdata/viewmore", ensureAuthenticated, async (req, res) => {

  const id = req.query.id;

  const student = await newStudentModel.findOne({ ID: id })


  const datatoviewmore = {
    gender: student.gender,
    dob: student.DOB,
    phoneNum: student.phoneNumber,
    email: student.Email,
    aadhar: student.AadharNumber,
    sem: student.semester,
    father_name: student.FatherName,
    mother_name: student.MotherName,
    parentphn: student.parent_phn,
    parentEmail: student.parent_email,
    category: student.category,
    income: student.income,
    address: student.address,
    gaurdian: student.gaurdian_name,
    gaurdianphn: student.gaurdian_phn,
    gaurdianadd: student.gaurdian_address,
    jeerank: student.JEE_rank,
    jeepercent: student.JEE_percentile,
    hosteler: student.hosteller,
    roomno: student.room_no,
  }

  res.send(datatoviewmore);
})

app.get("/viewdata/viewFeeDetails", ensureAuthenticated, async (req, res) => {
  const id = req.query.id;

  let student;
  const user = await newStudentModel.findOne({ ID: id });

  if(user.data_validated_by_admin === 2) {
    student = await newStudentModel.findOne({ ID: id });
  } else {
    student = await unverifiedData.findOne({ ID: id });
  }

  const documentObject = {}

  const messfeedocument = student.document.filter((doc) => doc.doc_name === "messfee_receipt");
  const academicfeedocument = student.document.filter((doc) => doc.doc_name === "academicfee_receipt");
  const maintenancefeedocument = student.document.filter((doc) => doc.doc_name === "maintenancefee_receipt");

  documentObject.messfeefileObject = messfeedocument[0];
  documentObject.academicfeefileObject = academicfeedocument[0];
  documentObject.maintenancefeefileObject = maintenancefeedocument[0];


  const dataToFeeDetails = {
    fees: student.fees,
    document: documentObject,
    semester: user.semester
  }

  res.send(dataToFeeDetails);
})

app.get("/viewdata/viewDocuments", ensureAuthenticated, async (req, res) => {
  const id = req.query.id;

  const user = await newStudentModel.findOne({ ID: id });

  let student; 

  if(user.data_validated_by_admin === 2) {
    student = await newStudentModel.findOne({ ID: id })
  } else {
    student = await unverifiedData.findOne({ ID: id });
  }

  const documentObject = {}

  const photofile = student.document.filter((doc) => doc.doc_name === "photo_file");
  const incomefile = student.document.filter((doc) => doc.doc_name === "income_file");
  const signaturefile = student.document.filter((doc) => doc.doc_name === "signature_file");
  const highschoolmarksheetfile = student.document.filter((doc) => doc.doc_name === "highschool_marksheet");
  const intermarksheetfile = student.document.filter((doc) => doc.doc_name === "inter_marksheet");
  const enrollmentletterfile = student.document.filter((doc) => doc.doc_name === "enrollment_letter");
  const categoryfile = student.document.filter((doc) => doc.doc_name === "category_file");


  documentObject.photofileObject = photofile[0];
  documentObject.incomefileObject = incomefile[0];
  documentObject.signaturefileObject = signaturefile[0];
  documentObject.highschoolmarksheetfileObject = highschoolmarksheetfile[0];
  documentObject.intermarksheetfileObject = intermarksheetfile[0];
  documentObject.enrollmentletterfileObject = enrollmentletterfile[0];
  documentObject.categoryfileObject = categoryfile[0];


  const dataToViewDocuments = {
    document: documentObject,
    category: user.category
  }

  res.send(dataToViewDocuments)
})

app.get("/viewdata/viewHostelDetails", ensureAuthenticated, async (req, res) => {
  const { id } = req.query;

  const student = await newStudentModel.findOne({ ID: id });

  let user;

  if(student.data_validated_by_admin === 2) {
    user = await newStudentModel.findOne({ ID: id })
  } else {
    user = await unverifiedData.findOne({ ID: id });
  }
  

  const messFeeReceipt = user.document.filter(doc => doc.doc_name === "messfee_receipt")[0];

  const dataToViewHostelDetail = {
    hostel: student.hostel,
    room: student.room_no,
    messFeeReceipt: messFeeReceipt
  }

  res.send(dataToViewHostelDetail)
})

app.get("/viewdata/viewdetails/filepreview", ensureAuthenticated, (req, res) => {
  const path = decodeURIComponent(req.query.path)
  res.sendFile(path)
})


app.post("/statusfromaccountant", ensureAuthenticated, async (req, res) => {
  const { academicVerified, messVerified, maintenanceVerified, ID } = req.body;
  const id = Number(ID)
  const user = await unverifiedData.findOne({ ID: id })
  const student = await newStudentModel.findOne({ ID: id })

  if (academicVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'academicfee_receipt')[0].verified = true;
  }

  if (messVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'messfee_receipt')[0].verified = true;
  }

  if (maintenanceVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'maintenancefee_receipt')[0].verified = true;
  }

  user.save().then(() => console.log("user saved")).catch((err) => console.log(err));

  const dataThatNeedsToBeVerifiedByAccounts = user.document.filter((doc) => doc.doc_name === "academicfee_receipt" || doc.doc_name === "messfee_receipt" || doc.doc_name === "maintenancefee_receipt");

  console.log(dataThatNeedsToBeVerifiedByAccounts);

  let flag = true;

  for(let i = 0; i < dataThatNeedsToBeVerifiedByAccounts.length; i++) {
    if(!dataThatNeedsToBeVerifiedByAccounts[i].verified) {
      flag = false;
      break;
    }
  }

  if (flag) {
    student.verified_by_accounts = true;
    student.save().then(() => console.log("user saved")).catch((err) => console.log(err));
  }

  res.json({ status: "OKAY" });
})


app.post("/statusfromdeanacad", ensureAuthenticated, async (req, res) => {
  const { photoVerified, signatureVerified, incomeVerified, highschoolMarksheetVerified, interMarkSheetVerified, enrollmentLetterVerified, categoryVerified, ID } = req.body;

  const id = Number(ID)
  const user = await unverifiedData.findOne({ ID: id })
  const student = await newStudentModel.findOne({ ID: id })

  if (photoVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'photo_file')[0].verified = true;
  }

  if (signatureVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'signature_file')[0].verified = true;
  }

  if (incomeVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'income_file')[0].verified = true;
  }

  if (highschoolMarksheetVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'highschool_marksheet')[0].verified = true;
  }

  if (interMarkSheetVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'inter_marksheet')[0].verified = true;
  }

  if (enrollmentLetterVerified) {
    user.document.filter((doc, index) => doc.doc_name === 'enrollment_letter')[0].verified = true;
  }

  if (categoryVerified && student.category !== "General") {
    user.document.filter((doc, index) => doc.doc_name === 'category_file')[0].verified = true;
  }

  user.save().then(() => console.log("user saved")).catch((err) => console.log(err));

  const dataThatNeedsToBeVerifiedByAdmissionCell = user.document.filter((doc, index) => doc.doc_name === "photo_file" || doc.doc_name === "signature_file" || doc.doc_name === "income_file" || doc.doc_name === "category_file" || doc.doc_name === "enrollment_letter" || doc.doc_name === "highschool_marksheet" || doc.doc_name === "inter_marksheet");

  let flag = true;

  for(let i = 0; i < dataThatNeedsToBeVerifiedByAdmissionCell.length; i++) {
    if(!dataThatNeedsToBeVerifiedByAdmissionCell[i].verified) {
      flag = false;
      break;
    }
  }

  if(flag) {
    student.verified_by_dean_acad = true;
    student.save().then(() => console.log("user saved")).catch((err) => console.log(err));
  }
  res.json({ status: "OKAY" });
})


app.post("/statusFromWarden", ensureAuthenticated, async (req, res) => {
  const { hostelNameVerified, roomNumberVerified, messFeeVerified, ID } = req.body;

  const id = Number(ID);

  const student = await newStudentModel.findOne({ ID: id });

  if(hostelNameVerified && roomNumberVerified && messFeeVerified) {
    student.verified_by_warden = true;
    student.save().then(() => console.log("user saved")).catch((err) => console.log(err));
  }

  res.json({ status: "Okay" });

})

app.post("/rejected", ensureAuthenticated, async (req, res) => {
  const { rejectedFrom, id } = req.body;

  const student = await newStudentModel.findOne({ ID: id });

  if(rejectedFrom === "Accounts") {
    student.rejected_by_accounts = true
  } else if(rejectedFrom === "DeanAcad") {
    student.rejected_by_dean_acad = true
  } else {
    student.rejected_by_warden = true
  }

  student.save().then(() => console.log("User Saved after rejecting form")).catch((err) => console.error(err));

  res.json({ status: "OKAY" });
})

app.post("/adminLogin", (req, res, next) => {
  passport.authenticate("local-admin", {
    successRedirect: "/admindashboard",
    failureRedirect: "/authentication",
    failureFlash: true
  })
    (req, res, next);
})

app.get("/download/:id", ensureAuthenticated, async (req, res) => {
  const Id = req.params.id;
  console.log(typeof Id)
  //
  await newStudentModel.find({ document: { $elemMatch: { _id: Id } } }, { "document.$": 1 }).then((filedata) => {
    const file = filedata[0].document
    const filePath = file[0].filepath
    const fileName = file[0].filename

    res.download(filePath, fileName, (err) => {
      if (err) {
        res.send(err)
      }
    })


  }).catch((error) => {
    res.send({ msg: "file does not exist" })
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






function importExceltoJson(filepath, batch) {
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