#!/usr/bin/env node

var path = require('path');
var program = require('commander');
var Vibrant = require('node-vibrant');
var pkg = require( path.join(__dirname, 'package.json') );
 
program
	.version(pkg.version)
	.option('-i, --image [path/to/file]', 'Specify the image file to extract colors from')
	.parse(process.argv);

// needs error checking to make sure file exists
if (program.image) {
	console.log('Getting colors from image %s ...', program.image);
	Vibrant.from(program.image).getPalette(function(err, palette) {
		// need error checking to display err thrown by Vibrant if any
		console.log(palette);
	});
} else {
	console.log('Please specify an image file. Use --help for more.');
}