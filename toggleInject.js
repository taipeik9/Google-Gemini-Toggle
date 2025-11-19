const STORAGE_KEY = "geminiEnabled";

document.querySelector(".toggle").addEventListener("click", toggleResults);
function toggleResults() {
    window.postMessage(
        {
            source: "gemini-toggle",
            fromPage: true,
            action: "TOGGLE_GEMINI",
        },
        "*"
    );
}

window.addEventListener("message", (e) => {
    if (e.source !== window) return;
    if (!e.data || e.data.source !== "gemini-toggle" || !e.data.fromContent)
        return;

    const toggle = document.querySelector(".toggle");
    const geminiDiv = document.querySelector("#eKIzJc");

    if ((toggle.checked = e.data.geminiEnabled)) {
        geminiDiv.classList.add("reveal");
    } else {
        geminiDiv.classList.remove("reveal");
    }
});
