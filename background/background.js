// background.js (MV3 service worker)

// Define redirect rules dynamically
const rules = [
  // Redirect Fandom wiki → poewiki.net
  {
    id: 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        transform: { host: "www.poewiki.net" }
      }
    },
    condition: {
      urlFilter: "||pathofexile.fandom.com/wiki/",
      resourceTypes: ["main_frame"]
    }
  },

  // Redirect Google searches containing "poe wiki" or "poewiki" → site:poewiki.net
  {
    id: 2,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        regexSubstitution: "https://www.google.com/search?q=site:poewiki.net \\1"
      }
    },
    condition: {
      regexFilter: "https://.*\\.google\\.com/search\\?q=(?:poe\\+wiki|poewiki\\+|\\+poewiki)(.*)",
      resourceTypes: ["main_frame"]
    }
  }
];

// On install/update, clear old rules and apply the new ones
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: rules.map(r => r.id),
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
});
