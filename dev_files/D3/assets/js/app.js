// @TODO: YOUR CODE HERE!

let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 25,
  right: 40,
  bottom: 100,
  left: 100
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
let chosenXAxis = "poverty";  
let chosenYAxis = "healthcare";

//***************************************************************************************

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]),
      d3.max(censusData, d => d[chosenYAxis])
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

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty:";
    var xsuffix = "%";
  } else if (chosenXAxis ==="age") {
    var xlabel = "Age (Median):";
    var xsuffix = "";
  } else {
    var xlabel = "Household Income (Median):";
    var xsuffix = "";
  }

  if (chosenYAxis === "healthcare") {
     var ylabel = "Healtchare:";
     var ysuffix = "%";
   } else if (chosenYAxis ==="smokes") {
     var ylabel = "Smokes:";
     var ysuffix = "%";
   } else {
     var ylabel = "Obesity:";
     var ysuffix = "%";
   }

  

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis].toLocaleString()}${xsuffix}<br>${ylabel} ${d[chosenYAxis]}${ysuffix}`);
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
d3.csv("assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });


//********************************************************************************

// xLinearScale function above csv import
var xLinearScale = xScale(censusData, chosenXAxis);

// Create yLinearscale function
var yLinearScale = yScale(censusData, chosenYAxis)

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
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 20)
  .attr("fill", carolinaBlue)
  .attr("opacity", ".5");


let textGroup = chartGroup.selectAll()
  .data(censusData)
  .enter()
  .append("text")
  .attr("text-anchor", "middle")
  // .attr("dx", function(d){return -10})
  .attr("dy", function(d){return +5})
  .text(d => d.abbr)
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .attr("font-size", "15px")
  .attr("font-weight", "bold")
  .attr("fill", "white");



// Create group for 3 x- axis labels
var labelsXGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

// Create X axes labels
var povertyLabel = labelsXGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("xValue", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

var ageLabel = labelsXGroup.append("text")
  .attr("x", 0)
  .attr("y", 45)
  .attr("xValue", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("Age (Median)");

var houseIncomeLabel = labelsXGroup.append("text")
  .attr("x", 0)
  .attr("y", 70)
  .attr("xValue", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Income (Median)");




// Create group for 3 y- axis labels
var labelsYGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");

// Create Y axes Labels
var healthcareLabel = labelsYGroup.append("text")
  .attr("y", 0 - margin.left + 50)
  .attr("x", 0 - (height / 2))
  .attr("yValue", "healthcare") // value to grab for event listener
  .attr("dy", "1em")
  .classed("active", true)
  .text("Lacks Healthcare (%)");

var smokesLabel = labelsYGroup.append("text")
  .attr("y", 0 - margin.left + 25)
  .attr("x", 0 - (height / 2))
  .attr("yValue", "smokes") // value to grab for event listener
  .attr("dy", "1em")
  .classed("inactive", true)
  .text("Smokes (%)");

var obesityLabel = labelsYGroup.append("text")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("yValue", "obesity") // value to grab for event listener
  .attr("dy", "1em")
  .classed("inactive", true)
  .text("Obese (%)");

 

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
     xLinearScale = xScale(censusData, chosenXAxis);

    // updates x axis with transition
     xAxis = renderXAxes(xLinearScale, xAxis);

    // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
     textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

    // XAxis Lables: changes classes to change bold text 
     if (chosenXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
         .classed("active", true)
         .classed("inactive", false);
        houseIncomeLabel
          .classed("active", false)
          .classed("inactive", true);
        
     } else if (chosenXAxis === "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);  
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        houseIncomeLabel
          .classed("active", true)
          .classed("inactive", false);
     } else {
        povertyLabel
         .classed("active", true)
         .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        houseIncomeLabel
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
     yLinearScale = yScale(censusData, chosenYAxis);

    // updates Y axis with transition
     yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
     textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
 
    // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
   
     // YAxis Lables: changes classes to change bold text  
     if (chosenYAxis === "smokes") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
         .classed("active", true)
         .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        
     } else if (chosenYAxis === "obesity") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);  
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
     } else {
        healthcareLabel
         .classed("active", true)
         .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
     }
    }
  });


 
//*********************************************************************************************
 }).catch(function(error) {
   console.log(error);
});










  

