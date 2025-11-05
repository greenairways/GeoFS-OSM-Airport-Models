// ==UserScript==
// @name         GeoFS OSM Airport Models
// @namespace    geofs-custom
// @version      1.0
// @description  Loads basic OSM airport models to airports that are missing buildings
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
        console.log("GeoFS loaded — adding custom airport model...");

        // Use jsDelivr mirror to avoid GitHub CORS issues
        const modelUrl = "https://cdn.jsdelivr.net/gh/greenairways/test@latest/IADP4.gltf";

        // --- Placement ---  
        const lat = 38.947265;   // Latitude
        const lon = -77.448265;   // Longitude
        const alt = 86.5;         // Altitude
        const heading = 90;      // Rotation

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
                scale: 10,              // Model Scale
                minimumPixelSize: 128,
                maximumScale: 2000
            }
        });

        console.log("✅ Model entity added:", entity);
        geofs.api.viewer.flyTo(entity); // Auto-fly to the model
    }
})();
