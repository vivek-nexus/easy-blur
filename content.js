// content.js
const existingStyleTag = document.querySelector('style[data-extension-styles]');
const newStyles = `
  .blur-element {
   filter: blur(6px)!important;
  }

  .highlight-element{
    border: 4px red solid!important;
  }
`;

if (existingStyleTag) {
    existingStyleTag.textContent += newStyles;
} else {
    const style = document.createElement('style');
    style.textContent = newStyles;
    style.setAttribute('data-extension-styles', ''); // Add a data attribute for identification
    document.head.appendChild(style);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'hoverMode') {
        document.addEventListener("mouseover", DocMouseOver);

        document.addEventListener("keydown", DocBlurKey)

        document.addEventListener("keydown", DocUnblurKey)

        document.addEventListener("keydown", exitHoverMode)
    }
})





function DocMouseOver(event) {
    const target = event.target;

    // Check if the target is an element (not a text node or something else)
    if (target.nodeType === 1) {
        target.setAttribute("target-element", "true")
        target.classList.add("highlight-element")

        target.addEventListener("mouseout", () => {
            target.removeAttribute("target-element")
            target.classList.remove("highlight-element")
        })
    }
}

function DocBlurKey(event) {
    if (event.key === "b") {
        const elementToLock = document.querySelector("[target-element='true']")
        // elementToLock.setAttribute("is-blur-locked", "true")
        elementToLock.classList.add("blur-element")
        alert("Blur successfully locked, until next page refresh")
    }
}

function DocUnblurKey(event) {
    if (event.key === "u") {
        const elementToLock = document.querySelector("[target-element='true']")
        // elementToLock.setAttribute("is-blur-locked", "false")
        elementToLock.classList.remove("blur-element")
        alert("Blur successfully unlocked, until next page refresh")
    }
}

function exitHoverMode(event) {
    if (event.key === "q") {
        document.removeEventListener("mouseover", DocMouseOver)
        document.removeEventListener("keydown", DocBlurKey)
        document.removeEventListener("keydown", DocUnblurKey)
    }
}

