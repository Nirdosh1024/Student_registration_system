
const phnNumber = document.getElementById("phone_number")

const email = document.getElementById("email")

const aadharNo = document.getElementById("aadhar")

const dob = document.getElementById("dob")



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
  
//aadhar number valiadtion
const isValidAadhar = (aadhar) => {
    const regexp = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
    return (regexp.test(String(aadhar)))
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

const initialForm = document.querySelector(".initial-form")

initialForm.addEventListener("submit" ,async (e) => {
  e.preventDefault();
  if(validateInputForInitialForm(initialForm)){
  const dataInForm = new FormData(initialForm);
  const values = [...dataInForm];
  const formDataObject = {};
  values.forEach((ele) => {
      formDataObject[ele[0]] = ele[1];
  })

  const axiosResponse = await axios({
      method: "POST",
      url: "http://localhost:5000/form-submit",
      data: formDataObject
  });

  console.log(axiosResponse);
  if(axiosResponse.data.status === "Okay"){
      window.location.href = "/dashboard"
  }
}
else{
   console.log("form not validated")
}
})

const validateInputForInitialForm = (initialForm) => {
    const emailvalue = email.value.trim();
    const phonevalue = phnNumber.value.trim();
    const aadharvalue = aadharNo.value.trim();

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

      if (!isValidAadhar(aadharvalue)) {
        setError(aadharNo, "Provide a valid Aadhar number");
      }
      else {
        setSuccess(aadharNo);
      }  


      if (!isValidPhone(phonevalue)) {
        setError(phnNumber, "Provide a valid phone number");
      }
      else {
        setSuccess(phnNumber);
      }

      if (!isValidDob(currentdobYear)) {
        setError(dob, "Provide a valid date of birth")
      }
      else {
        setSuccess(dob)
      }

      if(successMsg(initialForm)){
        return true;
      }
      else{
        return false;
      }
    
}