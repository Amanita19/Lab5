// script.js

const img = new Image();

const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const imageInput = document.querySelector("[id='image-input']");

var dimensions;

const form = document.querySelector("[id='generate-meme']");
const submit = document.querySelector("[type='submit']");
const reset = document.querySelector("[type='reset']");
const readText = document.querySelector("[type='button']"); 

const topText = document.querySelector("[name='textTop']");
const bottomText = document.querySelector("[name='textBottom']");

const voiceSelect = document.querySelector("[id='voice-selection']"); 

var synth = window.speechSynthesis;
var voices = synth.getVoices();
var toSpeak = new SpeechSynthesisUtterance();

const slider = document.querySelector("[type='range']");
const icon = document.querySelector("div img");

img.addEventListener('load', () => {

  ctx.fillStyle = 'black';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0,0, canvas.width, canvas.height);

  dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height); 
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
  submit.disabled = false;
  reset.disabled = true;
  readText.disabled = true;

});

imageInput.addEventListener('input', () => {
  img.src = URL.createObjectURL(document.querySelector("[id='image-input']").files[0]);
  img.alt = imageInput.value.split("\\").pop();
});

form.addEventListener( 'submit', () => {
  event.preventDefault();

  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.font = 'bold 40px serif';
  ctx.fillText( topText.value.toUpperCase(), canvas.width/2, 30);
  ctx.fillText( bottomText.value.toUpperCase(), canvas.width/2, canvas.height - 5);
  ctx.strokeText( topText.value.toUpperCase(), canvas.width/2, 30);
  ctx.strokeText( bottomText.value.toUpperCase(), canvas.width/2, canvas.height - 5);

  submit.disabled = true;
  reset.disabled = false;
  readText.disabled = false;
});

reset.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector("[id='image-input']").value = "";

    submit.disabled = false;
    reset.disabled = true;
    readText.disabled = true;
});

readText.addEventListener('click', () => {

  toSpeak.text = (topText.value + " " + bottomText.value);

  speechSynthesis.speak(toSpeak);
});

slider.addEventListener('input', () => {

  toSpeak.volume = slider.value/100;

  if( slider.value == 0) {

    icon.src = "icons/volume-level-0.svg"
    icon.alt = "Volume Level 0"
  }
  else if( slider.value < 34) {
    icon.src = "icons/volume-level-1.svg"
    icon.alt = "Volume Level 1"
  }
  else if( slider.value < 67 ) {
    icon.src = "icons/volume-level-2.svg"
    icon.alt = "Volume Level 2"
  }
  else {
    icon.src = "icons/volume-level-3.svg"
    icon.alt = "Volume Level 3"
  }
});

voiceSelect.addEventListener('change', () => {

  for( let i = 0; i < voices.length ; i++) {
    let selected = voiceSelect.options[voiceSelect.selectedIndex].dataset.name;
    if(voices[i].name == selected) {
      toSpeak.voice = voices[i];
    }
  }
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}