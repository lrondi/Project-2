# Deep Sea Corals Database visualization

On this project I wanted to create a website to visualize the data from the Deep Sea Corals database and the map visualizations that I worked with on the ETL project (https://github.com/lrondi/ETL-project).

The final website can be seen here: http://lurondi.pythonanywhere.com/

The first part consisted on creating the interactive map in which every species location in the database can be visualize as markers (one species at a time), and at the same time be able to see the location of every species that shares a given taxonomic rank with the selected species.

In order to do this, I created two dropdown menues to select the species and the level of taxonomic rank to compare locations, and a descriptive box with the information.

<img src='https://github.com/lrondi/Project-2/blob/master/images/screenshot1.png'>

The second part consisted on creating a plot to visualize the average depth at which every species was found, grouped by their vernacular name category (i.e. black coral, stony coral, etc), and by oceanic layer. The plot was created using D3, and it has a number of interactive properties. The y-axis is interactive and it changes its scale, and the bubbles are proportional to the log of number of species (because the range was to high to visualize directly). The bubbles also have tooltips with information of the average depth and number of species. On the side, there's an info box giving some information about that particular layer, and it changes as the selected layer changes too.

<img src='https://github.com/lrondi/Project-2/blob/master/images/screenshot2.png'>

<img src='https://github.com/lrondi/Project-2/blob/master/images/screenshot3.png'>

