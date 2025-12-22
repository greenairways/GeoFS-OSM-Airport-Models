# Contribution Guide
This guide will show you how to import your own custom model or use OSM data and import it. It will take roughly 40 minutes to read and follow through, so please free up some time in advance. **PLEASE, READ THIS GUIDE CAREFULLY. DO NOT SKIM THROUGH THIS.**

## STEP 1 - Acquiring OpenStreetMap Model (Skip if you already have a model)
- Go to [OpenStreetMap](https://www.openstreetmap.org/) and search for the airport you want to add.
- Use the **export** button in the top bar to open the export sidebar, then click **Manually Select a Different Area**.
- Select the building(s) you want to export. **Only select the terminal(s) and/or other airport buildings.**
- Click export, and it should download **map.osm** to your computer.

## STEP 2 - Converting OSM Data to 3D Data (Skip if you already have a model)
- Download the [OSM2World app](https://osm2world.org/download/files/latest/OSM2World-latest-bin.zip) and open **osm2world-windows.bat**. It should open a command line and  the main program of the app.
- In the main program, click **File > Open OSM file**, and use the file explorer to find your OSM file.
- Click **export as GLB** and choose the directory and file name, then click save. The file should show up in the directory you selected.

## STEP 3 - Importing into Blender & Simplifying
- Download [Blender](https://www.blender.org/download).
- Open Blender. There are default objects already; remove them by clicking the 3D window, pressing [A], and then pressing [DELETE] on your keyboard.
- Click **File > Import > glTF 2.0** and open your GLB file. If you are using an OSM model, you will also see other details around (e.g, flat lines on the ground).
- On the top-right, you will see the scene collection area. Expand the **OSM2World scene**. We only need the terminal building, so you need to delete everything else, **including the interior of the buildings to be kept**. This can be done by right-clicking the section and clicking **Delete Hierarchy**.

> [!WARNING]
> The file will NOT export if it is **larger than 20 megabytes**.

- Click **File > Export > glTF 2.0**, andd change **glTF binary** to **glTF seperate**.
- Choose the path you want to export the file to, and the file name, then click **export**. You should see a .gltf file, a .bin file, and some images in the exported files.

## STEP 4 - Importing into GitHub & glTF Editing
- Create a GitHub account [here](https://github.com/signup/).
- Create a new repository, and if it isn't already public, make it so. A detailed tutorial can be found [here](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).
- Navigate to the main page of the repository, and above the list of files, select **Add file > Upload files**, and upload the file from Step 4. Then click **Commit Changes**. A tutorial can be found [here](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

> [!CAUTION]
> **DO NOT** move or import the file into a folder in the repository, or it will not work.

- Open the file you just uploaded to the repository and click the pencil icon to open the file editor.
- Use [CTRL] + [F] ([COMMAND] + [F] for MacOS) to open find. Search "images", and click next. It should scroll down to a section where you should be seeing items in this format:

		{
			"mimeType":"image/jpeg",
			"name":"Image_9",
			"uri":"Image_9.jpg"
		},

- In the last box, replace **Image_9.jpg** with https://cdn.jsdelivr.net/gh/username/repoitory@latest/image.jpg (Replace `username` with your GitHub username, `repository` with your GitHub repository name, and `image.jpg` with your file name)
- Now, search for "materials" and scroll down. It should be in this format:

  		{
			"name":"Plaster002",
			"normalTexture":{
				"index":0
			},
			"occlusionTexture":{
				"index":1
			},
			"pbrMetallicRoughness":{
				"baseColorTexture":{
					"index":2
				},
				"metallicRoughnessTexture":{
					"index":1
				}
			}
		},

- Replace that with the format below, and fill in the name, normalTexture, occlusionTexture, baseColorTexture, and metallicRoughnessTexture from the existing material.
- Do this for all the materials in the code. **DO NOT CHANGE baseColorFactor, roughnessFactor, and emissiveFactor**.

      {
        "name": "Plaster002",
        "normalTexture": {
          "index": 0
        },
        "occlusionTexture": {
          "index": 1
        },
        "pbrMetallicRoughness": {
          "baseColorTexture": {
            "index": 2
          },
          "metallicRoughnessTexture": {
            "index": 1
          },
          "baseColorFactor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "roughnessFactor": 0.8
        },
        "emissiveFactor": [
          0.01,
          0.009,
          0.006
        ]
      },

- Click **Commit changes** to save your changes.

## STEP 5 - Importing and Testing
- Go to https://github.com/greenairways/GeoFS-OSM-Airport-Models, and install CustomModelLoader.js.
- In Tampermonkey, scroll down to const modelUrl = "https://cdn.jsdelivr.net/gh/username/repositoryname@latest/filename";
- Replace username with your GitHub username, repositoryname with the repository name you saved your files, and filename with the name of your gltf file + file extension (gltf)
- Scroll down to where it says:
  
	  // --- Placement ---
	  const lat = latitude;   // Latitude
	  const lon = longitude;   // Longitude
	  const alt = altitude;         // Altitude
	  const heading = heading;      // Rotation

- Replace these with the coordinates, altitude, and rotation.
- Next, scroll down a bit further
  
		scale: scale,              // Model Scale

- Replace scale with the amount you want to multiply
- Click File > Save
- Adjust and save values until you are satisfied with the results. It may take some time to get the desired results.

## STEP 6 - Submission
- Go to https://github.com/greenairways/GeoFS-OSM-Airport-Models/issues and create a new issue using the **Import Request** template, using the format below for your submission

  		{
            name: "EXAMPLE NAME",
            modelUrl: "ModelUrlHere",
            lat: Latitude,
            lon: Longitude,
            alt: Altitude,
            heading: Rotation,
            scale: Scale
        }


### If you completed all of these steps correctly, your model should load in properly. If there are any problems or you are stuck, contact thegreen121 on Discord.
