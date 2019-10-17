//let year;

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selYear");
  // var selectedYear = ...

  // Use the list of sample names to populate the select options
  d3.json("/year").then((selYear) => {
    selYear.forEach((year) => {
      selector
        .append("option")
        .text(year)
        .property("value", year);
    });

    // Use the first sample from the list to build the initial plots
    const firstYear = selYear[-1];
    //buildCharts(firstYear);
    //buildMetadata(firstYear);
  });
}

function optionChanged(newYear) {
  // Fetch new data each time a new sample is selected
  //buildCharts(newYear);
  //buildMetadata(newYear);
  year = document.getElementById("selYear").value;
  //let sourceDataYear = `combined_data/${yearSelected}`;
  console.log(year)
  populate_chart_by_year(year);




}

// Initialize the dashboard
init();


//********************************************************************************************* */
// @TODO: YOUR CODE HERE!

let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 25,
  right: 40,
  bottom: 100,
  left: 135
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//=============================================================================================================

// Initial Params
let chosenXAxis = "cost_per_stu";  
let chosenYAxis = "cost_per_prisoner";



// starting point here
populate_chart_by_year('2016');

//***************************************************************************************

// function used for updating x-scale var upon click on axis label
function xScale(edCorrData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(edCorrData, d => d[chosenXAxis]) * 0.8,
      d3.max(edCorrData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(edCorrData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(edCorrData, d => d[chosenYAxis]),
      d3.max(edCorrData, d => d[chosenYAxis])
    ])
    .range([height, 0]);

  return yLinearScale;
}

//***************************************************************************************

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
  .duration(1000)  // <-- Transition time
  .call(bottomAxis);

  return xAxis;
}


// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
var leftAxis = d3.axisLeft(newYScale);

   yAxis.transition()
    .duration(1000)  // <-- Transition time
    .call(leftAxis);

   return yAxis;
 }

//************************************************************************

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000) // <-- Transition time
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  textGroup.transition()
    .duration(1000) // <-- Transition time
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

//*****************************************************************

//Axis function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {


  if (chosenXAxis === "cost_per_stu") {
    var xlabel = "Cost per Student:";
    var xsuffix = "";
  } else if (chosenXAxis ==="stu_to_pop_percent") {
    var xlabel = "Student to State Pop:";
    var xsuffix = "%";
  } else {
    var xlabel = "Total Education Exp:";
    var xsuffix = " (1k)";
  }

  if (chosenYAxis === "cost_per_prisoner") {
     var ylabel = "Cost per Prisoner:";
     var ysuffix = "";
   } else if (chosenYAxis ==="prisoner_to_pop_percent") {
     var ylabel = "Prisoner to State Pop:";
     var ysuffix = "%";
   } else {
     var ylabel = "Total Correction Exp:";
     var ysuffix = " (1k)";
   }

  

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis].toLocaleString()}${xsuffix}<br>${ylabel} ${d[chosenYAxis].toLocaleString()}${ysuffix}`);
    });


  // Step 7: Create tooltip in the chart
  // ==============================
   
  circlesGroup.call(toolTip);
  textGroup.call(toolTip);
  

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  

  textGroup.on("mouseover", function(data) {
     toolTip.show(data);
    })
     // onmouseout event
     .on("mouseout", function(data, index) {
       toolTip.hide(data);
     });
    

  return circlesGroup;  
  return textGroup;
}

 
 
//*************************************************************************

// Retrieve data from the CSV file and execute everything below

//   d3.csv("/static/data/ed_corr_data.csv").then(function(edCorrData, err) {
//     if (err) throw err;
//     console.log(edCorrData);
// //    // parse data
//     edCorrData.forEach(function(data) {
//       data.cost_per_stu = +data.cost_per_stu;
//       data.stu_to_pop_percent = +data.stu_to_pop_percent;
//       data.ed_total_exp_1k = +data.ed_total_exp_1k;
//       data.cost_per_prisoner = +data.cost_per_prisoner;
//       data.prisoner_to_pop_percent = +data.prisoner_to_pop_percent;
//       data.corr_total_exp_1k = +data.corr_total_exp_1k;
//     });



function populate_chart_by_year(year) {

  // let metaPanel = d3.select("#sample-metadata");

  chartGroup.html("");  //<--clears data to start over

  let sourceDataYear = `combined_data/${year}`;
   console.log(sourceDataYear)


    d3.json(sourceDataYear).then(function(edCorrData, err) {
     if (err) throw err;
     console.log(edCorrData)

     edCorrData.forEach(function(data) {
        data.cost_per_stu = +data.cost_per_stu;
        data.stu_to_pop_percent = +data.stu_to_pop_percent;
        data.ed_total_exp_1k = +data.ed_total_exp_1k;
        data.cost_per_prisoner = +data.cost_per_prisoner;
        data.prisoner_to_pop_percent = +data.prisoner_to_pop_percent;
        data.corr_total_exp_1k = +data.corr_total_exp_1k;
     });



    //********************************************************************************

    // xLinearScale function above csv import
    var xLinearScale = xScale(edCorrData, chosenXAxis);

    // Create yLinearscale function
    var yLinearScale = yScale(edCorrData, chosenYAxis)

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // append x axis
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);


    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);


    //********************************************************************************

    // Step 5: Create Circles
    //     // ==============================
    carolinaBlue = d3.rgb("#99badd")

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(edCorrData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", carolinaBlue)
      .attr("opacity", ".5");


    let textGroup = chartGroup.selectAll()
      .data(edCorrData)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      // .attr("dx", function(d){return -10})
      .attr("dy", function(d){return +5})
      .text(d => d.state_abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .attr("font-size", "15px")
      .attr("font-weight", "bold")
      .attr("fill", "white");

      


    // Create group for 3 x- axis labels
    var labelsXGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    // Create X axes labels
    var cost_per_stuLabel = labelsXGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("xValue", "cost_per_stu") // value to grab for event listener
      .classed("active", true)
      .text("Cost per Student");

    var stu_to_pop_percentLabel = labelsXGroup.append("text")
      .attr("x", 0)
      .attr("y", 45)
      .attr("xValue", "stu_to_pop_percent") // value to grab for event listener
      .classed("inactive", true)
      .text("Student to State Population (%)");

    var ed_total_exp_1kLabel = labelsXGroup.append("text")
      .attr("x", 0)
      .attr("y", 70)
      .attr("xValue", "ed_total_exp_1k") // value to grab for event listener
      .classed("inactive", true)
      .text("Total Education Expense (000s)");




    // Create group for 3 y- axis labels
    var labelsYGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

    // Create Y axes Labels
    var cost_per_prisonerLabel = labelsYGroup.append("text")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2))
      .attr("yValue", "cost_per_prisoner") // value to grab for event listener
      .attr("dy", "1em")
      .classed("active", true)
      .text("Cost per Prisoner");

    var prisoner_to_pop_percentLabel = labelsYGroup.append("text")
      .attr("y", 0 - margin.left + 25)
      .attr("x", 0 - (height / 2))
      .attr("yValue", "prisoner_to_pop_percent") // value to grab for event listener
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Prisoner to State Population (%)");

    var corr_total_exp_1kLabel = labelsYGroup.append("text")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("yValue", "corr_total_exp_1k") // value to grab for event listener
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Total Correction Expense (000s)");

    

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);



    //*********************************************************************************************
    // X axis labels event listener
    labelsXGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xValue = d3.select(this).attr("xValue");
      if (xValue !== chosenXAxis) {

        // replaces chosenXAxis with value
          chosenXAxis = xValue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(edCorrData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

        // XAxis Lables: changes classes to change bold text 
        if (chosenXAxis === "stu_to_pop_percent") {
            cost_per_stuLabel
              .classed("active", false)
              .classed("inactive", true);
            stu_to_pop_percentLabel
            .classed("active", true)
            .classed("inactive", false);
            ed_total_exp_1kLabel
              .classed("active", false)
              .classed("inactive", true);
            
        } else if (chosenXAxis === "ed_total_exp_1k") {
            cost_per_stuLabel
              .classed("active", false)
              .classed("inactive", true);  
            stu_to_pop_percentLabel
              .classed("active", false)
              .classed("inactive", true);
            ed_total_exp_1kLabel
              .classed("active", true)
              .classed("inactive", false);
        } else {
            cost_per_stuLabel
            .classed("active", true)
            .classed("inactive", false);
            stu_to_pop_percentLabel
              .classed("active", false)
              .classed("inactive", true);
            ed_total_exp_1kLabel
              .classed("active", false)
              .classed("inactive", true);
        }
        }
      });


    //*********************************************************************************************
    // Y axis labels event listener
    labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yValue = d3.select(this).attr("yValue");
      if (yValue !== chosenYAxis) {

        // replaces chosenYAxis with value
          chosenYAxis = yValue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(edCorrData, chosenYAxis);

        // updates Y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
    
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
      
        // YAxis Lables: changes classes to change bold text  
        if (chosenYAxis === "prisoner_to_pop_percent") {
            cost_per_prisonerLabel
              .classed("active", false)
              .classed("inactive", true);
            prisoner_to_pop_percentLabel
            .classed("active", true)
            .classed("inactive", false);
            corr_total_exp_1kLabel
              .classed("active", false)
              .classed("inactive", true);
            
        } else if (chosenYAxis === "corr_total_exp_1k") {
            cost_per_prisonerLabel
              .classed("active", false)
              .classed("inactive", true);  
            prisoner_to_pop_percentLabel
              .classed("active", false)
              .classed("inactive", true);
            corr_total_exp_1kLabel
              .classed("active", true)
              .classed("inactive", false);
        } else {
            cost_per_prisonerLabel
            .classed("active", true)
            .classed("inactive", false);
            prisoner_to_pop_percentLabel
              .classed("active", false)
              .classed("inactive", true);
            corr_total_exp_1kLabel
              .classed("active", false)
              .classed("inactive", true);
        }
        }
      });


 
//*********************************************************************************************
 }).catch(function(error) {
   console.log(error);
});


}


//*********************************************************************************************






  

