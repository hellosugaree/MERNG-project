/* // Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&callback=initMap`;
script.async = true;

// Attach your callback function to the `window` object
const additionalOptions = {};

window.initMap = function() {

  // JS API is loaded and available
  console.log('loaded')
  try{
  let map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
          ...additionalOptions  });
  } catch (err) {
    console.log(err);
  }
};

// Append the 'script' element to 'head'
document.head.appendChild(script); */