(function () {
    // early exit if script has already run
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    const listener = (details) => {
        const filter = browser.webRequest.filterResponseData(details.requestId);
        const decoder = new TextDecoder("utf-8");
        const encoder = new TextEncoder();

        let responseData = "";

        filter.ondata = (event) => {
            responseData += decoder.decode(event.data, { stream: true });
        };

        filter.onstop = () => {
            const dummyBody = document.createElement("html");
            dummyBody.innerHTML = responseData;
            const geminiDiv = dummyBody.querySelector("#eKIzJc");
            if (geminiDiv) {
                geminiDiv.remove();
            }
            const AIModeDiv = dummyBody.querySelector(".olrp5b");
            if (AIModeDiv) {
                AIModeDiv.remove();
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
