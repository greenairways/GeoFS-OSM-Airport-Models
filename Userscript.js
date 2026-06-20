// ==UserScript==
// @name         GeoFS OSM Airport Models
// @namespace    geofs-custom
// @version      4.3
// @description  Adds custom and extra OSM models to GeoFS
// @match        *://www.geo-fs.com/*
// @grant        none
// ==/UserScript==

(function () {
"use strict";

const JSON_URL = "https://raw.githubusercontent.com/greenairways/GeoFS-OSM-Airport-Models/refs/heads/main/5.6hfix.json";

// ================= SETTINGS =================
const MAX_ALTITUDE_FT = 18000;

// tighter distances = less load
const LOAD_DISTANCE = 25;
const UNLOAD_DISTANCE = 32;

// lower cap = more stable for weak devices
const MAX_MODELS = 8;

// stop checking far airports
const MAX_DISTANCE_CHECK = 50;

// grid system
const GRID_SIZE = 2;

// scale safety
const MIN_SCALE = 0.05;
const MAX_SCALE = 20;
// ============================================

let airportData = [];
const activeModels = new Map();
const grid = new Map();

// -------- GRID SYSTEM --------
function getGridKey(lat, lon) {
    const x = Math.floor(lat / GRID_SIZE);
    const y = Math.floor(lon / GRID_SIZE);
    return `${x},${y}`;
}

function buildGrid() {
    airportData.forEach(ap => {
        const key = getGridKey(ap.lat, ap.lon);
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(ap);
    });
}

// -------- LOAD JSON --------
function loadAirportJSON() {
    fetch(JSON_URL)
        .then(r => r.json())
        .then(json => {
            airportData = json;

            // prioritize important airports if field exists
            airportData.sort((a, b) => (b.priority || 0) - (a.priority || 0));

            buildGrid();
            console.log(`✅ Loaded ${airportData.length} airports (stable mode)`);
        })
        .catch(err => console.error("❌ JSON load failed:", err));
}

// -------- SCALE OPTIMIZATION --------
function getDynamicScale(baseScale, dist) {
    if (dist > 20) return baseScale * 0.4;
    if (dist > 10) return baseScale * 0.7;
    return baseScale;
}

// -------- CREATE MODEL --------
function createModel(ap, dist) {

    const safeScale = Math.min(
        Math.max(ap.scale || 1, MIN_SCALE),
        MAX_SCALE
    );

    const dynamicScale = getDynamicScale(safeScale, dist);

    const position = Cesium.Cartesian3.fromDegrees(ap.lon, ap.lat, ap.alt || 0);

    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(ap.heading || 0), 0, 0
        )
    );

    return geofs.api.viewer.entities.add({
        name: ap.name,
        position,
        orientation,
        model: {
            uri: ap.modelUrl,
            scale: dynamicScale,
            minimumPixelSize: 0,
            maximumScale: 500
        }
    });
}

// -------- MAIN UPDATE --------
function update() {
    if (!geofs.aircraft.instance || airportData.length === 0) return;

    const ac = geofs.aircraft.instance;
    const lat = ac.llaLocation[0];
    const lon = ac.llaLocation[1];
    const altFt = ac.llaLocation[2] * 3.28084;

    // hard cutoff at altitude
    if (altFt > MAX_ALTITUDE_FT) {
        activeModels.forEach(obj => {
            geofs.api.viewer.entities.remove(obj.entity);
        });
        activeModels.clear();
        return;
    }

    let candidates = [];

    // only check nearby grid cells
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const key = getGridKey(lat + dx * GRID_SIZE, lon + dy * GRID_SIZE);
            if (grid.has(key)) {
                candidates.push(...grid.get(key));
            }
        }
    }

    let loadedCount = activeModels.size;

    for (let ap of candidates) {

        const dist = getDistanceNM(lat, lon, ap.lat, ap.lon);
        const isLoaded = activeModels.has(ap.name);

        if (dist > MAX_DISTANCE_CHECK && !isLoaded) continue;

        const shouldLoad = dist <= LOAD_DISTANCE;
        const shouldUnload = dist > UNLOAD_DISTANCE;

        // LOAD
        if (shouldLoad && !isLoaded) {

            if (loadedCount >= MAX_MODELS) continue;

            const entity = createModel(ap, dist);
            activeModels.set(ap.name, { entity });
            loadedCount++;

            break; // stagger
        }

        // UNLOAD
        if (shouldUnload && isLoaded) {
            geofs.api.viewer.entities.remove(activeModels.get(ap.name).entity);
            activeModels.delete(ap.name);
            loadedCount--;
        }
    }
}

// -------- DISTANCE --------
function getDistanceNM(lat1, lon1, lat2, lon2) {
    const R = 3440.065;
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

// -------- INIT --------
const wait = setInterval(() => {
    if (typeof geofs !== "undefined" && typeof Cesium !== "undefined") {
        clearInterval(wait);

        loadAirportJSON();
        setInterval(update, 2500);
    }
}, 1500);

})();
