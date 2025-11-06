// ==UserScript==
// @name         GeoFS Static Model Loader
// @namespace    geofs-custom
// @version      1.0
// @description  Loads a static model to GeoFS
// @author       thegreen121 (GXRdev)
// @match        *://www.geo-fs.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const checkInterval = setInterval(() => {
        if (typeof geofs !== "undefined" &&
            geofs.api && geofs.api.viewer &&
            typeof Cesium !== "undefined") {
            clearInterval(checkInterval);
            setTimeout(initCustomAirport, 2000);
        }
    }, 1500);

    function initCustomAirport() {
        console.log("GeoFS loaded — adding custom static model...");

        // Use jsDelivr mirror to avoid GitHub CORS issues
        const modelUrl = "https://cdn.jsdelivr.net/gh/username/repositoryname@latest/filename";

        // --- Placement ---
        const lat = latitude;   // Latitude
        const lon = longitude;   // Longitude
        const alt = altitude;         // Altitude
        const heading = heading;      // Rotation

        // --- Position and orientation ---
        const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(
                Cesium.Math.toRadians(heading), 0, 0
            )
        );

        // --- Add the model ---
        const entity = geofs.api.viewer.entities.add({
            name: "GeoFS custom static model",
            position: position,
            orientation: orientation,
            model: {
                uri: modelUrl,
                scale: scale,              // Model Scale
                minimumPixelSize: 128,
                maximumScale: 2000
            }
        });

        console.log("✅ Model entity added:", entity);
        geofs.api.viewer.flyTo(entity); // Auto-fly to the model
    }
})();
