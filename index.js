// ==UserScript==
// @name              Better YouTube Theater Mode
// @namespace         https://github.com/NightFeather0615
// @version           1.3.2
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

    let isPlayerSetup = false;

    const trySetupPlayer = async () => {
        if (window.location.pathname !== "/watch" || isPlayerSetup) return;

        isPlayerSetup = true;

        let theaterBtn = await waitElement(".ytp-size-button.ytp-button");

        let mashheadContainer = await waitElement("#masthead-container");
        let pageManager = await waitElement("#page-manager");

        let videoBleedContainer = await waitElement("#full-bleed-container");
        let videoBleedContainerObserver = new ResizeObserver(() => {
            let isTheaterView = document.querySelector("#masthead").theater;

            if (window.location.pathname !== "/watch" || videoBleedContainer.clientHeight === 0) {
                mashheadContainer.hidden = false;
                pageManager.style.marginTop = "var(--ytd-masthead-height,var(--ytd-toolbar-height))";
            } else if (isTheaterView && isPlayerSetup && videoBleedContainer.clientHeight > 0) {
                mashheadContainer.hidden = true;
                pageManager.style.marginTop = "0px";
            }
        })
        videoBleedContainerObserver.observe(videoBleedContainer);

        let liveChat = document.querySelector("#chat");

        console.log(`[YT Better Theater Mode] Video player initialized`);

        const processTheaterMode = async () => {
            await asyncSleep(50);

            let isTheaterView = document.querySelector("#masthead").theater;

            if (isTheaterView) {
                console.log(`[YT Better Theater Mode] Applying player styles`);

                mashheadContainer.hidden = true;

                videoBleedContainer.style.maxHeight = "100vh";
                videoBleedContainer.style.height = "100vh";

                pageManager.style.marginTop = "0px";

                if (liveChat) {
                    liveChat.style.top = "0px";
                    liveChat.style.borderRadius = "0 0 0 0";
                }
            } else {
                console.log(`[YT Better Theater Mode] Resetting player styles`);

                mashheadContainer.hidden = false;

                videoBleedContainer.style.maxHeight = "";
                videoBleedContainer.style.height = "";

                pageManager.style.marginTop = "var(--ytd-masthead-height,var(--ytd-toolbar-height))";

                if (liveChat) {
                    liveChat.style.borderRadius = "12px";
                }
            }

            console.log(`[YT Better Theater Mode] Triggering player resize event`);
            let resizeEvent = window.document.createEvent("UIEvents");
            resizeEvent.initUIEvent("resize", true, false, window, 0);
            window.dispatchEvent(resizeEvent);
        }

        console.log(`[YT Better Theater Mode] Setting up theater mode`);

        await processTheaterMode();

        theaterBtn.onclick = processTheaterMode;
    }

    await trySetupPlayer();
    document.addEventListener("selectionchange", trySetupPlayer);
})();
