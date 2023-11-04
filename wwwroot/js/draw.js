"use strict";

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var userColor = getRandomColor();

var connection = new signalR.HubConnectionBuilder().withUrl("/drawDotHub").build();

connection.start().then(function () {
    // Send the user's color to the server
    connection.invoke("SetUserColor", userColor).catch(function (err) {
        return console.error(err.toString());
    });
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("updateDot", function (x, y, color) {
    drawDot(x, y, 8, color);
});

connection.on("clearCanvas", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Variables for referencing the canvas and 2dcanvas context
var canvas, ctx;
// Variables to keep track of the mouse position and left-button status
var mouseX, mouseY, mouseDown = 0;

// Function to draw a dot with the specified color
function drawDot(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Keep track of the mouse button being pressed and draw a dot at the current location
function sketchpad_mouseDown() {
    mouseDown = 1;
    drawDot(mouseX, mouseY, 8, userColor);

    connection.invoke("UpdateCanvas", mouseX, mouseY).catch(function (err) {
        return console.error(err.toString());
    });
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown = 0;
}

// Keep track of the mouse position and draw a dot if the mouse button is currently pressed
function sketchpad_mouseMove(e) {
    // Update the mouse co-ordinates when moved
    getMousePos(e);
    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown === 1) {
        drawDot(mouseX, mouseY, 8, userColor);
        connection.invoke("UpdateCanvas", mouseX, mouseY).catch(function (err) {
            return console.error(err.toString());
        });
    }
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e) {
        e = event;
    }
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}

// Set up the canvas and add event handlers after the page has loaded
// Get the specific canvas element from the HTML document
canvas = document.getElementById('sketchpad');
// If the browser supports the canvas tag, get the 2d drawing context for this canvas
if (canvas.getContext) {
    ctx = canvas.getContext('2d');
}

// Check that we have a valid context to draw with before adding event handlers
if (ctx) {
    // React to mouse events on the canvas, and mouseup on the entire document
    canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
    canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
    window.addEventListener('mouseup', sketchpad_mouseUp, false);
} else {
    document.write("Browser not supported!!");
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connection.invoke("ClearCanvas").catch(function (err) {
        return console.error(err.toString());
    });
}

// Attach the clearCanvas function to the button's click event
var clearButton = document.getElementById("clear_button");
clearButton.addEventListener("click", clearCanvas);