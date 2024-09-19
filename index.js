// ==UserScript==
// @name              Better YouTube Theater Mode
// @namespace         https://github.com/NightFeather0615
// @version           1.0.0
// @description       Make YouTube's theater mode work like Twitch's one
// @author            NightFeather
// @match             *://www.youtube.com/*
// @icon              https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant             none
// @license           MPL-2.0
// ==/UserScript==

/* jshint esversion: 8 */
/* jshint -W083 */
/* jshint multistr: true */

/* eslint no-multi-str: 0 */

const waitElement = async (selector) => {
    'use strict';

    while (document.querySelector(selector) === null) {
        await new Promise((resolve, reject) => requestAnimationFrame(resolve));
    }

    return document.querySelector(selector);
};

const asyncSleep = async (ms) => {
    'use strict';

    return new Promise(resolve => setTimeout(resolve, ms));
};

(async function() {
    'use strict';

    let theaterBtn = await waitElement(".ytp-size-button.ytp-button");

    let mashheadContainer = await waitElement("#masthead-container");
    let pageManager = await waitElement("#page-manager");
    let liveChat = await waitElement("#chat");
    let videoBleedContainer = await waitElement("#full-bleed-container");

    const processTheaterMode = async () => {
        await asyncSleep(50);

        let isTheaterView = document.getElementById("masthead")?.getAttribute("theater")?.length >= 0;

        if (isTheaterView) {
            videoBleedContainer.style.maxHeight = "100vh";
            videoBleedContainer.style.height = "100vh";
            mashheadContainer.hidden = true;
            pageManager.style.marginTop = "0px";
            liveChat.style.top = "0px";
            liveChat.style.borderRadius = "0 0 0 0"
        } else {
            videoBleedContainer.style.maxHeight = "";
            videoBleedContainer.style.height = "";
            mashheadContainer.hidden = false;
            pageManager.style.marginTop = "var(--ytd-masthead-height,var(--ytd-toolbar-height))";
            liveChat.style.borderRadius = "12px"
        }

        let resizeEvent = window.document.createEvent("UIEvents");
        resizeEvent.initUIEvent("resize", true, false, window, 0);
        window.dispatchEvent(resizeEvent);
    }

    await processTheaterMode();

    theaterBtn.onclick = processTheaterMode;
})();
