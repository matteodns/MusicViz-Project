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
    STRIP_H: 20,
    WINDOWIDTH: window.innerWidth-20,
    WINDOWHEIGHT: window.innerHeight-70,

    currentGenre: "All",
    // ATTRIB: '<a href="https://www.enseignement.polytechnique.fr/informatique/CSC_51052/">CSC_51052_EP</a> - <a href="https://www.adsbexchange.com/data-samples/">ADSBX sample data</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
    'Today': 'Pop',
}


function createViz() {
    console.log("Using D3 v" + d3.version);
    loadData("All");
}


function loadData(genre) {
    files_to_load = ["data/ClassicHit_raw.csv"];
    let broad_genre;
    if (genre === "All") {
        broad_genre = "All";
        geo2load = "data/GeoGenre_raw.csv";
    } else {
        broad_genre = map_detailed2broadgenres[genre];
        geo2load = `data/Geo${broad_genre}.csv`;
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

        classichit.map(d => {
            if (d.Genre === "Today") {
                d.Genre = "Pop";
            }
        });

        if (genre !== "All") {
            classichit = classichit.filter((d) => d.Genre === genre);
        }

        console.log("Data loaded:", classichit, geogenre);
        console.log("Genre:", broad_genre);

        createTimeline(classichit);
        createWorldmap(geogenre, broad_genre);
        createCarac(classichit);

    }).catch(function(error) {
        console.error("Error loading the CSV file:", error);
    });

};


function createTimeline(classichit) {

    const vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "background": "#121212",
        "stroke": "#DDDDDD",
        "data": {"values": classichit},
        "mark": {
            "type": "bar",
            "tooltip": true,
        },
        "width": 0.7 * ctx.WINDOWIDTH,
        "height": 0.7 * ctx.WINDOWHEIGHT,
        "encoding": {
            "x": {
                "field": "Year",
                "type": "temporal",
                "timeUnit": "year",
                "title": "Year",
                "axis": {
                    "values": d3.range(1950, 2025, 10)
                }
            },
            "y": {
                "aggregate": "count",
                "title": "Number of Songs",
                "type": "quantitative",
                "legend": {
                    "labelColor": "#DDDDDD",
                }
            },

            "color": {
                "aggregate": "mean",
                "field": "Popularity",
                "title": "Measure of popularity (in %)",
                "type": "quantitative",
                "format": ".1f",
                "scale": {"scheme": "greens"},
                "legend": {
                    "labelColor": "#DDDDDD",
                    "titleColor": "#DDDDDD",
                }
            },
        },
        "config": {
            "axisX": {"labelColor": "#DDDDDD", "titleColor": "#DDDDDD"},
            "axisY": {"labelColor": "#DDDDDD", "titleColor": "#DDDDDD"},
        }
    };
    const vlOpts = {actions: false};
    vegaEmbed("#TimelineDiv", vlSpec, vlOpts);
}


function createWorldmap(geogenre, genre) {

    d3.select("#WorldmapDiv").selectAll("*").remove();

    d3.json("data/countries-50m.json").then(function(world) {

        const countries = topojson.feature(world, world.objects.countries);

        // const proj = d3.geoNaturalEarth1().fitExtent([[5, 5], [0.65*ctx.WINDOWIDTH-10, (0.65*ctx.WINDOWHEIGHT-10)*2/3]], countries);
        
        const width = 928; //0.65*ctx.WINDOWIDTH;
        const height = width / 2;

        const proj = d3.geoNaturalEarth1().fitExtent([[2, 2], [width - 2, height]], {type: "Sphere"})

        let geoPathGen = d3.geoPath().projection(proj);

        let mapText = d3.select("div#WorldmapDiv")
            .append("g")

        let svgG = d3.select("div#WorldmapDiv")
            .append("g")
            .attr("id", "WorldmapSVG");

        let svgEl = svgG.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        let legendG = svgG.append("svg")
            .attr("width", "70px")
            // .attr("height", 0.7*ctx.WINDOWHEIGHT);

        svgEl.append("path") // Sphere path
            .datum({type: "Sphere"})
            .attr("fill", d3.color("#121212"))
            .attr("stroke", "lightgrey")
            .attr("d", geoPathGen);

        let countriesG = svgEl.append("g") // Countries path
            .attr("id", "countriesG")
            .selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("d", geoPathGen)
            .attr("fill", d3.color("#D7D7D7"))
            .attr("stroke", "lightgrey")
            
        let countriesTitle = countriesG.append("title")
            .text(d => d.properties.name);


        if (genre !== "All") {
            console.log("Creating worldmap for genre: ", genre);
            let genre_map = {};
            geogenre.forEach(d => {
                genre_map[map_countries2iso[d.Country]] = d.popularity;
            });

            let domainExtent = d3.extent(geogenre, (d) => d.popularity)
            let color = d3.scaleSequential(domainExtent, d3.interpolateGreens).unknown(d3.color("#D7D7D7")); 

            countriesG.attr("fill", d => color(genre_map[d.properties.name]));
            countriesTitle.text(d => {
                let value = genre_map[d.properties.name];
                return value !== undefined ? `${d.properties.name}: ${(100*value).toFixed()}%` : d.properties.name;
            });              
            createMapLegend(legendG, mapText, color, domainExtent, genre);
        }

    }).catch(function(error) {
        console.error("Error loading the GeoJSON file:", error);
    });
}


// Utilisation de la fonction wrap dans createMapLegend
function createMapLegend(legendG, mapText, color, domainExtent, genre) {

    let range4legend = d3.range(domainExtent[0], domainExtent[1], (domainExtent[1]-domainExtent[0])/100).reverse();
    let scale4legend = d3.scaleLinear()
        .domain(domainExtent)
        .rangeRound([range4legend.length, 0]);
    legendG.selectAll("line")
        .data(range4legend)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", (d, j) => (j+4))
        .attr("x2", ctx.STRIP_H)
        .attr("y2", (d, j) => (j+4))
        .attr("stroke", (d) => (color(d)));
    legendG.append("g")
        .attr("transform", `translate(${ctx.STRIP_H + 4}, 4)`)
        .style("stroke", "#DDDDDD")
        .style("color", "#DDDDDD")
        .style("font-size", "11px")
        .style("font-family", "Poppins")
        .style("font-weight", "400")
        .call(d3.axisRight(scale4legend).ticks(5));
        
    mapText.append("text")
        .attr("x", 70)
        .attr("y", range4legend.length / 2)
        .style("color", "#DDDDDD")
        .style("font-size", "16px")
        .style("font-family", "Poppins")
        .style("font-weight", "400")
        .text("Genre: " + genre);
}

function createCarac(classichit) {

    let vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "background": "#222222",
        "stroke": "#DDDDDD",
        "data": {"values": classichit},
        "transform": [
            {"fold": ctx.caracs_list},
            {"aggregate": [{"op": "mean", "field": "value", "as": "value"}], "groupby": ["Year", "key"]},
            {"window": [{"op": "mean", "field": "value", "as": "value"}], "groupby": ["key"], "frame": [-5, 0]},
        ],
        "width": 0.7 * ctx.WINDOWIDTH,
        "height": 0.7 * ctx.WINDOWHEIGHT,
        "mark": "line",
        "encoding": {
            "x": {
                "field": "Year",
                "type": "ordinal",
                "timeUnit": "year",
                "title": "Year",
                "axis": {
                    "values": d3.range(1950, 2025, 10)
                }
            },
            "y": {
                "field": "value",
                "type": "quantitative",
                "axis": {
                    "title": null
                }
            },
            "color": {
                "condition": {
                    "param": "hover",
                    "field": "key",
                    "type": "nominal",
                    "legend": null
                },
                "value": "grey",
            },
            "opacity": {
                "condition": {
                    "param": "hover",
                    "value": 1
                },
                "value": 0.2,
            }
        },
        "layer": [{
            "params": [{
                "name": "hover",
                "select": {
                    "type": "point",
                    "fields": ["key"],
                    "on": "pointerover",
                }
            }],
            "mark": {"type": "line", "strokeWidth": 8, "stroke": "transparent"}
        }, {
            "mark": "line"
        }, {
            "encoding": {
                "x": {"aggregate": "max", "field": "Year"},
                "y": {"aggregate": {"argmax": "Year"}, "field": "value"},
            },
            "layer": [{
                "mark": {"type": "circle"}
            }, {
                "mark": {"type": "text", "align": "left", "dx": 4},
                "encoding": {"text": {"field":"key", "type": "nominal"}}
            }]
        }],
        "config": {
            "view": {"stroke": null},
            "axisX": {"labelColor": "#DDDDDD", "titleColor": "#DDDDDD"},
            "axisY": {"labelColor": "#DDDDDD", "titleColor": "#DDDDDD"},
        }
    };

    const vlOpts = {actions: false};
    vegaEmbed("#CaracDiv", vlSpec, vlOpts);
}


// Fonctions à effectuer après le chargement de la page

document.addEventListener("DOMContentLoaded", function () {
    const openChoose = document.querySelector('.openChoose');
    const genreSelect = document.getElementById('genreSelect');
    const closeBtn = document.querySelector('.close');
    const genreItems = genreSelect.querySelectorAll('li');

    const sections = document.querySelectorAll("section");
    let currentSection = 0;
    let isScrolling = false;

    const currentGenreCont = document.querySelector('.openChoose span');

    sections[0].scrollIntoView({ behavior: "smooth" });

    // Fast scroll between sections
    window.addEventListener("wheel", function (e) {
        if (isScrolling) return;

        if (e.deltaY > 0) {
        // Scrolling down
        if (currentSection < sections.length - 1) {
            currentSection++;
        }
        } else {
        // Scrolling up
        if (currentSection > 0) {
            currentSection--;
        }
        }

        isScrolling = true;
        sections[currentSection].scrollIntoView({ behavior: "smooth" });

        setTimeout(() => { 
        isScrolling = false;
        }, 500); // Adjust timeout based on scroll duration
    });

    // Open the dropdown by adding the 'open' class
    openChoose.addEventListener('click', () => {
    genreSelect.classList.add('open');
    });

    // Close the dropdown when clicking "close"
    closeBtn.addEventListener('click', () => {
    genreSelect.classList.remove('open');
    });

    // Close the dropdown when clicking any list item
    genreItems.forEach(item => {
    item.addEventListener('click', () => {
        sections[0].scrollIntoView({ behavior: "smooth" });
        genreSelect.classList.remove('open');
        const selectedGenre = event.target.getAttribute('data-value');
        console.log('Selected genre:', selectedGenre);
        ctx.currentGenre = selectedGenre;
        currentGenreCont.innerText = selectedGenre;
        loadData(selectedGenre);
    });
    });
});