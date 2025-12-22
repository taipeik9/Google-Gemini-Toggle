const STORAGE_KEY = "geminiEnabled";

(function () {
    // early exit if script has already run
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    // helper function for inserting subtring at a specified index
    const insertString = (idx, str, insert) => {
        if (idx !== -1) {
            return str.substring(0, idx) + insert + str.substring(idx);
        }
    };

    // helper function for removing entire tag and all children by id or class name
    const removeTag = (str, tagIdx, tag) => {
        // no tag found
        if (tagIdx == -1) {
            return [str, null];
        }

        let i = tagIdx;
        let tagStartIdx = null;
        while (tagStartIdx === null && i >= 0) {
            if (str.slice(i, i + tag.length + 1) == `<${tag}`) {
                tagStartIdx = i;
            } else {
                --i;
            }
        }
        if (tagStartIdx === null) {
            throw new Error(`could not find start of tag: ${tag}`);
        }

        let tagEndIdx = null;
        let tagCount = 0;
        while (tagEndIdx === null && i <= str.length) {
            if (str.slice(i, i + 4) == `<${tag}`) {
                ++tagCount;
            }
            if (str.slice(i - 5, i) == `/${tag}>`) {
                --tagCount;
                if (tagCount == 0) {
                    tagEndIdx = i;
                }
            }
            if (tagEndIdx == null) {
                ++i;
            }
        }

        if (tagStartIdx === null) {
            throw new Error(`could not find end of tag: ${tag}`);
        }

        const newStr = str.substring(0, tagStartIdx) + str.substring(tagEndIdx);
        return newStr;
    };

    // creating a dummy doc object and then manipulating it creates
    // some weird formatting issues, so, I am just using string manip instead :/
    const insertClasses = (str, idNameIdx, insert) => {
        let i = idNameIdx;
        let divStartIdx = null;
        while (divStartIdx === null) {
            if (str.slice(i - 4, i) === "<div") {
                divStartIdx = i;
            } else {
                --i;
            }
        }
        console.log(str.slice(divStartIdx, divStartIdx + 100));

        // find the "class" idx
        let classWordEndIdx = null;
        while (classWordEndIdx == null && str[i] !== ">") {
            if (str.slice(i - 5, i) == "class") {
                classWordEndIdx = i;
            } else {
                --i;
            }
        }
        console.log(str[i]);
        console.log(str[i] === ">");
        let insertIdx;
        if (str[i] === ">") {
            insert = ' class="' + insert;
            insert += '"';
            insertIdx = divStartIdx;
        } else {
            insertIdx = i + 2;
        }
        str = insertString(insertIdx, str, insert);

        return str;
    };

    // creates our toggle div and then inserts it before the ai div
    const insertToggle = (str, idNameIdx, enabled) => {
        const switchDiv = document.createElement("div");
        const toggleContainer = document.createElement("div");
        toggleContainer.classList.add("toggle-container");

        const title = document.createElement("span");
        title.textContent = "Gemini Results";
        toggleContainer.appendChild(title);

        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.classList.add("toggle");
        toggle.checked = enabled;

        toggleContainer.appendChild(toggle);

        switchDiv.appendChild(toggleContainer);

        let divStartIdx = null;
        let i = idNameIdx;
        while (divStartIdx === null && i >= 0) {
            if (str[i] === "<") {
                divStartIdx = i;
            } else {
                --i;
            }
        }

        return insertString(divStartIdx, str, toggleContainer.outerHTML);
    };

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

        let geminiEnabled = (await browser.storage.local.get(STORAGE_KEY))
            .geminiEnabled;

        let responseData = "";

        filter.ondata = (event) => {
            responseData += decoder.decode(event.data, { stream: true });
        };

        filter.onstop = () => {
            const aiIdNameIdx = responseData.indexOf('id="eKIzJc"');

            if (aiIdNameIdx !== -1) {
                let classesToInsert = "gemini-div ";
                if (geminiEnabled) {
                    classesToInsert += "reveal ";
                }

                responseData = insertClasses(
                    responseData,
                    aiIdNameIdx,
                    classesToInsert
                );
                const styleTag = document.createElement("style");
                styleTag.textContent = styleSheet;
                const headEndIdx = responseData.indexOf("</head>");
                responseData = insertString(
                    headEndIdx,
                    responseData,
                    styleTag.outerHTML
                );

                responseData = insertToggle(
                    responseData,
                    responseData.indexOf('id="eKIzJc"'), // this is recalculated as the index could have moved
                    geminiEnabled
                );
            }

            // remove ai mode div
            responseData = removeTag(
                responseData,
                responseData.indexOf('class="olrp5b"'),
                "div"
            );

            filter.write(encoder.encode(responseData));
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
