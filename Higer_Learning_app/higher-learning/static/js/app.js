function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  const metaUrl = `metadata/${sample}`;
  let metaPanel = d3.select("#sample-metadata");

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metaUrl).then((sample) => { 
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    metaPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      metaPanel
        .append("p")
        .text(`${key}: ${value}`);
    });
  
  });
    
// BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  d3.json(metaUrl).then((sample) => {
      let washData = sample.WFREQ;
      console.log(washData)
  // Wash Frequency | Level
      let level = washData     
  
  // Trig to calc meter point
      var degrees = 180 - parseInt(level)*20,
         radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
  
  // Path: may have to change to create a better triangle
     var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
      var data = [{ type: 'scatter',
        x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'Washes',
        text: level,
        hoverinfo: 'text+name'},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: [
          '8-9',
          '7-8', 
          '6-7', 
          '5-6', 
          '4-5', 
          '3-4', 
          '2-3',
          '1-2', 
          '0-1', 
          '',
          ],
        textinfo: 'text',
        textposition:'inside',	  
        marker: {colors:[
              'rgba(5, 38, 0, .5)', // 8-9
              'rgba(11, 92, 0, .5)', // 7-8
              'rgba(14, 127, 0, .5)', // 6-7
              'rgba(110, 154, 22, .5)', // 5-6 
              'rgba(170, 202, 42, .5)', // 4-5  
              'rgba(202, 209, 95, .5)', // 3-4
              'rgba(210, 206, 145, .5)', // 2-3
              'rgba(229, 228, 227, .5)', // 1-2
              'rgba(239, 238, 237, .5)', // 0-1
              'rgba(255, 255, 255, 0)', // bottom
              '',
              ]},
        labels: [
          '8-9', 
          '7-8', 
          '6-7', 
          '5-6', 
          '4-5', 
          '3-4', 
          '2-3', 
          '1-2', 
          '0-1', 
          ''
          ],
        hoverinfo: 'label',
       hole: .5,
        type: 'pie',
        showlegend: false
      }];
  
      var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
         }],
       title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
        //height: 1000,
        //width: 1000,
        xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
       yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
     };
  
    Plotly.newPlot('gauge', data, layout);
  
  });
       
  
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const sampleData = `samples/${sample}`;
  
    // @TODO: Build a Bubble Chart using the sample data
  d3.json(sampleData).then((sample) => {
    let xValues = sample.otu_ids;
    let yValues = sample.sample_values;
    let markSize = sample.sample_values;
    let markColor = sample.otu_ids;
    let textLabels = sample.otu_labels

    //var desired_maximum_marker_size = 40;

    let bubbleTrace = {
      x: xValues,
      y: yValues,
      text: textLabels,
      mode: 'markers',
      marker: {
        color: markColor,
        size: markSize,
        //sizeref: Math.max(markSize) / (desired_maximum_marker_size),
        //sizemode: 'area'
      }
    };
    
    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: "<b>Sample Distributions and Sizes</b>",
      xaxis: {
        title: {
          text: 'otu ids',
        }},
      yaxis: {
        title: {
          text: 'sample values',
        }},

      showlegend: false
      //height: 600,
      //width: 600
    };
    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
  

    // @TODO: Build a Pie Chart
  d3.json(sampleData).then((sample) => {
    let sampleValues  = sample.sample_values.slice(0,10);
    let sampleLabels = sample.otu_ids.slice(0,10);
    let sampleText = sample.otu_labels.slice(0,10)

    let pieTrace = [{
      values: sampleValues,
      labels: sampleLabels,
      hovertext: sampleText,
      type: "pie",
      title: "<b>Top Samples</b><br> "
      
    }];

    let pieLayout = {
      //height: 600,
      //width: 100,
      showlegend: true
    };

    Plotly.newPlot("pie", pieTrace, pieLayout);
  });


    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}


 



// 


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
