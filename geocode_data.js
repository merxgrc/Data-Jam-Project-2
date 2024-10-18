function geocodeAddress(address) {
    var apiKey = 'AIzaSyBaoAyNqDc5Os1tX5bwAKVgkfHugQb-4lY'; // Replace with your actual API Key
    var baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var url = baseUrl + encodeURIComponent(address) + '&key=' + apiKey;
  
    var response = UrlFetchApp.fetch(url);
    Logger.log('API URL: ' + url);  // Log the API URL
    var json = JSON.parse(response.getContentText());
  
    if (json.status == 'OK') {
      var location = json.results[0].geometry.location;
      Logger.log('Latitude: ' + location.lat + ', Longitude: ' + location.lng);  // Log lat/lng for debugging
      return [location.lat, location.lng];
    } else {
      Logger.log('Geocoding Error for address: ' + address + ', Status: ' + json.status);  // Log errors
      return ['Error', 'Error'];
    }
  }
  
  function geocodeSheet() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var range = sheet.getRange('D2:D');  // Use a smaller range for testing
    var values = range.getValues();
    
    Logger.log('Values captured: ' + JSON.stringify(values));  // Log the entire values array
  
    for (var i = 0; i < values.length; i++) {
      if (values[i][0] != '') {
        Logger.log('Processing address in Row ' + (i + 2) + ': ' + values[i][0]);  // Log the address being processed
        var geocodeResult = geocodeAddress(values[i][0]);
        sheet.getRange(i + 2, 19).setValue(geocodeResult[0]); // Puts Latitude in column S (19th column)
        sheet.getRange(i + 2, 20).setValue(geocodeResult[1]); // Puts Longitude in column T (20th column)
      } else {
        Logger.log('Empty cell at Row ' + (i + 2));  // Log empty cells
      }
    }
  }