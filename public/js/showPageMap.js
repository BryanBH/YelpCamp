mapboxgl.accessToken = mbToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  projection: "globe", // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl());
const marker1 = new mapboxgl.Marker({ color: "black" })
  .setLngLat(camp.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(`${camp.title}`))
  .addTo(map);

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
