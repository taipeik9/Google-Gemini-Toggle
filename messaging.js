window.addEventListener("message", (e) => {
    if (e.source !== window) return;
    if (!e.data || e.data.source !== "gemini-toggle" || !e.data.fromPage)
        return;

    browser.runtime.sendMessage({
        fromContent: true,
        action: e.data.action,
    });
});

browser.runtime.onMessage.addListener((msg) => {
    if (!msg.fromBackground || msg.geminiEnabled === undefined) return;

    window.postMessage(
        {
            source: "gemini-toggle",
            fromContent: true,
            geminiEnabled: msg.geminiEnabled,
        },
        "*"
    );
});
