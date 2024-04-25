chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "injectScript",
        title: "Easy Blur",
        contexts: ["page"]
    })
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "injectScript") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: injectScript
        });
    }
})

function injectScript() {
    chrome.storage.local.get(["blurIntensity", "blurKey", "unblurKey", "exitKey"]).then((result) => {
        //default values
        let blurIntensity = 6
        let blurKey = "b"
        let unblurKey = "u"
        let exitKey = "q"

        //read from chrome storage, if available
        if (result.blurIntensity)
            blurIntensity = result.blurIntensity
        if (result.blurKey)
            blurKey = result.blurKey
        if (result.unblurKey)
            unblurKey = result.unblurKey
        if (result.exitKey)
            exitKey = result.exitKey

        //style sheet for blur, unblur, custom cursor help text
        const existingStyleTag = document.querySelector('style[easy-blur-styles]');
        const newStyles = `
                @font-face {
                    font-family: Sora;
                    src: url("fonts/Sora_Variable.ttf") format("truetype");
                }

                .blur-element {
                    filter: blur(${blurIntensity}px)!important;
                }
    
                .highlight-blurred-element{
                    outline: red solid 4px!important;
                    filter: blur(0px)!important;
                }
                
                 .highlight-unblurred-element {
                    outline: red solid 4px!important;
                }

                .custom-cursor{
                    position: fixed;
                    padding: 1rem;
                    background-color: rgba(255,255,255,0.3);
                    backdrop-filter: blur(16px);
                    z-index: 1000;
                    border-radius: 16px;
                    box-shadow: 0px 0px 24px 2px rgba(0,0,0, 0.25);
                }

                .custom-cursor-text{
                    margin: 0px;
                    font-size: max(1rem, 16px);
                    font-family: "Sora", sans-serif;
                    line-height: 150%;
                    
                }
                `;

        if (existingStyleTag) {
            existingStyleTag.textContent += newStyles;
        } else {
            const style = document.createElement('style');
            style.textContent = newStyles;
            style.setAttribute('easy-blur-styles', ''); // Add a data attribute for identification
            document.head.appendChild(style);
        }

        //custom cursor help text
        const html = document.querySelector("html")
        const customCursor = document.createElement("div");
        const customCursorText = document.createElement("p")
        const defaultHelpText = `<span>Hover over any element you want to modify, <br /> 👉 Press <b>"${blurKey}"</b> to blur <br /> 👉 Press <b>"${unblurKey}"</b> to unblur<br /> 👉 Press <b>"${exitKey}"</b> to stop hovering<span>`
        customCursor.append(customCursorText)
        html.append(customCursor)

        customCursor.classList.add("custom-cursor")
        customCursorText.classList.add("custom-cursor-text")
        customCursorText.innerHTML = defaultHelpText


        // Move help text with mouse
        document.addEventListener("mousemove", MoveHelpText)
        // Mark hovered element
        document.addEventListener("mouseover", DocMouseOver);
        // Blur marked element on keypress
        document.addEventListener("keydown", DocBlurKey)
        // Unblur marked element on keypress
        document.addEventListener("keydown", DocUnblurKey)

        //Stop blurring when exit key is pressed
        document.addEventListener("keydown", (e) => {
            if (e.key === exitKey) {
                ClearEventListeners()
            }
        })
        //Stop blurring when right click is invoked
        document.addEventListener("contextmenu", () => {
            ClearEventListeners()
            return
        })
        //Stop blurring when settings are hot updated in chrome storage
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            ClearEventListeners()
            return
        });


        // higlight hovered element
        function DocMouseOver(event) {
            const target = event.target;
            const isElementBlurred = target.classList.contains("blur-element")

            // Check if the target is an element (not a text node or something else)
            if (target.nodeType === 1) {
                target.setAttribute("target-element", "true")
                if (isElementBlurred)
                    target.classList.add("highlight-blurred-element")
                else
                    target.classList.add("highlight-unblurred-element")

                target.addEventListener("mouseout", () => {
                    target.removeAttribute("target-element")
                    if (isElementBlurred)
                        target.classList.remove("highlight-blurred-element")
                    else
                        target.classList.remove("highlight-unblurred-element")
                })
            }
        }

        // move help text with cursor
        function MoveHelpText(event) {
            const x = event.clientX;
            const y = event.clientY;

            customCursor.style.left = x + 12 + 'px';
            customCursor.style.top = y + 12 + 'px';
        }

        // Blur the element marked with the attribute, by DocMouseOver function
        function DocBlurKey(event) {
            if (event.key === blurKey) {
                const elementToBlur = document.querySelector("[target-element='true']")
                elementToBlur.classList.add("blur-element")
                customCursorText.innerHTML = "Blur locked until next refresh!"
                setTimeout(() => {
                    customCursorText.innerHTML = defaultHelpText
                }, 2500);
            }
        }

        // Unblur the element marked with the attribute, by DocMouseOver function
        function DocUnblurKey(event) {
            if (event.key === unblurKey) {
                const elementToUnblur = document.querySelector("[target-element='true']")
                elementToUnblur.classList.remove("blur-element")
                customCursorText.innerHTML = "Blur unlocked until next refresh!"
                setTimeout(() => {
                    customCursorText.innerHTML = defaultHelpText
                }, 2500);
            }
        }

        // Remove custom text, highlighter, blur, unblur event listeners and custom text element
        function ClearEventListeners() {
            document.removeEventListener("mousemove", MoveHelpText)
            customCursor.remove()
            document.removeEventListener("mouseover", DocMouseOver)
            document.removeEventListener("keydown", DocBlurKey)
            document.removeEventListener("keydown", DocUnblurKey)
        }
    })
}



