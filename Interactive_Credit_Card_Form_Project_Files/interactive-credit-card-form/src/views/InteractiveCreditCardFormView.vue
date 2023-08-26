<script setup>
import {ref, onMounted} from "vue";

const formWrapperLoaded = ref(false);
const creditCardsContainerLoaded = ref(false);

const inputPlaceholders = ref(["e.g. Jane Appleseed", "e.g. 1234 5678 9123 0000", "MM", "YY", "e.g. 123"]); // name, cardNumber, expDate, expYear, cvc

const ccName = ref("");
const ccNamePlaceholder = ref("Jane Appleseed");
const ccNameValid = ref(true);

const ccNumber = ref("");
const ccNumberPlaceholder = ref("0000000000000000");
const ccNumberValid = ref(true);
const ccNumberWrongFormat = ref(false);
const ccNumberNotValidType = ref(true);

const ccMonth = ref("");
const ccMonthPlaceholder = ref("00");
const ccYear = ref("");
const ccYearPlaceholder = ref("00");
const ccExpDateValid = ref(true);

const ccCvc = ref("");
const ccCvcPlaceholder = ref("123");
const ccCvcValid = ref(true);

const formIsValid = ref(false);
const formSubmittedSuccess = ref(false);

const error = ref(false);
const animateButtonIcon = ref(false);
const ccAnimateFrontInView = ref(false);
const ccAnimateBackInView = ref(false);

const checkmarkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                <path
                                    stroke-dasharray="60"
                                    stroke-dashoffset="60"
                                    d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                                >
                                    <animate
                                        class="animate-circle"
                                        fill="freeze"
                                        attributeName="stroke-dashoffset"
                                        dur="0.5s"
                                        values="60;0"
                                    />
                                </path>
                                <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10">
                                    <animate
                                        class="animate-checkmark"
                                        fill="freeze"
                                        attributeName="stroke-dashoffset"
                                        begin="0.6s"
                                        dur="0.2s"
                                        values="14;0"
                                    />
                                </path>
                            </g>
                        </svg>`;

const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                        <path
                            fill="currentColor"
                            d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6Zm0 22a10 10 0 1 1 10-10a10 10 0 0 1-10 10Z"
                            class="clr-i-outline clr-i-outline-path-1"
                        />
                        <path
                            fill="currentColor"
                            d="M18 20.07a1.3 1.3 0 0 1-1.3-1.3v-6a1.3 1.3 0 1 1 2.6 0v6a1.3 1.3 0 0 1-1.3 1.3Z"
                            class="clr-i-outline clr-i-outline-path-2"
                        />
                        <circle cx="17.95" cy="23.02" r="1.5" fill="currentColor" class="clr-i-outline clr-i-outline-path-3" />
                        <path fill="none" d="M0 0h36v36H0z" />
                    </svg>`;

// prettier-ignore
const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path fill="currentColor" d="m224.49 136.49l-72 72a12 12 0 0 1-17-17L187 140H40a12 12 0 0 1 0-24h147l-51.49-51.52a12 12 0 0 1 17-17l72 72a12 12 0 0 1-.02 17.01Z"/></svg>`;

const isNumber = (value) => {
    // Check if the value contains only digits
    return /^[0-9\s]+$/.test(value);
};

const limitInput = (field, n) => {
    // Enforce maximum length for ccNumber

    switch (field) {
        case "ccNumber":
            if (ccNumber.value.length > n) {
                ccNumber.value = ccNumber.value.slice(0, n);
            }
            break;
        case "cvc":
            if (ccCvc.value.length > n) {
                ccCvc.value = ccCvc.value.slice(0, n);
            }
            break;
        default:
            break;
    }
};

const creditCardType = ref("");

const testCreditCard = (cc) => {
    let amex = new RegExp("^3[47][0-9]{13}$");
    let visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
    let cup1 = new RegExp("^62[0-9]{14}[0-9]*$");
    let cup2 = new RegExp("^81[0-9]{14}[0-9]*$");

    let mastercard = new RegExp("^5[1-5][0-9]{14}$");
    let mastercard2 = new RegExp("^2[2-7][0-9]{14}$");

    let disco1 = new RegExp("^6011[0-9]{12}[0-9]*$");
    let disco2 = new RegExp("^62[24568][0-9]{13}[0-9]*$");
    let disco3 = new RegExp("^6[45][0-9]{14}[0-9]*$");

    let diners = new RegExp("^3[0689][0-9]{12}[0-9]*$");
    let jcb = new RegExp("^35[0-9]{14}[0-9]*$");

    if (visa.test(cc)) {
        creditCardType.value = "VISA";
        return true;
    }
    if (amex.test(cc)) {
        creditCardType.value = "AMEX";
        return true;
    }
    if (mastercard.test(cc) || mastercard2.test(cc)) {
        creditCardType.value = "MASTERCARD";
        return true;
    }
    if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
        creditCardType.value = "DISCOVER";
        return true;
    }
    if (diners.test(cc)) {
        creditCardType.value = "DINERS";
        return true;
    }
    if (jcb.test(cc)) {
        creditCardType.value = "JCB";
        return true;
    }
    if (cup1.test(cc) || cup2.test(cc)) {
        creditCardType.value = "CHINA_UNION_PAY";
        return true;
    }
    return false;
};

const validateField = (field) => {
    if (field === "ccName") {
        ccName.value === "" ? (ccNameValid.value = false) : (ccNameValid.value = true);
    }

    if (field === "ccNumber") {
        // Validate Credit Card Number
        ccNumberValid.value = ccNumber.value !== "";

        if (ccNumber.value && !isNumber(ccNumber.value)) {
            ccNumberWrongFormat.value = true;
            ccNumber.value = ccNumber.value.replace(/[^0-9]/g, "");
        } else {
            ccNumberWrongFormat.value = false;
        }

        // Test if the credit card number is valid
        //creditCardType.value = testCreditCard(ccNumber.value);

        if (!ccNumberValid.value) {
            ccNumberNotValidType.value = false;
        } else if (!testCreditCard(ccNumber.value)) {
            ccNumberValid.value = false;
            ccNumberNotValidType.value = true;
        } else {
            ccNumberNotValidType.value = false;
        }

        // Enforce maximum length for ccNumber
        limitInput("ccNumber", 16);
    }

    if (field === "ccExpDateValid") {
        if (ccMonth.value.length > 2) {
            ccMonth.value = ccMonth.value.slice(0, 2);
        }
        if (ccYear.value.length > 2) {
            ccYear.value = ccYear.value.slice(0, 2);
        }
        ccMonth.value === "" || ccYear.value === "" ? (ccExpDateValid.value = false) : (ccExpDateValid.value = true);
    }

    if (field === "cvc") {
        ccCvc.value === "" ? (ccCvcValid.value = false) : (ccCvcValid.value = true);
    }

    if (ccNameValid.value && ccNumberValid.value && ccExpDateValid.value && ccCvcValid.value) {
        formIsValid.value = true;
    } else {
        formIsValid.value = false;
    }
};

const validateForm = () => {
    console.log("Validate Form");
    const fields = ["ccName", "ccNumber", "ccExpDateValid", "cvc"];
    for (let i = 0; i < fields.length; i++) {
        validateField(fields[i]);
    }
};

const submitForm = () => {
    console.log("Form Submitted!");
    validateForm();

    if (formIsValid.value) {
        animateButtonIcon.value = true;

        setTimeout(() => {
            formSubmittedSuccess.value = true;
        }, 1000);
    } else {
        error.value = true;
        setTimeout(() => {
            error.value = false;
        }, 1000);
    }
};

const resetForm = () => {
    formSubmittedSuccess.value = false;
    formIsValid.value = false;
    ccNameValid.value = true;
    ccNumberValid.value = true;
    ccExpDateValid.value = true;
    ccCvcValid.value = true;
    ccName.value = "";
    ccNumber.value = "";
    ccMonth.value = "";
    ccYear.value = "";
    ccCvc.value = "";
    error.value = false;
    animateButtonIcon.value = false;
};

onMounted(() => {
    // Animate Credit Card Container into view
    setTimeout(() => {
        creditCardsContainerLoaded.value = true;
    }, 50);

    // Animate Credit Cards into view
    setTimeout(() => {
        ccAnimateFrontInView.value = true;

        setTimeout(() => {
            ccAnimateBackInView.value = true;
        }, 500);
    }, 200);

    // Animate Credit Card Form into view
    setTimeout(() => {
        formWrapperLoaded.value = true;
    }, 500);
});
</script>

<template>
    <div class="cc-form-container">
        <h1 style="position: absolute; top: 0; left: 0; opacity: 0">Frontend Mentor Interactive Credit Card Solution</h1>
        <div :class="`credit-cards-wrapper ${creditCardsContainerLoaded ? `loaded` : ``}`">
            <div class="credit-cards">
                <div :class="`credit-cards__front ${ccAnimateFrontInView ? `animate-into-view` : ``}`">
                    <img src="../assets/bg-card-front.png" alt="Credit Card Front" />
                    <div class="credit-card-front__circles">
                        <div class="white-circle white-circle--fill white-circle--large"></div>
                        <div class="white-circle white-circle--small white-circle--hollow"></div>
                        <Transition name="fade">
                            <div class="credit-card-type" v-if="creditCardType">
                                <h2>{{ creditCardType }}</h2>
                            </div>
                        </Transition>
                    </div>
                    <div class="credit-cards__front--information">
                        <div class="cc-number">
                            <Transition name="fade">
                                <span v-if="ccNumber || ccNumberPlaceholder">{{ ccNumber ? ccNumber : ccNumberPlaceholder }}</span>
                            </Transition>
                        </div>

                        <div class="cc-name-and-exp-date">
                            <div class="cc-name">
                                <Transition name="fade">
                                    <span v-if="ccName || ccNamePlaceholder">
                                        {{ ccName ? ccName : ccNamePlaceholder }}
                                    </span>
                                </Transition>
                                <span>&nbsp;</span>
                            </div>

                            <div class="cc-exp-date">
                                <Transition name="fade">
                                    <div v-if="ccMonth || ccYear || ccMonthPlaceholder || ccYearPlaceholder">
                                        <span class="cc-exp-date__month">{{ ccMonth ? ccMonth : ccMonthPlaceholder }}</span
                                        >/<span class="cc-exp-date__year">{{ ccYear ? ccYear : ccYearPlaceholder }}</span>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="`credit-cards__back ${ccAnimateBackInView ? `animate-into-view` : ``}`">
                    <img src="../assets/bg-card-back.png" alt="Credit Card Back" />
                    <div class="cc-cvc-number">
                        <Transition name="fade">
                            <span v-if="ccCvc || ccCvcPlaceholder">
                                {{ ccCvc ? ccCvc : ccCvcPlaceholder }}
                            </span>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>

        <div :class="`form-wrapper ${formWrapperLoaded ? `loaded` : ``}`">
            <form @submit.prevent="submitForm" v-if="!formSubmittedSuccess">
                <div class="grid">
                    <div class="grid-row">
                        <div class="grid-row__item">
                            <label for="cardholder-name">Cardholder Name</label>
                            <input
                                type="text"
                                id="cardholder-name"
                                name="cardholder-name"
                                :placeholder="inputPlaceholders[0]"
                                v-model="ccName"
                                :class="!ccNameValid ? `invalid` : ``"
                                @input="validateField(`ccName`)"
                            />
                            <div id="card-holder-name-error" class="error">
                                <Transition name="slide-fade">
                                    <div v-if="!ccNameValid">Cardholder Name can't be blank.</div>
                                </Transition>
                            </div>
                        </div>
                    </div>

                    <div class="grid-row">
                        <div class="grid-row__item">
                            <label for="cardholder-number"> Card Number </label>
                            <input
                                type="text"
                                id="cardholder-number"
                                name="cardholder-number"
                                :placeholder="inputPlaceholders[1]"
                                v-model="ccNumber"
                                :class="!ccNumberValid ? `invalid` : ``"
                                @input="limitInput('ccNumber', 16), validateField('ccNumber')"
                            />
                            <div id="credit-card-error" class="error">
                                <TransitionGroup name="slide-fade">
                                    <div v-if="!ccNumberValid && ccNumber.length < 0">Card Number can't be blank</div>
                                    <div v-if="!ccNumberValid && ccNumberNotValidType && ccNumber.length > 1">Not a valid credit card</div>
                                    <div v-if="ccNumberWrongFormat">Wrong format, numbers only</div>
                                </TransitionGroup>
                            </div>
                        </div>
                    </div>

                    <div class="grid-row grid-row--two-column">
                        <div class="grid-row__item">
                            <label for="cardholder-expiration-month">Exp. Date (MM/YY)</label>
                            <div class="grid-row grid-row--two-column">
                                <div>
                                    <input
                                        type="text"
                                        id="cardholder-expiration-month"
                                        :placeholder="inputPlaceholders[2]"
                                        name="cardholder-expiration-month"
                                        v-model="ccMonth"
                                        :class="!ccExpDateValid ? `invalid` : ``"
                                        @input="validateField(`ccExpDateValid`)"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        id="cardholder-expiration-year"
                                        :placeholder="inputPlaceholders[3]"
                                        name="cardholder-expiration-year"
                                        v-model="ccYear"
                                        :class="!ccExpDateValid ? `invalid` : ``"
                                        @input="validateField(`ccExpDateValid`)"
                                    />
                                </div>
                            </div>
                            <div id="expiration-date-error" class="error">
                                <Transition name="slide-fade">
                                    <div v-if="!ccExpDateValid">Exp. Date can't be blank</div>
                                </Transition>
                            </div>
                        </div>
                        <div class="grid-row__item">
                            <label for="cardholder-cvc">CVC</label>
                            <input
                                type="text"
                                id="cardholder-cvc"
                                :placeholder="inputPlaceholders[4]"
                                name="cardholder-cvc"
                                v-model="ccCvc"
                                :class="!ccCvcValid ? `invalid` : ``"
                                @input="validateField(`cvc`)"
                                @keydown="limitInput('cvc', 4)"
                            />
                            <div id="cvc-error" class="error">
                                <Transition name="slide-fade">
                                    <div v-if="!ccCvcValid">CVC can't be blank</div>
                                </Transition>
                            </div>
                        </div>
                    </div>

                    <div class="grid-row">
                        <div class="grid-row__item">
                            <button :class="`button ${error ? `shake` : ``}`" type="submit" :disabled="error" @click="submitForm">
                                <span class="pattern">
                                    <span class="target inner"></span>
                                </span>
                                <span class="text">
                                    <span v-text="error ? `Error!` : `Confirm `"></span>
                                    <span :class="`error-icon ${error ? `active` : ``}`" v-html="errorIcon" v-if="error"></span>
                                    <span
                                        v-if="animateButtonIcon"
                                        :class="`checkmark-icon ${animateButtonIcon ? `active` : ``}`"
                                        v-html="animateButtonIcon ? checkmarkIcon : ''"
                                    ></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <Transition name="fade">
                <div v-if="formSubmittedSuccess" class="form-success-message">
                    <div class="icon-checkmark">
                        <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="40" cy="40" r="40" fill="url(#a)" />
                            <path d="M28 39.92 36.08 48l16-16" stroke="#fff" stroke-width="3" />
                            <defs>
                                <linearGradient id="a" x1="-23.014" y1="11.507" x2="0" y2="91.507" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#6348FE" />
                                    <stop offset="1" stop-color="#610595" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h2>THANK YOU!</h2>
                    <p class="message">We've added your card details</p>
                    <p>
                        <button class="button" @click="resetForm">
                            <span class="pattern">
                                <span class="target inner"></span>
                            </span>
                            <span class="text">
                                <span>Continue</span>
                                <span class="arrow-icon" v-html="arrowIcon"></span>
                            </span>
                        </button>
                    </p>
                </div>
            </Transition>
        </div>
    </div>
</template>
