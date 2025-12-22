# Google Gemini Toggle

Adds a toggle on Google searches which enables / disables the Gemini results.

## Quick Demonstration



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

To remove the stutter, instead of removing the overview div when

## Future Changes