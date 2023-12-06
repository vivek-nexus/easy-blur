chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "injectScript",
        title: "Easy blur",
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "injectScript") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: injectScript
        });
    }
});

function injectScript() {
    alert(`Easy blur hover mode is active

    • Hover over an element 
    • Press "b" to blur, "u" to unblur
    • Press "Esc" to stop selecting
    
Change blur settings by opening the extension using the puzzle icon.
    `)

    chrome.storage.local.get(["blurIntensity"]).then((result) => {
        let blurIntensity = 6;
        if (result.blurIntensity)
            blurIntensity = result.blurIntensity

        const existingStyleTag = document.querySelector('style[data-extension-styles]');
        const newStyles = `
                .blur-element {
                filter: blur(${blurIntensity}px)!important;
                }
    
                .highlight-element{
                    border: 4px red solid!important;
                }`;

        if (existingStyleTag) {
            existingStyleTag.textContent += newStyles;
        } else {
            const style = document.createElement('style');
            style.textContent = newStyles;
            style.setAttribute('data-extension-styles', ''); // Add a data attribute for identification
            document.head.appendChild(style);
        }

        // Start blurring in response to various events
        document.addEventListener("mouseover", DocMouseOver);
        document.addEventListener("keydown", DocBlurKey)
        document.addEventListener("keydown", DocUnblurKey)

        //Stop blurring in response to various events
        document.addEventListener("keydown", exitHoverMode)
        document.addEventListener("contextmenu", () => {
            clearHoverMode()
            return
        })
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            for (let key in changes) {
                if (key === "blurIntensity") {
                    clearHoverMode()
                    return
                }
            }
        });



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
                elementToLock.classList.add("blur-element")
                alert("Blur successfully locked, until next page refresh")
            }
        }

        function DocUnblurKey(event) {
            if (event.key === "u") {
                const elementToLock = document.querySelector("[target-element='true']")
                elementToLock.classList.remove("blur-element")
                alert("Blur successfully unlocked, until next page refresh")
            }
        }

        function exitHoverMode(event) {
            if (event.key === "Escape") {
                document.removeEventListener("mouseover", DocMouseOver)
                document.removeEventListener("keydown", DocBlurKey)
                document.removeEventListener("keydown", DocUnblurKey)
            }
        }

        function clearHoverMode() {
            document.removeEventListener("mouseover", DocMouseOver)
            document.removeEventListener("keydown", DocBlurKey)
            document.removeEventListener("keydown", DocUnblurKey)
        }
    })
}



