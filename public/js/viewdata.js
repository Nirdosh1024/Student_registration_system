const dataTable = document.querySelector(".data-table");
const popup = document.querySelector(".pop-up");
const closebtn = document.querySelector(".close");
console.log(popup)
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

})

closebtn.addEventListener("click" , (e) => {
    popup.style.display = "none"
})