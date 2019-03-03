function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  var metadata = `/metadata/${sample}`
  // console.log(metadata)
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(metadata).then(response => {
    var paneldata = d3.select('#sample-metadata');
    // console.log(response);
      // Use `.html("") to clear any existing metadata
    paneldata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    paneldata.append("P").html(`<ul><b>AGE</b>: ${response.AGE}</ul>`);
    paneldata.append("P").html(`<ul><b>BBTYPE</b>: ${response.BBTYPE}</ul>`);
    paneldata.append("P").html(`<ul><b>ETHNICITY</b>: ${response.ETHNICITY}</ul>`);
    paneldata.append("P").html(`<ul><b>GENDER</b>: ${response.GENDER}</ul>`);
    paneldata.append("P").html(`<ul><b>LOCATION</b>: ${response.LOCATION}</ul>`);
    paneldata.append("P").html(`<ul><b>SAMPLEID</b>: ${response.sample}</ul>`);

    // var sampleData = `/samples/${sample}`;
    
    // console.log(sampleData)
    // console.log(test)
  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  var sampleData = `/samples/${sample}`;
  d3.json(sampleData).then(response2 => {
    // console.log(response2)
    var topTenIds = response2.otu_ids.slice(0,10);
    // console.log(topTenIds)
    var topTenLabels = response2.otu_labels.slice(0,10)
    // console.log(topTenLabels)
    var topTenValues = response2.sample_values.slice(0,10)
    // console.log(topTenValues)
    var data = [{
      "label": topTenIds,
      "values": topTenValues,
      "hovertext": topTenLabels,
      "type": "pie"
    }]
    // console.log(data)
    Plotly.newPlot('pie', data);
  })
  
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Bubble Chart using the sample data

  d3.json(sampleData).then(x => {
    console.log(x)
    var otuIds = x.otu_ids
    // console.log(otuIds)
    var otuLabels = x.otu_labels
    // console.log(otuLabels)
    var otuValues = x.sample_values
    // console.log(otuValues)

    var trace1 = {
      x: otuIds,
      y: otuValues,
      mode: 'markers',
      text: otuLabels,
      marker: {
        color: otuIds,
        size: otuValues,
        colorscale: 'Earth'
      }
    };
    var bubbleData = [trace1];

    var layout = {
      title: '<b>Bubble Chart</b>',
      titlefont: {
        "size": 36
      },
      showlegend: false,
      height: 600,
      width: 1200
    };
    // var test = d3.select('#bubble')
    // console.log(bubbleData)
    Plotly.newPlot("bubble", bubbleData, layout)
  })

  // @TODO: Build a Pie Chart
  
    
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_"+sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    guage(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  guage(newSample);
}

// Initialize the dashboard
init();
