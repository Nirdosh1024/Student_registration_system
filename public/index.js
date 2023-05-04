const personalForm = document.querySelector(".personal-form");


personalForm.addEventListener("submit", async () => {
    const dataInForm = new FormData(personalForm);
    const values = [...dataInForm];
    const formDataObject = {};
    values.forEach((ele, index) => {
        formDataObject[ele[0]] = ele[1];
    })
    console.log(formDataObject);
    const axiosResponse = await axios({
        method: "POST",
        url: "http://localhost:5000/form-submit",
        data: formDataObject
    });

    console.log(axiosResponse);

    // fetch("http://localhost:5000/form-submit",{
    //     method:"POST",
    //     body:JSON.stringify(formDataObject)
    // }).then((data)=>data.json()).then(data=>{
    //     console.log(data)
    //     console.log("hurray")
    // })
})