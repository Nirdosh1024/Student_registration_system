//To display image #personal details

const image_input = document.getElementById("image-input");
var uploaded_image = "";
image_input.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    uploaded_image = reader.result;
    document.querySelector("#display_image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
})






//To display student's signature
const sign_input = document.getElementById("sign-input");
var uploaded_image = "";
sign_input.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    uploaded_image = reader.result;
    document.querySelector("#display_sign").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
})

//Hostel form

const hostelform = document.getElementById("hosteller");
console.log(hostelform)
const hostelAllotmentForm = document.querySelector(".complete-form");

hostelform.addEventListener("click", (e) => {
  if (e.target.children[1].selected) {
    hostelAllotmentForm.style.display = "block";
  } else {
    hostelAllotmentForm.style.display = "none";
  }
})








