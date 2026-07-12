import { WikiService } from "../services/WikiService.js";

//we find all our elements that can be interacted with or needs to be modified dynamically
const toggle = document.querySelector("#usePoE2Wiki");
const switchEl = toggle.closest(".switch");
const searchInput = document.querySelector("#searchWikiInput");
const logo = document.querySelector(".main-logo img");
const title = document.querySelector("h3");

//We set the toggle to the current state of the usePoE2Wiki setting
toggle.checked = await WikiService.usePoE2Wiki();
await updateUI();

//We remove the class that disable the animation for the switch element
switchEl.classList.remove("no-anim");

//When you click on the toggle, we set the usePoE2Wiki setting to the current state of the toggle and update the UI
toggle.addEventListener("change", async () => {
    await WikiService.setUsePoE2Wiki(toggle.checked);
    await updateUI();
});

//Update the UI with the current wiki infos
async function updateUI() {
    const wiki = await WikiService.getCurrentWiki();

    logo.src = wiki.icon;
    title.textContent = wiki.title;
    searchInput.placeholder = wiki.placeholder;
}

//We focus the search input when the popup opens
searchInput.focus();

// While typing in the search input, we listen for a keyUP event for the key ENTER.
// If this is registered - we assume you pressed ENTER and proceed.
searchInput.addEventListener("keyup", async (event) => {
    //If the key is not ENTER, we skip the current iteration of the event listener
    if (event.key !== "Enter")
        return;

    //We get the query from the search input
    const query = searchInput.value;

    //if the query is empty, we skip the current iteration of the event listener
    if (!query.trim())
        return;

    //We search for the query on the relevant wiki
    await WikiService.search(query);

    //Our job is done, we close the add-on window
    window.close();
});