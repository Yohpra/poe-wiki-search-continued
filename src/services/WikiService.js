export class WikiService {

    /*
        From the add-on storage, we get the value of the usePoE2Wiki key
    */
    static async usePoE2Wiki() {
        const { usePoE2Wiki } = await chrome.storage.local.get({
            usePoE2Wiki: false
        });
        return usePoE2Wiki;
    }

    /*
          We set the value of the usePoE2Wiki key in the add-on storage
    */
    static async setUsePoE2Wiki(enabled) {
        await chrome.storage.local.set({
            usePoE2Wiki: enabled
        });
    }

    /*
        We return the current wiki based on the value of the usePoE2Wiki key (either PoE 1 or PoE 2)
    */
    static async getCurrentWiki() {
        return (await this.usePoE2Wiki())
            ? WikiService.POE2
            : WikiService.POE1;
    }

    /*
        We open a new tab with the relevant results from the current wiki
        (if you typed the exact name of something, e.g. "Faster Attacks" for PoE 1 or "Rapid Attacks I" for PoE 2,
        then it will open the relevant page instead of searching for it)
    */
    static async search(query) {
        const wiki = await this.getCurrentWiki();

        await chrome.tabs.create({
            url: wiki.siteSearch + encodeURIComponent(query)
        });
    }

    /*
        We defined what makes up the wiki objects:
        siteQuery: wiki URL added to google queries,
        siteBase: the default wiki url for article pages,
        siteSearch: the wiki URL used during searches,
        shorthand: what should we replace in queries,
        gameName: the game name,
        icon: the icon used in the add-on UI,
        title: the title used in the add-on UI,
        placeholder: the example used in the text input:
    */
    static POE1 = {
        siteQuery : "poewiki.net",
        siteBase : "https://www.poewiki.net/wiki/",
        siteSearch: "https://www.poewiki.net/w/index.php?search=",
        shorthand: "poewiki",
        gameName: "poe",
        icon: "../icons/icon_96.png",
        title: "Search PoE Wiki",
        placeholder: "Ex.: Faster Attacks"
    };

    /*
        We defined what makes up the wiki objects:
        siteQuery: wiki URL added to google queries,
        siteBase: the default wiki url for article pages,
        siteSearch: the wiki URL used during searches,
        shorthand: what should we replace in queries,
        gameName: the game name,
        icon: the icon used in the add-on UI,
        title: the title used in the add-on UI,
        placeholder: the example used in the text input:
    */
    static POE2 = {
        siteQuery : "poe2wiki.net",
        siteBase : "https://www.poe2wiki.net/wiki/",
        siteSearch: "https://www.poe2wiki.net/index.php?search=",
        shorthand: "poe2wiki",
        gameName: "poe2",
        icon: "../icons/icon_2_96.png",
        title: "Search PoE 2 Wiki",
        placeholder: "Ex.: Rapid Attacks I"
    };
}