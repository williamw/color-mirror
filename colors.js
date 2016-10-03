#!/usr/bin/env node

var path = require('path');
var program = require('commander');
var Vibrant = require('node-vibrant');
var pkg = require( path.join(__dirname, 'package.json') );
 
program
	.version(pkg.version)
	.option('-i, --image [path/to/file]', 'Specify the image file to extract colors from')
	.option('-h, --hex', 'Display color values in Hex (default)')
	.option('-H, --hsl', 'Display color values in HSL')
	.option('-r, --rgb', 'Display color values in RGB')
	.parse(process.argv);

// needs error checking to make sure file exists
if (program.image) {
	console.log('Getting colors from image %s ...', program.image);
	Vibrant.from(program.image).getPalette(function(err, swatches) {
	    for (var swatch in swatches) {
	    	if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
				if (program.rgb) {
					console.log(swatch, swatches[swatch].getRgb())
				}  else if (program.hsl) {
					console.log(swatch, swatches[swatch].getHsl())
				} else {
					console.log(swatch, swatches[swatch].getHex())
				}
	    	}
	    }
	});
} else {
	console.log('Please specify an image file. Use --help for more.');
}