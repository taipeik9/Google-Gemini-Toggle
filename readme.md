# Google Gemini Toggle

Adds a toggle on Google searches which enables / disables the Gemini results.

#### Latest Update (November 19th 2025)

Wow, it is working so well. Below is an updated todo list, but I also wanted to write down some of the things that I did / tried today, so that I can remember.

So, there is now a toggle switch for the AI overview, and it remembers your option, which is stored in local storage (extension scope, not browser). This was pretty painstaking - there are three components: injected script, content scripts, and the background script (worker). The background script intercepts the search request and adds the toggle switch along with the class that hides the overview. The state of whether its enabled or not is stored in the background script. I tried this in a lot of ways, the obvious onen being storing it in the browser localStorage. The problem with this, however, was still with the loading of the gemini div. The localStorage wouldn't be able to update until the page was loaded, and again, I don't load the page until the gemini box is gone (to remove that stutter). So, I can't have the worker script rely on the initial load for the state. Now, I could have added a stylesheet which runs on document_start that hides the gemini div from the beginning, but that would create a stutter in the opposite direction (when a user loads the page starting with gemini enabled, then it would flash without it before appearing). So, the best option was to store the state on the background script.

The processes communicate via messaging. When a user toggles Gemini, a function is called on the injected script then a message is sent to the messaging content script, and then another message is sent to the background script, which checks the state and reverses it. Then the messaging queue happens again, but backwards, to update the injected script with the current state of Gemini Toggle. So, when a user opens a page with Gemini enabled or disabled there will be no stutter with their experience.

Also, some of the day was creating the toggle button bc css is not my strong suit haha. I followed a tutorial online and copied the look of the material UI toggle switches.

TODO
- [x] Toggle Gemini results back on
- [ ] Figure out "people also ask" section
- [x] Add div space back after AI overview is removed (maybe instead of removing just turn it into a div with min-height 12px, only if its the first item in our div list; if it prioritizes something else then it actually creates a weird space, see search "firefox webrequest api")
- [ ] Stop it from requesting the AI service? (save the planet) I think this happens in a separate req. The "https://www.google.com/async/folsrch" call. However, I worry that that is requesting other important async services and blocking the request will break things, but we'll just try and see.
  - [ ] If I'm able to do the above, I would love it so much if the on-page toggle could actually request the service, so its blocked unless someone checks that box
- [x] "toggle" icon for when its off/on.
- [x] Store user option in local storage.
- [ ] determine ai div without id name? (future "proofing")

### November 20th tasks completed
- [x] figure out max-height, summaries get cut off

### November 25th completed!
- [x] fix bug -> gemini enabled on two tabs, disable and then refresh. The second tab will have the summary removed, but the toggle button will still be checked. I update the check on reload in googleGeminiToggle.js but for some reason its not persisting. 

### November 21 added notes
- [ ] add dark mode
- [ ] crazy image + footer bug when looking up "black"