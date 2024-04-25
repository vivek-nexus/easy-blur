const blurIntensity = document.querySelector("#blur-intensity")
const blurKey = document.querySelector("#blur-shortcut")
const unblurKey = document.querySelector("#unblur-shortcut")
const exitKey = document.querySelector("#exit-shortcut")

const blurAmountValue = document.querySelector("#blur-amount-value")

blurIntensity.value = 6
blurKey.value = "b"
unblurKey.value = "u"
exitKey.value = "q"

blurAmountValue.textContent = `Blur intensity: 6 px`


chrome.storage.local.get(["blurIntensity", "blurKey", "unblurKey", "exitKey"]).then((result) => {
    if (result.blurIntensity) {
        blurIntensity.value = result.blurIntensity
        blurAmountValue.textContent = ` Blur intensity: ${blurIntensity.value} px`
    }
    if (result.blurKey)
        blurKey.value = result.blurKey
    if (result.unblurKey)
        unblurKey.value = result.unblurKey
    if (result.exitKey)
        exitKey.value = result.exitKey
});


blurIntensity.addEventListener("input", (event) => {
    blurAmountValue.textContent = `Blur intensity: ${event.target.value} px`;
    chrome.storage.local.set({ blurIntensity: event.target.value }).then(() => {
        console.log(`Blur intensity set to ${event.target.value}`);
    });
})

blurKey.addEventListener("input", (event) => {
    chrome.storage.local.set({ blurKey: event.target.value }).then(() => {
        console.log(`Blur key set to ${event.target.value}`);
    });
})

unblurKey.addEventListener("input", (event) => {
    chrome.storage.local.set({ unblurKey: event.target.value }).then(() => {
        console.log(`Unblur key set to ${event.target.value}`);
    });
})

exitKey.addEventListener("input", (event) => {
    chrome.storage.local.set({ exitKey: event.target.value }).then(() => {
        console.log(`Exit key set to ${event.target.value}`);
    });
})