# Google Gemini Toggle

Adds a toggle on Google searches which enables / disables the Gemini results. Version 1.0

## Quick Demonstration
As you can see, its styled nicely and whether the user wants Gemini toggled on or off is stored in local storage.

https://github.com/user-attachments/assets/07eda88c-1e9b-4011-99fa-3dab44426799

## To Run Locally

This extension is not published on the Firefox web store, yet. So, to run it locally you can follow the steps below

1. Clone the repository
2. In Firefox navigate to `about:debugging` in the url bar
3. Click on "This Firefox" and then "Load Temporary Add-on"
4. Select any of the files in the root of the cloned repository

## Motivations
I absolutely cannot stand that the Gemini overview is forced upon you when you search something. When learning or fact-finding, I don't want to read results that could potentially be wrong, and whether it's wrong or not is also dependant on the quality of my "prompt". I want to look at all the available "human-written" information and determine for myself. 

That being said, when I am coding, there are times where Gemini understands my question better than the Google search results. So, I don't want it removed all together.

Furthermore, most of the extensions which remove it all together just remove the div once its found on document load, which created this ugly effect where the AI Overview quickly flashes and then disappears.

## Some "Weirdness" with the Implementation

To remove the stutter, instead of removing the overview div when the document loads (like most of the Gemini removal extensions do), I patch the incoming document. I started by parsing the HTML string in JavaScript and then appending the necessary divs, however, this created a strange effect on only a select few pages. It would push the footer up really high and make a massive space right in the middle of the results. I tried to change around the styling but nothing would help. Even if I parsed the document, did nothing to it and then sent the ".outerHTML" or ".innerHTML" to the user it would still create this weird effect. So, I changed my approach to just modify the string directly. That's why there's some weird string modification helper functions which iterate over the HTML string and modify it if it finds certain ids.

So, its a bit of a "hackey" solution and I haven't tested it that extensively, however, it works well where I have tested it so far! I could have just left it with the easier solution, but I wanted to cover all edge cases.

## Future Changes
Here are some features I want to implement in the future

- [ ] Stop the search from requesting the AI service unless its toggled on
- [ ] Add a form for users to submit bugs or feature requests
- [ ] Actually add it to the Firefox web store
