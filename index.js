//command line arguments
var system = require('system');
var args = system.args;
var fs = require('fs');

//strip tags
var striptags = require('strip');

//lodash (non-es6)
var _ = require('lodash');

//get all the sentences
var getSentences = function (text) {
  return text.split('.');
}

//process each sentence that contains a date
var processSentences = function (sentences) {
  var res = [];
  var re = /(19\d\d)|(20\d\d)/ig;
  var pickDate = /(19\d\d)|(20\d\d)/ig;
  _.forEach(sentences, function (s) {
    if(re.test(s)) {
      var date = s.match(pickDate);
      var sen = s.replace(/\[\d*\]/, '');//strip wikipedia annotations
      sen = sen.replace(/\n/, '');//strip newlines
      sen = sen.replace(',', '');//strip commas for file formatting
      console.log(sen);
      res.push({
        date: date,
        sentence: sen
      });
    }
  });
  return _.sortBy(res, 'date');
}

var formatSentences = function (sentences) {
  var res = [];
  _.forEach(sentences, function (s) {
    res.push(s.date + ',' + s.sentence);
  });
  return res;
}

//output file
var writeArrayToFile = function (array) {
  var path = 'output.csv';
  var content = '';
  _.forEach(array, function (data) {
    content = content + data + '\n';
  });
  fs.write(path, content, 'w');
  console.log('file written');
}
 
if(args.length == 2) {
  var page = require('webpage').create();
  console.log('The default user agent is ' + page.settings.userAgent);
  page.settings.userAgent = 'SpecialAgent';
  page.open(args[1], function(status) {
    if (status !== 'success') {
      console.log('Unable to access network');
    } else {
      //program
      var content = page.evaluate(function() {
        return $('#mw-content-text p').text();//wikipedia specific selectors
      });
      console.log(content);
      var block = striptags(content).toLowerCase();
      //strip is block of source
      var sentences = getSentences(block);
      var dateSentences = processSentences(sentences);

      writeArrayToFile(formatSentences(dateSentences));
      console.log('Done');
    }
    phantom.exit();
  });
} else {
  phantom.exit();
}



