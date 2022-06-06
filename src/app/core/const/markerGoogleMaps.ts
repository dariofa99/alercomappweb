export class MarkerGoogleMaps {
  PINCOLOR = '#990099';
  PINLABEL = 'A';

  // Pick your pin (hole or no hole)
  PINSVGHOLE =
    'M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z';
  LABELORIGINHOLE = new google.maps.Point(12, 15);
  PINSVGFILLED =
    'M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z';
  LABELORIGINFILLED = new google.maps.Point(12, 9);

  MARKERIMAGE = {
    // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
    path: this.PINSVGFILLED,
    anchor: new google.maps.Point(12, 17),
    fillOpacity: 1,
    fillColor: this.PINCOLOR,
    strokeWeight: 2,
    strokeColor: this.PINCOLOR,
    scale: 2,
    labelOrigin: this.LABELORIGINFILLED,
  };
  LABEL = {
    text: this.PINLABEL,
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  };
}
