const STORAGE_KEY = "geminiEnabled";

(function () {
    // early exit if script has already run
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    const sendMessage = async (tabId) => {
        const newToggleState = !(await browser.storage.local.get(STORAGE_KEY))
            .geminiEnabled;

        browser.tabs.sendMessage(tabId, {
            fromBackground: true,
            geminiEnabled: newToggleState,
        });
        await browser.storage.local.set({ geminiEnabled: newToggleState });
    };

    browser.runtime.onMessage.addListener(async (msg, sender) => {
        if (msg.fromContent) {
            await sendMessage(sender.tab.id);
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
        console.log(geminiEnabled);

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
                switchDiv.innerHTML = `
                    <div class="toggle-container">
                        <span>Gemini Results</span>
                        <input type="checkbox" class="toggle" ${
                            geminiEnabled ? "checked" : ""
                        }>
                    </div>
                `;
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
