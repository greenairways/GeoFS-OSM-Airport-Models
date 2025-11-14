// ==UserScript==
// @name         GeoFS OSM Airport Models (JSON Loader)
// @namespace    geofs-custom
// @version      1.3.5
// @description  Loads airport building models from an external JSON file
// @author       thegreen121 (GXRdev)
// @match        *://www.geo-fs.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // URL of external JSON config
    const JSON_URL = "https://raw.githubusercontent.com/greenairways/GeoFS-OSM-Airport-Models/refs/heads/main/airportdata.json";

    // Wait for GeoFS + Cesium
    const checkInterval = setInterval(() => {
        if (typeof geofs !== "undefined" &&
            geofs.api &&
            geofs.api.viewer &&
            typeof Cesium !== "undefined") {

            clearInterval(checkInterval);
            setTimeout(loadAirportJSON, 1500);
        }
    }, 1500);


    // --- Load JSON file ---
    function loadAirportJSON() {
        console.log("📡 Fetching airport model list from JSON…");

        fetch(JSON_URL)
            .then(response => response.json())
            .then(json => {
                console.log("📁 Loaded airport list:", json);
                json.forEach(addModel);
            })
            .catch(err => console.error("❌ Failed to load JSON:", err));
    }


    // --- Add model ---
    function addModel({ name, modelUrl, lat, lon, alt, heading, scale }) {

        if (geofs.api.viewer.entities.values.some(e => e.name === name)) {
            console.log(`⚠️ Model '${name}' already exists, skipping.`);
            return;
        }

        const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);

        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading || 0), 0, 0)
        );

        const entity = geofs.api.viewer.entities.add({
            name,
            position,
            orientation,
            model: {
                uri: modelUrl,
                scale: scale || 1,
                minimumPixelSize: 128,
                maximumScale: 2000,
                color: Cesium.Color.fromCssColorString("#fff8e0").withAlpha(1.0),
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                colorBlendAmount: 0.25
            }
        });

        console.log(`✅ Loaded model: ${name}`);
    }

})();
