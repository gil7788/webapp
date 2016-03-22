// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var UTILS = (function () {

	return {
		/**
		 * Check if a given value is a plain Object
		 *
		 * @param  {*}       o Any value to be checked
		 * @return {Boolean}   true if it's an Object
		 */
		isObject: function (o) {
			var toString = Object.prototype.toString;
			return (toString.call(o) === toString.call({}));
		},

		/**
		 * AJAX helper function (similar to jQuery, but far from it!)
		 *
		 * @param {string} url     URL for the ajax request
		 * @param {Object} options AJAX settings
		 */
		ajax: function (url, options) {
			var xhr = new XMLHttpRequest(),
				method = 'GET',
				options = UTILS.isObject(options) ? options : {};

			// Check if "method" was supplied
			if (options.method) {
				method = options.method;
			}

			// Setup the request
			xhr.open(method.toUpperCase(), url);

			xhr.onreadystatechange = function () {
				var status;

				// If request finished
				if (xhr.readyState === 4) {
					status = xhr.status;

					// If response is OK or fetched from cache
					if ((status >= 200 && status < 300) || status === 304) {
						var res = xhr.responseText,
							contentType = xhr.getResponseHeader('Content-Type');

						// If server sent a content type header, handle formats
						if (contentType) {
							// Handle JSON format
							if (contentType === 'text/json' ||
								contentType === 'application/json') {

								// JSON throws an exception on invalid JSON
								try {
									res = JSON.parse(res);
								} catch (err) {
									// Trigger "fail" callback if set
									if (options.fail) {
										options.fail.call(xhr, err);
										return;
									}
								}
							// Handle XML format
							} else if (contentType === 'text/xml' ||
								contentType === 'application/xml') {
								// responseXML returns a document object
								res = xhr.responseXML;

								// if XML was invalid, trigger fail callback
								if (res === null && options.fail) {
									options.fail.call(xhr, 'Bad XML file');
									return;
								}
							}
						}

						// Trigger done callback with the proper response
						if (options.done) {
							options.done.call(xhr, res);
						}
					}

				}
			};

			// Fire the request
			xhr.send(null);
		}
	};
}());
