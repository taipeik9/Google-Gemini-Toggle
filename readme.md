# Google Gemini Toggle

Adds a toggle on Google searches which enables / disables the Gemini results.

## Informal Update

Great progress today. This working demo removes Gemini from the searches and there is no "AI Overview" flash before it gets removed, which was the whole point of me making this. All other versions I've tried remove the AI Overview after its been injected into the DOM; I assume either through polling or mutation observation. This, would leave a weird stutter for every search that includes an AI response. The response would show and then quickly get removed. I fixed this by adding a webRequest listener on the browser for the search page that removes the "AI Overview" div before the page is actually shown to the end user.

Readme will come together later. This is the first iteration of the extension. Right now, there's no toggle ability, but it removes Gemini from all searches and AI mode. I want AI mode to be a toggleable feature in the menu later and of course, all Gemini searches should also be able to be toggled back on.

TODO
- [ ] Toggle Gemini results back on
- [ ] Figure out "people also ask" section
- [ ] Add div space back after AI overview is removed (maybe instead of removing just turn it into a div with min-height 12px, only if its the first item in our div list; if it prioritizes something else then it actually creates a weird space, see search "firefox webrequest api")
- [ ] Stop it from requesting the AI service? (save the planet) I think this happens in a separate req. The "https://www.google.com/async/folsrch" call. However, I worry that that is requesting other important async services and blocking the request will break things, but we'll just try and see.
- [ ] "toggle" icon for when its off/on.