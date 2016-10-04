#!/usr/bin/env node

var path = require('path')
var program = require('commander')
var Vibrant = require('node-vibrant')
var pkg = require( path.join(__dirname, 'package.json') )
 
program
	.version(pkg.version)
	.option('-i, --image [path/to/file]', 'specify the image file to extract colors from')
	.option('-s, --samples [int]', 'specify colors in initial palette (64)')
	.option('-q, --quality [int]', 'specify scale down factor. 1 means no downsampling (5)')
	.option('-l, --minNormalLuma [0-1]', 'specify minimal luma threshold for the Vibrant and Muted swatches')
	.option('-A, --all', 'output all extracted colors (default is most vibrant only)')
	.option('-h, --hex', 'output color value(s) in Hex')
	.option('-H, --hsl', 'output color value(s) in HSL')
	.option('-r, --rgb', 'output color value(s) in RGB')
	.option('-d, --debug', 'display debug messages')
	.parse(process.argv)

// TO DO: Needs error checking to make sure file exists
if (program.image) {
	console.log('Getting colors from image %s...', program.image)
	
	var optsG = {
		minNormalLuma: 0.3
	}
	if (program.minNormalLuma) optsG.minNormalLuma = program.minNormalLuma
	var g = new Vibrant.Generator(optsG)
	if (program.debug) console.log('Created Vibrant Generator')
	// TO DO: Figure out why the Vibrant instance below doesn't seem to use this generator
	
	var optsV = {
		colorCount: 64,
		quality: 5
	}
	if (program.samples) optsV.colorCount = program.samples
	if (program.quality) optsV.quality = program.quality
	var v = new Vibrant(program.image, optsV)
	if (program.debug) console.log('Created Vibrant object')
	
	v.getPalette(function(errors, swatches) {
			if (program.debug) console.log('Inside getPalette')
			if (errors) {
				console.log(errors)
				process.exit()
			}

			if (program.rgb || program.hsl || program.hex) {
				if (program.debug) console.log('Inside RGB, HSL, Hex if statement \n swatches: \n', swatches)
				if (program.all) {
					showAllSwatches(swatches)
				} else {
					if (program.hsl) console.log('Vibrant ', swatches['Vibrant'].getHsl())
					if (program.rgb) console.log('Vibrant ', swatches['Vibrant'].getRgb())
					if (program.hex) console.log('Vibrant ', swatches['Vibrant'].getHex())
				}
			}
		})
} else {
	console.log('[Error: Please specify an image to process ]')
	program.help()
}

function showAllSwatches(swatches) {
	if (program.debug) console.log('Inside showAllSwatches function')
    for (var swatch in swatches) {
    	if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
			if (program.debug) console.log('Inside showAllSwatches if statement')
			if (program.hsl) console.log(swatch, swatches[swatch].getHsl())
			if (program.rgb) console.log(swatch, swatches[swatch].getRgb())
			if (program.hex) console.log(swatch, swatches[swatch].getHex())
    	}
    }
}