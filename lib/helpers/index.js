const path = require("path");

function isPathRelative(path) {
	return path === '.' || path.startsWith('./') || path.startsWith('../')
}

function isPathAbsolute(path) {
	return !isPathRelative(path);
}

function getCurrentFileLayer(filePath) {
	const normalizedPath = filePath.replace(/[\\]+/g, "/")
	const projectPath = normalizedPath?.split('src')[1]
	const segments = projectPath?.split('/')

	return segments?.[1]
}

function getNormalizedCurrentFilePath(currentFilePath) {
	const fromNormalizedPath = path.toNamespacedPath(currentFilePath);
	const isWindowsOS = fromNormalizedPath.includes('\\');
	const fromPath = fromNormalizedPath.split('src')[1];
	return isWindowsOS ? fromPath.split('\\').join('/') : fromPath;
}


module.exports = {
	isPathRelative,
	getCurrentFileLayer,
	getNormalizedCurrentFilePath,
	isPathAbsolute
}