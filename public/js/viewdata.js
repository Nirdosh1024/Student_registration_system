

const dataTable = document.querySelector(".data-table");
const popup = document.querySelector(".pop-up");
const closebtn = document.querySelector(".close");
console.log(popup)

const feeDetailsPopup = document.querySelector(".fee-details-popup");
const closeFeeDetailsBtn = document.querySelector(".close-fee-details-btn");

const sgender = document.querySelector(".Gender")
const sdob = document.querySelector(".DOB");
const sphoneNum = document.querySelector(".Phone_Number");
const semail = document.querySelector(".Email")
const saadhar = document.querySelector(".aadharNo");
const ssem = document.querySelector(".sem");
const sfathername = document.querySelector(".fatherName");
const smothername =  document.querySelector(".motherName");
const sparentphn = document.querySelector(".parentphn");
const sparentemail = document.querySelector(".parentEmail");
const scategory =  document.querySelector(".category");
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
const maintenancefeefile  = document.querySelector(".maintenance-fee-file");

const academicstatus  =  document.querySelector(".academicstatus");
const messstatus =  document.querySelector(".messstatus");
const maintenancestatus = document.querySelector(".maintenancestatus");

dataTable.addEventListener("click", async (e) => {
    if(e.target.classList.contains("view-more-btn")) {
        const id = e.target.dataset['id']
    
        const axiosResponse = await axios({
            method: "GET",
            url: "http://localhost:5000/viewdata/viewmore",
            params: { 
                id : id
            }        
        });
        const resData = axiosResponse.data;

    popup.style.display = "block";
    sgender.textContent = resData.gender;
    sdob.textContent = resData.dob;
    sphoneNum.textContent = resData.phoneNum;
    semail.textContent = resData.email;
    saadhar.textContent = resData.aadhar;
    ssem.textContent =  resData.sem;
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


    else if(e.target.classList.contains("view-fee-details")) {
        const id = e.target.dataset['id'];

        const axiosResponse = await axios({
            method: "GET",
            url: "http://localhost:5000/viewdata/viewFeeDetails",
            params: { 
                id : id
            }        
        });
        const resData = axiosResponse.data;
        console.log(resData);
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

        feeDetailsPopup.addEventListener("click" , async (e) => {
            if(e.target.classList.contains("academic-fee-file")){
                const axiosResponse = await axios({
                    method: "GET",
                    url : "http://localhost:5000/viewdata/viewfeedetails/viewfile",
                    params : {
                        path : resData.document[6].filepath
                    }
                })
            }
            else if(e.target.classList.contains("mess-fee-file")){
                const axiosResponse = await axios({
                    method: "GET",
                    url : "http://localhost:5000/viewdata/viewfeedetails/viewfile",
                    params : {
                        path : resData.document[8].filepath
                    }
                })

            
            }
            else{
                const axiosResponse = await axios({
                    method: "GET",
                    url : "http://localhost:5000/viewdata/viewfeedetails/viewfile",
                    params : {
                        path : resData.document[9].filepath
                    }
                })
            }
        })
        // academicfeefile.src = resData.document[6].filepath;
        // messfeefile.src = resData.document[8].filepath;
        // maintenancefeefile.src = resData.document[9].filepath;

    }
})

closebtn.addEventListener("click" , (e) => {
    popup.style.display = "none"
})

closeFeeDetailsBtn.addEventListener("click", () => {
    feeDetailsPopup.style.display = "none"
})