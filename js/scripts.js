const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");
const fadeElement = document.querySelector("#fade");


// validate CEP input

cepInput.addEventListener("keypress", (e) => {

    const onlyNumbers = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

    // allow only numbers

    if(!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    };
});


// Get address event

cepInput.addEventListener("keyup", (e) => {

    const inputValue = e.target.value;

    // check we have the correct length
    if(inputValue.length === 8) {
        getAddress(inputValue);
    };
});


// get customer address from API

const getAddress = async (cep) => {
    toggleLoader();

    cepInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    // show error and reset form

    if(data.erro ==="true") {
        if(!addressForm.hasAttribute("disabled")) {
            toggleDisabled();
        }
        addressForm.reset();
        toggleLoader();
        toggleMessage("CEP inválido, tente novamente.")
        return;
    }

    if(addressInput.value === "") {
        toggleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighborhoodInput.value = data.bairro;
    regionInput.value = data.uf;

    toggleLoader();

}

// add or remove disable attribute

const toggleDisabled = () => {
    if(regionInput.hasAttribute("disabled")) {
        formInputs.forEach((input) => {
            input.removeAttribute("disabled");
        });
    } else {
        formInputs.forEach((input) => {
            input.setAttribute("disabled", "disabled");
        });
    };
};

// show or hide loader

const toggleLoader = () => {
    const loadElement = document.querySelector("#loader");  

    fadeElement.classList.toggle("hide");
    loadElement.classList.toggle("hide");
}


// show or hide message

const toggleMessage = (msg) => {
    const messageElement = document.querySelector("#message");
    const messageElementText = document.querySelector("#message p");
    messageElementText.innerText = msg;
    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
}

// close message modal

closeButton.addEventListener("click", () => toggleMessage());


// save address

addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleLoader();
    setTimeout(() => {
        toggleLoader();

        toggleMessage("Endereço salvo com sucesso!");

        addressForm.reset();

    }, 1500);
})