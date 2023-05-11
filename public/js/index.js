// Function for admin fee form submission

const adminfeeForm = document.querySelector(".adminfee-form")

adminfeeForm.addEventListener("submit" , async () => {
    const dataInForm = new FormData(adminfeeForm);

    const values = [...dataInForm];
    const formDataObject = {};


    values.forEach((ele) => {
        formDataObject[ele[0]] = ele[1];
    })

    console.log(formDataObject);

    const axiosRes = await axios({
        method: "POST",
        url: "http://localhost:5000/adminfeeform",
        data: formDataObject
    });

    console.log(axiosRes)
})
