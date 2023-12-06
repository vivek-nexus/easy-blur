// popup.js
const copyButton = document.getElementById('copyButton');

copyButton.addEventListener('click', function () {
    const messageToUI = document.querySelector("#message")
    messageToUI.textContent = "Hover mode active. Press esc key to cancel."
    window.close()

    // Get the currently active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "hoverMode" })
    });
});
