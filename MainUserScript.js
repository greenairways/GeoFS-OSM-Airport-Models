// ==UserScript==
// @name         GeoFS OSM Airport Models (JSON Loader)
// @namespace    geofs-custom
// @version      Auto
// @description  Loads airport building models from an external JSON file with smart distance/altitude unloading (minimumPixelSize fixed)
// @author       thegreen121 (GXRdev)
// @match        https://*.geo-fs.com/geofs.php*
// @match        https://beta.geo-fs.com/geofs.php*
// @match        https://www.geo-fs.com/geofs.php*
// @match        https://www.beta.geo-fs.com/geofs.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const scripts = [
        "https://raw.githubusercontent.com/greenairways/GeoFS-OSM-Airport-Models/main/defaultbuildingremover.js",
        "https://raw.githubusercontent.com/greenairways/GeoFS-OSM-Airport-Models/main/Userscript.js"
    ];

    async function injectScript(url) {
        try {
            console.log(`GeoFS Loader: Fetching ${url}...`);
            const response = await fetch(url);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const code = await response.text();
            const scriptElement = document.createElement('script');
            
            // We wrap the code in a try-catch so one script crashing 
            // doesn't stop the other from working.
            scriptElement.textContent = `try { ${code} } catch (e) { console.error('Error in injected script: ' + e); }`;
            
            document.body.appendChild(scriptElement);
            console.log(`GeoFS Loader: Successfully injected ${url.split('/').pop()}`);
        } catch (err) {
            console.error(`GeoFS Loader: Failed to load ${url}:`, err);
        }
    }

    // Wait 5 seconds to let the flight simulator engine stabilize
    console.log("GeoFS Loader: Waiting for engine stabilization...");
    setTimeout(() => {
        scripts.forEach(injectScript);
    }, 5000);
})();
