const ctx = {
    caracs_list: [
        "Danceability",
        "Energy",
        "Speechiness",
        "Acousticness",
        "Instrumentalness",
        "Liveness",
        "Valence"
    ],
    worldmap: null,
    ATTRIB: '<a href="https://www.enseignement.polytechnique.fr/informatique/CSC_51052/">CSC_51052_EP</a> - <a href="https://www.adsbexchange.com/data-samples/">ADSBX sample data</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};


map_countries2iso = {
    "australia": "Australia",
    "canada": "Canada",
    "china": "China",
    "india": "India",
    "mexico": "Mexico",
    "russia": "Russia",
    "usa": "United States of America",
    "colombia": "Colombia",
    "france": "France",
    "italy": "Italy",
    "japan": "Japan",
    "philippines": "Philippines",
    "spain": "Spain",
    "united_kingdom": "United Kingdom",
    "puerto_rico": "Puerto Rico",
    "argentina": "Argentina",
    "germany": "Germany",
    "israel": "Israel",
    "paraguay": "Paraguay",
    "south_korea": "South Korea",
    "taiwan": "Taiwan",
    "ukraine": "Ukraine",
    "chile": "Chile",
    "dominican_republic": "Dominican Rep.",
    "indonesia": "Indonesia",
    "peru": "Peru",
    "thailand": "Thailand",
    "turkey": "Turkey",
    "venezuela": "Venezuela",
    "denmark": "Denmark",
    "egypt": "Egypt",
    "honk_kong": "Hong Kong",
    "ireland": "Ireland",
    "morocco": "Morocco",
    "netherlands": "Netherlands",
    "norway": "Norway",
    "portugal": "Portugal",
    "vietnam": "Vietnam",
    "bolivia": "Bolivia",
    "bulgaria": "Bulgaria",
    "costa_rica": "Costa Rica",
    "ecuador": "Ecuador",
    "el_salvador": "El Salvador",
    "greece": "Greece",
    "guatemala": "Guatemala",
    "honduras": "Honduras",
    "malaysia": "Malaysia",
    "panama": "Panama",
    "poland": "Poland",
    "sweden": "Sweden",
    "austria": "Austria",
    "finland": "Finland",
    "hungary": "Hungary",
    "iceland": "Iceland",
    "lithuania": "Lithuania",
    "new_zealand": "New Zealand",
    "nicaragua": "Nicaragua",
    "romania": "Romania",
    "singapore": "Singapore",
    "south_africa": "South Africa",
    "switzerland": "Switzerland",
    "uruguay": "Uruguay",
    "czech_republic": "Czechia",
    "mongolia": "Mongolia",
    "pakistan": "Pakistan",
    "saudi_arabia": "Saudi Arabia",
    "brazil": "Brazil",
}

map_detailed2broadgenres = {
    'Alt. Rock': 'Rock',
    'Blues': 'Rock',
    'Country': 'Other',
    'Disco': 'EDM',
    'EDM': 'EDM',
    'Folk': 'Other',
    'Funk': 'Other',
    'Gospel': 'Other',
    'Jazz': 'Other',
    'Metal': 'Rock',
    'Pop': 'Pop',
    'Punk': 'Rock',
    'R&B': 'HipHop',
    'Rap': 'HipHop',
    'Reggae': 'Other',
    'Rock': 'Rock',
    'SKA': 'Other',
    'Today': 'Other',
}


function createViz() {
    console.log("Using D3 v" + d3.version);
    loadData("All");
}


function loadData(genre) {
    files_to_load = ["data/ClassicHit_raw.csv"];
    let AllGenres = true;
    if (genre === "All") {
        geo2load = "data/GeoGenre_cleaned.csv";
        AllGenres = true;
    } else {
        geo2load = `data/Geo${map_detailed2broadgenres[genre]}.csv`;
        AllGenres = false;
    }
    Promise.all([
        d3.csv("data/ClassicHit_raw.csv", d3.autoType),
        d3.csv(geo2load, d3.autoType)
    ]).then(function(data) {

        let [classichit, geogenre] = data;

        const parseYear = d3.timeParse("%Y");
        classichit.forEach(d => {
            d.Year = parseYear(d.Year);
        });

        classichit = classichit.filter((d) => d.Year >= parseYear("1950"));
        classichit = classichit.filter((d) => d.Year < parseYear("2024"));
        classichit = classichit.filter((d) => d.Genre !== "World");

        if (genre !== "All") {
            classichit = classichit.filter((d) => d.Genre === genre);
        }

        console.log("Data loaded:", classichit, geogenre);

        Promise.all([
            createTimeline(classichit),
            createWorldmap(geogenre, !AllGenres),
            createCarac(classichit),
        ]).then(() => {window.scrollTo({top: 0, behavior: 'smooth'});})

        // setTimeout(() => {
        //     window.scrollTo({top: 0, behavior: 'smooth'});
        // }, 1000);

    }).catch(function(error) {
        console.error("Error loading the CSV file:", error);
    });

};


function createTimeline(classichit) {
    const containerWidth = document.getElementById("TimelineDiv").clientWidth;
    const containerHeight = window.innerHeight;

    d3.select("#WorldmapDiv").selectAll("*").remove();

    const vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {"values": classichit},
        "mark": "bar",
        "width": 0.7 * containerWidth,
        "height": 0.7 * containerHeight,
        "encoding": {
            "x": {
                "field": "Year",
                "type": "temporal",
                "timeUnit": "year",
                "title": "Year"
            },
            "y": {
                "aggregate": "count",
                "title": "Number of Songs",
                "type": "quantitative"
            },
            // "color": {
            //     "field": "Genre",
            //     "type": "nominal"
            // }
            "color": {
                "aggregate": "count",
                "title": "Number of Songs",
                "type": "quantitative",
                "scale": {"scheme": "greens"}
            },
        }
    };
    const vlOpts = {actions: false};
    vegaEmbed("#TimelineDiv", vlSpec, vlOpts);
}


function createWorldmap(geogenre, show) {
    const containerWidth = document.getElementById("WorldmapDiv").clientWidth;
    const containerHeight = window.innerHeight;

    d3.json("data/countries-50m.json").then(function(world) {

        const countries = topojson.feature(world, world.objects.countries);

        const proj = d3.geoNaturalEarth1().fitExtent([[50, 50], [0.7*containerWidth, 0.7*containerHeight]], countries);
        let geoPathGen = d3.geoPath().projection(proj);

        let svgEl = d3.select("div#WorldmapDiv")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight);

        svgEl.append("path") // Sphere path
            .datum({type: "Sphere"})
            .attr("fill", d3.color("white"))
            .attr("stroke", "lightgrey")
            .attr("d", geoPathGen);

        let countriesG = svgEl.append("g") // Countries path
            .attr("id", "countriesG")
            .selectAll("path")
            .data(countries.features)
            .join("path")
            .attr("d", geoPathGen)
            .attr("fill", "lightgrey")
            // .attr("fill", d => color(genre_map[d.properties.name]))
            .attr("stroke", "lightgrey");


        if (show) {
            let genre_map = {};
            geogenre.forEach(d => {
                genre_map[map_countries2iso[d.Country]] = d.popularity;
            });

            let domainExtent = d3.extent(geogenre, (d) => d.popularity)
            let color = d3.scaleSequential(domainExtent, d3.interpolateGreens).unknown("lightgrey"); 

            countriesG.attr("fill", d => color(genre_map[d.properties.name]));
            createMapLegend(svgEl, containerWidth, color, domainExtent); //Genre
        }

    }).catch(function(error) {
        console.error("Error loading the GeoJSON file:", error);
    });
}


function createMapLegend(svgEl, containerWidth, color, domainExtent) {
    
    let range4legend = d3.range(domainExtent[0], domainExtent[1], (domainExtent[1]-domainExtent[0])/100).reverse();
    let scale4legend = d3.scaleLinear()
        .domain(domainExtent)
        .rangeRound([range4legend.length, 0]);
    let legendG = svgEl.append("g")
        .attr("id", "legendG")
        .attr("transform", `translate(${0.75 * containerWidth}, 100)`);
    legendG.selectAll("line")
        .data(range4legend)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", (d, j) => (j))
        .attr("x2", 20) //ctx.STRIP_H = 20
        .attr("y2", (d, j) => (j))
        .attr("stroke", (d) => (color(d)));
    legendG.append("g")
        .attr("transform", `translate(${20 + 4},0)`) //ctx.STRIP_H
        .call(d3.axisRight(scale4legend).ticks(5));
    legendG.append("text")
        .attr("x", 50)
        .attr("y", range4legend.length / 2)
        .style("fill", "black")
        .attr("font-size", "11px")
        .attr("font", "Helvetica Neue")
        .text("Proportion de musiques \"Pop\" dans le Top 50");
}

function createCarac(classichit) {
    const containerWidth = document.getElementById("TimelineDiv").clientWidth;
    const containerHeight = document.getElementById("TimelineDiv").clientHeight;

    const vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {"values": classichit},
        // Faire une rolling mean sur 5 ans pour lisser la courbe ?
        "repeat": {
            "layer": ctx.caracs_list,
        },
        "spec": {
            "mark": "line",
            width: 0.7 * containerWidth,
            height: 0.7*containerHeight,
            "encoding": {
                "x": {
                    "field": "Year",
                    "type": "ordinal",
                    "timeUnit": "year",
                    "title": "Year"
                },
                "y": {
                    "aggregate": "mean",
                    "field": {"repeat": "layer"},
                    "type": "quantitative",
                    "title": null
                },
                "color": {
                    "datum": {"repeat": "layer"},
                    "type": "nominal",
                },
            },
        },
    };
    const vlOpts = {actions: false};
    vegaEmbed("#CaracDiv", vlSpec, vlOpts);
}




// function pour ramener en haut de la page sur changement de genre dans le select:
// de manière smooth

function changeGenre() {
    let genre = document.getElementById("genreSelect").value;
    loadData(genre);
}








// Fonction pour descendre d'une section (après appui sur la flèche):

// function clic(prochain) {
//     var arrows = document.querySelectorAll(".down");
//     for (var i = 0; i <= arrows.length - 1; i++) {
//       arrows[i].classList.add("clic");
//     }
//     setTimeout(down, 250, prochain);
//   }

// function up() {
//     var top = document
//       .querySelector("body")
//       .getBoundingClientRect().top; /*distance jusqu'au de la page*/

//     var haut = 0;
//     var id = setInterval(frame, 10);

//     function frame() {
//       if (haut < top) {
//         clearInterval(id);
//       } else {
//         haut += -10;
//         window.scrollBy(0, -10);
//       }
//     }
//     var arrowtop = document.querySelector(".updown.up");
//     arrowtop.classList.remove("clic");
//   }

//   function down(prochain) {
//     var distance = document.querySelector(prochain).getBoundingClientRect().top;
//     var bas = 0;
//     var n = Math.floor(distance / 10);

//     var id1 = setInterval(frame1, 10);

//     function frame1() {
//       if (bas >= n * 10) {
//         clearInterval(id1);
//         var id2 = setInterval(frame2, 10);

//         function frame2() {
//           if (bas >= distance) {
//             clearInterval(id2);
//           } else {
//             bas += 1;
//             window.scrollBy(0, 1);
//           }
//         }
//       } else {
//         bas += 10;
//         window.scrollBy(0, 10);
//       }
//     }
//     setTimeout(addArrow, 500);
//   }

// function addArrow() {
//     var arrows = document.querySelectorAll(".down");
//     for (var i = 0; i <= arrows.length - 1; i++) {
//       arrows[i].classList.remove("clic");
//     }
//   }