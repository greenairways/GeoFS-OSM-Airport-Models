// ==UserScript==
// @name         GeoFS Multi-URL Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Blocks a list of specific URLs from loading in GeoFS
// @author       Your Name
// @match        https://www.geo-fs.com/geofs.php*
// @match        https://*.geo-fs.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add any URLs you want to block to this list
    const blockedUrls = [
        "https://data.geo-fs.com/buildings/10_1672_385.glb",
        "https://example-another-asset.com/file.glb",
        "https://data.geo-fs.com/some-other-model.glb",
        "https://data.geo-fs.com/buildings/10_1673_385.glb",
        "https://data.geo-fs.com/buildings/10_1672_386.glb",
        "https://data.geo-fs.com/buildings/10_1673_384.glb",
        "https://data.geo-fs.com/buildings/10_1672_384.glb",
        "https://buffer.buffer.com/buffer.buffer",
        "https://data.geo-fs.com/buildings/11_3347_770.glb",
        "https://data.geo-fs.com/buildings/11_3348_770.glb",
        "https://data.geo-fs.com/buildings/11_3346_771.glb",
        "https://buffer.buffer.com/buffer.buffer",
        "https://data.geo-fs.com/buildings/12_6693_1539.glb",
        "https://data.geo-fs.com/buildings/12_6694_1540.glb",
        "https://buffer.buffer.com/buffer.buffer",
        "https://data.geo-fs.com/buildings/11_3346_769.glb",
        "https://data.geo-fs.com/buildings/11_3347_769.glb",
        "https://data.geo-fs.com/buildings/11_3347_771.glb"
    ];

    // Helper function to check if a URL should be blocked
    const shouldBlock = (url) => {
        if (!url) return false;
        return blockedUrls.some(blocked => url.includes(blocked));
    };

    // Intercept Fetch requests
    const originalFetch = window.fetch;
    window.fetch = function() {
        const url = arguments[0];
        if (shouldBlock(url)) {
            console.log("GeoFS Blocker: Blocked Fetch -> " + url);
            return Promise.reject(new TypeError("Request blocked by userscript"));
        }
        return originalFetch.apply(this, arguments);
    };

    // Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (shouldBlock(url)) {
            console.log("GeoFS Blocker: Blocked XHR -> " + url);
            this.send = function() {
                this.dispatchEvent(new Event('error'));
            };
        }
        return originalOpen.apply(this, arguments);
    };
})();
