(function (global) {
	var map = {
		'app': 'build/app'
	};

	var packages = {
		'app': {
			main: 'main.js',
			defaultExtension: 'js'
		}
	};

	System.config({
		map: map,
		packages: packages
	});
})(this);
