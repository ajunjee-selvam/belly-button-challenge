// Use the D3 library to read in samples.json from the URL https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json.
d3.json("samples.json").then(function(samples_data){
    console.log(samples_data)

    //Populate the dropdown
    d3.select("#selDataset")
    .selectAll("option")
    .data(samples_data.names)
    .enter()
    .append("option")
    .text(d=>d)
    .attr("value",d=>d);

    optionChanged(d3.select("#selDataset").property("value"));
});

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual. 
// - Use sample_values as the values for the bar chart. 
// - Use otu_ids as the labels for the bar chart. 
// - Use otu_labels as the hovertext for the chart.

// Function for creating bar chart based on the selected dataset
function createBarChart(x,y,text) {
    let data = [{
        type: 'bar',
        x: x,
        y: y,
        text: text,
        orientation: 'h'
    }];

    let layout = {
        title: "Top 10 OTUs"
    };

    Plotly.newPlot('bar', data, layout);
};

// Create a bubble chart that displays each sample.
// - Use otu_ids for the x values.
// - Use sample_values for the y values.
// - Use sample_values for the marker size.
// - Use otu_ids for the marker colors.
// - Use otu_labels for the text values.

// Function for creating bubble chart based on the selected dataset
function createBubbleChart(x,y,text) {
    let data = [{
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        markers: {
            size: y,
            color: x.map(value => value)
        }
    }];

    let layout = {
        title: "OTU Values",
        xaxis: {
            title: {
                text: 'OUT ID',
            }
        }
    };

    Plotly.newPlot('bubble', data, layout);
};

// Display the sample metadata, i.e., an individual's demographic information.
// Display each key-value pair from the metadata JSON object somewhere on the page.
function demoInfo(data) {
    let demo_info = d3.select("#sample-metadata");
    demo_info.html("")
    let demo_info_list = demo_info.append("ul");
    Object.entries(data).forEach(([key, value]) => {
        demo_info_list.append("li").text(key + ": " + value);
     });
};


// Update all the plots when a new sample is selected. 
function optionChanged(value) {
    d3.json("./data/samples.json").then(function(incomingData) {
        var metadata = incomingData.metadata.filter(data => data.id ==value);
        console.log(metadata);

        var sample = incomingData.samples.filter(data => data.id ==value);
        console.log(sample);

        createBarChart(sample[0].sample_values.slice(0,10).reverse(),sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),sample[0].otu_labels.slice(0,10).reverse());
        createBubbleChart(sample[0].otu_ids,sample[0].sample_values,sample[0].otu_labels);
        demoInfo(metadata[0]);
    });
}

