// Select all input elements for varification
const pform = document.querySelector(".personal-information-form");
const sdob = document.getElementById("dob");
const email = document.getElementById("email");
const phone = document.getElementById("phoneNumber");
const aadhar = document.getElementById("aadhar");
const parentPhnno = document.getElementById("parentPhnNo")
const parentemail = document.getElementById("Parentemail")
const gaurdianPhnno = document.getElementById("GaurdianNumber")
const dob = document.getElementById("dob")

const Gpincode = document.getElementById("GinputZip")


// elemets grabbed for correspondance address
const pStreet = document.getElementById("street-1")
const p1Street = document.getElementById("street-2")
const pCity = document.getElementById("inputCity")
const pState = document.getElementById("inputState")
const pPincode = document.getElementById("inputZip")
const pCountry = document.getElementById("inputCountry")

const cStreet = document.getElementById("Cstreet-1")
const c1Street = document.getElementById("Cstreet-2")
const cCity = document.getElementById("CinputCity")
const cState = document.getElementById("CinputState")
const cPincode = document.getElementById("CinputZip")
const cCountry = document.getElementById("CinputCountry")


// grabbing elements of educational detail form by id
const educationalDetails = document.querySelector(".educational-details");
const eform = document.querySelector(".educational-details-form");

const highSchoolMarks = document.getElementById("highSchool-marks")
const highSchoolcerti = document.getElementById("highSchool-marksheet")
const interMarks = document.getElementById("inter-marks")
const intermaxMarks = document.getElementById("inter-maxmarks")
const highschoolmaxMarks = document.getElementById("highschool-maxmarks")

const interMarksheet = document.getElementById("inter-marksheet")
const jeePercentile = document.getElementById("percentile")
const enrollmentLetter = document.getElementById("enrollment-letter")

const highPassingYear =  document.getElementById("highschool-year")

const interPassingYear = document.getElementById("inter-year")


let gFormData = new FormData();


const successMsg = (form) => {
  const inputControlDivs = form.getElementsByClassName("input-control");
  
  const arr  = Array.from(inputControlDivs);
  for(let i = 0; i < arr.length; i++) {
    const inputField = arr[i].getElementsByTagName("input");
    if (inputField.length>0){

    

    if(arr[i].className === "input-control error" || (!inputField[0].value && inputField[0].hasAttribute("required"))) {
      console.log("Something is wrong. It will not work");
      return false;
    } 
  }
  }
  return true;
}

//error message display function
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');
  element.focus();
  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove('success')

}

//success message display function
const setSuccess = element => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error')

  errorDisplay.innerText = "";
  inputControl.classList.add('success');
  inputControl.classList.remove('error');

}

//pdf file validation
const isValidpdf = (e) => {
  const targetFile = e.target.files;
  const fileName = targetFile[0].name;
  const fileSize = Math.round((targetFile[0].size / 1024));

  var ext = fileName.split('.').reverse()[0]

  if (ext === "pdf") {
    if (fileSize <= 2 * 1024) {
      setSuccess(e.target)
    }
    else {
      setError(e.target, "File size is more than 2 MB");
    }
  }
  else {
    setError(e.target, "File is not in pdf format")
  }
}

//image validation
const isValidimagefile = (e) => {
  const targetFile = e.target.files;
  const fileName = targetFile[0].name;
  const fileSize = Math.round((targetFile[0].size / 1024));


  const extension = fileName.split('.').reverse()[0]
  const ext = extension.toLowerCase()

  if (ext === "jpg" || ext === "jpeg" || ext === "png") {
    if (fileSize <= 2 * 1024) {

      setSuccess(e.target)
    }
    else {
      setError(e.target, "File size is more than 2 MB");
    }
  }
  else {
    setError(e.target, "File is not in valid format")
  }
}

//email validation
const isValidEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


//mobile number validation
const isValidPhone = (phonenumber) => {
  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if ((phonenumber.match(phoneno))) {
    return true;
  }
  else {
    return false;
  }
}

//aadhar number valiadtion
const isValidAadhar = (aadhar) => {
  const regexp = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
  return (regexp.test(String(aadhar)))
}


// date of birth validation
const isValidDob = (dob) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const thresholdYear = currentYear - 15;
  if (dob <= thresholdYear) {
    return true;
  }
  else {
    return false
  }
}

// pincode validation
const isValidPincode = (pincode) => {
  const regexp = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
  return (regexp.test(String(pincode)))
}


//function to validate marks
const isValidMarks = (marks) => {
  let maxmarks = 1000;
  if (marks > maxmarks) {
    return false;
  }

  else {
    return true;
  }
}

//function to calculate percentage
const percentCalculate = (marks,maxmarks) => {
   let percent =  parseFloat((marks/maxmarks)*100).toFixed(2);
   return percent;
}



const validateInputsForPersonalForm = (pform) => {
  const emailvalue = email.value.trim();
  const phonevalue = phone.value.trim();
  const aadharvalue = aadhar.value.trim();
  const parentPhnnovalue = parentPhnno.value.trim();
  const parentemailvalue = parentemail.value.trim();
  const gaurdianPhnnovalue = gaurdianPhnno.value.trim();
  const pincodevalue = pPincode.value.trim();

  // for dob validation
  const dobvalue = dob.value;
  const currentdobArray = dobvalue.split("-")
  const currentdobYear = parseInt(currentdobArray[0])


  if (!isValidEmail(emailvalue)) {
    setError(email, "Provide a valid email address");
  }
  else {
    setSuccess(email);
  }

  if (!isValidPhone(phonevalue)) {
    setError(phone, "Provide a valid phone number");
  }
  else {
    setSuccess(phone);
  }

  if (!isValidAadhar(aadharvalue)) {
    setError(aadhar, "Provide a valid Aadhar number");
  }
  else {
    setSuccess(aadhar);
  }

  if (!isValidPhone(parentPhnnovalue)) {
    setError(parentPhnno, "Provide a valid Phone number")
  }
  else {
    setSuccess(parentPhnno)
  }

  if (!isValidEmail(parentemailvalue)) {
    setError(parentemail, "Provide a valid Email")
  }
  else {
    setSuccess(parentemail)
  }

  if (!isValidPhone(gaurdianPhnnovalue)) {
    setError(gaurdianPhnno, "Provide a valid Phone number")
  }
  else {
    setSuccess(gaurdianPhnno)
  }

  if (!isValidDob(currentdobYear)) {
    setError(dob, "Provide a valid date of birth")
  }
  else {
    setSuccess(dob)
  }

  if (!isValidPincode(pincodevalue)) {
    setError(pPincode, 'Provide a valid pincode')
  }
  else {
    setSuccess(pPincode)
  }


  if (categoryVal.value !== "General") {
    if (categoryCerti.files.length) {
      setSuccess(categoryCerti)
    }

    else {
      setError(categoryCerti, "Choose a file")
    }
  }
  if(successMsg(pform)) {
    return true;
  } else {
    return false;
  }
}


const validateInputForEducationalDetails = (eform) => {
  //eductaional form values
  const intermaxMarksvalue = intermaxMarks.value.trim()
  const interMarksvalue = interMarks.value.trim()
  const highschoolmaxMarksvalue = highschoolmaxMarks.value.trim()
  const highSchoolMarksvalue = highSchoolMarks.value.trim()
  const jeePercentilevalue = jeePercentile.value.trim();

  const highPassingYearvalue = highPassingYear.value.trim()

  const interPassingYearvalue = interPassingYear.value.trim()

  if (!isValidMarks(highschoolmaxMarksvalue)) {
    setError(highschoolmaxMarks, "Provide a valid value")
  }
  else {
    setSuccess(highschoolmaxMarks)
  }

  if (!isValidMarks(intermaxMarksvalue)) {
    setError(intermaxMarks, "Provide a valid  value")
  }

  else {
    setSuccess(intermaxMarks)
  }

  if (parseInt(highSchoolMarksvalue) > parseInt(highschoolmaxMarksvalue)) {

    setError(highSchoolMarks, "Provide a valid value ")

  }
  else {
    setSuccess(highSchoolMarks)
  }

  if (parseInt(interMarksvalue) > parseInt(intermaxMarksvalue)) {
    setError(interMarks, "Provide a valid value")
  }
  else {
    setSuccess(interMarks)
  }

  if (parseInt(jeePercentilevalue) > 100) {
    setError(jeePercentile, "Provide a valid percentile")
  }
  else {
    setSuccess(jeePercentile)
  }

  if(parseInt(highPassingYearvalue) > 2015){
    setSuccess(highPassingYear)
  }
  else{
    setError(highPassingYear, "Provide a valid passing year")
  }

  if(parseInt(interPassingYearvalue) > 2015){
    setSuccess(interPassingYear)
  }
  else{
    setError(interPassingYear, "Provide a valid passing year")
  }
  if(parseInt(highPassingYearvalue) >= parseInt(interPassingYearvalue)){
    
    setError(highPassingYear, "Provide a valid passing year")
  }
  if(percentCalculate(highSchoolMarksvalue,highschoolmaxMarksvalue))

  if(successMsg(eform)) {
      return true;
  } else {
      return false;
  }
}

//fee-details validation element grab
const feeform = document.querySelector(".fee-details-form")
const acedemicfee = document.getElementById("acedemicfee")
const messfee = document.getElementById("mess-fee")
const hostelfee = document.getElementById("hostel-fee")
const maintenancefee = document.getElementById("maintenancefee")
const academicfeeAmount = document.getElementById("academicfee-amount")

const hostelfeeAmount = document.getElementById("hostel-amount")

const messfeeAmount = document.getElementById("mess-amount")

const messSecurityAmount = document.getElementById("messSecurity-amount")

const maintenancefeeAmount = document.getElementById("maintenance-amount")



//fee details validation

const validateInputForFeeDetails = (feeform) => {
  const academicfeeAmountvalue = academicfeeAmount.value.trim();

  const hostelfeeAmountvalue = hostelfeeAmount.value.trim();

  const messfeeAmountvalue = messfeeAmount.value.trim();

  const messSecurityAmountvalue = messSecurityAmount.value.trim();

  if(parseInt(academicfeeAmountvalue) <= 0){
    setError(academicfeeAmount , "Provide a valid value")
  }

  if(parseInt(hostelfeeAmountvalue) <= 0){
    setError(hostelfeeAmount , "Provide a valid value")
  }
  
  if(parseInt(messSecurityAmountvalue) <= 0){
    setError(messSecurityAmount , "Provide a valid value")
  }

  if(parseInt(messfeeAmountvalue) <= 0){
    setError(messfeeAmount , "Provide a valid value")
  }

  if(successMsg(feeform)) {
    return true;
} else {
    return false;
}
}

//to check field of category
const categoryVal = document.getElementById("category")
const categoryCerti = document.getElementById("category-certificate")

categoryCerti.addEventListener("change", (e) => {
  if (categoryVal.value === "") {
    setError(categoryVal, "Kindly choose category first")
  }
})

//income certificate validation
const incomeCerti = document.getElementById("income-certificate")
incomeCerti.addEventListener("change", isValidpdf)

//caste category validation
categoryCerti.addEventListener("change", isValidpdf)

// signature validation
const signature = document.getElementById("sign-input")
signature.addEventListener("change", isValidimagefile)

// student image validation
const stuImage = document.getElementById("image-input")
stuImage.addEventListener("change", isValidimagefile)

// validation for permanent address and fillig out coresspondance address
const copyAddressBtn = document.getElementById("copy-address")
copyAddressBtn.addEventListener("click", () => {
  const pstreetvalue = pStreet.value
  const p1Streetvalue = p1Street.value
  const pCityvalue = pCity.value
  const pStatevalue = pState.value
  const pPincodevalue = pPincode.value
  const pCountryvalue = pCountry.value



  if (copyAddressBtn.checked) {
    if (pstreetvalue) {
      cStreet.value = pstreetvalue
    }
    else {
      setError(pStreet, "Kindly fill out Permanent address")
    }

    if (p1Streetvalue) {
      c1Street.value = p1Streetvalue
    }

    else {
      setError(p1Street, "Kindly fill out Permanent address")
    }

    if (pCityvalue) {
      cCity.value = pCityvalue
    }

    else {
      setError(pCity, "Kindly fill out Permanent address")
    }

    if (pStatevalue) {
      cState.value = pStatevalue
    }

    else {
      setError(pState, "Kindly fill out Permanent address")
    }

    if (pCountryvalue) {
      cCountry.value = pCountryvalue
    }

    else {
      setError(pCountry, "Kindly fill out Permanent address")
    }
    if (pPincodevalue) {
      cPincode.value = pPincodevalue

    }
    else {
      setError(pPincode, "Kindly fill out Permanent address")
    }
  }
}

)
//education details and form details
const hostelDetails = document.querySelector(".hostel-details");



//high-school marksheet validation
highSchoolcerti.addEventListener("change", isValidpdf)

//inter marksheet validation
interMarksheet.addEventListener("change", isValidpdf)

//enrollement letter validation
enrollmentLetter.addEventListener("change", isValidpdf)




// acedemic fee validation
acedemicfee.addEventListener("change", isValidpdf)

//mess fee validation
messfee.addEventListener("change", isValidpdf)

// hostel fee validation 
hostelfee.addEventListener("change", isValidpdf)

// maintenance fee validation
maintenancefee.addEventListener("change", isValidpdf)




const personalInfo=document.querySelector('.personal-information')
//personal form validation function declaration
pform.addEventListener('submit', (e) => {
  e.preventDefault();
  let dataInForm = new FormData(pform);
  const values = [...dataInForm.entries()];
  values.forEach(value => {
    gFormData.append(value[0], value[1]);
  })
  // if(validateInputsForPersonalForm(pform)) {
  //   educationalDetails.style.display = "block";
  // } else {
  //   educationalDetails.style.display = "none";
  // }
  personalInfo.style.display="none";
  educationalDetails.style.display = "block";
})



// educational form 
eform.addEventListener(("submit"), (e) => {
  e.preventDefault();
  let dataInForm = new FormData(eform);
  const values = [...dataInForm.entries()];
  values.forEach(value => {
    gFormData.append(value[0], value[1]);
  })
  // if(validateInputForEducationalDetails(eform)) {
  //   hostelDetails.style.display = "block";
  // }
  // else {
  //   hostelDetails.style.display = "none";
  // }
  educationalDetails.style.display="none";
  hostelDetails.style.display = "block";
})
const paymentDetails = document.querySelector(".payment")

const hostelDetailsForm = document.querySelector(".hostel-details-form");

hostelDetailsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let dataInForm = new FormData(hostelDetailsForm);
  const values = [...dataInForm.entries()];
  values.forEach(value => {
    gFormData.append(value[0], value[1]);
  })
  hostelDetails.style.display="none";
  paymentDetails.style.display = "block";
})

const paymentForm = document.querySelector(".payment-form");
const feeDetails = document.querySelector(".fee-details");
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let dataInForm = new FormData(paymentForm);
  const values = [...dataInForm.entries()];
  values.forEach(value => {
    gFormData.append(value[0], value[1]);
  })
  paymentDetails.style.display="none";
  feeDetails.style.display = "block";

})



// fee form
feeform.addEventListener("submit", async (e) => {
  e.preventDefault()
  let dataInForm = new FormData(feeform);
  const values = [...dataInForm.entries()];
  values.forEach(value => {
    gFormData.append(value[0], value[1]);
  })
  
  if(validateInputForFeeDetails(feeform)){
    const axiosRes = await axios({
      method: "POST",
      url: "http://localhost:5000/studentform",
      data: gFormData
  });
  console.log(axiosRes.data.status)
  }
  else{
    console.log("not validated")
  }
})


const ePrevButton = document.getElementById("e-prev-btn");
const hPrevButton = document.getElementById("h-prev-btn");
const pPrevButton = document.getElementById("p-prev-btn");
const fPrevButton = document.getElementById("f-prev-btn");

ePrevButton.addEventListener("click",()=>{
  personalInfo.style.display = "block"
  educationalDetails.style.display = "none"
})

hPrevButton.addEventListener("click",()=>{
  educationalDetails.style.display = "block"
  hostelDetails.style.display = "none"
})

pPrevButton.addEventListener("click",()=>{
  hostelDetails.style.display = "block"
  paymentDetails.style.display = "none"
})

fPrevButton.addEventListener("click",() =>{
  paymentDetails.style.display = "block"
  feeDetails.style.display = "none"
})
