const STORAGE_KEY = "geminiEnabled";

(function () {
    // early exit if script has already run
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    const sendMessage = async (tabId, newState) => {
        let state = (await browser.storage.local.get(STORAGE_KEY))
            .geminiEnabled;
        if (newState !== undefined) {
            await browser.storage.local.set({ geminiEnabled: newState });
            state = newState;
        }
        browser.tabs.sendMessage(tabId, {
            fromBackground: true,
            geminiEnabled: state,
        });
    };

    browser.runtime.onMessage.addListener(async (msg, sender) => {
        if (msg.fromContent) {
            sendMessage(sender.tab.id, msg.newState);
        }
    });

    const listener = async (details) => {
        const filter = browser.webRequest.filterResponseData(details.requestId);
        const decoder = new TextDecoder("utf-8");
        const encoder = new TextEncoder();

        // fetching the sheet from another file to avoid this file being cluttered
        const styleFetch = await fetch(
            browser.runtime.getURL("styles/toggle.css")
        );
        const styleSheet = await styleFetch.text();

        const geminiEnabled = (await browser.storage.local.get(STORAGE_KEY))
            .geminiEnabled;

        let responseData = "";

        filter.ondata = (event) => {
            responseData += decoder.decode(event.data, { stream: true });
        };

        filter.onstop = () => {
            const dummyBody = document.createElement("html");
            dummyBody.innerHTML = responseData;
            const geminiDiv = dummyBody.querySelector("#eKIzJc");
            const head = dummyBody.querySelector("head");

            const styleTag = document.createElement("style");
            styleTag.textContent = styleSheet;
            head.appendChild(styleTag);

            let geminiParent;
            if (geminiDiv) {
                geminiParent = geminiDiv.parentNode;
                geminiDiv.classList.add("gemini-div");
                if (geminiEnabled) {
                    geminiDiv.classList.add("reveal");
                }
            } else {
                console.error("Could not find Gemini div");
            }
            if (geminiParent) {
                const switchDiv = document.createElement("div");
                const toggleContainer = document.createElement("div");
                toggleContainer.classList.add("toggle-container");

                const title = document.createElement("span");
                title.textContent = "Gemini Results";
                toggleContainer.appendChild(title);

                const toggle = document.createElement("input");
                toggle.type = "checkbox";
                toggle.classList.add("toggle");
                toggle.checked = geminiEnabled;

                toggleContainer.appendChild(toggle);

                switchDiv.appendChild(toggleContainer);
                geminiParent.insertBefore(switchDiv, geminiDiv);
            } else {
                console.error("Could not find Gemini parent div");
            }

            const AIModeDiv = dummyBody.querySelector(".olrp5b");
            if (AIModeDiv) {
                AIModeDiv.remove();
            } else {
                console.error("Could not find AI Mode div");
            }

            filter.write(encoder.encode(dummyBody.innerHTML));
            filter.disconnect();
        };

        return {};
    };
    browser.webRequest.onBeforeRequest.addListener(
        listener,
        {
            urls: ["https://www.google.com/search*"],
            types: ["main_frame"],
        },
        ["blocking"]
    );
})();
