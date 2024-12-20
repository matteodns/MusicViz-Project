# MusicViz-Project

Project of Data-Visualization for an Ecole Polytechnique course (CSC_51052_EP).

## Description

This project is an interactive data visualization page exploring the evolution and global trends of music genres. Using two comprehensive datasets, the page provides insights into the characteristics of 15,000 songs from 1950 to the present and the geographical popularity of music genres across 72 countries. Users can explore timelines, genre-specific features, and a world map showcasing regional preferences, all presented in an engaging and intuitive interface.

This project is deployed on github-pages: [MusicViz-Project](https://matteodns.github.io/MusicViz-Project/)

## Installation

Follow these steps to set up and explore the project locally:

1.**Clone the Repository**:
Open a terminal and run the following command:

```bash
Copy code
git clone https://github.com/your-username/your-repo-name.git 
``` 
2.**Navigate to the Project Directory**:

```bash
Copy code
cd your-repo-name  
```
3. **Launch a Local Server**:  
   - Open the `index.html` file in the project directory with a local server.  
   - If you are using Visual Studio Code, you can install the **Live Server** extension.  
   - Once installed, right-click on `index.html` and select **Open with Live Server**.

4. **Explore the Visualizations**:  
   Open the webpage in your browser and interact with the visualizations.

## Usage

This project provides an interactive webpage for exploring music genres through three dynamic visualizations. Follow these steps to navigate and use the webpage:

1. **Selecting a Genre**:  
   - Use the dropdown menu in the top-right corner to choose a music genre.  
   - Once selected, all visualizations will update automatically, and you will be redirected to the home section.

2. **Exploring the Visualizations**:  
   The page is divided into three sections, accessible by scrolling or using navigation buttons:  
   - **Timeline**: Shows the number of songs released per year for the selected genre, along with their average popularity.  
   - **Characteristics**: Displays various musical attributes, such as energy, danceability, valence, and instrumentalness, as average values over time.  
   - **World Map**: Highlights the geographical distribution of the selected genre in 2022, based on the percentage of songs in Spotify’s Top 50 by country.

3. **Interactivity**:  
   - Hover over elements in the visualizations for detailed information.  
   - Highlight specific attributes in the characteristics chart by hovering over their respective lines.

4. **Navigation**:  
   - Scroll through the page, click on section arrows, or use the header shortcuts to move between sections easily.

Enjoy exploring the evolution and global trends of your favorite music genres!


## Datasets

This project utilizes two datasets, both sourced from Kaggle, to analyze and visualize music trends and characteristics:

1. **Dataset n°1: 15,000 Classic Hits**  
   - **Description**: This dataset contains information about 15,000 songs spanning from 1950 to the present, divided into 19 different genres (17 used in this project). Each entry includes features such as:
     - Title, Artist, and Genre
     - Danceability, Energy, Acousticness
     - Instrumentalness, Liveness, Speechiness, etc.
   - **Preprocessing**:
     - The genre "World" was excluded due to its vague definition.
     - Songs labeled as "Today" were reclassified as "Pop" to maintain consistency.
   - **Source**: [15,000 Classic Hits Dataset](https://www.kaggle.com/datasets/thebumpkin/10400-classic-hits-10-genres-1923-to-2023)

2. **Dataset n°2: Music Genres by Country**  
   - **Description**: This dataset provides geographical insights into music preferences across 72 countries, listing the number of songs from Spotify's 2022 Top 50 for each genre. The genres are divided into six categories:
     - HipHop/Rap/R&B, EDM, Pop, Rock/Metal, and Latin/Reggaeton.
   - **Preprocessing**:
     - A mapping was created to align genres from both datasets for consistency.
     - Data for each genre was stored in `.csv` files, associating countries with their genre proportions.
   - **Source**: [Music Genres by Country Dataset](https://www.kaggle.com/datasets/marshalll3302/favorite-music-genres-by-country)

Both datasets were used separately to create complementary visualizations, without the need for merging.

## Acknowledgments

This project draws inspiration and resources from the following:

- **Map Visualization**:  
  - [World Choropleth Map by D3](https://observablehq.com/@d3/world-choropleth/2)  
  - [World Atlas by TopoJSON](https://github.com/topojson/world-atlas?tab=readme-ov-file)  

- **Interactive Line Plot**:
    - [Multi Series Line Chart with an Interactive Line Highlight](https://vega.github.io/vega-lite/examples/interactive_line_hover.html)

- **Spotify Graphic Chart**:  
  - [Spotify Design Documentation](https://developer.spotify.com/documentation/design#using-our-colors)  

- **General Inspiration**:  
  - [Nathalie Denis](https://nathalie-denis.com/) for her precious advice in the HTML/CSS implementation.

We sincerely thank the creators and contributors of these resources for their valuable tools and insights, which greatly enhanced the development of this project.
