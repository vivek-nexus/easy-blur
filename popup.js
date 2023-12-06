const blurAmountInput = document.querySelector("#blur-amount-input")
const blurAmountValue = document.querySelector("#blur-amount-value")


chrome.storage.local.get(["blurIntensity"]).then((result) => {
    if (result.blurIntensity) {
        blurAmountInput.value = result.blurIntensity
        blurAmountValue.textContent = ` Blur intensity: ${blurAmountInput.value} px`
    }
    else {
        blurAmountInput.value = 6
        blurAmountValue.textContent = ` Blur intensity: 6 px`
    }
});


blurAmountInput.addEventListener("input", (event) => {
    blurAmountValue.textContent = `Blur intensity: ${event.target.value} px`;
    chrome.storage.local.set({ blurIntensity: event.target.value }).then(() => {
        console.log(`Blur intensity set to ${event.target.value}`);
    });
})