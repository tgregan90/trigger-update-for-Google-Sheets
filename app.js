function myFunction() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;             // Wait up to 5s for previous refresh to end.

  var id = "<Spreadsheet ID>";
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName("<Sheet Name>");
  var dataRange = sheet.getDataRange();
  var formulas = dataRange.getFormulas();
  var content = "";
  var now = new Date();
  var time = now.getTime();
  var re = /.*[^a-z0-9]import(?:xml|data|feed|html|range)\(.*/gi;
  var re2 = /((\?|&)(update=[0-9]*))/gi;
  var re3 = /(",)/gi;

  for (var row=0; row<formulas.length; row++) {
    for (var col=0; col<formulas[0].length; col++) {
      content = formulas[row][col];
      if (content != "") {
        var match = content.search(re);
        if (match !== -1 ) {
          // import function is used in this cell
          var updatedContent = content.toString().replace(re2,re2);
          // Update url in formula with querystring param
          sheet.getRange(row+1, col+1).setFormula(updatedContent);
        }
      }
    }
  }
  lock.releaseLock();
  sheet.getRange(1,5).setValue("Rates were last updated at " + now.toLocaleTimeString())
}
