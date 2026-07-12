// background.js (MV3 service worker)
import { WikiService } from "../services/WikiService.js";

const RULE_IDS = [1, 2, 3];

//Build our set of rules, depending on whether we're using poe2 or poe1
async function buildRules() {
    if (await WikiService.usePoE2Wiki()) {
        let filter = "(?:([^&]*)\\+)?(?:poe\\+2\\+wiki|poe2\\+wiki|poe2wiki)(?:\\+([^&]*))?";
        return [
        //redirect google search using either "poe2 wiki", "poe 2 wiki" or "poe2wiki" with "site:poe2wiki.net", to avoid fextralife
            {
                id: 1,
                priority: 1,
                action: {
                    type: "redirect",
                    redirect: {
                        regexSubstitution: "https://www.google.com/search?q=site:poe2wiki.net \\1 \\2"
                    }
                },
                condition: {
                    regexFilter: "https://.*\\.google\\.com/search\\?.*?q=" + filter,
                    resourceTypes: ["main_frame"]
                }
            },
            //redirect duckduckgo search using either "poe2 wiki", "poe 2 wiki" or "poe2wiki" with "site:poe2wiki.net", to avoid fextralife
            {
                id: 2,
                priority: 1,
                action: {
                    type: "redirect",
                    redirect: {
                        regexSubstitution: "https://duckduckgo.com/?q=site:poe2wiki.net \\1 \\2"
                    }
                },
                condition: {
                    regexFilter: "https://(?:.*\\.)?duckduckgo\\.com/\\?.*?q=" + filter,
                    resourceTypes: ["main_frame"]
                }
            }
        ];
    }

    let filter = "(?:([^&]*)\\+)?(?:poe\\+wiki|poewiki)(?:\\+([^&]*))?";
    return [
        //redirect from fandom article to poewiki.net article
        {
            id: 1,
            priority: 1,
            action: {
                type: "redirect",
                redirect: { transform: { host: "www.poewiki.net" } }
            },
            condition: {
                urlFilter: "||pathofexile.fandom.com/wiki/",
                resourceTypes: ["main_frame"]
            }
        },
        //redirect google search using either "poe wiki" or "poewiki" with "site:poewiki.net", to avoid fandom
        {
            id: 2,
            priority: 1,
            action: {
                type: "redirect",
                redirect: {
                    regexSubstitution: "https://www.google.com/search?q=site:poewiki.net \\1 \\2"
                }
            },
            condition: {
                regexFilter: "https://.*\\.google\\.com/search\\?.*?q=" + filter,
                resourceTypes: ["main_frame"]
            }
        },
        //redirect duckduckgo search using either "poe wiki" or "poewiki" with "site:poewiki.net", to avoid fandom
        {
            id: 3,
            priority: 1,
            action: {
                type: "redirect",
                redirect: {
                    regexSubstitution: "https://duckduckgo.com/?q=site:poewiki.net \\1 \\2"
                }
            },
            condition: {
                regexFilter: "https://(?:.*\\.)?duckduckgo\\.com/\\?.*?q=" + filter,
                resourceTypes: ["main_frame"]
            }
        }
    ];
}

//Apply our new rules, build from the buildRules() function
async function applyRules() {
    //We get the rules from the buildRules() function
    const rules = await buildRules();

    //We apply the rules: first by removing the existing ones, then by adding the new rules.
    chrome.declarativeNetRequest.updateDynamicRules(
        {
            removeRuleIds: RULE_IDS,
            addRules: rules
        },
        () => {
            if (chrome.runtime.lastError) {
                console.error("Failed to update rules:", chrome.runtime.lastError);
            } else {
                console.log("Dynamic redirect rules applied successfully.");
            }
        }
    );
}

//Automatically set these rules up when the add-on is installed or updated
chrome.runtime.onInstalled.addListener(applyRules);

//Automatically updates these rules when the usePoE2Wiki setting changes
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && "usePoE2Wiki" in changes) {
        applyRules().catch(err => console.error("Failed to apply rules on setting change:", err));
    }
});