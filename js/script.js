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


function createViz() {
    console.log("Using D3 v" + d3.version);
    // createWorldmap();
    loadData();
}


function loadData() {
    Promise.all([
        d3.csv("data/ClassicHit_raw.csv", d3.autoType),
        d3.csv("data/GeoGenre_raw.csv", d3.autoType)
    ]).then(function(data) { 

        let [classichit, geogenre] = data; 

        const parseYear = d3.timeParse("%Y");
        classichit.forEach(d => {
            d.Year = parseYear(d.Year);
        });

        classichit = classichit.filter((d) => d.Year >= parseYear("1950"));
        classichit = classichit.filter((d) => d.Year < parseYear("2024"));
        classichit = classichit.filter((d) => d.Genre !== "World");

        // ctx.classichit = classichit;
        // ctx.geogenre = geogenre;

        console.log("Data loaded:", classichit, geogenre);

        createTimeline(classichit);
        createWorldmap(geogenre);
        createCarac(classichit);

    }).catch(function(error) {
        console.error("Error loading the CSV file:", error);
    });
};


function createTimeline(classichit) {
    const containerWidth = document.getElementById("TimelineDiv").clientWidth;

    const vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {"values": classichit}, 
        "mark": "bar",
        "width": 0.7 * containerWidth,
        "height": 500,
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
            "color": {
                "field": "Genre",
                "type": "nominal"
            }
        }
    };
    const vlOpts = {actions: false}; 
    vegaEmbed("#TimelineDiv", vlSpec, vlOpts);
}


function createWorldmap(geogenre) {
    
};


function createCarac(classichit) {
    const containerWidth = document.getElementById("CaracDiv").clientWidth;

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
            height: 500,
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




// Fonction clic

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