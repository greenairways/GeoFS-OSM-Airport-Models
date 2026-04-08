// ==UserScript==
// @name         GeoFS OSM Airport Models (JSON Loader with UI)
// @namespace    geofs-custom
// @version      Auto
// @description  Loads airport building models from an external JSON file with smart distance/altitude unloading and a Montserrat font toggle panel.
// @author       thegreen121 (GXRdev)
// @match        *://www.geo-fs.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const JSON_URL = "https://raw.githubusercontent.com/greenairways/GeoFS-OSM-Airport-Models/refs/heads/main/airportdata.json";

    const MAX_ALTITUDE_FT = 18000; // feet
    const MAX_DISTANCE_NM = 30;    // nautical miles

    // Hard safety limits to prevent broken models
    const MIN_SCALE = 0.05;
    const MAX_SCALE = 20;

    const loadedModels = [];

    // Use Montserrat as Panel Font 🤓
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Panel
    const panel = document.createElement('div');
    panel.style = `
        position: absolute; 
        top: 10px; 
        right: 10px; 
        z-index: 10000;
        background: rgba(0, 0, 0, 0.8); 
        color: white; 
        padding: 12px;
        border-radius: 4px; 
        font-family: 'Montserrat', sans-serif; 
        font-size: 13px;
        max-height: 50vh; 
        overflow-y: auto; 
        width: 240px; 
        border: 1px solid #555;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;
    panel.innerHTML = `<div style="font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px; display: flex; justify-content: space-between;">
        <span>Airport Models</span>
        <span style="font-size: 10px; color: #888; font-weight: 400;">JSON LOADER</span>
    </div>`;
    document.body.appendChild(panel);

    // Wait for GeoFS + Cesium
    const checkInterval = setInterval(() => {
        if (
            typeof geofs !== "undefined" &&
            geofs.api &&
            geofs.api.viewer &&
            geofs.aircraft &&
            typeof Cesium !== "undefined"
        ) {
            clearInterval(checkInterval);
            setTimeout(loadAirportJSON, 1500);
            setInterval(updateModelVisibility, 2000);
        }
    }, 1500);

    // --- Load JSON ---
    function loadAirportJSON() {
        console.log("📡 Fetching airport model list from JSON…");

        fetch(JSON_URL)
            .then(r => r.json())
            .then(json => json.forEach(addModel))
            .catch(err => console.error("❌ JSON load failed:", err));
    }

    // --- Add model ---
    function addModel({ name, modelUrl, lat, lon, alt, heading, scale }) {

        if (geofs.api.viewer.entities.values.some(e => e.name === name)) return;

        const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);

        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(
                Cesium.Math.toRadians(heading || 0), 0, 0
            )
        );

        // Clamp scale to prevent insane models
        const safeScale = Math.min(
            Math.max(scale || 1, MIN_SCALE),
            MAX_SCALE
        );

        const entity = geofs.api.viewer.entities.add({
            name,
            position,
            orientation,
            show: true,
            model: {
                uri: modelUrl,
                scale: safeScale,
                minimumPixelSize: 0, // 🔥 FIX: disables forced upscaling
                maximumScale: 500,
                heightReference: Cesium.HeightReference.NONE
            }
        });

        const modelObj = {
            entity,
            lat,
            lon,
            userToggle: true 
        };

        loadedModels.push(modelObj);

        // --- Add Toggle to Panel ---
        const item = document.createElement('div');
        item.style = "margin-bottom: 6px; display: flex; align-items: center; cursor: pointer;";
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.style = "margin-right: 10px; cursor: pointer;";
        checkbox.onclick = (e) => {
            modelObj.userToggle = e.target.checked;
        };

        const label = document.createElement('span');
        // 缩短超长名称并应用字体样式
        label.innerText = name.length > 25 ? name.substring(0, 25) + "..." : name;
        label.title = name;
        label.style = "white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 400;";

        item.appendChild(checkbox);
        item.appendChild(label);
        panel.appendChild(item);

        console.log(`✅ Loaded model: ${name} (scale: ${safeScale})`);
    }

    // --- Visibility logic ---
    function updateModelVisibility() {
        if (!geofs.aircraft.instance) return;

        const aircraft = geofs.aircraft.instance;
        const acLat = aircraft.llaLocation[0];
        const acLon = aircraft.llaLocation[1];
        const acAltFt = aircraft.llaLocation[2] * 3.28084;

        loadedModels.forEach(m => {
            const distanceNm = getDistanceNM(acLat, acLon, m.lat, m.lon);

            const shouldShow =
                m.userToggle &&
                acAltFt <= MAX_ALTITUDE_FT &&
                distanceNm <= MAX_DISTANCE_NM;

            if (m.entity.show !== shouldShow) {
                m.entity.show = shouldShow;
            }
        });
    }

    // --- Distance calc (NM) ---
    function getDistanceNM(lat1, lon1, lat2, lon2) {
        const R = 3440.065; // Earth radius NM
        const toRad = d => d * Math.PI / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        return 2 * R * Math.asin(Math.sqrt(a));
    }

})();
