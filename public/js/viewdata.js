

const dataTable = document.querySelector(".data-table");
const popup = document.querySelector(".pop-up");
const closebtn = document.querySelector(".close");
const hostelDetailsPopup = document.querySelector(".hostel-details-pop-up")
const closeViewDocumentsBtn = document.querySelector(".close-view-documents-btn")

const feeDetailsPopup = document.querySelector(".fee-details-popup");
const closeFeeDetailsBtn = document.querySelector(".close-fee-details-btn");

const sgender = document.querySelector(".Gender")
const sdob = document.querySelector(".DOB");
const sphoneNum = document.querySelector(".Phone_Number");
const semail = document.querySelector(".Email")
const saadhar = document.querySelector(".aadharNo");
const ssem = document.querySelector(".sem");
const sfathername = document.querySelector(".fatherName");
const smothername = document.querySelector(".motherName");
const sparentphn = document.querySelector(".parentphn");
const sparentemail = document.querySelector(".parentEmail");
const scategory = document.querySelector(".category");
const sincome = document.querySelector(".address");
const sgaurdian = document.querySelector(".gaurdian");
const sgaurdianphn = document.querySelector(".gaurdianphn");
const sgaurdaddress = document.querySelector(".gaurdianaddress");
const sjeerank = document.querySelector(".jeerank");
const sjeepercent = document.querySelector(".jeepercentile");
const shosteler = document.querySelector(".hosteller");
const sroomno = document.querySelector(".roomno")
const saddress = document.querySelector(".address")




// grabbing elements to populate the fee details modal of a particular student
const paidAcademicFee = document.querySelector(".paid-academic-fee");
const paidHostelFee = document.querySelector(".paid-hostel-fee");
const paidMessFee = document.querySelector(".paid-mess-fee");
const semesterField = document.querySelector(".mess-fee-with-sem");
const paidMaintenanceFee = document.querySelector(".paid-maintenance-fee");

const pendingAcademicFee = document.querySelector(".pending-academic-fee");
const pendingHostelFee = document.querySelector(".pending-hostel-fee");
const pendingMessFee = document.querySelector(".pending-mess-fee");
const pendingMaintenanceFee = document.querySelector(".pending-maintenance-fee");

const academicfeefile = document.querySelector(".academic-fee-file");
const messfeefile = document.querySelector(".mess-fee-file");
const maintenancefeefile = document.querySelector(".maintenance-fee-file");

const academicstatus = document.querySelector(".academicstatus");
const messstatus = document.querySelector(".messstatus");
const maintenancestatus = document.querySelector(".maintenancestatus");
const submittedByAccounts = document.querySelector(".submitted-by-accounts");
const rejectedByAccounts = document.querySelector(".rejected-by-accounts");

// grabbing elements to populate the documents of a particular students
const documentPopup = document.querySelector(".documents-pop-up");

const photoFile = document.querySelector(".photo-file");
const incomeFile = document.querySelector(".income-file");
const signatureFile = document.querySelector(".signature-file");
const highSchoolMarksheetFile = document.querySelector(".highschool-marksheet-file");
const interMarksheetFile = document.querySelector(".inter-marksheet-file");
const enrollmentLetterFile = document.querySelector(".enrollment-letter-file");
const categoryFile = document.querySelector(".category-file");
const rejectedByDeanAcad = document.querySelector(".rejected-by-dean-acad");
const submittedByDeanAcad = document.querySelector(".submitted-by-dean-acad");

// grabbing elements to populate hostel details pop up
const hostelName = document.querySelector(".hostel-name")
const roomNo = document.querySelector(".room-no");
const messFeeFile = document.querySelector(".mess-fee-file-for-hostel-verification");
const submittedByWarden = document.querySelector(".submitted-by-warden");
const rejectedByWarden = document.querySelector(".rejected-by-warden");

console.log(submittedByAccounts)
console.log(rejectedByAccounts)
console.log(submittedByDeanAcad)
console.log(rejectedByDeanAcad)
console.log(submittedByWarden)
console.log(rejectedByWarden)

dataTable.addEventListener("click", async (e) => {
    if (e.target.classList.contains("view-more-btn")) {
        const id = e.target.dataset['id']

        const axiosResponse = await axios({
            method: "GET",
            url: "http://localhost:5000/viewdata/viewmore",
            params: {
                id: id
            }
        });
        const resData = axiosResponse.data;

        popup.style.display = "block";
        sgender.textContent = resData.gender;
        sdob.textContent = resData.dob;
        sphoneNum.textContent = resData.phoneNum;
        semail.textContent = resData.email;
        saadhar.textContent = resData.aadhar;
        ssem.textContent = resData.sem;
        sfathername.textContent = resData.father_name;
        smothername.textContent = resData.mother_name;
        sparentphn.textContent = resData.parentphn;
        sparentemail.textContent = resData.parentEmail;
        scategory.textContent = resData.category;
        sincome.textContent = resData.income;
        saddress.textContent = resData.address;
        sgaurdian.textContent = resData.gaurdian;
        sgaurdianphn.textContent = resData.gaurdianphn;
        sgaurdaddress.textContent = resData.gaurdianadd;
        sjeerank.textContent = resData.jeerank;
        sjeepercent.textContent = resData.sjeepercent;
        const result = resData.hosteler === "true" ? "Yes" : "No"
        shosteler.textContent = result;
        sroomno.textContent = resData.roomno;
    }


    else if (e.target.classList.contains("view-fee-details")) {
        const id = e.target.dataset['id'];

        const axiosResponse = await axios({
            method: "GET",
            url: "http://localhost:5000/viewdata/viewFeeDetails",
            params: {
                id: id
            }
        });
        const resData = axiosResponse.data;
        feeDetailsPopup.style.display = "block";

        // data is to be populated here with the help of textContent Property
        paidAcademicFee.textContent = resData.fees.academic_fee;
        paidHostelFee.textContent = resData.fees.hostel_fee;
        paidMessFee.textContent = resData.fees.mess_fee;
        paidMaintenanceFee.textContent = resData.fees.maintenance_fee;

        pendingAcademicFee.textContent = resData.fees.pending_fee.academic_fee;
        pendingHostelFee.textContent = resData.fees.pending_fee.hostel_fee;
        pendingMessFee.textContent = resData.fees.pending_fee.mess_fee;
        pendingMaintenanceFee.textContent = resData.fees.pending_fee.maintenance_fee;
        semesterField.textContent += "(" + resData.semester + ")";

        feeDetailsPopup.addEventListener("click", async (e) => {
                academicfeefile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.academicfeefileObject.filepath)}`
            
                messfeefile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.messfeefileObject.filepath)}`
            
                maintenancefeefile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.maintenancefeefileObject.filepath)}`
        })
        

        submittedByAccounts.addEventListener("click", async (e) => {
            const academicstatus = document.querySelector(".academicstatus");
            const messstatus = document.querySelector(".messstatus")
            const maintainstatus = document.querySelector(".maintainstatus");


            const axiosResponse = await axios({
                method: "POST",
                url: "http://localhost:5000/statusfromaccountant",
                data: {
                    academicVerified: academicstatus.checked ? true : false,
                    messVerified: messstatus.checked ? true : false,
                    maintenanceVerified: maintainstatus.checked ? true : false,
                    ID: id
                }
            })
            window.location.reload()
        })

        rejectedByAccounts.addEventListener("click", async () => {
            const axiosResponse = await axios({
                method: "POST",
                url: "http://localhost:5000/rejected",
                data: {
                    rejectedFrom: "Accounts",
                    id: id
                }
            })
            window.location.reload()
        })
    } else if (e.target.classList.contains("view-documents")) {
        const id = e.target.dataset['id'];

        const axiosResponse = await axios({
            method: "GET",
            url: "http://localhost:5000/viewdata/viewDocuments",
            params: {
                id: id
            }
        });
        const resData = axiosResponse.data;
        documentPopup.style.display = "block";

        documentPopup.addEventListener("click", (e) => {
                photoFile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.photofileObject.filepath)}`

                incomeFile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.incomefileObject.filepath)}`

                signatureFile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.signaturefileObject.filepath)}`

                highSchoolMarksheetFile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.highschoolmarksheetfileObject.filepath)}`

                interMarksheetFile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.intermarksheetfileObject.filepath)}`

                enrollmentLetterFile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.enrollmentletterfileObject.filepath)}`

                categoryFile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.document.categoryfileObject.filepath)}`
        })

        submittedByDeanAcad.addEventListener("click", async (e) => {

            const photoStatus = document.querySelector(".photostatus");
            const incomeStatus = document.querySelector(".incomestatus");
            const signatureStatus = document.querySelector(".signaturestatus");
            const highschoolStatus = document.querySelector(".highschoolstatus");
            const interStatus = document.querySelector(".interstatus");
            const enrollmentStatus = document.querySelector(".enrollmentstatus");
            const categoryStatus = document.querySelector(".categorystatus");

            const axiosResponse = await axios({
                method: "POST",
                url: "http://localhost:5000/statusfromdeanacad",
                data: {
                    photoVerified: photoStatus.checked ? true : false,
                    signatureVerified: signatureStatus.checked ? true : false,
                    incomeVerified: incomeStatus.checked ? true : false,
                    highschoolMarksheetVerified: highschoolStatus.checked ? true : false,
                    interMarkSheetVerified: interStatus.checked ? true : false,
                    enrollmentLetterVerified: enrollmentStatus.checked ? true : false,
                    categoryVerified: categoryStatus.checked ? true : false,
                    ID: id
                }
            })
            window.location.reload();
        })

        rejectedByDeanAcad.addEventListener("click", async () => {
            const axiosResponse = await axios({
                method: "POST",
                url: "http://localhost:5000/rejected",
                data: {
                    rejectedFrom: "DeanAcad",
                    id: id
                }
            })
            window.location.reload()
        })
    } else if(e.target.classList.contains("view-hostel-details")) {
        const id = e.target.dataset['id'];

        const axiosResponse = await axios({
            method: "GET",
            url: "http://localhost:5000/viewdata/viewHostelDetails",
            params: {
                id: id,
            }
        })

        const resData = axiosResponse.data;


        hostelDetailsPopup.style.display = "block";
        hostelName.textContent = resData.hostel;
        roomNo.textContent = resData.room;

        messFeeFile.href = `/viewdata/viewdetails/filepreview?path=${encodeURIComponent(resData.messFeeReceipt.filepath)}`
        
        submittedByWarden.addEventListener("click", async (e) => {

            const hostelNameStatus = document.getElementById("hostel-name-status");
            const roomNoStatus = document.getElementById("room-no-status");
            const messFeeStatus = document.getElementById("messfeestatus");
            
            const axiosResponse = await axios({
                method: "POST",
                url: "http://localhost:5000/statusFromWarden",
                data: {
                    hostelNameVerified: hostelNameStatus.checked ? true : false,
                    roomNumberVerified: roomNoStatus.checked ? true : false,
                    messFeeVerified: messFeeStatus.checked ? true : false,
                    ID: id
                }
            })
            window.location.reload();
        })

        rejectedByWarden.addEventListener("click", async () => {
            const axiosResponse = await axios({
                method: "POST",
                url: "http://localhost:5000/rejected",
                data: {
                    rejectedFrom: "Warden",
                    id: id
                }
            })
            window.location.reload()
        })
    }
})



closeFeeDetailsBtn.addEventListener("click", () => {
    feeDetailsPopup.style.display = "none";
    window.location.reload();
})

closeViewDocumentsBtn.addEventListener("click", () => {
    documentPopup.style.display = "none";
    window.location.reload();
})


closebtn.addEventListener("click", (e) => {
    popup.style.display = "none";
})





