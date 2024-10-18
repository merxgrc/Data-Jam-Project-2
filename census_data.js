function getCensusData() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // List of cities you want data for
    var cities = [
      "Berkeley", "Fremont", "Hayward", "Livermore", 
      "Napa", "Palo Alto", "Pittsburg", "San Francisco", 
      "San Jose", "Suisun City", "Vacaville"
    ];
    
    // API variables for Median Household Income and various demographic groups
    var variables = [
      "B19013_001E",  // Median Household Income
      "B02001_002E",  // White
      "B02001_003E",  // Black or African American
      "B02001_005E",  // Asian
      "B02001_004E",  // American Indian and Alaska Native
      "B03001_003E",  // Hispanic or Latino
      "B02001_006E",  // Native Hawaiian and Other Pacific Islander
      "B02001_008E"   // Two or More Races
    ];
    
    var apiKey = '7c3aa1ccb8b1b3eb659f8fc4e1932b4f7a60e476';  // Replace with your actual Census API key
    
    // Dictionary to store fetched data for each city
    var censusData = {};
  
    // Fetch Census data for all cities once
    var url = "https://api.census.gov/data/2020/acs/acs5?get=NAME," + variables.join(',') + "&for=place:*&in=state:06&key=" + apiKey;
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());
  
    // Loop through all cities and store their data in the dictionary
    for (var j = 1; j < data.length; j++) {
      for (var k = 0; k < cities.length; k++) {
        if (data[j][0].includes(cities[k])) {
          censusData[cities[k]] = data[j];  // Store the data by city
        }
      }
    }
  
    // Loop through each row in the sheet and match cities with stored census data
    var lastRow = sheet.getLastRow();  // Get the last row with data
    for (var i = 2; i <= lastRow; i++) {
      var address = sheet.getRange(i, 4).getValue();  // Assuming the city is part of the address in column D
      var cityFound = false;
  
      // Extract just the city name from the address by splitting the string on commas
      var addressParts = address.split(',');
      if (addressParts.length > 1) {
        var cityName = addressParts[1].trim();  // Assuming the city is the second part of the address
  
        // Check if the city name matches any known city
        for (var city in censusData) {
          if (cityName.includes(city)) {
            var cityData = censusData[city];  // Get the data for the matched city
            
            // Write the matched data to the correct row (columns K to R)
            sheet.getRange(i, 11).setValue(cityData[1]);  // Median Household Income in K
            sheet.getRange(i, 12).setValue(cityData[2]);  // American Indian in L
            sheet.getRange(i, 13).setValue(cityData[3]);  // Asian in M
            sheet.getRange(i, 14).setValue(cityData[4]);  // Black in N
            sheet.getRange(i, 15).setValue(cityData[5]);  // Hispanic in O
            sheet.getRange(i, 16).setValue(cityData[6]);  // Pacific Islander in P
            sheet.getRange(i, 17).setValue(cityData[7]);  // Two or More Races in Q
            sheet.getRange(i, 18).setValue(cityData[8]);  // White in R
            cityFound = true;
            break;
          }
        }
  
        if (!cityFound) {
          Logger.log("No city match found for: " + address);
        }
      }
    }
  }