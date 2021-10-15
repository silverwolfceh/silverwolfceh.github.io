function doGet(e) {
  var type1 = e.parameter.type;
  if (type1 == '1') {
    var sheets = SpreadsheetApp.openById('<IDsheet>').getActiveSheet();
    var jo = {};
    var arrays = [];
    var rows = sheets.getRange(2, 1, sheets.getLastRow(), sheets.getLastColumn()).getValues();
    for (var i = 0, l = rows.length; i < l; i++ ) {
      var dataRow = rows[i];
      var record = {};
      record[dataRow[0]] = dataRow[1];
      arrays.push(record);
    }
    jo.data = arrays;
    var result = JSON.stringify(jo);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  
  } else if (type1 == '2') {
    var sheets = SpreadsheetApp.openById('<IDsheet>').getActiveSheet();
    var url1 = e.parameter.url;
    var results = '';
    var rows = sheets.getRange(2, 1, sheets.getLastRow(), sheets.getLastColumn()).getValues();
    for (var i = 0, l = rows.length; i < l; i++ ) {
      var dataRow = rows[i];
      if (dataRow[0] == url1) {
        results = dataRow[1]
      }
    }
    return ContentService.createTextOutput(results);
  } else {
    var realURL = e.parameter.url;
    var url1 = Utilities.base64Encode(Utilities.newBlob(realURL).getBytes());
    var code = '';
    var dem = 0;
    while (1) {
      var rdn = getRandomInt(0, url1.length - 6);
      var url2 = Utilities.base64Encode(Utilities.newBlob(rdn+realURL+rdn*2).getBytes());
      code = url2.slice(rdn, rdn+5);
      var hihi = checkHave(code);
      if (hihi == 0) {
        break;
      } else {
        dem += 1;
      }
    }
    var sheets = SpreadsheetApp.openById('<IDsheet>').getActiveSheet();
    sheets.appendRow([code, realURL]);
    return ContentService.createTextOutput(code);
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function checkHave(code) {
  var sheets = SpreadsheetApp.openById('<IDsheet>').getActiveSheet();
  var results = 0;
  var rows = sheets.getRange(2, 1, sheets.getLastRow(), sheets.getLastColumn()).getValues();
  for (var i = 0, l = rows.length; i < l; i++ ) {
    var dataRow = rows[i];
    if (dataRow[0] == code) {
      results += 1;
    }
  }
  return results;
}
