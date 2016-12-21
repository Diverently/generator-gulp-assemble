var log = (function (output) {
  'use strict';
	var moduleExport = {},
		  privateVariable = 1;

	function privateMethod() {
		// ...
	}

	moduleExport.moduleProperty = 1;
	moduleExport.out = function (output) {
		console.log(output);
	};

	return moduleExport;
}());
