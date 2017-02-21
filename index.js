//command line arguments
var system = require('system');
var args = system.args;
var fs = require('fs');

//strip tags
var striptags = require('strip');

//lodash (non-es6)
var _ = require('lodash');

//search for months
var search = [];

//toss out unreasonable dates
var dateFilter = function (blockText) {
  var re = /(19\d\d,)|(20\d\d,)/ig;
  var dates = blockText.match(re);
  return dates.sort();
}

//get sentence surrounding each date
var getDateSentences = function (dates, text) {
  console.log('here');
  var res = [];
  _.forEach(dates, function (d) {
    console.log(d);
    var re = new RegExp('(\..*' + d + '.*\. )');
    console.log(re);
    var find = text.match(re);
    console.log(find);
    res.push(find);
  });
  return res;
}

//output file
var writeArrayToFile = function (array) {
  var path = 'output.txt';
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
      var content = page.content;
      //var strip = striptags(blockText).replace(/\s/ig, '');
      var block = striptags(content).toLowerCase();
      //strip is block of source
      var dates = dateFilter(block);
      var sentences = getDateSentences(dates, block);

      //output results
      _.forEach(sentences, function (d) {
        //console.log(d);
      });
      //writeArrayToFile(sentences);
      console.log('Done');
    }
    phantom.exit();
  });
} else {
  phantom.exit();
}



