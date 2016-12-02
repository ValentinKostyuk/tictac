let express = require('express');
let app = express();
let url = require('url');

let allowedFolders = ['/app', '/resources', '/node_modules'];
let allowedExtensions = ['html', 'css', 'js'];

function escapeRegExp (str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function getIsFolderAllowedRegExp (){
	let regexStr = '(^' + escapeRegExp('/') +'[^/]*$)|';
	for (let i = 0; i < allowedFolders.length; i++) {
		regexStr += '(^' + escapeRegExp(allowedFolders[i]) + '.*)|';
	}
	regexStr = regexStr.substring(0, regexStr.length - 1);
	return new RegExp(regexStr, 'i');
}

function getIsExtensionAllowedRegExp (){
	let regexStr = '(^' + escapeRegExp('/') +'$)|';
	for (let i = 0; i < allowedExtensions.length; i++) {
		regexStr += '(\.' + escapeRegExp(allowedExtensions[i]) + '$)|';
	}
	regexStr = regexStr.substring(0, regexStr.length - 1);
	return new RegExp(regexStr, 'i');
}

let extensionsRegExp = getIsExtensionAllowedRegExp();
let foldersRegExp = getIsFolderAllowedRegExp();

function getIsValidPath(path){
	return foldersRegExp.test(path) && extensionsRegExp.test(path);
}

function filterNotAllowedFiles(req, res, next) {
	console.log(req.originalUrl);
	let originalUrl = url.parse(req.originalUrl).path;

	if (getIsValidPath(originalUrl)) {
		next();
	} else {
		res.status(404).send('File not found');
	}
}

app.get('/*', filterNotAllowedFiles);

app.use('/', express.static('./'));

app.listen(3003, function () {
	console.log('Example app listening on port 3000!');
});