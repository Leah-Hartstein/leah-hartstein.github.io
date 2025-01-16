document.addEventListener("DOMContentLoaded", function() {
    const image = document.querySelector('.Image');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          image.classList.add('in-view');
        } else {
          image.classList.remove('in-view');
        }
      });
    });

    observer.observe(image);
  });


// Hello! here is my JS code. This is built from a combination of the examples given in the earlier weeks in the semester
// and the Plotly documentation, with extremely heavy assistance from chatgpt to do all the fancier stuff. 
// Also very critical is a function Rob very amazingly wrote for me in a tutorial for extracting a bunch of lines from a CSV and make them into traces.
// Which I've modified for 3/5 charts. 



// First, this wonderful script that plays the embedded tiktok videos that chatgpt just knocked right out on it's first go.
// Initially it just autoplayed the videos muted, but after recieving test feed I've asked chatgpt to add in the extra functionality
// of letting the user click the videos to unmute them or restart them if they've completed the autoplay.
// I first experimented with buttons but I found that they intruded on my lovely minimal design too much, so this interaction
// Is just explained with a little CTA under the videos instead.


document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.scrollVideo');

     //Chatgpt's nifty little function for checking the scroll position relative to the video, so they only play when they're onscreen.
    function checkScroll() {
        videos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
      
            if (isInViewport) {
                video.play();
            } else {
                video.pause();
            }
        });
    }
  
    // Which is then fired on every frame via this function...
    checkScroll();
  
    // ... that listens to the built in JS event for scrolling.
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    // And let's add the interactive functionality too
    videos.forEach(video => {
        video.addEventListener('click', function() {
            if (video.paused || video.ended) {
                video.muted = false; // If the user clicks the video after it's ended, the video is unmuted
                video.currentTime = 0; // and restarted.
                video.play();
            } else {
                video.muted = !video.muted; // If the video is still playing, clicking just toggles muting instead.
            }
        });
    });
});


// Rob told me to put this in here as a common object for each chart to make them work better with my CSS styling.
// I've also attempted to stop the user from accidentally zooming in on a random small portion of a chart and getting lost here.
// But it doesn't seem to work and it's 8:30pm on the night this thing is due. Gotta move on, alas.

const chartconfig = {
    responsive: true,
    scrollZoom: false,

}

const sharedfont = "richmond-display"; //setting the font here because I'm specifying it in about 30 places so far and it'd be a huge pain to change otherwise.


const unpack = (data, key) => data.map(row => row[key]) // Setting the unpack function that's used everywhere for all my lovely little charts


// Finally, lets get to the charts!

// BEGIN KIA THEFT CHART

// This is the first chart you see and the center of the whole thing: month-by-month data on Kia thefts in 68 US cities, collected from a report by VICE/Motherboard.
// There's been other articles that have gathered this data but they've all reached the same cities and the VICE report did it the best.
// I suspect that it's just because they're querying police departments and there's only about 70 in the USA that answer information requests in a timely fashion.
// As a result despite getting 68 cities this data has a few annoying gaps. Lots of states where they got the small cities, like Buffalo, New York and Reno, Nevada but not the big cities like New York City and Los Vegas.
// Despite this it's still by far the best data I've been able to find for this visualisation.

// For this first chart I've manipulated the data only a bit to make for a more visually appealing design: the traces show
// as a stack to show the sheer weight of the increased thefts across all these cities, and the traces are arranged in the stack by
// order of total thefts across the whole period, so Chicago and Milwaukee appear at the top, which is relevant to the narrative
// I build up later on. Other than that, the biggest change is that I've renamed all of the dates on the X axis to be the full names
// of months instead of 'jan/19' etc.

Plotly.d3.csv("transposedSheet.csv", transposed_data => {



    const date = unpack(transposed_data, "Date");

    let cityArray = ["Boise, ID",
        "Oxnard, CA",
        "Corpus Cristi, TX",
        "McKinney, TX",
        "Eugene, OR",
        "Peoria, AZ",
        "Amarillo, TX",
        "Chandler, AZ",
        "Reno, NV",
        "Plano, TX",
        "Aurora, IL",
        "Modesto, CA",
        "Newport News, VA",
        "Providence, RI",
        "Garland, TX",
        "Madison, WI",
        "Fremont, CA",
        "Pittsburgh, PA",
        "Irving, TX",
        "Arlington, TX",
        "Spokane, WA",
        "Salt Lake City, UT",
        "Lubbock, TX",
        "Raleigh, NC",
        "Virginia Beach",
        "Wichita, KS",
        "St. Petersburg, FL",
        "Akron, OH",
        "Chula Vista, CA",
        "Orlando, FL",
        "El Paso",
        "Syracuse, NY",
        "Tuscon",
        "Stockton, CA",
        "San Bernardino, CA",
        "Vancouver, WA",
        "Montgomery County, MD",
        "Henderson, NV",
        "Anaheim, CA",
        "Glendale, AZ",
        "Dayton",
        "Bakersfield",
        "New Haven, CT",
        "Durham, NC",
        "Sacramento",
        "Riverside County, CA",
        "Seattle",
        "San Francisco",
        "Baltimore",
        "San Jose, CA",
        "San Diego",
        "Washington",
        "Buffalo, NY",
        "Rochester, NY",
        "Omaha",
        "Cleveland",
        "Austin, TX",
        "Cincinatti",
        "Albuquerque",
        "Atlanta",
        "Portland",
        "Washington, D.C.",
        "Dallas",
        "Louisville",
        "Minneapolis, MN",
        "Denver",
        "Los Angeles",
        "Milwaukee, WI",
        "Chicago"]


    let traces = []


    // The visual design for this chart and all the other ones is to connote the Kia theft wave with Lime Green.
    // So for this chart, with the help of chatgpt, I've made it so that there's a gradient with very harsh steps between levels
    // So the top half dozen cities all have clearly distinct shades of green that allows them to be differentiated from both
    // eachother and all the little cities that pile up at the bottom of the chart.

    // So first we define the starting colours for the lines and fills - darkslategrey to lime. 
    const startColor = [25, 49, 49, 2]; // darkslategrey
    const endColor = [0, 255, 0, 2]; // lime

    const startColorLine = [40, 79, 79, 0.5]; // darkslategrey
    const endColorLine = [0, 255, 0, 0.5]; // lime


    // Then we make a function to interpolate between the two colours in a gradient.
    function interpolateColor(color1, color2, factor) {
        // By fiddling with the math on this a bit I was able to make it really really dramatic so the majority of the gradient is
        // in the top few traces.
        factor = Math.pow(factor, 15);
        // Every trace grabs a different rgb value as it iterates through Rob's amazing city extraction function.
        const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
        const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
        const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
        return [r, g, b];
    }

    // Rob really came through and helped write this function that goes through every entry in the city array and generates a trace

    cityArray.forEach((city, index) => {


        // Each trace in the array does the colour interpolation functions to grab unique shades

        const intermediateColor = interpolateColor(startColor, endColor, index / cityArray.length);
        const intermediateColorLine = interpolateColor(startColorLine, endColorLine, index / cityArray.length);

        // And now let's set it up to look all nice

        let cityTrace = {
            x: date,
            y: unpack(transposed_data, city),
            name: city, //creating a variable here so that it can show on mouseover properly
            customdata: 'city',
            fillcolor: `rgb(${intermediateColor.join(',')})`, //using the colour here for the fill
            line: {
                color: `rgb(${intermediateColorLine.join(',')})`, //and the line
                width: 0.8,

            },
            stackgroup: 'one', //setting up each trace as stacked.
            mode: "lines", //with lines.
            hovertemplate: '<b>%{fullData.name}</b><br>' + //for some reason I couldn't get the city names to show properly until chatgpt tried going deeper and got this fullData.Name thing to check
                '<b>Month: </b>%{x}<br>' +
                '<b>Kia Thefts: </b>%{y:.2f%}<extra></extra>',
        }
        console.log(cityTrace)
        traces.push(cityTrace) // Then we cram the traces into the city array and load that for the chart!
    })

    console.log(traces)



    var chartLayout = {
        hovermode: 'closest',
        plot_bgcolor: 'rgba(255,255,255,0)', //Backgrounds are all transparent to nicely integrate into the page.
        paper_bgcolor: 'rgba(255,255,255,0)',
        height: 600,
         // These height and margins are used in every chart, I think. It's late.
        margin: {
            t: 140,
            r: 180,
            // l: 180,
        },
        title: {
            text: 'Thefts of Kia/Hyundai Cars in the United States, 2020-2023',
            font: {
                color: 'white',
                family: sharedfont, style: 'italic',
                size: 30,
            },
            pad: {
                b: 200,
            },
        },
        yaxis: { //Styling my X's and Y's here. Nothing crazy going on but it's here where I decided on the sort of neon/night mode aesthetic
            // that fits in thematically with the embedded videos of cars speeding in the dark
            tickcolor: "white",
            gridcolor: "darkslategrey",
            gridwidth: 1,

            zerolinecolor: "green",
            zerolinewidth: 2,
            tickfont: {

                family: sharedfont, size: 12,
                color: 'white',

            },
        },
        xaxis: {
            tickcolor: "white",
            gridcolor: "darkslategrey",
            gridwidth: 0.5,

            tickfont: {

                family: sharedfont, size: 12,
                color: 'white',

            },
            tickangle: 60,
            dtick: 2,
            tick0: 1,
            tickmode: 'linear',
        },
        hoverlabel: { //styling my hoverlabels for legibility
            bgcolor: 'black',
            bordercolor: '#003166',
            font: {
                family: sharedfont, size: 12,
                color: 'white',
            }
        },
        legend: {
            itemclick: false, //Normally you can turn on and off parts of the legend but that's just way too complicated
            // for this chart with so many traces in it. Way too easy to turn on accidentally and slightly spoil 
            // the aesthetic without noticing. I've chosen to turn it off to prevent this.
            title: {
                font: {

                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 'bold'
                },
                text: 'City',
                side: 'top center',
            },
            itemwidth: 2,
            font: {
                family: sharedfont,
                size: 12,
                color: 'white',
            }
        },
        annotations: [ 
            // And now my annotations! Chatgpt helped but very straightforward - just putting in the coordinates 
            // for the text over the chart. I've chosen to show the top three cities with these only, because 
            // they tell an interesting story Chicago and Los Angeles are both huge cities with high crime rates.
            //  So for Milwaukee, a city of half a million that I've barely heard of, to be sitting in the middle above LA is quite remarkable.
            {
                x: 'December 2022',
                y: 0.74, 
                xref: 'x',
                yref: 'paper',
                text: 'Chicago',
                showarrow: false,
                font: {
                    family: sharedfont,
                    size: 16,
                    color: 'white',
                }
            },
            {
                x: 'July 2021',
                y: 0.17, 
                xref: 'x',
                yref: 'paper',
                text: 'Milwaukee, WI',
                showarrow: false,
                font: {
                    family: sharedfont,
                    size: 16,
                    color: 'white',
                }
            },
            {
                x: 'March 2022',
                y: 0.145,
                xref: 'x',
                yref: 'paper',
                text: 'Los Angeles',
                showarrow: false,
                font: {
                    family: sharedfont,
                    size: 16,
                    color: 'white',
                }
            }
        ]

    }

    var chartData = traces;

    Plotly.newPlot("theftChart", chartData, chartLayout, chartconfig);

    // Finally, big thanks to chatgpt on this: one of my user testers accidentally zoomed in on a tiny portion of the chart and then couldn't figure
    // out how to escape because none of that stuff is intuitive in Plotly. This really isn't a chart that'd need that kind of finesse at all, so here's a function to disable it
    // Update: It's now 8:47pm and this didn't work either so I'm moving on. No clue how to turn this stuff off. Would try
    // more stuff if I had another few days.

    document.getElementById('theftChart').on('plotly_relayout', function(eventdata) {
        if ('xaxis.autorange' in eventdata || 'yaxis.autorange' in eventdata) {
            Plotly.relayout('theftChart', 'xaxis.autorange', false);
            Plotly.relayout('theftChart', 'yaxis.autorange', false);
        }
    });




})

// BEGIN KIA MODEL CHART

// Now let's move on to the chart showing effected Kia Models from 2011 to today, so I can dramatically
// highlight the huge chunk of endangered cars and communicate my point. This is all quite simple data that I obtained
// From Carfigures.com, a site that aggregates publically released car sales data from press releases and investor reports. 
// This is why there's that drop in 2023, I think. Several models have not been aggregated on the site yet.
// I had to do a bit of gruntwork though, because the site doesn't let you pull up several models at once, 
// so I had to go to the pages for each of the 14 cars
// and copy all the data into my own CSV. Like the last chart I've chosen to show them stacked because the point
// is the sheer enormity of the numbers

Plotly.d3.csv("EffectedKiaModels.csv", kia_data => {
    const year = unpack(kia_data, "year");

    // This uses a tweaked version of Rob's script for grabbing city theft data to grab the model data instead
    // So I don't have to set up 14 individual traces
    let carArray = [
        "Accent",
        "Elantra",
        "Kona",
        "Santa Fe",
        "Tucson",
        "Veloster",
        "Forte",
        "Optima",
        "Rio",
        "Sedona",
        "Soul",
        "Sportage",
    ];

    let traces = [];

    // And then we iterate through the array in the same way
    carArray.forEach((car, index) => {
        let color;
        let brand;
        if (["Accent", "Elantra", "Kona", "Santa Fe", "Tucson", "Veloster"].includes(car)) {
            // But chatgpt helped me with this part: using an if statement as we iterate so
            // all the Hyundai models are one colours and all the Kia models are another.
            color = 'slateblue'; 
            brand = "Hyundai";
            rank = "1";
        } else {
            color = 'lime'; //specifically, Kia gets to be lime because that's the colour I've associated with the Kia Boyz
            brand = "Kia";
            rank = "1000";
        }

        let carTrace = {
            x: year,
            y: unpack(kia_data, car),
            legendgroup: brand,
            legendrank: rank,
            legendgrouptitle: { //I tried unbelievably hard to show the kias and hyundais as separate in the 
            // legend with different titles but nothing worked. Chatgpt couldn't help and googling this shows it as an
            // issue with plotly JS for years. Oh well.
                text: brand,
                font: {
                    family: sharedfont, size: 12,
                    color: 'white',
                },
            },
            name: car,
            line: {
                color: color,
                width: 0.8,
            },
            stackgroup: 'one',
            mode: "lines",
            //none of the legendgroup stuff I tried worked at all except for in the hovertemplates where they're fine.
            // good enough I guess!
            hovertemplate: '<b>%{fullData.legendgroup}</b> %{fullData.name}<br>' + 
                '<b>Year: </b>%{x}<br>' +
                '<b>Sales: </b>%{y:.2f%}<extra></extra>',
        };
        console.log(carTrace);
        traces.push(carTrace);
    });

    console.log(traces);



    var chartLayout = {
        hovermode: 'closest',
        plot_bgcolor: 'rgba(255,255,255,0)',
        paper_bgcolor: 'rgba(255,255,255,0)',
        height: 600,
        margin: {
            t: 160,
            r: 180, // making the legend consistent with the previous chart
        },
        images: [ //Initially I had the brand names as just text annotations but I think it's way sexier to use the logos.
        // I just made them white and transparent in photoshop.
            {
                "source": "KIAlogo.png",
                "xref": "paper",
                "yref": "paper",
                "x": 0.2,
                "y": 0.6,
                "sizex": 0.1,
                "sizey": 0.1,
                "xanchor": "center",
                "yanchor": "center"
            },
            {
                "source": "Hyundailogo.png",
                "xref": "paper",
                "yref": "paper",
                "x": 0.2,
                "y": 0.3,
                "sizex": 0.2,
                "sizey": 0.2,
                "xanchor": "center",
                "yanchor": "center"
            },
        ],
        title: {
            xanchor: 'center',
            yanchor: 'center',

            pad: {
                b: 200,
            },
            text: 'Sales of affected Kia/Hyundai cars in the United States',
            font: {
                color: 'white',
                family: sharedfont, style: 'italic',
                size: 30,
            },
        },
        yaxis: {
            tickcolor: "white",
            tickwidth: 2,
            gridcolor: "teal",
            gridwidth: 1,
            zerolinecolor: "green",
            zerolinewidth: 2,
            tickfont: {
                family: sharedfont, size: 12,
                color: 'white',
            },

        },
        xaxis: {
            tickcolor: "white",
            // tickwidth: 2,
            gridcolor: "darkslategrey",
            gridwidth: 0.5,
            tickfont: {
                family: sharedfont, size: 14,
                color: 'white',
            },
            tickangle: 60,
            tick0: 1,
            tickmode: 'linear',
        },
        hoverlabel: {
            bgcolor: 'black',
            bordercolor: '#003166',
            font: {
                family: sharedfont, size: 14,
                color: 'white',
            },
        },
        showlegend: true,
        legend: {
            itemclick: false,
            groupclick: "toggleitem",
            itemwidth: 30,
            font: {
                family: sharedfont,
                size: 12,
                color: 'white',
            },
            tracegroupgap: 10, 
            traceorder: 'reversed',
            title: {
                font: {
                    family: sharedfont,
                    size: 16,
                    color: 'white',
                },
                text: 'Model',
            },
        },
        legendgrouptitle: {
            font: {
                family: sharedfont, size: 12,
                color: 'white',
            },
            // Another place where chatgpt tried to help me with my legend groups. Didn't work!
            text: {
                'Kia': 'Kia',
                'Hyundai': 'Hyundai',
            },
        },
        annotations: [ //So this is the only remaining text annotation: my big ominous red square of cars that've had their
        // coverage dropped.
            {
                x: 2018,
                y: 0.5,
                xref: 'x',
                yref: 'paper',
                xanchor: 'middle',
                yanchor: 'top',
                text: 'No longer covered by State Farm Insurance',
                showarrow: false,
                font: {
                    family: 'richmond-display',
                    size: 20,
                    color: 'white',
                    weight: 700,

                },
            },

        ],
        shapes: [
            {
                type: 'rect',
                xref: 'x',
                yref: 'paper',
                x0: 2015,
                y0: 0,
                x1: 2021,
                y1: 1, // Covers the full height of the plot
                fillcolor: 'red',
                opacity: 0.4,
                line: {
                    width: 0
                }
            }
        ]
    };

    var chartData = traces;

    Plotly.newPlot("salesChart", chartData, chartLayout);
});








// BEGIN KIA THEFT CHOROPLETH 

// And now we get to the choropleth! my favourite chart. This draws from the same data as the previous Kia theft chart,
// Only I manually aggregated the cities by state because that's how the plotly JS USA choropleth fills in its polygons.

// This has sort of exacerbated my issue with the lack of data for certain cities, because now New York is visible on the
// chart but it never really lights up because I'm only tracking Buffalo or whatever, which is sort of deceptive.
// To fix this, I tried to follow rob's suggestion of integrating a second 'scatter' choropleth to show the cities as markers
// So I could then put more data on them, but I could never get it to work and it'd only show these big ugly
// dots in the center of each state with a random city name attached even after I spent ages googling the longitude
// and latitude for individual city and feeding them into the thing. 
// I've kept that code in so you can see where me and chatgpt gave up and also because
// when I try to get rid of it it breaks everything. You can reveal the ugly dots again by changing
// Plotly.newPlot("choropleth", [choroData, scatterData] to Plotly.newPlot("choropleth", [scatterData, choroData]

// Anyway, this chart was originally intended to be way more ambitious before it turned out to be really hard to do.
// My original plan was that you could mouseover a city and then reveal data about how many kia thefts were occuring
// and how many Kia Boyz accounts were present, alongside an embedded local Kia Boyz video that I'd put in a box to the left
// of the choropleth and then listen for mousing over each state and swap the videos out. Just writing all that out made me
// feel exhausted and there's no way I would've had time to feed hundreds of videos into this thing, let alone get it running
// without making everything freak out.

// Looking at the final chart, I think it looks really cool anyway, especially with the autoplaying animation. 
// You don't really need a whole lot of fine data to communicate the important part of the Choropleth,
// which is that the thefts started to really shoot up across the entire country in mid-late 2023.
// And my testers all felt like this was about the right level of interactivity. Check the transcripts!

// I got the Choro up and running myself and then got chatgpt to help me with the timeline thing at the bottom. It did a great
// Job :).

Plotly.d3.csv("nicecleantable.csv", theft_data => {

    const states = unpack(theft_data, "State"); //grabbing the aggregated states here which is the main thing the choro shows
    // These other three ones are all tragically things that would've come in handy if the markers worked :(
    const cities = unpack(theft_data, "City");
    const latitudes = unpack(theft_data, "Latitude"); 
    const longitudes = unpack(theft_data, "Longitude");

    let dateArray = [ //grabbing the renamed dates here for so it looks right on the timeline sliedr
        "December 2019", "January 2020", "February 2020", "March 2020", "April 2020",
        "May 2020", "June 2020", "July 2020", "August 2020", "September 2020",
        "October 2020", "November 2020", "December 2020", "January 2021",
        "February 2021", "March 2021", "April 2021", "May 2021", "June 2021",
        "July 2021", "August 2021", "September 2021", "October 2021",
        "November 2021", "December 2021", "January 2022", "February 2022",
        "March 2022", "April 2022", "May 2022", "June 2022", "July 2022",
        "August 2022", "September 2022", "October 2022", "November 2022",
        "December 2022", "January 2023", "February 2023", "March 2023",
        "April 2023", "May 2023", "June 2023", "July 2023", "August 2023"
    ];

    const choroDates = {}; //chatgpt helped with this, but here's where we grab the dates so we can create the timeline
    dateArray.forEach(date => {
        choroDates[date] = unpack(theft_data, date);
    });

    var hoverTexts = [];
    states.forEach((state, i) => { //heres where I tried to have chatgpt make it so that the states with 0 thefts show 'no data available'
        // on highlight instead of 0. It doesn't work for some reason, and I can't tell if it's just because of the scatterchoro thing
        // because that also broke highlighting a state showing the full unabbreviated state name :(. I'm sorry its 930pm.
        hoverTexts.push(choroDates[dateArray[0]][i] === 0 ? 'No data available' : `${state}: ${choroDates[dateArray[0]][i]} thefts`);
    });

    var choroData = {
        // So here's the main choropleth! Actually just a pretty simple setup from the plotly USA-states template.
        // But with the Z axis changing for the timeline at the bottom.
        type: "choropleth",
        locationmode: "USA-states",
        locations: states,
        z: choroDates[dateArray[0]],
        text: hoverTexts,
        hovertemplate: '%{text}<extra></extra>',
        colorscale: [
            [0, 'black'], //States with exactly 0 thefts show as black instead of a very dark colour to convey that there's
            // a lack of data and not no thefts
            [0.0001, 'darkslategray'],
            [1, 'lime'], //States turn to lime green as the number of thefts increase.
        ],
        zmin: 0,
        zmax: 1800, //This is the highest number a state ever gets to, which corresponds to California in July 2023
        marker: {
            line: {
                color: 'rgb(180,180,180)',
                width: 0.8
            }
        },
        colorbar: {
            tickmode: "array",
            tickvals: [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800],
            ticktext: ['0', '200', '400', '600', '800', '1000', '1200', '1400', '1600', '1800'],
            tickfont: {
                size: 10,
                color: 'white'
            },
        },
    };

    var scatterData = {
        type: 'scattergeo',
        mode: 'markers',
        lon: longitudes,
        lat: latitudes,
        text: cities,
        marker: {
            size: 8,
            color: 'red',
            opacity: 0.7,
            line: {
                width: 1,
                color: 'black'
            }
        },
        name: 'Theft Locations'
    };

    // So here's where we do the beautful animation! 
    var sliderSteps = dateArray.map((date, i) => ({ //the steps are set to the dates in the datearray that we iterates through
        // in a for loop.
        label: date,
        method: 'animate',
        args: [
            ['frame' + i],
            {
                mode: 'immediate',
                transition: { duration: 300, easing: 'elastic-in' },
                frame: { duration: 300, redraw: true }
            }
        ],
        value: date
    }));

    var choroLayout = {
        plot_bgcolor: 'darkslateblue',
        paper_bgcolor: 'rgba(255,255,255,0)',
        margin: {
            t: 160,
            r: 140,
            l: 140,
        },
        dragmode: false, // Disabling zooming because there's just not that level of detail and it's awkward if you zoom in 
        // and hard to get out again.
        title: {
            text: 'Thefts of Kia/Hyundai Cars by State',
            font: {
                color: 'white',
                family: sharedfont,
                style: 'italic',
                size: 30,
            },
            pad: {
                b: 200,
            },
        },
        height: 600,
        geo: {
            bgcolor: 'rgba(255,255,255,0)',
            showcountries: true,
            showframe: true,
            scope: 'usa',
        },
        sliders: [{ // And this is where the slider is set up in the layout. I've positioned it at the bottom.
            // so I can place the shape that's the curve from the earlier theft chart underneath for consistency
            // and legibility.
            active: 0,
            steps: sliderSteps,
            len: 0.9,
            x: 0.05,
            xanchor: 'left',
            y: 0,
            yanchor: 'top',
            font: {
                size: 10,
                color: 'white',
                family: sharedfont,
            },
            pad: { t: 20, r: 10, b: 10 },
            currentvalue: {
                visible: true,
                prefix: 'Date: ',
                xanchor: 'right',
                font: {
                    size: 20,
                    color: 'white',
                    family: sharedfont,
                }
            }
        }]
    };

    var frames = dateArray.map((date, i) => ({ //and here's where we set up the frames for the animation. Saving each according
        // to a for loop.
        name: 'frame' + i,
        data: [
            {
                type: "choropleth",
                locationmode: "USA-states",
                locations: states,
                z: choroDates[date],
                text: states.map((state, j) => choroDates[date][j] === 0 ? 'No data available' : `${state}: ${choroDates[date][j]} thefts`),
                hovertemplate: '%{text}<extra></extra>',
                colorscale: [
                    [0, 'black'],
                    [0.0001, 'darkslategray'],
                    [1, 'lime'],
                ],
                zmin: 0,
                zmax: 1800,
                marker: {
                    line: {
                        color: 'rgb(180,180,180)',
                        width: 0.8
                    }
                },
                colorbar: {
                    tickmode: "array",
                    tickvals: [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800],
                    ticktext: ['0', '200', '400', '600', '800', '1000', '1200', '1400', '1600', '1800'],
                    tickfont: {
                        size: 10,
                        color: 'white'
                    },
                },
            },
            {
                type: 'scattergeo', //This is where chatgpt tried integrating the scattergeo with the animation.
                // I think this is where the issue is? possibly?
                mode: 'markers',
                lon: longitudes,
                lat: latitudes,
                text: states,
                marker: {
                    size: 8,
                    color: 'red',
                    opacity: 0.7,
                    line: {
                        width: 1,
                        color: 'black'
                    }
                },
                name: 'Theft Locations'
            }
        ]
    }));

    // Here chatgpt went crazy on the newPlot to add additional functionality where the animation autoplays from frame
    // 13, where things start to really kick off, on the first time the user scrolls through the page.
    
    Plotly.newPlot("choropleth", [choroData, scatterData], choroLayout, { displayModeBar: false }).then(function () {
        Plotly.addFrames("choropleth", frames);
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                animateChoropleth(13); // Start animation from frameIndex 13
                observer.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });

        observer.observe(document.getElementById("choropleth")); //I'm pretty sure how this works is by checking when the user
        // reaches the choropleth div and then triggering the animation.
    });

    // Also, there's a play button! For some reason chatgpt did this via adding an element to the document and then appending it
    // Instead of using the built in plotly functionality, but it works and it actually looks pretty great because I can style the button.
    // Unlike the uglier one you see in the next chart. This just hooks into the function at the bottom for animating the choropleth.
    var playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.style.position = 'relative';
    playButton.style.top = '-95px';
    playButton.style.left = '130px';
    playButton.style.zIndex = '1000';
    playButton.addEventListener('click', function () {
        animateChoropleth(0);
    });

    document.getElementById('choropleth').appendChild(playButton);

    var isPlaying = false;

    //This function animates the choropleth if it isn't already playing using the intergrated plotly animate functionality
    function animateChoropleth(startIndex) { 
        if (!isPlaying) { 
            isPlaying = true;
            var frameDuration = 300;
            var frameIndex = startIndex;
            var intervalId = setInterval(function () {
                Plotly.animate("choropleth", ['frame' + frameIndex], {
                    frame: { duration: frameDuration, redraw: true },
                    transition: { duration: frameDuration / 2, easing: 'elastic-in' },
                    mode: "next"
                });
                frameIndex++;
                if (frameIndex >= dateArray.length) { //It just iterates through the dateArray when you press play!
                    clearInterval(intervalId);
                    isPlaying = false;
                }
            }, frameDuration);
        }
    }

});









// BEGIN ARREST CHART

// And now we get to the chart of arrests! This one is also data compiled from a simple source that required a bit of
// extra gruntwork: I grabbed the arrests for Auto theft from the FBI's Crime data explorer for males in Wisconsin 
// Over 2012-2022, which is all the data current available. 

// This data is all easy to access but the age breakdown only shows one year at a time, so I had to manually
// Load each of the ten years in and then copy each of the demographics into a CSV.

// This is when I started to figure out my whole thesis that the Kia challenge isn't real. There's just not that much
// Of an increase in auto theft arrests even over 2022 when Milwaukee put out a completely insane number of Kia thefts per capita.

// To properly illustrate this real lack of change the user can toggle between a stacked chart and a stacked 100% chart
// So they can see both the quantity of arrests and the age distribution of arrests, and you can see that neither changes
// A whole lot. Not really a teen craze if only 70 more teens participate, is it?


Plotly.d3.csv("arrests.csv", arrest_data => {
    const year = unpack(arrest_data, "Year");

    let ageArray = [ //again using robs function to pull from an array but with ages this time. This is how the demographics
    // Are presented in the data, which ended up working out pretty well for me because it's way more granular with the teens.
        "Under 10",
        "10 to 12",
        "13 to 14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25 to 29",
        "30 to 34",
        "35 to 39",
        "40 to 44",
        "45 to 49",
        "50 to 54",
        "55 to 59",
        "60 to 64",
        "65 and over",
    ];

    //Chatgpt modified the original code to create the stacked trace option, which is expressed here with the normalize boolean
    function createTraces(normalize = false) { //by default we want a stacked chart so normalize is off
        let traces = ageArray.map((age, index) => {
            let color;
            let width;
            let mode;
            let marker = { // To tell my story properly I put two markers on the 18 age trace to show how the Kia theft wave
                // only adds up to 70 more arrests. 
                size: 8,
                color: 'lime', // Default color for the markers
                line: {
                    color: 'white',
                    width: 4
                },
                symbol: [],  
                opacity: [], 
            };

            if (["Under 10", "10 to 12", "13 to 14", "15", "16", "17"].includes(age)) { 
                //teenagers are coloured green because they'd be the Kia Boyz
                color = 'lime';
                width = 0.8;
                mode = 'lines';

            } else if (["18"].includes(age)) {
                color = 'lime';
                width = 4; //18 year olds get a bigger thicker line and markers to differentiate them from the other data
                mode = 'lines+markers';

                // Initialize marker properties for each data point
                year.forEach((_, i) => {
                    if (i === 0 || i === 4) { // and then we filter for just the 0 and 4th marker, because it starts from the right for some reason?
                        marker.symbol.push('square'); //The markers are square so they visually break from the rounded lines
                        marker.opacity.push(1);
                        marker.color = '#FFFFFF'; // And white so they match the annotation text
                    } else {
                        marker.symbol.push('circle'); 
                        marker.opacity.push(0);
                    }
                });
            } else {
                color = 'slategrey'; //All the other ages get thin lines and are coloured grey.
                width = 0.8;
                mode = 'lines';
            }

            let yData = unpack(arrest_data, age);

            if (normalize) { //enabling the normalize variable does this math stuff to it so traces are all scaled to
                // always occupy the entire Y axis.
                const yearlySums = year.map((_, i) =>
                    ageArray.reduce((sum, age) => sum + parseFloat(arrest_data[i][age]), 0)
                );
                yData = yData.map((y, i) => y / yearlySums[i]);
            }
            // and then we can finally get to the trace! Which is a pretty straightforward stack group trace, only with the
            // Y axis set to the yData variable that changes depending on which chart is selected.
            return {
                x: year,
                y: yData,
                name: age,
                mode: mode,
                line: {
                    color: color,
                    width: width,
                },
                marker: marker,
                stackgroup: 'one',
                hovertemplate: '<b>Age: %{fullData.name}</b><br>' +
                    '<b>Year: </b>%{x}<br>' +
                    '<b>Arrests: </b>%{y:.2f%}<extra></extra>',
            };
        });

        return traces;
    }

    let traces = createTraces();
    let traces100 = createTraces(true); //so then when we create the traces it just runs the function again with the normalize
    // variable enabled 

    let updateMenus = [ //this is where we use updatemenus for the buttons to alternate between the charts.
        {
            buttons: [
                {
                    args: [{ 'y': traces.map(t => t.y) }],
                    label: 'Arrests (Stacked)',
                    method: 'restyle',
                    bgcolor: 'darkslategrey',
                    font: {
                        color: 'black', // for some reason the enabled button is always white. It's hardcoded and googling
                        // finds people complaining about it for years. So I've had to break with my scheme literally only here
                        // and make the text black :(
                        family: sharedfont,
                        size: 14
                    },
                },
                {
                    args: [{ 'y': traces100.map(t => t.y) }],
                    label: 'Arrests (Distribution)',
                    method: 'restyle',
                    font: {
                        color: 'black',
                        family: sharedfont,
                        size: 14
                    },
                },
            ],
            direction: 'left',
            pad: { 'r': 10, 't': 10 },
            showactive: true,
            type: 'buttons',
            x: 0.05,
            xanchor: 'left',
            y: 1.0,
            yanchor: 'top',
            font: {
                color: 'black',
                family: sharedfont,
                size: 16
            },
            bgcolor: 'slategrey',
            bordercolor: 'black',
            borderwidth: 1
        }
    ];

    // I'd already established my chart styling at this point so this is largely tweaked from the Kia models. Just with the 
    // legend disabled because the individual ages aren't really important. This worked really well except I haven't
    // worked out a way to customise the ticks on the Y axis for the normalised chart to properly show them as percentages
    // I dunno how you are supposed to check what chat you're showing in the layout object. If I had more time
    // I'd experiment with having two instead of one.
    var chartLayout = {
        updatemenus: updateMenus,
        hovermode: 'closest',
        plot_bgcolor: 'rgba(255,255,255,0)',
        paper_bgcolor: 'rgba(255,255,255,0)',
        height: 600,
        margin: {
            t: 140,
            l: 120,
            r: 120,
        },
        title: {
            text: 'Arrests for Car Theft in Wisconsin by age group, 2012-2022',
            font: {
                color: 'white',
                family: sharedfont,
                style: 'italic',
                size: 30,
            },
            pad: {
                b: 20,
            },
        },
        yaxis: {
            tickcolor: "white",
            tickwidth: 2,
            gridcolor: "teal",
            gridwidth: 1,
            zerolinecolor: "green",
            zerolinewidth: 2,
            tickmode: 'auto',  // Change tickmode to 'linear'
            nticks: 10,  // Specify the number of ticks
            tickfont: {
                family: sharedfont,
                size: 12,
                color: 'white',
            },
        },

        xaxis: {
            tickcolor: "white",
            gridcolor: "darkslategrey",
            gridwidth: 0.5,
            tickfont: {
                family: sharedfont,
                size: 14,
                color: 'white',
            },
            tickangle: 60,
            tickmode: 'linear',
        },
        hoverlabel: {
            bgcolor: 'black',
            bordercolor: '#003166',
            font: {
                family: sharedfont,
                size: 14,
                color: 'white',
            },
        },
        showlegend: false,
        legend: {
            groupclick: "toggleitem",
            itemwidth: 30,
            font: {
                family: sharedfont,
                size: 10,
                color: 'white',
            },
            tracegroupgap: 10,
            traceorder: 'reversed',
            title: {
                font: {
                    family: sharedfont,
                    size: 16,
                    color: 'white',
                },
                text: 'Age',
            },
        },
        annotations: [ //and the annotations work the same way, just separating the top and bottom of the chart.
            {
                x: 2017,
                y: 0.2,
                xref: 'x',
                yref: 'paper',
                xanchor: 'middle',
                yanchor: 'top',
                text: 'Under 18',
                showarrow: false,
                font: {
                    family: sharedfont,
                    size: 20,
                    color: 'white',
                    weight: 700,
                },
            },
            {
                x: 2017,
                y: 0.7,
                xref: 'x',
                yref: 'paper',
                xanchor: 'middle',
                yanchor: 'top',
                text: 'Over 18',
                showarrow: false,
                font: {
                    family: sharedfont,
                    size: 20,
                    color: 'white',
                    weight: 700,
                },
            },
            {
                x: 2018,
                y: 0.55,
                xref: 'x',
                yref: 'paper',
                xanchor: 'middle',
                yanchor: 'top',
                text: '501 Arrests<br>43% of Total.', //except for this annotation and the following one, which I've carefully
                // positioned above the marker so they fit together visually
                showarrow: false,
                font: {
                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 700,
                },
            },
            {
                x: 2020.9, //This one gets to sit as close to the edge as possible
                y: 0.6,
                xref: 'x',
                yref: 'paper',
                xanchor: 'left',
                yanchor: 'top',
                text: '570 Arrests<br>50% of total<br>                                    ', //but with all these extra spaces so the annotation
                // extends the chart boundry slightly and the square marker isn't cut in half. Silly but it works.
                showarrow: false,
                font: {
                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 700,
                },
            },
        ],
    };

    Plotly.newPlot("arrestChart", traces, chartLayout, { responsive: true });
});






// BEGIN KIA SEARCH TERM CHART

// And now we get to the final two charts! I'm not gonna lie these are basically both just the google trend chart adapted into
// Plotly. Google trends for related search terms are the only way I could find to grab data that'd reflect interest in the tiktok trend since tiktok
// doesn't release any, and Google trend data is always just showing the search interest as a normalized percentage 
// So there's really only one way to display it, which is how it shows by default.
// Luckily this works really well with my narrative anyway, since the whole point is that both the Kia challenge and Sea Shanties
// Were flash-in-the-pan memes without lasting appeal and not actual cultural movements.

// Both of these charts are incredibly straightforward as a result and were built from the styling established before,
// Only showing a regular scatter instead of a stacked, and with different colours because I'm no longer representing auto theives.
// But the memes surrounding them.


Plotly.d3.csv("KiaSearches.csv", search_data => {




    const challenge = unpack(search_data, "Kia Challenge");
    const boyz = unpack(search_data, "Kia Boyz");
    const theft = unpack(search_data, "Kia theft");
    const steal = unpack(search_data, "How to Steal Kia");
    const usb = unpack(search_data, "Kia USB");
    const week = unpack(search_data, "Week");

    var trace1 = {
        x: week,
        y: challenge,
        name: "Kia Challenge",
        mode: "lines",
        fill: 'tozeroy',
        zorder: '1',
        hovertemplate: 'Searches for "Kia Challenge"' +
            '<b>Week: </b>%{x}<br>' +
            '<b>Search interest (%): </b>%{y:.2f%}%<extra></extra>',
    }


    var trace2 = {
        x: week,
        y: boyz,
        name: "Kia Boyz",
        mode: "lines",
        fill: 'none',
        color: 'limegreen', //The Kia Boyz get to be their characteristic lime green
        opacity: 0.9, //but with no fill and a lower opacity because otherwise the bottom of the chart gets really muddled
        // since there's all that crap down there
        zorder: '-1',
        hovertemplate: 'Searches for "Kia Boyz"' +
            '<b>Week: </b>%{x}<br>' +
            '<b>Search interest (%): </b>%{y:.2f%}%<extra></extra>',
    }

    var trace3 = {
        x: week,
        y: theft,
        name: "Kia Theft",
        mode: "lines",
        fill: 'tozeroy',
        zorder: 100,
        hovertemplate: 'Searches for "Kia Theft"' +
            '<b>Week: </b>%{x}<br>' +
            '<b>Search interest (%): </b>%{y:.2f%}%<extra></extra>',
    }

    var trace4 = {
        x: week,
        y: steal,
        name: "How to Steal Kia",
        mode: "lines",
        fill: 'none',
        opacity: 0.5, //The other lesser search terms get an even lower opacity because they're even less important
        zorder: -1,
        line: {
            dash: 'dashdot',
        },
        hovertemplate: 'Searches for "How to Steal Kia"' +
            '<b>Week: </b>%{x}<br>' +
            '<b>Search interest (%): </b>%{y:.2f%}%<extra></extra>',
    }

    var trace5 = {
        x: week,
        y: usb,
        name: "Kia USB",
        mode: "lines",
        fill: 'none',
        opacity: 0.5,
        zorder: -1,
        line: {
            dash: 'dashdot',
        },
        hovertemplate: 'Searches for "Kia USB"' +
            '<b>Week: </b>%{x}<br>' +
            '<b>Search interest (%): </b>%{y:.2f%}%<extra></extra>',
    }



    var layout = {
        hovermode: 'closest',
        plot_bgcolor: 'rgba(255,255,255,0)',
        paper_bgcolor: 'rgba(255,255,255,0)',
        height: 600,
        margin: {
            t: 140,
        },
        title: {
            text: 'Google Trend data for "Kia Challenge"-related search terms',
            font: {
                color: 'white',
                family: sharedfont,
                style: 'italic',
                size: 30,
            },
            pad: {
                b: 200,
            },
        },
        yaxis: {
            tickcolor: "white",
            tickwidth: 2,
            gridcolor: "teal",
            gridwidth: 1,
            zerolinecolor: "green",
            zerolinewidth: 2,
            tickfont: {
                family: sharedfont,
                size: 12,
                color: 'white',
            },
        },
        xaxis: {
            tickcolor: "white",
            gridcolor: "darkslategrey",
            gridwidth: 0.5,
            tickfont: {
                family: sharedfont,
                size: 12,
                color: 'white',
            },
            tickangle: 60,
            dtick: 30,
            tick0: 0,
            tickmode: 'auto',
        },
        hoverlabel: {
            bgcolor: 'black',
            bordercolor: '#003166',
            font: {
                family: sharedfont,
                size: 14,
                color: 'white',
            },
        },
        showlegend: true,
        legend: {
            groupclick: "toggleitem",
            itemwidth: 30,
            font: {
                family: sharedfont,
                size: 10,
                color: 'white',
            },
            tracegroupgap: 10,
            traceorder: 'reversed',
            title: {
                font: {
                    family: sharedfont,
                    size: 16,
                    color: 'white',
                },
                text: 'Age',
            },
        },
        annotations: [ //these annotations are all straightforward. Just matching the details in the text.
        // I've chosen to only annotate the three big peaks because it'd get crowded if I tried to fit in all five events.
            {
                x: '2022-10-22',
                y: 90,
                xref: 'x',
                yref: 'y',
                xanchor: 'right',
                yanchor: 'bottom',
                text: 'October 10 2022:<br>Death of four in accident',
                showarrow: false,
                arrowcolor: 'white',
                arrowhead: 1,
                arrowsize: 1,
                arrowpath: 'M -10,-50 Q -20,-75 -30,-50',
                ax: 50,
                ay: 0,
                font: {
                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 700,
                },
            },
            {
                x: '2022-07-24',
                y: 65,
                xref: 'x',
                yref: 'y',
                xanchor: 'right',
                yanchor: 'bottom',
                text: 'July 07 2022:<br>Viral spread of Tiktok',
                showarrow: false,
                arrowcolor: 'white',
                arrowhead: 1,
                arrowsize: 1,
                ax: -50,
                ay: 0,
                font: {
                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 700,
                },
            },
            {
                x: '2024-02-25',
                y: 25,
                xref: 'x',
                yref: 'y',
                xanchor: 'right',
                yanchor: 'bottom',
                text: 'March 3 2024:<br>Milwaukee lawsuit settlement',
                showarrow: false,
                arrowcolor: 'white',
                arrowhead: 1,
                arrowsize: 1,
                ax: -50,
                ay: 0,
                font: {
                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 700,
                },
            },
        ],
    }



    var data = [trace3, trace1, trace2, trace4, trace5]

    Plotly.newPlot("trendChart", data, layout, chartconfig)
})

// BEGIN SEA SHANTY SEARCH TERM CHART

// This chart's even simpler than the other one since I'd already established the style at this point. 
// The only difference is the annotations. 

Plotly.d3.csv("ShantySearches.csv", shanty_data => {
    const shanty = unpack(shanty_data, "Sea Shanty");
    const wellerman = unpack(shanty_data, "Wellerman");
    const week = unpack(shanty_data, "Week");

    var trace2 = {
        x: week,
        y: shanty,
        name: "Sea Shanty",
        type: 'scatter',
        mode: "lines",
        fill: 'tozeroy',
        hovertemplate: 'Searches for "Sea Shanty"<br>' +
            '<b>Week: </b>%{x}<br>' +
            '<b>Search interest (%): </b>%{y:.2f%}%<extra></extra>',
    }

    var trace1 = {
        x: week,
        y: wellerman,
        name: "Wellerman",
        type: 'scatter',
        fill: 'tozeroy',
        mode: 'lines',
        hovertemplate: 'Searches for "Wellerman"<br>' +
            '<b>Week: </b>%{x}<br>' +
            '<b>Search interest (%): </b>%{y:.2f%}%<extra></extra>',
    }


    var layout = {
        hovermode: 'closest',
        plot_bgcolor: 'rgba(255,255,255,0)',
        paper_bgcolor: 'rgba(255,255,255,0)',
        height: 600,
        margin: {
            t: 140,
        },
        title: {
            text: 'Google Trend data for "Sea Shanty"-related search terms',
            font: {
                color: 'white',
                family: sharedfont,
                style: 'italic',
                size: 30,
            },
            pad: {
                b: 50,
                t: 50,
            },
            xanchor: 'center',
            yanchor: 'top',
        },
        yaxis: {
            tickcolor: "white",
            tickwidth: 2,
            gridcolor: "teal",
            gridwidth: 1,
            zerolinecolor: "green",
            zerolinewidth: 2,
            tickfont: {
                family: sharedfont,
                size: 12,
                color: 'white',
            },
        },
        xaxis: {
            tickcolor: "white",
            gridcolor: "darkslategrey",
            gridwidth: 0.5,
            tickfont: {
                family: sharedfont,
                size: 12,
                color: 'white',
            },
            tickangle: 60,
            dtick: 30,
            tick0: 0,
            tickmode: 'auto',
        },
        hoverlabel: {
            bgcolor: 'black',
            bordercolor: '#003166',
            font: {
                family: sharedfont,
                size: 14,
                color: 'white',
            },
        },
        showlegend: true,
        legend: {
            groupclick: "toggleitem",
            itemwidth: 30,
            font: {
                family: sharedfont,
                size: 10,
                color: 'white',
            },
            tracegroupgap: 10,
            traceorder: 'reversed',
            title: {
                font: {
                    family: sharedfont,
                    size: 16,
                    color: 'white',
                },
                text: 'Age',
            },
        },
        annotations: [
            {
                x: '2020-07-26',
                y: 75,
                xref: 'x',
                yref: 'y',
                xanchor: 'middle',
                yanchor: 'bottom',
                showarrow: false,
                text: 'January 17 2021:<br>Viral spread of initial<br>"Wellerman" Tiktok',
                font: {
                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 700,
                },
            },
            {
                x: '2022-11-06',
                y: 45,
                xref: 'x',
                yref: 'y',
                xanchor: 'middle',
                yanchor: 'bottom',
                showarrow: false,
                text: 'June 05 2022:<br>Several Sea Shanty<br>festivals are held',
                font: {
                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 700,
                },
            },
            {
                x: '2020-01-10',
                y: 20,
                xref: 'x',
                yref: 'y',
                xanchor: 'middle',
                yanchor: 'bottom',
                showarrow: false,
                text: 'July 2019:<br>Spread of Sea Shanty<br> content on Tiktok',
                font: {
                    family: sharedfont,
                    size: 14,
                    color: 'white',
                    weight: 700,
                },
            },
        ],
    }

    var data = [trace2, trace1]

    Plotly.newPlot("shantyChart", data, layout, chartconfig)
})
