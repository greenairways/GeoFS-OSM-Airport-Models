# Contribution Guide
## DO NOT SKIM THROUGH THIS, READ IT CAREFULLY. Guide will take 15 mins - 1 hour
This guide will show you how to import your own custom model, or use OSM data and import it. There are two ways to add your airport model: OSM and custom.

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
## Step 5 -  GitHub
- If you haven't already, create a GitHub account. 
