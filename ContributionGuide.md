# Contribution Guide
This guide will show you how to import your own custom model, or use OSM data and import it.
> [!IMPORTANT]
> This guide will take 15 minutes to 1 hour to read, so please free up some time in advance. **PLEASE, DO NOT SKIM THROUGH THIS, READ IT CAREFULLY.**

## STEP 1 - Aquiring the OpenStreetMap Model and Data
> [!NOTE]
> Skip this step if you already have a model ready for use.
- Go to https://www.openstreetmap.org/ and search for the airport you want to add to the add-on.
- Use the **export** button in the top bar to open the export sidebar, then click **Manually Select a Different Area**.
- Circle the area where you want to export the buildings. **Only export the terminals and/or other airport buildings.**
- Click export, and it should download a **map.osm** file to your computer.

## STEP 2 - Converting the OSM Data to 3D Data
> [!TIP]
> Skip this step if you already have a model ready for use.
- Go to https://osm2world.org/download/, and click on **Latest Build** to download the OSM2World app as a .ZIP file.
- Extract the ZIP file and open the **osm2world-windows.bat** file. It should open a command line and shortly after, open the main program of the app.
- In the main program, click **File > Open OSM file**, and use the file explorer to find your OSM file.
- Click **export as GLB** and choose the directory and file name, then click save. The file should show up in the directory you selected.

## STEP 3 - Importing into Blender
> [!TIP]
> If you don't have Blender, you can download it [here](https://www.blender.org/download/).
- Open Blender. There are default objects there already, but you can remove them by clicking the 3D window, press [A], and then press [DELETE] on your keyboard.
- In the top-left, click **File > Import > glTF 2.0**. Navigate to your model file and open it. If you are using an OSM model, you will most likely also see other details around (e.g, flat lines on the ground).
- On the top right hand side, you will see the scene collection area. Expand the one that says **OSM2World scene**. You should see lots of parts. We only need the terminal building, so we need to delete everything else, **including the interior of the building you wish to keep**, as there is a file size limit.
> [!IMPORTANT]
> When deleting, make sure to right-click the section you want to delete and click **Delete Hierarchy**. You should just have the terminal building remaining.

## STEP 4 - Exporting the Model
- Click **File > Export > glTF 2.0**, andd change **glTF binary** to **glTF seperate**.
- Choose your path you want to export the file in, and the file name.
- Click export, and it should show up in the directory you selected. You should see (your file name).gltf, (your file name).bin, and some images.
> [!WARNING]
The file will NOT export if it is **larger than 20 megabytes**. Please contact **thegreen121** on Discord if the file is larger than 20 MB.

## STEP 5 - Importing into GitHub and glTF Editing
> [!TIP]
> If you don't have a Github Account, you can create one [here](https://github.com/signup).
- Create a new repository, and if it isn't already public, make it so. A detailed turotial can be found [here](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).
- Navigate to the main page of the repository, and above the list of files, select **Add file > Upload files**, and upload the file from Step 4. Then click **Commit Changes**. A totorial can be found [here](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
> [!CAUTION]
> DO NOT move or import the file into a folder in the repository, or it will not work.
- Open the file you just uploaded in the repository and click the pencil icon to open the file editor.
- Use [CTRL] + [F] ([COMMAND] + [F] for MacOS) to open find. Search "images", and click next. It should scroll down to a section where you should be seeing items in this format:
		{
			"mimeType":"image/jpeg",
			"name":"Image_9",
			"uri":"Image_9.jpg"
		},
- In the last box, replace **Image_9.jpg** with https://cdn.jsdelivr.net/gh/yourusername/repositoryname@latest/imagename.jpg
> [!NOTE]
> Replace yourusername with your GitHub username, repositoryname with your GitHub repository name, and imagename.jpg with your file name and its file extention (jpg, png, etc)
- Now find "materials" and scroll down. It should be in this format
  
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
- Do this for all the materials in the code DO NOT CHANGE baseColorFactor, roughnessFactor, and emissiveFactor

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

## STEP 6 - Importing and Testing
- Go to https://github.com/greenairways/GeoFS-OSM-Airport-Models, and install CustomModelLoader.js.
- In Tampermonkey, scroll down to const modelUrl = "https://cdn.jsdelivr.net/gh/username/repositoryname@latest/filename";
- Replace username with your GitHub username, repositoryname with the repository name you saved your files, and filename as the name of your gltf file + file extention (gltf)
- Scroll down to where it says:
  
	  // --- Placement ---
	  const lat = latitude;   // Latitude
	  const lon = longitude;   // Longitude
	  const alt = altitude;         // Altitude
	  const heading = heading;      // Rotation

- Replace these with the coordinates, altitude, and rotation.
- Next scroll down a bit further
  
		scale: scale,              // Model Scale

- Replace scale with the amount you want to mutiply
- Click File > Save
- Adjust values until you are satisifed with the results. It may take some time to get the desired results.
>[!IMPORTANT]
>Remember to hit **Save** ***every time*** you edit the file.

## StEP 7 - Submission
- Go to https://github.com/greenairways/GeoFS-OSM-Airport-Models/issues and create a new issue using the **Import Request** template, using the format below for your submisssion

  		{
            name: "EXAMPLE NAME",
            modelUrl: "ModelUrlHere",
            lat: Latitude,
            lon: Longtitude,
            alt: Altitude,
            heading: Rotation,
            scale: Scale
        }


### If you completed all of these steps correctly, your model should load in properly. If there are any problems or you are stuck, contact thegreen121 on Discord.
