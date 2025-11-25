const STORAGE_KEY = "geminiEnabled";

document
    .querySelector(".toggle-container")
    .addEventListener("click", toggleResults);

const toggle = document.querySelector(".toggle");

function toggleResults() {
    const checked = window.sessionStorage.getItem(STORAGE_KEY);
    window.postMessage(
        {
            source: "gemini-toggle",
            fromPage: true,
            newState: !(checked === "true"),
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
    window.sessionStorage.setItem(STORAGE_KEY, e.data.geminiEnabled);

    if ((toggle.checked = e.data.geminiEnabled)) {
        geminiDiv.classList.add("reveal");
    } else {
        geminiDiv.classList.remove("reveal");
    }
});

// check the toggle state on load (works because toggleContent runs on document idle)
window.postMessage(
    {
        source: "gemini-toggle",
        fromPage: true,
    },
    "*"
);
