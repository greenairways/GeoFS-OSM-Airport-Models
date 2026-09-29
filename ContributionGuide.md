# Contribution Guide
## DO NOT SKIM THROUGH THIS, READ IT CAREFULLY. Guide will take 15 mins - 1 hour
This guide will show you how to import your own custom model, or use OSM data and import it. There are two ways to add your airport model: OSM and custom.

New Features:
- Default Building Remover
  - Removes a default building from the game, so it doesn't overlap a custom building. Contact thegbx121 to use this feature.

# OSM MODEL - if you are using a custom model skip the first 2 steps
## Step 1 - Aquire OSM model and data
- https://www.openstreetmap.org/
- Search the airport you want to import
- Click export, and click "manually select a different area"
- Try to only circle the terminals/other features and nothing else
- Click export, and it should download map.osm to your computer
## Step 2 - Convert the OSM data to 3D data
- https://osm2world.org/download/
- Click latest build, and it should download a ZIP file to your computer
- Extract it, and open "osm2world-windows.bat"
- It should open a command line and shortly after, open the main program
- In the main program, click File > Open OSM file, and use the file explorer to find your OSM file
- Click "export as GLB" and choose directory and file name, then click save. You should find it wherever you selected the export to
## Step 3 - Import the 3D model into Blender
- If you don't have Blender already installed, download and install it here at https://www.blender.org/download/
- Open blender. There are default objects there already, so remove them by clicking in the 3D window, pressing A then press delete on your keyboard.
- In the top-left, click File > Import > glTF 2.0. Navigate to your model file and open it. 
- If you used an OSM model, you will most likely see your terminal building/s and lots of other details around as well, like flat lines on the ground
- On the top right hand side, you will see the scene collection area. Expand the one that says "OSM2World scene.
- You should see lots of parts. We only need the terminal building, so we need to delete everything except the terminal buildings
- Delete everything except the buildings you want to keep. As there is a file size limit, delete the interior features as well
### IMPORTANT!!! WHEN DELETING, MAKE SURE TO RIGHT CLICK THE SELECTON YOU WANT TO DELETE, AND CLICK "DELETE HIERARCHY"
- You should just have the terminal building remaining.
## Step 4 -  Export the model
- Click File > Export > glTF 2.0
- Change glTF binary to glTF seperate
- Choose your path you want to export the file in, and the file name
- Click export, and it should show up in the directory you selected
- You should see (your file name).gltf, (your file name).bin, and some images.
### IMPORTANT!!! IF ANY OF YOUR FILES ARE LARGER THAN 20MB, THEN IT WILL NOT IMPORT. CONTACT thegreen121 ON DISCORD IF ANY OF YOUR FILES ARE LARGER THAN 20MB
## Step 5 -  GitHub import + glTF editing
- If you haven't already, create a GitHub account. 
- Create a new repository
### IMPORTANT!!! IT MUST BE PUBLIC FOR IT TO BE IMPORTED INTO THE GAME
- Click Add file > Upload file
- Upload all of your files and click Commit changes
- Do not import anything into folders
- Open (your file name).gltf and click the pencil icon to edit
- Use Control + F (Command + F for MacOS) to open find. Search "images", and click next
- It should scroll down to a section where you should be seeing items in this format:
		{
			"mimeType":"image/jpeg",
			"name":"Image_9",
			"uri":"Image_9.jpg"
		},
- In the last box, replace Image_9.jpg, with https://cdn.jsdelivr.net/gh/yourusername/repositoryname@latest/imagename.jpg
- Replace yourusername with your username, repositoryname with your repository name, and imagename.jpg with your image name and its file extention (jpg, png, etc)
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
- Do this for all materials. DO NOT CHANGE baseColorFactor, roughnessFactor, and emissiveFactor

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

- Click "Commit changes" to save your changes
## Step 6 - Importing and testing
- Default Building Remover Info:
  - Removes a default building from the game, so it doesn't overlap a custom building. Contact thegbx121 to use this feature.
- Go to https://github.com/greenairways/GeoFS-OSM-Airport-Models
- Open CustomModelLoader.js, and install it
- In Tampermonkey, scroll down to const modelUrl = "https://cdn.jsdelivr.net/gh/username/repositoryname@latest/filename";
- Replace username with your GitHub username, repositoryname with the repository name you saved your files, and filename as the name of your gltf file + file extention (gltf)
- Scroll down to where it says:
## IMPORTANT!!! YOU WILL NEED TO FINE-TUNE THESE VALUES MANY TIMES TO GET THE DESIRED RESULT
  
        {
            name: "Name",
            modelUrl: "https://cdn.jsdelivr.net/gh/username/repositoryname@latest/filename",
            lat: 0,
            lon: 0,
            alt: 100,
            heading: 90,
            scale: 1,
            entity: null
        }

- Replace name with the name of the model, airport (including ICAO code), and your nickname for credit
- Follow the instructions in the script
- Click File > Save
- In game, go to the desired location and drag the mouse to loose-tune and click the bar and use arrow keys to fine-tune
- Once it reaches the desired position and scale, copy the output to the clipboard.
## Step 7 - Submission
- https://forms.gle/c8gGtg5gCyBqhtQ68 - use this form to submit your model
  ## If you completed all of these steps correctly, your model should load in properly and eventually get added. If there are any problems or you are stuck, contact thegbx121 on Discord.
