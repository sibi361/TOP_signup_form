const requirementsContainer = document.querySelector(".form-requirements");
const requirementsInner = document.querySelector(".form-requirements-inner");
const reqLen = document.querySelector("#reqLen");
const reqLetter = document.querySelector("#reqLetter");
const reqNum = document.querySelector("#reqNum");
const reqSym = document.querySelector("#reqSym");
const requirements = [reqLen, reqLetter, reqNum, reqSym];
const reqMatch = document.querySelector("#reqMatch");
const passInput = document.querySelector("#password");
const passConfInput = document.querySelector("#passwordConf");
const submitButton = document.querySelector('input[type="submit"]');
const formEle = document.querySelector("form");

const PASSWORD_REGEX_LENGTH = /^(.{8,})$/;
const PASSWORD_REGEX_LETTER = /([a-zA-Z]{1,})/;
const PASSWORD_REGEX_NUM = /([\d]{1,})/;
const PASSWORD_REGEX_SYMBOL = /([!@#$%^&*()\-_+.]{1,})/;

function validator(input) {
    if (
        !PASSWORD_REGEX_LENGTH.test(input) ||
        !PASSWORD_REGEX_LETTER.test(input) ||
        !PASSWORD_REGEX_NUM.test(input) ||
        !PASSWORD_REGEX_SYMBOL.test(input)
    ) {
        passInput.classList.add("invalid");

        if (!PASSWORD_REGEX_LENGTH.test(input)) {
            reqLen.classList.add("req-fail");
        } else reqLen.classList.remove("req-fail");

        if (!PASSWORD_REGEX_LETTER.test(input)) {
            reqLetter.classList.add("req-fail");
        } else reqLetter.classList.remove("req-fail");

        if (!PASSWORD_REGEX_NUM.test(input)) {
            reqNum.classList.add("req-fail");
        } else reqNum.classList.remove("req-fail");

        if (!PASSWORD_REGEX_SYMBOL.test(input)) {
            reqSym.classList.add("req-fail");
        } else reqSym.classList.remove("req-fail");

        return false;
    } else {
        passInput.classList.remove("invalid");
        requirements.forEach((req) => req.classList.remove("req-fail"));
        return true;
    }
}

function misc() {
    requirementsContainer.classList.remove("hidden");
    if (canSubmitForm) submitButton.removeAttribute("disabled");
    else submitButton.setAttribute("disabled", "");
}

let canSubmitForm = false;

passInput.addEventListener("keyup", () => {
    const givenPass = passInput.value;
    canSubmitForm = validator(givenPass);
    misc();
});

passConfInput.addEventListener("keyup", () => {
    const givenConfirmPass = passConfInput.value;
    const givenPass = passInput.value;
    const passwordsMatch = givenConfirmPass === givenPass;
    if (passwordsMatch) {
        passConfInput.classList.remove("invalid");
        reqMatch.classList.remove("req-fail");
    } else {
        passConfInput.classList.add("invalid");
        reqMatch.classList.add("req-fail");
    }
    misc();
});

// form submit
const POST_URL = "https://httpbin.org/post";

formEle.addEventListener("submit", (e) => {
    e.preventDefault();
    submitButton.value = "Create Account ✅";

    console.log(`# Sending form data to ${POST_URL}`);
    const data = new URLSearchParams(new FormData(formEle));
    fetch(POST_URL, {
        method: "POST",
        referrerPolicy: "no-referrer",
        body: data,
    })
        .then((response) => response.json())
        .then((resp) => {
            submitButton.value = "Create Account ✅✅";
            console.log(
                "# Form submit success! Server received the following data:"
            );
            console.table(resp["form"]);
        })
        .catch((error) => {
            submitButton.value = "Create Account ✅❌";
            console.log(`# Form submit failed:\n${error}`);
        });
});
