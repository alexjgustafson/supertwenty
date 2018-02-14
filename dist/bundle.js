/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3)
__webpack_require__(4)
__webpack_require__(5)
__webpack_require__(8)
__webpack_require__(10)

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	var container, button, menu, links, i, len;

	container = document.getElementById( 'site-navigation' );
	if ( ! container ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			menu.setAttribute( 'aria-expanded', 'false' );
		} else {
			container.className += ' toggled';
			button.setAttribute( 'aria-expanded', 'true' );
			menu.setAttribute( 'aria-expanded', 'true' );
		}
	};

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}

	/**
	 * Toggles `focus` class to allow submenu access on tablets.
	 */
	( function( container ) {
		var touchStartFn, i,
			parentLink = container.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

		if ( 'ontouchstart' in window ) {
			touchStartFn = function( e ) {
				var menuItem = this.parentNode, i;

				if ( ! menuItem.classList.contains( 'focus' ) ) {
					e.preventDefault();
					for ( i = 0; i < menuItem.parentNode.children.length; ++i ) {
						if ( menuItem === menuItem.parentNode.children[i] ) {
							continue;
						}
						menuItem.parentNode.children[i].classList.remove( 'focus' );
					}
					menuItem.classList.add( 'focus' );
				} else {
					menuItem.classList.remove( 'focus' );
				}
			};

			for ( i = 0; i < parentLink.length; ++i ) {
				parentLink[i].addEventListener( 'touchstart', touchStartFn, false );
			}
		}
	}( container ) );
} )();


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
( function() {
	var isIe = /(trident|msie)/i.test( navigator.userAgent );

	if ( isIe && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
} )();


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(6);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
		var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*!\nTheme Name: supertwenty\nTheme URI: http://underscores.me/\nAuthor: Alex Gustafson\nAuthor URI: http://alexjgustafson.tech\nDescription: Description\nVersion: 1.0.0\nLicense: GNU General Public License v2 or later\nLicense URI: LICENSE\nText Domain: supertwenty\nTags: custom-background, custom-logo, custom-menu, featured-images, threaded-comments, translation-ready\n\nThis theme, like WordPress, is licensed under the GPL.\nUse it to make something cool, have fun, and share what you've learned with others.\n\nsupertwenty is based on Underscores https://underscores.me/, (C) 2012-2017 Automattic, Inc.\nUnderscores is distributed under the terms of the GNU GPL v2 or later.\n\nNormalizing styles have been helped along thanks to the fine work of\nNicolas Gallagher and Jonathan Neal https://necolas.github.io/normalize.css/\n*/\n/*--------------------------------------------------------------\n>>> TABLE OF CONTENTS:\n----------------------------------------------------------------\n# Normalize\n# Typography\n# Elements\n# Forms\n# Navigation\n\t## Links\n\t## Menus\n# Accessibility\n# Alignments\n# Clearings\n# Widgets\n# Content\n\t## Posts and pages\n\t## Comments\n# Infinite scroll\n# Media\n\t## Captions\n\t## Galleries\n--------------------------------------------------------------*/\n/*--------------------------------------------------------------\n# Normalize\n--------------------------------------------------------------*/\nhtml {\n  font-family: sans-serif;\n  -webkit-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%; }\n\nbody {\n  margin: 0; }\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline; }\n\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n[hidden],\ntemplate {\n  display: none; }\n\na {\n  background-color: transparent; }\n\na:active,\na:hover {\n  outline: 0; }\n\nabbr[title] {\n  border-bottom: 1px dotted; }\n\nb,\nstrong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\nmark {\n  background: #ff0;\n  color: #000; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\nimg {\n  border: 0; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\nfigure {\n  margin: 1em 40px; }\n\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\npre {\n  overflow: auto; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0; }\n\nbutton {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer; }\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\ninput {\n  line-height: normal; }\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\nlegend {\n  border: 0;\n  padding: 0; }\n\ntextarea {\n  overflow: auto; }\n\noptgroup {\n  font-weight: bold; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n/*--------------------------------------------------------------\n# Typography\n--------------------------------------------------------------*/\nbody,\nbutton,\ninput,\nselect,\noptgroup,\ntextarea {\n  color: #404040;\n  font-family: sans-serif;\n  font-size: 16px;\n  font-size: 1rem;\n  line-height: 1.5; }\n\nh1, h2, h3, h4, h5, h6 {\n  clear: both; }\n\np {\n  margin-bottom: 1.5em; }\n\ndfn, cite, em, i {\n  font-style: italic; }\n\nblockquote {\n  margin: 0 1.5em; }\n\naddress {\n  margin: 0 0 1.5em; }\n\npre {\n  background: #eee;\n  font-family: \"Courier 10 Pitch\", Courier, monospace;\n  font-size: 15px;\n  font-size: 0.9375rem;\n  line-height: 1.6;\n  margin-bottom: 1.6em;\n  max-width: 100%;\n  overflow: auto;\n  padding: 1.6em; }\n\ncode, kbd, tt, var {\n  font-family: Monaco, Consolas, \"Andale Mono\", \"DejaVu Sans Mono\", monospace;\n  font-size: 15px;\n  font-size: 0.9375rem; }\n\nabbr, acronym {\n  border-bottom: 1px dotted #666;\n  cursor: help; }\n\nmark, ins {\n  background: #fff9c0;\n  text-decoration: none; }\n\nbig {\n  font-size: 125%; }\n\n/*--------------------------------------------------------------\n# Elements\n--------------------------------------------------------------*/\nhtml {\n  box-sizing: border-box; }\n\n*,\n*:before,\n*:after {\n  /* Inherit box-sizing to make it easier to change the property for components that leverage other behavior; see https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/ */\n  box-sizing: inherit; }\n\nbody {\n  background: #fff;\n  /* Fallback for when there is no custom background color defined. */ }\n\nhr {\n  background-color: #ccc;\n  border: 0;\n  height: 1px;\n  margin-bottom: 1.5em; }\n\nul, ol {\n  margin: 0 0 1.5em 3em; }\n\nul {\n  list-style: disc; }\n\nol {\n  list-style: decimal; }\n\nli > ul,\nli > ol {\n  margin-bottom: 0;\n  margin-left: 1.5em; }\n\ndt {\n  font-weight: bold; }\n\ndd {\n  margin: 0 1.5em 1.5em; }\n\nimg {\n  height: auto;\n  /* Make sure images are scaled correctly. */\n  max-width: 100%;\n  /* Adhere to container width. */ }\n\nfigure {\n  margin: 1em 0;\n  /* Extra wide images within figure tags don't overflow the content area. */ }\n\ntable {\n  margin: 0 0 1.5em;\n  width: 100%; }\n\n/*--------------------------------------------------------------\n# Forms\n--------------------------------------------------------------*/\nbutton,\ninput[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  border: 1px solid;\n  border-color: #ccc #ccc #bbb;\n  border-radius: 3px;\n  background: #e6e6e6;\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 12px;\n  font-size: 0.75rem;\n  line-height: 1;\n  padding: .6em 1em .4em; }\n  button:hover,\n  input[type=\"button\"]:hover,\n  input[type=\"reset\"]:hover,\n  input[type=\"submit\"]:hover {\n    border-color: #ccc #bbb #aaa; }\n  button:active, button:focus,\n  input[type=\"button\"]:active,\n  input[type=\"button\"]:focus,\n  input[type=\"reset\"]:active,\n  input[type=\"reset\"]:focus,\n  input[type=\"submit\"]:active,\n  input[type=\"submit\"]:focus {\n    border-color: #aaa #bbb #bbb; }\n\ninput[type=\"text\"],\ninput[type=\"email\"],\ninput[type=\"url\"],\ninput[type=\"password\"],\ninput[type=\"search\"],\ninput[type=\"number\"],\ninput[type=\"tel\"],\ninput[type=\"range\"],\ninput[type=\"date\"],\ninput[type=\"month\"],\ninput[type=\"week\"],\ninput[type=\"time\"],\ninput[type=\"datetime\"],\ninput[type=\"datetime-local\"],\ninput[type=\"color\"],\ntextarea {\n  color: #666;\n  border: 1px solid #ccc;\n  border-radius: 3px;\n  padding: 3px; }\n  input[type=\"text\"]:focus,\n  input[type=\"email\"]:focus,\n  input[type=\"url\"]:focus,\n  input[type=\"password\"]:focus,\n  input[type=\"search\"]:focus,\n  input[type=\"number\"]:focus,\n  input[type=\"tel\"]:focus,\n  input[type=\"range\"]:focus,\n  input[type=\"date\"]:focus,\n  input[type=\"month\"]:focus,\n  input[type=\"week\"]:focus,\n  input[type=\"time\"]:focus,\n  input[type=\"datetime\"]:focus,\n  input[type=\"datetime-local\"]:focus,\n  input[type=\"color\"]:focus,\n  textarea:focus {\n    color: #111; }\n\nselect {\n  border: 1px solid #ccc; }\n\ntextarea {\n  width: 100%; }\n\n/*--------------------------------------------------------------\n# Navigation\n--------------------------------------------------------------*/\n/*--------------------------------------------------------------\n## Links\n--------------------------------------------------------------*/\na {\n  color: royalblue; }\n  a:visited {\n    color: purple; }\n  a:hover, a:focus, a:active {\n    color: midnightblue; }\n  a:focus {\n    outline: thin dotted; }\n  a:hover, a:active {\n    outline: 0; }\n\n/*--------------------------------------------------------------\n## Menus\n--------------------------------------------------------------*/\n.main-navigation {\n  clear: both;\n  display: block;\n  float: left;\n  width: 100%; }\n  .main-navigation ul {\n    display: none;\n    list-style: none;\n    margin: 0;\n    padding-left: 0; }\n    .main-navigation ul ul {\n      box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);\n      float: left;\n      position: absolute;\n      top: 100%;\n      left: -999em;\n      z-index: 99999; }\n      .main-navigation ul ul ul {\n        left: -999em;\n        top: 0; }\n      .main-navigation ul ul li:hover > ul,\n      .main-navigation ul ul li.focus > ul {\n        left: 100%; }\n      .main-navigation ul ul a {\n        width: 200px; }\n    .main-navigation ul li:hover > ul,\n    .main-navigation ul li.focus > ul {\n      left: auto; }\n  .main-navigation li {\n    float: left;\n    position: relative; }\n  .main-navigation a {\n    display: block;\n    text-decoration: none; }\n\n/* Small menu. */\n.menu-toggle,\n.main-navigation.toggled ul {\n  display: block; }\n\n@media screen and (min-width: 37.5em) {\n  .menu-toggle {\n    display: none; }\n  .main-navigation ul {\n    display: block; } }\n\n.site-main .comment-navigation, .site-main\n.posts-navigation, .site-main\n.post-navigation {\n  margin: 0 0 1.5em;\n  overflow: hidden; }\n\n.comment-navigation .nav-previous,\n.posts-navigation .nav-previous,\n.post-navigation .nav-previous {\n  float: left;\n  width: 50%; }\n\n.comment-navigation .nav-next,\n.posts-navigation .nav-next,\n.post-navigation .nav-next {\n  float: right;\n  text-align: right;\n  width: 50%; }\n\n/*--------------------------------------------------------------\n# Accessibility\n--------------------------------------------------------------*/\n/* Text meant only for screen readers. */\n.screen-reader-text {\n  border: 0;\n  clip: rect(1px, 1px, 1px, 1px);\n  clip-path: inset(50%);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute !important;\n  width: 1px;\n  word-wrap: normal !important;\n  /* Many screen reader and browser combinations announce broken words as they would appear visually. */ }\n  .screen-reader-text:focus {\n    background-color: #f1f1f1;\n    border-radius: 3px;\n    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);\n    clip: auto !important;\n    clip-path: none;\n    color: #21759b;\n    display: block;\n    font-size: 14px;\n    font-size: 0.875rem;\n    font-weight: bold;\n    height: auto;\n    left: 5px;\n    line-height: normal;\n    padding: 15px 23px 14px;\n    text-decoration: none;\n    top: 5px;\n    width: auto;\n    z-index: 100000;\n    /* Above WP toolbar. */ }\n\n/* Do not show the outline on the skip link target. */\n#content[tabindex=\"-1\"]:focus {\n  outline: 0; }\n\n/*--------------------------------------------------------------\n# Alignments\n--------------------------------------------------------------*/\n.alignleft {\n  display: inline;\n  float: left;\n  margin-right: 1.5em; }\n\n.alignright {\n  display: inline;\n  float: right;\n  margin-left: 1.5em; }\n\n.aligncenter {\n  clear: both;\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n/*--------------------------------------------------------------\n# Clearings\n--------------------------------------------------------------*/\n.clear:before,\n.clear:after,\n.entry-content:before,\n.entry-content:after,\n.comment-content:before,\n.comment-content:after,\n.site-header:before,\n.site-header:after,\n.site-content:before,\n.site-content:after,\n.site-footer:before,\n.site-footer:after {\n  content: \"\";\n  display: table;\n  table-layout: fixed; }\n\n.clear:after,\n.entry-content:after,\n.comment-content:after,\n.site-header:after,\n.site-content:after,\n.site-footer:after {\n  clear: both; }\n\n/*--------------------------------------------------------------\n# Widgets\n--------------------------------------------------------------*/\n.widget {\n  margin: 0 0 1.5em;\n  /* Make sure select elements fit in widgets. */ }\n  .widget select {\n    max-width: 100%; }\n\n/*--------------------------------------------------------------\n# Content\n--------------------------------------------------------------*/\n/*--------------------------------------------------------------\n## Posts and pages\n--------------------------------------------------------------*/\n.sticky {\n  display: block; }\n\n.hentry {\n  margin: 0 0 1.5em; }\n\n.updated:not(.published) {\n  display: none; }\n\n.page-content,\n.entry-content,\n.entry-summary {\n  margin: 1.5em 0 0; }\n\n.page-links {\n  clear: both;\n  margin: 0 0 1.5em; }\n\n/*--------------------------------------------------------------\n## Comments\n--------------------------------------------------------------*/\n.comment-content a {\n  word-wrap: break-word; }\n\n.bypostauthor {\n  display: block; }\n\n/*--------------------------------------------------------------\n# Infinite scroll\n--------------------------------------------------------------*/\n/* Globally hidden elements when Infinite Scroll is supported and in use. */\n.infinite-scroll .posts-navigation,\n.infinite-scroll.neverending .site-footer {\n  /* Theme Footer (when set to scrolling) */\n  display: none; }\n\n/* When Infinite Scroll has reached its end we need to re-display elements that were hidden (via .neverending) before. */\n.infinity-end.neverending .site-footer {\n  display: block; }\n\n/*--------------------------------------------------------------\n# Media\n--------------------------------------------------------------*/\n.page-content .wp-smiley,\n.entry-content .wp-smiley,\n.comment-content .wp-smiley {\n  border: none;\n  margin-bottom: 0;\n  margin-top: 0;\n  padding: 0; }\n\n/* Make sure embeds and iframes fit their containers. */\nembed,\niframe,\nobject {\n  max-width: 100%; }\n\n/* Make sure logo link wraps around logo image. */\n.custom-logo-link {\n  display: inline-block; }\n\n/*--------------------------------------------------------------\n## Captions\n--------------------------------------------------------------*/\n.wp-caption {\n  margin-bottom: 1.5em;\n  max-width: 100%; }\n  .wp-caption img[class*=\"wp-image-\"] {\n    display: block;\n    margin-left: auto;\n    margin-right: auto; }\n  .wp-caption .wp-caption-text {\n    margin: 0.8075em 0; }\n\n.wp-caption-text {\n  text-align: center; }\n\n/*--------------------------------------------------------------\n## Galleries\n--------------------------------------------------------------*/\n.gallery {\n  margin-bottom: 1.5em; }\n\n.gallery-item {\n  display: inline-block;\n  text-align: center;\n  vertical-align: top;\n  width: 100%; }\n  .gallery-columns-2 .gallery-item {\n    max-width: 50%; }\n  .gallery-columns-3 .gallery-item {\n    max-width: 33.33%; }\n  .gallery-columns-4 .gallery-item {\n    max-width: 25%; }\n  .gallery-columns-5 .gallery-item {\n    max-width: 20%; }\n  .gallery-columns-6 .gallery-item {\n    max-width: 16.66%; }\n  .gallery-columns-7 .gallery-item {\n    max-width: 14.28%; }\n  .gallery-columns-8 .gallery-item {\n    max-width: 12.5%; }\n  .gallery-columns-9 .gallery-item {\n    max-width: 11.11%; }\n\n.gallery-caption {\n  display: block; }\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(9);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!./node_modules/css-loader/index.js!./style.css", function() {
		var newContent = require("!!./node_modules/css-loader/index.js!./style.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*!\nTheme Name: supertwenty\nTheme URI: http://underscores.me/\nAuthor: Alex Gustafson\nAuthor URI: http://alexjgustafson.tech\nDescription: Description\nVersion: 1.0.0\nLicense: GNU General Public License v2 or later\nLicense URI: LICENSE\nText Domain: supertwenty\nTags: custom-background, custom-logo, custom-menu, featured-images, threaded-comments, translation-ready\n\nThis theme, like WordPress, is licensed under the GPL.\nUse it to make something cool, have fun, and share what you've learned with others.\n\nsupertwenty is based on Underscores https://underscores.me/, (C) 2012-2017 Automattic, Inc.\nUnderscores is distributed under the terms of the GNU GPL v2 or later.\n\nNormalizing styles have been helped along thanks to the fine work of\nNicolas Gallagher and Jonathan Neal https://necolas.github.io/normalize.css/\n*/\n/*--------------------------------------------------------------\n>>> TABLE OF CONTENTS:\n----------------------------------------------------------------\n# Normalize\n# Typography\n# Elements\n# Forms\n# Navigation\n\t## Links\n\t## Menus\n# Accessibility\n# Alignments\n# Clearings\n# Widgets\n# Content\n\t## Posts and pages\n\t## Comments\n# Infinite scroll\n# Media\n\t## Captions\n\t## Galleries\n--------------------------------------------------------------*/\n/*--------------------------------------------------------------\n# Normalize\n--------------------------------------------------------------*/\nhtml {\n\tfont-family: sans-serif;\n\t-webkit-text-size-adjust: 100%;\n\t-ms-text-size-adjust: 100%;\n}\n\nbody {\n\tmargin: 0;\n}\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n\tdisplay: block;\n}\n\naudio,\ncanvas,\nprogress,\nvideo {\n\tdisplay: inline-block;\n\tvertical-align: baseline;\n}\n\naudio:not([controls]) {\n\tdisplay: none;\n\theight: 0;\n}\n\n[hidden],\ntemplate {\n\tdisplay: none;\n}\n\na {\n\tbackground-color: transparent;\n}\n\na:active,\na:hover {\n\toutline: 0;\n}\n\nabbr[title] {\n\tborder-bottom: 1px dotted;\n}\n\nb,\nstrong {\n\tfont-weight: bold;\n}\n\ndfn {\n\tfont-style: italic;\n}\n\nh1 {\n\tfont-size: 2em;\n\tmargin: 0.67em 0;\n}\n\nmark {\n\tbackground: #ff0;\n\tcolor: #000;\n}\n\nsmall {\n\tfont-size: 80%;\n}\n\nsub,\nsup {\n\tfont-size: 75%;\n\tline-height: 0;\n\tposition: relative;\n\tvertical-align: baseline;\n}\n\nsup {\n\ttop: -0.5em;\n}\n\nsub {\n\tbottom: -0.25em;\n}\n\nimg {\n\tborder: 0;\n}\n\nsvg:not(:root) {\n\toverflow: hidden;\n}\n\nfigure {\n\tmargin: 1em 40px;\n}\n\nhr {\n\tbox-sizing: content-box;\n\theight: 0;\n}\n\npre {\n\toverflow: auto;\n}\n\ncode,\nkbd,\npre,\nsamp {\n\tfont-family: monospace, monospace;\n\tfont-size: 1em;\n}\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n\tcolor: inherit;\n\tfont: inherit;\n\tmargin: 0;\n}\n\nbutton {\n\toverflow: visible;\n}\n\nbutton,\nselect {\n\ttext-transform: none;\n}\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n\t-webkit-appearance: button;\n\tcursor: pointer;\n}\n\nbutton[disabled],\nhtml input[disabled] {\n\tcursor: default;\n}\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n\tborder: 0;\n\tpadding: 0;\n}\n\ninput {\n\tline-height: normal;\n}\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n\tbox-sizing: border-box;\n\tpadding: 0;\n}\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n\theight: auto;\n}\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n\t-webkit-appearance: none;\n}\n\nfieldset {\n\tborder: 1px solid #c0c0c0;\n\tmargin: 0 2px;\n\tpadding: 0.35em 0.625em 0.75em;\n}\n\nlegend {\n\tborder: 0;\n\tpadding: 0;\n}\n\ntextarea {\n\toverflow: auto;\n}\n\noptgroup {\n\tfont-weight: bold;\n}\n\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\n\ntd,\nth {\n\tpadding: 0;\n}\n\n/*--------------------------------------------------------------\n# Typography\n--------------------------------------------------------------*/\nbody,\nbutton,\ninput,\nselect,\noptgroup,\ntextarea {\n\tcolor: #404040;\n\tfont-family: sans-serif;\n\tfont-size: 16px;\n\tfont-size: 1rem;\n\tline-height: 1.5;\n}\n\nh1, h2, h3, h4, h5, h6 {\n\tclear: both;\n}\n\np {\n\tmargin-bottom: 1.5em;\n}\n\ndfn, cite, em, i {\n\tfont-style: italic;\n}\n\nblockquote {\n\tmargin: 0 1.5em;\n}\n\naddress {\n\tmargin: 0 0 1.5em;\n}\n\npre {\n\tbackground: #eee;\n\tfont-family: \"Courier 10 Pitch\", Courier, monospace;\n\tfont-size: 15px;\n\tfont-size: 0.9375rem;\n\tline-height: 1.6;\n\tmargin-bottom: 1.6em;\n\tmax-width: 100%;\n\toverflow: auto;\n\tpadding: 1.6em;\n}\n\ncode, kbd, tt, var {\n\tfont-family: Monaco, Consolas, \"Andale Mono\", \"DejaVu Sans Mono\", monospace;\n\tfont-size: 15px;\n\tfont-size: 0.9375rem;\n}\n\nabbr, acronym {\n\tborder-bottom: 1px dotted #666;\n\tcursor: help;\n}\n\nmark, ins {\n\tbackground: #fff9c0;\n\ttext-decoration: none;\n}\n\nbig {\n\tfont-size: 125%;\n}\n\n/*--------------------------------------------------------------\n# Elements\n--------------------------------------------------------------*/\nhtml {\n\tbox-sizing: border-box;\n}\n\n*,\n*:before,\n*:after {\n\t/* Inherit box-sizing to make it easier to change the property for components that leverage other behavior; see https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/ */\n\tbox-sizing: inherit;\n}\n\nbody {\n\tbackground: #fff;\n\t/* Fallback for when there is no custom background color defined. */\n}\n\nhr {\n\tbackground-color: #ccc;\n\tborder: 0;\n\theight: 1px;\n\tmargin-bottom: 1.5em;\n}\n\nul, ol {\n\tmargin: 0 0 1.5em 3em;\n}\n\nul {\n\tlist-style: disc;\n}\n\nol {\n\tlist-style: decimal;\n}\n\nli > ul,\nli > ol {\n\tmargin-bottom: 0;\n\tmargin-left: 1.5em;\n}\n\ndt {\n\tfont-weight: bold;\n}\n\ndd {\n\tmargin: 0 1.5em 1.5em;\n}\n\nimg {\n\theight: auto;\n\t/* Make sure images are scaled correctly. */\n\tmax-width: 100%;\n\t/* Adhere to container width. */\n}\n\nfigure {\n\tmargin: 1em 0;\n\t/* Extra wide images within figure tags don't overflow the content area. */\n}\n\ntable {\n\tmargin: 0 0 1.5em;\n\twidth: 100%;\n}\n\n/*--------------------------------------------------------------\n# Forms\n--------------------------------------------------------------*/\nbutton,\ninput[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n\tborder: 1px solid;\n\tborder-color: #ccc #ccc #bbb;\n\tborder-radius: 3px;\n\tbackground: #e6e6e6;\n\tcolor: rgba(0, 0, 0, 0.8);\n\tfont-size: 12px;\n\tfont-size: 0.75rem;\n\tline-height: 1;\n\tpadding: .6em 1em .4em;\n}\n\nbutton:hover,\ninput[type=\"button\"]:hover,\ninput[type=\"reset\"]:hover,\ninput[type=\"submit\"]:hover {\n\tborder-color: #ccc #bbb #aaa;\n}\n\nbutton:active, button:focus,\ninput[type=\"button\"]:active,\ninput[type=\"button\"]:focus,\ninput[type=\"reset\"]:active,\ninput[type=\"reset\"]:focus,\ninput[type=\"submit\"]:active,\ninput[type=\"submit\"]:focus {\n\tborder-color: #aaa #bbb #bbb;\n}\n\ninput[type=\"text\"],\ninput[type=\"email\"],\ninput[type=\"url\"],\ninput[type=\"password\"],\ninput[type=\"search\"],\ninput[type=\"number\"],\ninput[type=\"tel\"],\ninput[type=\"range\"],\ninput[type=\"date\"],\ninput[type=\"month\"],\ninput[type=\"week\"],\ninput[type=\"time\"],\ninput[type=\"datetime\"],\ninput[type=\"datetime-local\"],\ninput[type=\"color\"],\ntextarea {\n\tcolor: #666;\n\tborder: 1px solid #ccc;\n\tborder-radius: 3px;\n\tpadding: 3px;\n}\n\ninput[type=\"text\"]:focus,\ninput[type=\"email\"]:focus,\ninput[type=\"url\"]:focus,\ninput[type=\"password\"]:focus,\ninput[type=\"search\"]:focus,\ninput[type=\"number\"]:focus,\ninput[type=\"tel\"]:focus,\ninput[type=\"range\"]:focus,\ninput[type=\"date\"]:focus,\ninput[type=\"month\"]:focus,\ninput[type=\"week\"]:focus,\ninput[type=\"time\"]:focus,\ninput[type=\"datetime\"]:focus,\ninput[type=\"datetime-local\"]:focus,\ninput[type=\"color\"]:focus,\ntextarea:focus {\n\tcolor: #111;\n}\n\nselect {\n\tborder: 1px solid #ccc;\n}\n\ntextarea {\n\twidth: 100%;\n}\n\n/*--------------------------------------------------------------\n# Navigation\n--------------------------------------------------------------*/\n/*--------------------------------------------------------------\n## Links\n--------------------------------------------------------------*/\na {\n\tcolor: royalblue;\n}\n\na:visited {\n\tcolor: purple;\n}\n\na:hover, a:focus, a:active {\n\tcolor: midnightblue;\n}\n\na:focus {\n\toutline: thin dotted;\n}\n\na:hover, a:active {\n\toutline: 0;\n}\n\n/*--------------------------------------------------------------\n## Menus\n--------------------------------------------------------------*/\n.main-navigation {\n\tclear: both;\n\tdisplay: block;\n\tfloat: left;\n\twidth: 100%;\n}\n\n.main-navigation ul {\n\tdisplay: none;\n\tlist-style: none;\n\tmargin: 0;\n\tpadding-left: 0;\n}\n\n.main-navigation ul ul {\n\tbox-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);\n\tfloat: left;\n\tposition: absolute;\n\ttop: 100%;\n\tleft: -999em;\n\tz-index: 99999;\n}\n\n.main-navigation ul ul ul {\n\tleft: -999em;\n\ttop: 0;\n}\n\n.main-navigation ul ul li:hover > ul,\n.main-navigation ul ul li.focus > ul {\n\tleft: 100%;\n}\n\n.main-navigation ul ul a {\n\twidth: 200px;\n}\n\n.main-navigation ul li:hover > ul,\n.main-navigation ul li.focus > ul {\n\tleft: auto;\n}\n\n.main-navigation li {\n\tfloat: left;\n\tposition: relative;\n}\n\n.main-navigation a {\n\tdisplay: block;\n\ttext-decoration: none;\n}\n\n/* Small menu. */\n.menu-toggle,\n.main-navigation.toggled ul {\n\tdisplay: block;\n}\n\n@media screen and (min-width: 37.5em) {\n\t.menu-toggle {\n\t\tdisplay: none;\n\t}\n\t.main-navigation ul {\n\t\tdisplay: block;\n\t}\n}\n\n.site-main .comment-navigation, .site-main\n.posts-navigation, .site-main\n.post-navigation {\n\tmargin: 0 0 1.5em;\n\toverflow: hidden;\n}\n\n.comment-navigation .nav-previous,\n.posts-navigation .nav-previous,\n.post-navigation .nav-previous {\n\tfloat: left;\n\twidth: 50%;\n}\n\n.comment-navigation .nav-next,\n.posts-navigation .nav-next,\n.post-navigation .nav-next {\n\tfloat: right;\n\ttext-align: right;\n\twidth: 50%;\n}\n\n/*--------------------------------------------------------------\n# Accessibility\n--------------------------------------------------------------*/\n/* Text meant only for screen readers. */\n.screen-reader-text {\n\tborder: 0;\n\tclip: rect(1px, 1px, 1px, 1px);\n\tclip-path: inset(50%);\n\theight: 1px;\n\tmargin: -1px;\n\toverflow: hidden;\n\tpadding: 0;\n\tposition: absolute !important;\n\twidth: 1px;\n\tword-wrap: normal !important; /* Many screen reader and browser combinations announce broken words as they would appear visually. */\n}\n\n.screen-reader-text:focus {\n\tbackground-color: #f1f1f1;\n\tborder-radius: 3px;\n\tbox-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);\n\tclip: auto !important;\n\tclip-path: none;\n\tcolor: #21759b;\n\tdisplay: block;\n\tfont-size: 14px;\n\tfont-size: 0.875rem;\n\tfont-weight: bold;\n\theight: auto;\n\tleft: 5px;\n\tline-height: normal;\n\tpadding: 15px 23px 14px;\n\ttext-decoration: none;\n\ttop: 5px;\n\twidth: auto;\n\tz-index: 100000;\n\t/* Above WP toolbar. */\n}\n\n/* Do not show the outline on the skip link target. */\n#content[tabindex=\"-1\"]:focus {\n\toutline: 0;\n}\n\n/*--------------------------------------------------------------\n# Alignments\n--------------------------------------------------------------*/\n.alignleft {\n\tdisplay: inline;\n\tfloat: left;\n\tmargin-right: 1.5em;\n}\n\n.alignright {\n\tdisplay: inline;\n\tfloat: right;\n\tmargin-left: 1.5em;\n}\n\n.aligncenter {\n\tclear: both;\n\tdisplay: block;\n\tmargin-left: auto;\n\tmargin-right: auto;\n}\n\n/*--------------------------------------------------------------\n# Clearings\n--------------------------------------------------------------*/\n.clear:before,\n.clear:after,\n.entry-content:before,\n.entry-content:after,\n.comment-content:before,\n.comment-content:after,\n.site-header:before,\n.site-header:after,\n.site-content:before,\n.site-content:after,\n.site-footer:before,\n.site-footer:after {\n\tcontent: \"\";\n\tdisplay: table;\n\ttable-layout: fixed;\n}\n\n.clear:after,\n.entry-content:after,\n.comment-content:after,\n.site-header:after,\n.site-content:after,\n.site-footer:after {\n\tclear: both;\n}\n\n/*--------------------------------------------------------------\n# Widgets\n--------------------------------------------------------------*/\n.widget {\n\tmargin: 0 0 1.5em;\n\t/* Make sure select elements fit in widgets. */\n}\n\n.widget select {\n\tmax-width: 100%;\n}\n\n/*--------------------------------------------------------------\n# Content\n--------------------------------------------------------------*/\n/*--------------------------------------------------------------\n## Posts and pages\n--------------------------------------------------------------*/\n.sticky {\n\tdisplay: block;\n}\n\n.hentry {\n\tmargin: 0 0 1.5em;\n}\n\n.updated:not(.published) {\n\tdisplay: none;\n}\n\n.page-content,\n.entry-content,\n.entry-summary {\n\tmargin: 1.5em 0 0;\n}\n\n.page-links {\n\tclear: both;\n\tmargin: 0 0 1.5em;\n}\n\n/*--------------------------------------------------------------\n## Comments\n--------------------------------------------------------------*/\n.comment-content a {\n\tword-wrap: break-word;\n}\n\n.bypostauthor {\n\tdisplay: block;\n}\n\n/*--------------------------------------------------------------\n# Infinite scroll\n--------------------------------------------------------------*/\n/* Globally hidden elements when Infinite Scroll is supported and in use. */\n.infinite-scroll .posts-navigation,\n.infinite-scroll.neverending .site-footer {\n\t/* Theme Footer (when set to scrolling) */\n\tdisplay: none;\n}\n\n/* When Infinite Scroll has reached its end we need to re-display elements that were hidden (via .neverending) before. */\n.infinity-end.neverending .site-footer {\n\tdisplay: block;\n}\n\n/*--------------------------------------------------------------\n# Media\n--------------------------------------------------------------*/\n.page-content .wp-smiley,\n.entry-content .wp-smiley,\n.comment-content .wp-smiley {\n\tborder: none;\n\tmargin-bottom: 0;\n\tmargin-top: 0;\n\tpadding: 0;\n}\n\n/* Make sure embeds and iframes fit their containers. */\nembed,\niframe,\nobject {\n\tmax-width: 100%;\n}\n\n/* Make sure logo link wraps around logo image. */\n.custom-logo-link {\n\tdisplay: inline-block;\n}\n\n/*--------------------------------------------------------------\n## Captions\n--------------------------------------------------------------*/\n.wp-caption {\n\tmargin-bottom: 1.5em;\n\tmax-width: 100%;\n}\n\n.wp-caption img[class*=\"wp-image-\"] {\n\tdisplay: block;\n\tmargin-left: auto;\n\tmargin-right: auto;\n}\n\n.wp-caption .wp-caption-text {\n\tmargin: 0.8075em 0;\n}\n\n.wp-caption-text {\n\ttext-align: center;\n}\n\n/*--------------------------------------------------------------\n## Galleries\n--------------------------------------------------------------*/\n.gallery {\n\tmargin-bottom: 1.5em;\n}\n\n.gallery-item {\n\tdisplay: inline-block;\n\ttext-align: center;\n\tvertical-align: top;\n\twidth: 100%;\n}\n\n.gallery-columns-2 .gallery-item {\n\tmax-width: 50%;\n}\n\n.gallery-columns-3 .gallery-item {\n\tmax-width: 33.33%;\n}\n\n.gallery-columns-4 .gallery-item {\n\tmax-width: 25%;\n}\n\n.gallery-columns-5 .gallery-item {\n\tmax-width: 20%;\n}\n\n.gallery-columns-6 .gallery-item {\n\tmax-width: 16.66%;\n}\n\n.gallery-columns-7 .gallery-item {\n\tmax-width: 14.28%;\n}\n\n.gallery-columns-8 .gallery-item {\n\tmax-width: 12.5%;\n}\n\n.gallery-columns-9 .gallery-item {\n\tmax-width: 11.11%;\n}\n\n.gallery-caption {\n\tdisplay: block;\n}\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(11)(__webpack_require__(12))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "/*\n     _ _      _       _\n ___| (_) ___| | __  (_)___\n/ __| | |/ __| |/ /  | / __|\n\\__ \\ | | (__|   < _ | \\__ \\\n|___/_|_|\\___|_|\\_(_)/ |___/\n                   |__/\n\n Version: 1.8.1\n  Author: Ken Wheeler\n Website: http://kenwheeler.github.io\n    Docs: http://kenwheeler.github.io/slick\n    Repo: http://github.com/kenwheeler/slick\n  Issues: http://github.com/kenwheeler/slick/issues\n\n */\n/* global window, document, define, jQuery, setInterval, clearInterval */\n;(function(factory) {\n    'use strict';\n    if (typeof define === 'function' && define.amd) {\n        define(['jquery'], factory);\n    } else if (typeof exports !== 'undefined') {\n        module.exports = factory(require('jquery'));\n    } else {\n        factory(jQuery);\n    }\n\n}(function($) {\n    'use strict';\n    var Slick = window.Slick || {};\n\n    Slick = (function() {\n\n        var instanceUid = 0;\n\n        function Slick(element, settings) {\n\n            var _ = this, dataSettings;\n\n            _.defaults = {\n                accessibility: true,\n                adaptiveHeight: false,\n                appendArrows: $(element),\n                appendDots: $(element),\n                arrows: true,\n                asNavFor: null,\n                prevArrow: '<button class=\"slick-prev\" aria-label=\"Previous\" type=\"button\">Previous</button>',\n                nextArrow: '<button class=\"slick-next\" aria-label=\"Next\" type=\"button\">Next</button>',\n                autoplay: false,\n                autoplaySpeed: 3000,\n                centerMode: false,\n                centerPadding: '50px',\n                cssEase: 'ease',\n                customPaging: function(slider, i) {\n                    return $('<button type=\"button\" />').text(i + 1);\n                },\n                dots: false,\n                dotsClass: 'slick-dots',\n                draggable: true,\n                easing: 'linear',\n                edgeFriction: 0.35,\n                fade: false,\n                focusOnSelect: false,\n                focusOnChange: false,\n                infinite: true,\n                initialSlide: 0,\n                lazyLoad: 'ondemand',\n                mobileFirst: false,\n                pauseOnHover: true,\n                pauseOnFocus: true,\n                pauseOnDotsHover: false,\n                respondTo: 'window',\n                responsive: null,\n                rows: 1,\n                rtl: false,\n                slide: '',\n                slidesPerRow: 1,\n                slidesToShow: 1,\n                slidesToScroll: 1,\n                speed: 500,\n                swipe: true,\n                swipeToSlide: false,\n                touchMove: true,\n                touchThreshold: 5,\n                useCSS: true,\n                useTransform: true,\n                variableWidth: false,\n                vertical: false,\n                verticalSwiping: false,\n                waitForAnimate: true,\n                zIndex: 1000\n            };\n\n            _.initials = {\n                animating: false,\n                dragging: false,\n                autoPlayTimer: null,\n                currentDirection: 0,\n                currentLeft: null,\n                currentSlide: 0,\n                direction: 1,\n                $dots: null,\n                listWidth: null,\n                listHeight: null,\n                loadIndex: 0,\n                $nextArrow: null,\n                $prevArrow: null,\n                scrolling: false,\n                slideCount: null,\n                slideWidth: null,\n                $slideTrack: null,\n                $slides: null,\n                sliding: false,\n                slideOffset: 0,\n                swipeLeft: null,\n                swiping: false,\n                $list: null,\n                touchObject: {},\n                transformsEnabled: false,\n                unslicked: false\n            };\n\n            $.extend(_, _.initials);\n\n            _.activeBreakpoint = null;\n            _.animType = null;\n            _.animProp = null;\n            _.breakpoints = [];\n            _.breakpointSettings = [];\n            _.cssTransitions = false;\n            _.focussed = false;\n            _.interrupted = false;\n            _.hidden = 'hidden';\n            _.paused = true;\n            _.positionProp = null;\n            _.respondTo = null;\n            _.rowCount = 1;\n            _.shouldClick = true;\n            _.$slider = $(element);\n            _.$slidesCache = null;\n            _.transformType = null;\n            _.transitionType = null;\n            _.visibilityChange = 'visibilitychange';\n            _.windowWidth = 0;\n            _.windowTimer = null;\n\n            dataSettings = $(element).data('slick') || {};\n\n            _.options = $.extend({}, _.defaults, settings, dataSettings);\n\n            _.currentSlide = _.options.initialSlide;\n\n            _.originalSettings = _.options;\n\n            if (typeof document.mozHidden !== 'undefined') {\n                _.hidden = 'mozHidden';\n                _.visibilityChange = 'mozvisibilitychange';\n            } else if (typeof document.webkitHidden !== 'undefined') {\n                _.hidden = 'webkitHidden';\n                _.visibilityChange = 'webkitvisibilitychange';\n            }\n\n            _.autoPlay = $.proxy(_.autoPlay, _);\n            _.autoPlayClear = $.proxy(_.autoPlayClear, _);\n            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);\n            _.changeSlide = $.proxy(_.changeSlide, _);\n            _.clickHandler = $.proxy(_.clickHandler, _);\n            _.selectHandler = $.proxy(_.selectHandler, _);\n            _.setPosition = $.proxy(_.setPosition, _);\n            _.swipeHandler = $.proxy(_.swipeHandler, _);\n            _.dragHandler = $.proxy(_.dragHandler, _);\n            _.keyHandler = $.proxy(_.keyHandler, _);\n\n            _.instanceUid = instanceUid++;\n\n            // A simple way to check for HTML strings\n            // Strict HTML recognition (must start with <)\n            // Extracted from jQuery v1.11 source\n            _.htmlExpr = /^(?:\\s*(<[\\w\\W]+>)[^>]*)$/;\n\n\n            _.registerBreakpoints();\n            _.init(true);\n\n        }\n\n        return Slick;\n\n    }());\n\n    Slick.prototype.activateADA = function() {\n        var _ = this;\n\n        _.$slideTrack.find('.slick-active').attr({\n            'aria-hidden': 'false'\n        }).find('a, input, button, select').attr({\n            'tabindex': '0'\n        });\n\n    };\n\n    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {\n\n        var _ = this;\n\n        if (typeof(index) === 'boolean') {\n            addBefore = index;\n            index = null;\n        } else if (index < 0 || (index >= _.slideCount)) {\n            return false;\n        }\n\n        _.unload();\n\n        if (typeof(index) === 'number') {\n            if (index === 0 && _.$slides.length === 0) {\n                $(markup).appendTo(_.$slideTrack);\n            } else if (addBefore) {\n                $(markup).insertBefore(_.$slides.eq(index));\n            } else {\n                $(markup).insertAfter(_.$slides.eq(index));\n            }\n        } else {\n            if (addBefore === true) {\n                $(markup).prependTo(_.$slideTrack);\n            } else {\n                $(markup).appendTo(_.$slideTrack);\n            }\n        }\n\n        _.$slides = _.$slideTrack.children(this.options.slide);\n\n        _.$slideTrack.children(this.options.slide).detach();\n\n        _.$slideTrack.append(_.$slides);\n\n        _.$slides.each(function(index, element) {\n            $(element).attr('data-slick-index', index);\n        });\n\n        _.$slidesCache = _.$slides;\n\n        _.reinit();\n\n    };\n\n    Slick.prototype.animateHeight = function() {\n        var _ = this;\n        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {\n            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);\n            _.$list.animate({\n                height: targetHeight\n            }, _.options.speed);\n        }\n    };\n\n    Slick.prototype.animateSlide = function(targetLeft, callback) {\n\n        var animProps = {},\n            _ = this;\n\n        _.animateHeight();\n\n        if (_.options.rtl === true && _.options.vertical === false) {\n            targetLeft = -targetLeft;\n        }\n        if (_.transformsEnabled === false) {\n            if (_.options.vertical === false) {\n                _.$slideTrack.animate({\n                    left: targetLeft\n                }, _.options.speed, _.options.easing, callback);\n            } else {\n                _.$slideTrack.animate({\n                    top: targetLeft\n                }, _.options.speed, _.options.easing, callback);\n            }\n\n        } else {\n\n            if (_.cssTransitions === false) {\n                if (_.options.rtl === true) {\n                    _.currentLeft = -(_.currentLeft);\n                }\n                $({\n                    animStart: _.currentLeft\n                }).animate({\n                    animStart: targetLeft\n                }, {\n                    duration: _.options.speed,\n                    easing: _.options.easing,\n                    step: function(now) {\n                        now = Math.ceil(now);\n                        if (_.options.vertical === false) {\n                            animProps[_.animType] = 'translate(' +\n                                now + 'px, 0px)';\n                            _.$slideTrack.css(animProps);\n                        } else {\n                            animProps[_.animType] = 'translate(0px,' +\n                                now + 'px)';\n                            _.$slideTrack.css(animProps);\n                        }\n                    },\n                    complete: function() {\n                        if (callback) {\n                            callback.call();\n                        }\n                    }\n                });\n\n            } else {\n\n                _.applyTransition();\n                targetLeft = Math.ceil(targetLeft);\n\n                if (_.options.vertical === false) {\n                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';\n                } else {\n                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';\n                }\n                _.$slideTrack.css(animProps);\n\n                if (callback) {\n                    setTimeout(function() {\n\n                        _.disableTransition();\n\n                        callback.call();\n                    }, _.options.speed);\n                }\n\n            }\n\n        }\n\n    };\n\n    Slick.prototype.getNavTarget = function() {\n\n        var _ = this,\n            asNavFor = _.options.asNavFor;\n\n        if ( asNavFor && asNavFor !== null ) {\n            asNavFor = $(asNavFor).not(_.$slider);\n        }\n\n        return asNavFor;\n\n    };\n\n    Slick.prototype.asNavFor = function(index) {\n\n        var _ = this,\n            asNavFor = _.getNavTarget();\n\n        if ( asNavFor !== null && typeof asNavFor === 'object' ) {\n            asNavFor.each(function() {\n                var target = $(this).slick('getSlick');\n                if(!target.unslicked) {\n                    target.slideHandler(index, true);\n                }\n            });\n        }\n\n    };\n\n    Slick.prototype.applyTransition = function(slide) {\n\n        var _ = this,\n            transition = {};\n\n        if (_.options.fade === false) {\n            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;\n        } else {\n            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;\n        }\n\n        if (_.options.fade === false) {\n            _.$slideTrack.css(transition);\n        } else {\n            _.$slides.eq(slide).css(transition);\n        }\n\n    };\n\n    Slick.prototype.autoPlay = function() {\n\n        var _ = this;\n\n        _.autoPlayClear();\n\n        if ( _.slideCount > _.options.slidesToShow ) {\n            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );\n        }\n\n    };\n\n    Slick.prototype.autoPlayClear = function() {\n\n        var _ = this;\n\n        if (_.autoPlayTimer) {\n            clearInterval(_.autoPlayTimer);\n        }\n\n    };\n\n    Slick.prototype.autoPlayIterator = function() {\n\n        var _ = this,\n            slideTo = _.currentSlide + _.options.slidesToScroll;\n\n        if ( !_.paused && !_.interrupted && !_.focussed ) {\n\n            if ( _.options.infinite === false ) {\n\n                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {\n                    _.direction = 0;\n                }\n\n                else if ( _.direction === 0 ) {\n\n                    slideTo = _.currentSlide - _.options.slidesToScroll;\n\n                    if ( _.currentSlide - 1 === 0 ) {\n                        _.direction = 1;\n                    }\n\n                }\n\n            }\n\n            _.slideHandler( slideTo );\n\n        }\n\n    };\n\n    Slick.prototype.buildArrows = function() {\n\n        var _ = this;\n\n        if (_.options.arrows === true ) {\n\n            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');\n            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');\n\n            if( _.slideCount > _.options.slidesToShow ) {\n\n                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');\n                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');\n\n                if (_.htmlExpr.test(_.options.prevArrow)) {\n                    _.$prevArrow.prependTo(_.options.appendArrows);\n                }\n\n                if (_.htmlExpr.test(_.options.nextArrow)) {\n                    _.$nextArrow.appendTo(_.options.appendArrows);\n                }\n\n                if (_.options.infinite !== true) {\n                    _.$prevArrow\n                        .addClass('slick-disabled')\n                        .attr('aria-disabled', 'true');\n                }\n\n            } else {\n\n                _.$prevArrow.add( _.$nextArrow )\n\n                    .addClass('slick-hidden')\n                    .attr({\n                        'aria-disabled': 'true',\n                        'tabindex': '-1'\n                    });\n\n            }\n\n        }\n\n    };\n\n    Slick.prototype.buildDots = function() {\n\n        var _ = this,\n            i, dot;\n\n        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {\n\n            _.$slider.addClass('slick-dotted');\n\n            dot = $('<ul />').addClass(_.options.dotsClass);\n\n            for (i = 0; i <= _.getDotCount(); i += 1) {\n                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));\n            }\n\n            _.$dots = dot.appendTo(_.options.appendDots);\n\n            _.$dots.find('li').first().addClass('slick-active');\n\n        }\n\n    };\n\n    Slick.prototype.buildOut = function() {\n\n        var _ = this;\n\n        _.$slides =\n            _.$slider\n                .children( _.options.slide + ':not(.slick-cloned)')\n                .addClass('slick-slide');\n\n        _.slideCount = _.$slides.length;\n\n        _.$slides.each(function(index, element) {\n            $(element)\n                .attr('data-slick-index', index)\n                .data('originalStyling', $(element).attr('style') || '');\n        });\n\n        _.$slider.addClass('slick-slider');\n\n        _.$slideTrack = (_.slideCount === 0) ?\n            $('<div class=\"slick-track\"/>').appendTo(_.$slider) :\n            _.$slides.wrapAll('<div class=\"slick-track\"/>').parent();\n\n        _.$list = _.$slideTrack.wrap(\n            '<div class=\"slick-list\"/>').parent();\n        _.$slideTrack.css('opacity', 0);\n\n        if (_.options.centerMode === true || _.options.swipeToSlide === true) {\n            _.options.slidesToScroll = 1;\n        }\n\n        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');\n\n        _.setupInfinite();\n\n        _.buildArrows();\n\n        _.buildDots();\n\n        _.updateDots();\n\n\n        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);\n\n        if (_.options.draggable === true) {\n            _.$list.addClass('draggable');\n        }\n\n    };\n\n    Slick.prototype.buildRows = function() {\n\n        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;\n\n        newSlides = document.createDocumentFragment();\n        originalSlides = _.$slider.children();\n\n        if(_.options.rows > 0) {\n\n            slidesPerSection = _.options.slidesPerRow * _.options.rows;\n            numOfSlides = Math.ceil(\n                originalSlides.length / slidesPerSection\n            );\n\n            for(a = 0; a < numOfSlides; a++){\n                var slide = document.createElement('div');\n                for(b = 0; b < _.options.rows; b++) {\n                    var row = document.createElement('div');\n                    for(c = 0; c < _.options.slidesPerRow; c++) {\n                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));\n                        if (originalSlides.get(target)) {\n                            row.appendChild(originalSlides.get(target));\n                        }\n                    }\n                    slide.appendChild(row);\n                }\n                newSlides.appendChild(slide);\n            }\n\n            _.$slider.empty().append(newSlides);\n            _.$slider.children().children().children()\n                .css({\n                    'width':(100 / _.options.slidesPerRow) + '%',\n                    'display': 'inline-block'\n                });\n\n        }\n\n    };\n\n    Slick.prototype.checkResponsive = function(initial, forceUpdate) {\n\n        var _ = this,\n            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;\n        var sliderWidth = _.$slider.width();\n        var windowWidth = window.innerWidth || $(window).width();\n\n        if (_.respondTo === 'window') {\n            respondToWidth = windowWidth;\n        } else if (_.respondTo === 'slider') {\n            respondToWidth = sliderWidth;\n        } else if (_.respondTo === 'min') {\n            respondToWidth = Math.min(windowWidth, sliderWidth);\n        }\n\n        if ( _.options.responsive &&\n            _.options.responsive.length &&\n            _.options.responsive !== null) {\n\n            targetBreakpoint = null;\n\n            for (breakpoint in _.breakpoints) {\n                if (_.breakpoints.hasOwnProperty(breakpoint)) {\n                    if (_.originalSettings.mobileFirst === false) {\n                        if (respondToWidth < _.breakpoints[breakpoint]) {\n                            targetBreakpoint = _.breakpoints[breakpoint];\n                        }\n                    } else {\n                        if (respondToWidth > _.breakpoints[breakpoint]) {\n                            targetBreakpoint = _.breakpoints[breakpoint];\n                        }\n                    }\n                }\n            }\n\n            if (targetBreakpoint !== null) {\n                if (_.activeBreakpoint !== null) {\n                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {\n                        _.activeBreakpoint =\n                            targetBreakpoint;\n                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {\n                            _.unslick(targetBreakpoint);\n                        } else {\n                            _.options = $.extend({}, _.originalSettings,\n                                _.breakpointSettings[\n                                    targetBreakpoint]);\n                            if (initial === true) {\n                                _.currentSlide = _.options.initialSlide;\n                            }\n                            _.refresh(initial);\n                        }\n                        triggerBreakpoint = targetBreakpoint;\n                    }\n                } else {\n                    _.activeBreakpoint = targetBreakpoint;\n                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {\n                        _.unslick(targetBreakpoint);\n                    } else {\n                        _.options = $.extend({}, _.originalSettings,\n                            _.breakpointSettings[\n                                targetBreakpoint]);\n                        if (initial === true) {\n                            _.currentSlide = _.options.initialSlide;\n                        }\n                        _.refresh(initial);\n                    }\n                    triggerBreakpoint = targetBreakpoint;\n                }\n            } else {\n                if (_.activeBreakpoint !== null) {\n                    _.activeBreakpoint = null;\n                    _.options = _.originalSettings;\n                    if (initial === true) {\n                        _.currentSlide = _.options.initialSlide;\n                    }\n                    _.refresh(initial);\n                    triggerBreakpoint = targetBreakpoint;\n                }\n            }\n\n            // only trigger breakpoints during an actual break. not on initialize.\n            if( !initial && triggerBreakpoint !== false ) {\n                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);\n            }\n        }\n\n    };\n\n    Slick.prototype.changeSlide = function(event, dontAnimate) {\n\n        var _ = this,\n            $target = $(event.currentTarget),\n            indexOffset, slideOffset, unevenOffset;\n\n        // If target is a link, prevent default action.\n        if($target.is('a')) {\n            event.preventDefault();\n        }\n\n        // If target is not the <li> element (ie: a child), find the <li>.\n        if(!$target.is('li')) {\n            $target = $target.closest('li');\n        }\n\n        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);\n        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;\n\n        switch (event.data.message) {\n\n            case 'previous':\n                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;\n                if (_.slideCount > _.options.slidesToShow) {\n                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);\n                }\n                break;\n\n            case 'next':\n                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;\n                if (_.slideCount > _.options.slidesToShow) {\n                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);\n                }\n                break;\n\n            case 'index':\n                var index = event.data.index === 0 ? 0 :\n                    event.data.index || $target.index() * _.options.slidesToScroll;\n\n                _.slideHandler(_.checkNavigable(index), false, dontAnimate);\n                $target.children().trigger('focus');\n                break;\n\n            default:\n                return;\n        }\n\n    };\n\n    Slick.prototype.checkNavigable = function(index) {\n\n        var _ = this,\n            navigables, prevNavigable;\n\n        navigables = _.getNavigableIndexes();\n        prevNavigable = 0;\n        if (index > navigables[navigables.length - 1]) {\n            index = navigables[navigables.length - 1];\n        } else {\n            for (var n in navigables) {\n                if (index < navigables[n]) {\n                    index = prevNavigable;\n                    break;\n                }\n                prevNavigable = navigables[n];\n            }\n        }\n\n        return index;\n    };\n\n    Slick.prototype.cleanUpEvents = function() {\n\n        var _ = this;\n\n        if (_.options.dots && _.$dots !== null) {\n\n            $('li', _.$dots)\n                .off('click.slick', _.changeSlide)\n                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))\n                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));\n\n            if (_.options.accessibility === true) {\n                _.$dots.off('keydown.slick', _.keyHandler);\n            }\n        }\n\n        _.$slider.off('focus.slick blur.slick');\n\n        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {\n            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);\n            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);\n\n            if (_.options.accessibility === true) {\n                _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);\n                _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);\n            }\n        }\n\n        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);\n        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);\n        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);\n        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);\n\n        _.$list.off('click.slick', _.clickHandler);\n\n        $(document).off(_.visibilityChange, _.visibility);\n\n        _.cleanUpSlideEvents();\n\n        if (_.options.accessibility === true) {\n            _.$list.off('keydown.slick', _.keyHandler);\n        }\n\n        if (_.options.focusOnSelect === true) {\n            $(_.$slideTrack).children().off('click.slick', _.selectHandler);\n        }\n\n        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);\n\n        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);\n\n        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);\n\n        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);\n\n    };\n\n    Slick.prototype.cleanUpSlideEvents = function() {\n\n        var _ = this;\n\n        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));\n        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));\n\n    };\n\n    Slick.prototype.cleanUpRows = function() {\n\n        var _ = this, originalSlides;\n\n        if(_.options.rows > 0) {\n            originalSlides = _.$slides.children().children();\n            originalSlides.removeAttr('style');\n            _.$slider.empty().append(originalSlides);\n        }\n\n    };\n\n    Slick.prototype.clickHandler = function(event) {\n\n        var _ = this;\n\n        if (_.shouldClick === false) {\n            event.stopImmediatePropagation();\n            event.stopPropagation();\n            event.preventDefault();\n        }\n\n    };\n\n    Slick.prototype.destroy = function(refresh) {\n\n        var _ = this;\n\n        _.autoPlayClear();\n\n        _.touchObject = {};\n\n        _.cleanUpEvents();\n\n        $('.slick-cloned', _.$slider).detach();\n\n        if (_.$dots) {\n            _.$dots.remove();\n        }\n\n        if ( _.$prevArrow && _.$prevArrow.length ) {\n\n            _.$prevArrow\n                .removeClass('slick-disabled slick-arrow slick-hidden')\n                .removeAttr('aria-hidden aria-disabled tabindex')\n                .css('display','');\n\n            if ( _.htmlExpr.test( _.options.prevArrow )) {\n                _.$prevArrow.remove();\n            }\n        }\n\n        if ( _.$nextArrow && _.$nextArrow.length ) {\n\n            _.$nextArrow\n                .removeClass('slick-disabled slick-arrow slick-hidden')\n                .removeAttr('aria-hidden aria-disabled tabindex')\n                .css('display','');\n\n            if ( _.htmlExpr.test( _.options.nextArrow )) {\n                _.$nextArrow.remove();\n            }\n        }\n\n\n        if (_.$slides) {\n\n            _.$slides\n                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')\n                .removeAttr('aria-hidden')\n                .removeAttr('data-slick-index')\n                .each(function(){\n                    $(this).attr('style', $(this).data('originalStyling'));\n                });\n\n            _.$slideTrack.children(this.options.slide).detach();\n\n            _.$slideTrack.detach();\n\n            _.$list.detach();\n\n            _.$slider.append(_.$slides);\n        }\n\n        _.cleanUpRows();\n\n        _.$slider.removeClass('slick-slider');\n        _.$slider.removeClass('slick-initialized');\n        _.$slider.removeClass('slick-dotted');\n\n        _.unslicked = true;\n\n        if(!refresh) {\n            _.$slider.trigger('destroy', [_]);\n        }\n\n    };\n\n    Slick.prototype.disableTransition = function(slide) {\n\n        var _ = this,\n            transition = {};\n\n        transition[_.transitionType] = '';\n\n        if (_.options.fade === false) {\n            _.$slideTrack.css(transition);\n        } else {\n            _.$slides.eq(slide).css(transition);\n        }\n\n    };\n\n    Slick.prototype.fadeSlide = function(slideIndex, callback) {\n\n        var _ = this;\n\n        if (_.cssTransitions === false) {\n\n            _.$slides.eq(slideIndex).css({\n                zIndex: _.options.zIndex\n            });\n\n            _.$slides.eq(slideIndex).animate({\n                opacity: 1\n            }, _.options.speed, _.options.easing, callback);\n\n        } else {\n\n            _.applyTransition(slideIndex);\n\n            _.$slides.eq(slideIndex).css({\n                opacity: 1,\n                zIndex: _.options.zIndex\n            });\n\n            if (callback) {\n                setTimeout(function() {\n\n                    _.disableTransition(slideIndex);\n\n                    callback.call();\n                }, _.options.speed);\n            }\n\n        }\n\n    };\n\n    Slick.prototype.fadeSlideOut = function(slideIndex) {\n\n        var _ = this;\n\n        if (_.cssTransitions === false) {\n\n            _.$slides.eq(slideIndex).animate({\n                opacity: 0,\n                zIndex: _.options.zIndex - 2\n            }, _.options.speed, _.options.easing);\n\n        } else {\n\n            _.applyTransition(slideIndex);\n\n            _.$slides.eq(slideIndex).css({\n                opacity: 0,\n                zIndex: _.options.zIndex - 2\n            });\n\n        }\n\n    };\n\n    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {\n\n        var _ = this;\n\n        if (filter !== null) {\n\n            _.$slidesCache = _.$slides;\n\n            _.unload();\n\n            _.$slideTrack.children(this.options.slide).detach();\n\n            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);\n\n            _.reinit();\n\n        }\n\n    };\n\n    Slick.prototype.focusHandler = function() {\n\n        var _ = this;\n\n        _.$slider\n            .off('focus.slick blur.slick')\n            .on('focus.slick blur.slick', '*', function(event) {\n\n            event.stopImmediatePropagation();\n            var $sf = $(this);\n\n            setTimeout(function() {\n\n                if( _.options.pauseOnFocus ) {\n                    _.focussed = $sf.is(':focus');\n                    _.autoPlay();\n                }\n\n            }, 0);\n\n        });\n    };\n\n    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {\n\n        var _ = this;\n        return _.currentSlide;\n\n    };\n\n    Slick.prototype.getDotCount = function() {\n\n        var _ = this;\n\n        var breakPoint = 0;\n        var counter = 0;\n        var pagerQty = 0;\n\n        if (_.options.infinite === true) {\n            if (_.slideCount <= _.options.slidesToShow) {\n                 ++pagerQty;\n            } else {\n                while (breakPoint < _.slideCount) {\n                    ++pagerQty;\n                    breakPoint = counter + _.options.slidesToScroll;\n                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;\n                }\n            }\n        } else if (_.options.centerMode === true) {\n            pagerQty = _.slideCount;\n        } else if(!_.options.asNavFor) {\n            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);\n        }else {\n            while (breakPoint < _.slideCount) {\n                ++pagerQty;\n                breakPoint = counter + _.options.slidesToScroll;\n                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;\n            }\n        }\n\n        return pagerQty - 1;\n\n    };\n\n    Slick.prototype.getLeft = function(slideIndex) {\n\n        var _ = this,\n            targetLeft,\n            verticalHeight,\n            verticalOffset = 0,\n            targetSlide,\n            coef;\n\n        _.slideOffset = 0;\n        verticalHeight = _.$slides.first().outerHeight(true);\n\n        if (_.options.infinite === true) {\n            if (_.slideCount > _.options.slidesToShow) {\n                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;\n                coef = -1\n\n                if (_.options.vertical === true && _.options.centerMode === true) {\n                    if (_.options.slidesToShow === 2) {\n                        coef = -1.5;\n                    } else if (_.options.slidesToShow === 1) {\n                        coef = -2\n                    }\n                }\n                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;\n            }\n            if (_.slideCount % _.options.slidesToScroll !== 0) {\n                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {\n                    if (slideIndex > _.slideCount) {\n                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;\n                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;\n                    } else {\n                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;\n                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;\n                    }\n                }\n            }\n        } else {\n            if (slideIndex + _.options.slidesToShow > _.slideCount) {\n                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;\n                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;\n            }\n        }\n\n        if (_.slideCount <= _.options.slidesToShow) {\n            _.slideOffset = 0;\n            verticalOffset = 0;\n        }\n\n        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {\n            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);\n        } else if (_.options.centerMode === true && _.options.infinite === true) {\n            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;\n        } else if (_.options.centerMode === true) {\n            _.slideOffset = 0;\n            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);\n        }\n\n        if (_.options.vertical === false) {\n            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;\n        } else {\n            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;\n        }\n\n        if (_.options.variableWidth === true) {\n\n            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {\n                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);\n            } else {\n                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);\n            }\n\n            if (_.options.rtl === true) {\n                if (targetSlide[0]) {\n                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;\n                } else {\n                    targetLeft =  0;\n                }\n            } else {\n                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;\n            }\n\n            if (_.options.centerMode === true) {\n                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {\n                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);\n                } else {\n                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);\n                }\n\n                if (_.options.rtl === true) {\n                    if (targetSlide[0]) {\n                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;\n                    } else {\n                        targetLeft =  0;\n                    }\n                } else {\n                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;\n                }\n\n                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;\n            }\n        }\n\n        return targetLeft;\n\n    };\n\n    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {\n\n        var _ = this;\n\n        return _.options[option];\n\n    };\n\n    Slick.prototype.getNavigableIndexes = function() {\n\n        var _ = this,\n            breakPoint = 0,\n            counter = 0,\n            indexes = [],\n            max;\n\n        if (_.options.infinite === false) {\n            max = _.slideCount;\n        } else {\n            breakPoint = _.options.slidesToScroll * -1;\n            counter = _.options.slidesToScroll * -1;\n            max = _.slideCount * 2;\n        }\n\n        while (breakPoint < max) {\n            indexes.push(breakPoint);\n            breakPoint = counter + _.options.slidesToScroll;\n            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;\n        }\n\n        return indexes;\n\n    };\n\n    Slick.prototype.getSlick = function() {\n\n        return this;\n\n    };\n\n    Slick.prototype.getSlideCount = function() {\n\n        var _ = this,\n            slidesTraversed, swipedSlide, centerOffset;\n\n        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;\n\n        if (_.options.swipeToSlide === true) {\n            _.$slideTrack.find('.slick-slide').each(function(index, slide) {\n                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {\n                    swipedSlide = slide;\n                    return false;\n                }\n            });\n\n            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;\n\n            return slidesTraversed;\n\n        } else {\n            return _.options.slidesToScroll;\n        }\n\n    };\n\n    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {\n\n        var _ = this;\n\n        _.changeSlide({\n            data: {\n                message: 'index',\n                index: parseInt(slide)\n            }\n        }, dontAnimate);\n\n    };\n\n    Slick.prototype.init = function(creation) {\n\n        var _ = this;\n\n        if (!$(_.$slider).hasClass('slick-initialized')) {\n\n            $(_.$slider).addClass('slick-initialized');\n\n            _.buildRows();\n            _.buildOut();\n            _.setProps();\n            _.startLoad();\n            _.loadSlider();\n            _.initializeEvents();\n            _.updateArrows();\n            _.updateDots();\n            _.checkResponsive(true);\n            _.focusHandler();\n\n        }\n\n        if (creation) {\n            _.$slider.trigger('init', [_]);\n        }\n\n        if (_.options.accessibility === true) {\n            _.initADA();\n        }\n\n        if ( _.options.autoplay ) {\n\n            _.paused = false;\n            _.autoPlay();\n\n        }\n\n    };\n\n    Slick.prototype.initADA = function() {\n        var _ = this,\n                numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),\n                tabControlIndexes = _.getNavigableIndexes().filter(function(val) {\n                    return (val >= 0) && (val < _.slideCount);\n                });\n\n        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({\n            'aria-hidden': 'true',\n            'tabindex': '-1'\n        }).find('a, input, button, select').attr({\n            'tabindex': '-1'\n        });\n\n        if (_.$dots !== null) {\n            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {\n                var slideControlIndex = tabControlIndexes.indexOf(i);\n\n                $(this).attr({\n                    'role': 'tabpanel',\n                    'id': 'slick-slide' + _.instanceUid + i,\n                    'tabindex': -1\n                });\n\n                if (slideControlIndex !== -1) {\n                   var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex\n                   if ($('#' + ariaButtonControl).length) {\n                     $(this).attr({\n                         'aria-describedby': ariaButtonControl\n                     });\n                   }\n                }\n            });\n\n            _.$dots.attr('role', 'tablist').find('li').each(function(i) {\n                var mappedSlideIndex = tabControlIndexes[i];\n\n                $(this).attr({\n                    'role': 'presentation'\n                });\n\n                $(this).find('button').first().attr({\n                    'role': 'tab',\n                    'id': 'slick-slide-control' + _.instanceUid + i,\n                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,\n                    'aria-label': (i + 1) + ' of ' + numDotGroups,\n                    'aria-selected': null,\n                    'tabindex': '-1'\n                });\n\n            }).eq(_.currentSlide).find('button').attr({\n                'aria-selected': 'true',\n                'tabindex': '0'\n            }).end();\n        }\n\n        for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {\n          if (_.options.focusOnChange) {\n            _.$slides.eq(i).attr({'tabindex': '0'});\n          } else {\n            _.$slides.eq(i).removeAttr('tabindex');\n          }\n        }\n\n        _.activateADA();\n\n    };\n\n    Slick.prototype.initArrowEvents = function() {\n\n        var _ = this;\n\n        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {\n            _.$prevArrow\n               .off('click.slick')\n               .on('click.slick', {\n                    message: 'previous'\n               }, _.changeSlide);\n            _.$nextArrow\n               .off('click.slick')\n               .on('click.slick', {\n                    message: 'next'\n               }, _.changeSlide);\n\n            if (_.options.accessibility === true) {\n                _.$prevArrow.on('keydown.slick', _.keyHandler);\n                _.$nextArrow.on('keydown.slick', _.keyHandler);\n            }\n        }\n\n    };\n\n    Slick.prototype.initDotEvents = function() {\n\n        var _ = this;\n\n        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {\n            $('li', _.$dots).on('click.slick', {\n                message: 'index'\n            }, _.changeSlide);\n\n            if (_.options.accessibility === true) {\n                _.$dots.on('keydown.slick', _.keyHandler);\n            }\n        }\n\n        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {\n\n            $('li', _.$dots)\n                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))\n                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));\n\n        }\n\n    };\n\n    Slick.prototype.initSlideEvents = function() {\n\n        var _ = this;\n\n        if ( _.options.pauseOnHover ) {\n\n            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));\n            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));\n\n        }\n\n    };\n\n    Slick.prototype.initializeEvents = function() {\n\n        var _ = this;\n\n        _.initArrowEvents();\n\n        _.initDotEvents();\n        _.initSlideEvents();\n\n        _.$list.on('touchstart.slick mousedown.slick', {\n            action: 'start'\n        }, _.swipeHandler);\n        _.$list.on('touchmove.slick mousemove.slick', {\n            action: 'move'\n        }, _.swipeHandler);\n        _.$list.on('touchend.slick mouseup.slick', {\n            action: 'end'\n        }, _.swipeHandler);\n        _.$list.on('touchcancel.slick mouseleave.slick', {\n            action: 'end'\n        }, _.swipeHandler);\n\n        _.$list.on('click.slick', _.clickHandler);\n\n        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));\n\n        if (_.options.accessibility === true) {\n            _.$list.on('keydown.slick', _.keyHandler);\n        }\n\n        if (_.options.focusOnSelect === true) {\n            $(_.$slideTrack).children().on('click.slick', _.selectHandler);\n        }\n\n        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));\n\n        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));\n\n        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);\n\n        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);\n        $(_.setPosition);\n\n    };\n\n    Slick.prototype.initUI = function() {\n\n        var _ = this;\n\n        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {\n\n            _.$prevArrow.show();\n            _.$nextArrow.show();\n\n        }\n\n        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {\n\n            _.$dots.show();\n\n        }\n\n    };\n\n    Slick.prototype.keyHandler = function(event) {\n\n        var _ = this;\n         //Dont slide if the cursor is inside the form fields and arrow keys are pressed\n        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {\n            if (event.keyCode === 37 && _.options.accessibility === true) {\n                _.changeSlide({\n                    data: {\n                        message: _.options.rtl === true ? 'next' :  'previous'\n                    }\n                });\n            } else if (event.keyCode === 39 && _.options.accessibility === true) {\n                _.changeSlide({\n                    data: {\n                        message: _.options.rtl === true ? 'previous' : 'next'\n                    }\n                });\n            }\n        }\n\n    };\n\n    Slick.prototype.lazyLoad = function() {\n\n        var _ = this,\n            loadRange, cloneRange, rangeStart, rangeEnd;\n\n        function loadImages(imagesScope) {\n\n            $('img[data-lazy]', imagesScope).each(function() {\n\n                var image = $(this),\n                    imageSource = $(this).attr('data-lazy'),\n                    imageSrcSet = $(this).attr('data-srcset'),\n                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),\n                    imageToLoad = document.createElement('img');\n\n                imageToLoad.onload = function() {\n\n                    image\n                        .animate({ opacity: 0 }, 100, function() {\n\n                            if (imageSrcSet) {\n                                image\n                                    .attr('srcset', imageSrcSet );\n\n                                if (imageSizes) {\n                                    image\n                                        .attr('sizes', imageSizes );\n                                }\n                            }\n\n                            image\n                                .attr('src', imageSource)\n                                .animate({ opacity: 1 }, 200, function() {\n                                    image\n                                        .removeAttr('data-lazy data-srcset data-sizes')\n                                        .removeClass('slick-loading');\n                                });\n                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);\n                        });\n\n                };\n\n                imageToLoad.onerror = function() {\n\n                    image\n                        .removeAttr( 'data-lazy' )\n                        .removeClass( 'slick-loading' )\n                        .addClass( 'slick-lazyload-error' );\n\n                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);\n\n                };\n\n                imageToLoad.src = imageSource;\n\n            });\n\n        }\n\n        if (_.options.centerMode === true) {\n            if (_.options.infinite === true) {\n                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);\n                rangeEnd = rangeStart + _.options.slidesToShow + 2;\n            } else {\n                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));\n                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;\n            }\n        } else {\n            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;\n            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);\n            if (_.options.fade === true) {\n                if (rangeStart > 0) rangeStart--;\n                if (rangeEnd <= _.slideCount) rangeEnd++;\n            }\n        }\n\n        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);\n\n        if (_.options.lazyLoad === 'anticipated') {\n            var prevSlide = rangeStart - 1,\n                nextSlide = rangeEnd,\n                $slides = _.$slider.find('.slick-slide');\n\n            for (var i = 0; i < _.options.slidesToScroll; i++) {\n                if (prevSlide < 0) prevSlide = _.slideCount - 1;\n                loadRange = loadRange.add($slides.eq(prevSlide));\n                loadRange = loadRange.add($slides.eq(nextSlide));\n                prevSlide--;\n                nextSlide++;\n            }\n        }\n\n        loadImages(loadRange);\n\n        if (_.slideCount <= _.options.slidesToShow) {\n            cloneRange = _.$slider.find('.slick-slide');\n            loadImages(cloneRange);\n        } else\n        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {\n            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);\n            loadImages(cloneRange);\n        } else if (_.currentSlide === 0) {\n            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);\n            loadImages(cloneRange);\n        }\n\n    };\n\n    Slick.prototype.loadSlider = function() {\n\n        var _ = this;\n\n        _.setPosition();\n\n        _.$slideTrack.css({\n            opacity: 1\n        });\n\n        _.$slider.removeClass('slick-loading');\n\n        _.initUI();\n\n        if (_.options.lazyLoad === 'progressive') {\n            _.progressiveLazyLoad();\n        }\n\n    };\n\n    Slick.prototype.next = Slick.prototype.slickNext = function() {\n\n        var _ = this;\n\n        _.changeSlide({\n            data: {\n                message: 'next'\n            }\n        });\n\n    };\n\n    Slick.prototype.orientationChange = function() {\n\n        var _ = this;\n\n        _.checkResponsive();\n        _.setPosition();\n\n    };\n\n    Slick.prototype.pause = Slick.prototype.slickPause = function() {\n\n        var _ = this;\n\n        _.autoPlayClear();\n        _.paused = true;\n\n    };\n\n    Slick.prototype.play = Slick.prototype.slickPlay = function() {\n\n        var _ = this;\n\n        _.autoPlay();\n        _.options.autoplay = true;\n        _.paused = false;\n        _.focussed = false;\n        _.interrupted = false;\n\n    };\n\n    Slick.prototype.postSlide = function(index) {\n\n        var _ = this;\n\n        if( !_.unslicked ) {\n\n            _.$slider.trigger('afterChange', [_, index]);\n\n            _.animating = false;\n\n            if (_.slideCount > _.options.slidesToShow) {\n                _.setPosition();\n            }\n\n            _.swipeLeft = null;\n\n            if ( _.options.autoplay ) {\n                _.autoPlay();\n            }\n\n            if (_.options.accessibility === true) {\n                _.initADA();\n\n                if (_.options.focusOnChange) {\n                    var $currentSlide = $(_.$slides.get(_.currentSlide));\n                    $currentSlide.attr('tabindex', 0).focus();\n                }\n            }\n\n        }\n\n    };\n\n    Slick.prototype.prev = Slick.prototype.slickPrev = function() {\n\n        var _ = this;\n\n        _.changeSlide({\n            data: {\n                message: 'previous'\n            }\n        });\n\n    };\n\n    Slick.prototype.preventDefault = function(event) {\n\n        event.preventDefault();\n\n    };\n\n    Slick.prototype.progressiveLazyLoad = function( tryCount ) {\n\n        tryCount = tryCount || 1;\n\n        var _ = this,\n            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),\n            image,\n            imageSource,\n            imageSrcSet,\n            imageSizes,\n            imageToLoad;\n\n        if ( $imgsToLoad.length ) {\n\n            image = $imgsToLoad.first();\n            imageSource = image.attr('data-lazy');\n            imageSrcSet = image.attr('data-srcset');\n            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');\n            imageToLoad = document.createElement('img');\n\n            imageToLoad.onload = function() {\n\n                if (imageSrcSet) {\n                    image\n                        .attr('srcset', imageSrcSet );\n\n                    if (imageSizes) {\n                        image\n                            .attr('sizes', imageSizes );\n                    }\n                }\n\n                image\n                    .attr( 'src', imageSource )\n                    .removeAttr('data-lazy data-srcset data-sizes')\n                    .removeClass('slick-loading');\n\n                if ( _.options.adaptiveHeight === true ) {\n                    _.setPosition();\n                }\n\n                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);\n                _.progressiveLazyLoad();\n\n            };\n\n            imageToLoad.onerror = function() {\n\n                if ( tryCount < 3 ) {\n\n                    /**\n                     * try to load the image 3 times,\n                     * leave a slight delay so we don't get\n                     * servers blocking the request.\n                     */\n                    setTimeout( function() {\n                        _.progressiveLazyLoad( tryCount + 1 );\n                    }, 500 );\n\n                } else {\n\n                    image\n                        .removeAttr( 'data-lazy' )\n                        .removeClass( 'slick-loading' )\n                        .addClass( 'slick-lazyload-error' );\n\n                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);\n\n                    _.progressiveLazyLoad();\n\n                }\n\n            };\n\n            imageToLoad.src = imageSource;\n\n        } else {\n\n            _.$slider.trigger('allImagesLoaded', [ _ ]);\n\n        }\n\n    };\n\n    Slick.prototype.refresh = function( initializing ) {\n\n        var _ = this, currentSlide, lastVisibleIndex;\n\n        lastVisibleIndex = _.slideCount - _.options.slidesToShow;\n\n        // in non-infinite sliders, we don't want to go past the\n        // last visible index.\n        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {\n            _.currentSlide = lastVisibleIndex;\n        }\n\n        // if less slides than to show, go to start.\n        if ( _.slideCount <= _.options.slidesToShow ) {\n            _.currentSlide = 0;\n\n        }\n\n        currentSlide = _.currentSlide;\n\n        _.destroy(true);\n\n        $.extend(_, _.initials, { currentSlide: currentSlide });\n\n        _.init();\n\n        if( !initializing ) {\n\n            _.changeSlide({\n                data: {\n                    message: 'index',\n                    index: currentSlide\n                }\n            }, false);\n\n        }\n\n    };\n\n    Slick.prototype.registerBreakpoints = function() {\n\n        var _ = this, breakpoint, currentBreakpoint, l,\n            responsiveSettings = _.options.responsive || null;\n\n        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {\n\n            _.respondTo = _.options.respondTo || 'window';\n\n            for ( breakpoint in responsiveSettings ) {\n\n                l = _.breakpoints.length-1;\n\n                if (responsiveSettings.hasOwnProperty(breakpoint)) {\n                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;\n\n                    // loop through the breakpoints and cut out any existing\n                    // ones with the same breakpoint number, we don't want dupes.\n                    while( l >= 0 ) {\n                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {\n                            _.breakpoints.splice(l,1);\n                        }\n                        l--;\n                    }\n\n                    _.breakpoints.push(currentBreakpoint);\n                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;\n\n                }\n\n            }\n\n            _.breakpoints.sort(function(a, b) {\n                return ( _.options.mobileFirst ) ? a-b : b-a;\n            });\n\n        }\n\n    };\n\n    Slick.prototype.reinit = function() {\n\n        var _ = this;\n\n        _.$slides =\n            _.$slideTrack\n                .children(_.options.slide)\n                .addClass('slick-slide');\n\n        _.slideCount = _.$slides.length;\n\n        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {\n            _.currentSlide = _.currentSlide - _.options.slidesToScroll;\n        }\n\n        if (_.slideCount <= _.options.slidesToShow) {\n            _.currentSlide = 0;\n        }\n\n        _.registerBreakpoints();\n\n        _.setProps();\n        _.setupInfinite();\n        _.buildArrows();\n        _.updateArrows();\n        _.initArrowEvents();\n        _.buildDots();\n        _.updateDots();\n        _.initDotEvents();\n        _.cleanUpSlideEvents();\n        _.initSlideEvents();\n\n        _.checkResponsive(false, true);\n\n        if (_.options.focusOnSelect === true) {\n            $(_.$slideTrack).children().on('click.slick', _.selectHandler);\n        }\n\n        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);\n\n        _.setPosition();\n        _.focusHandler();\n\n        _.paused = !_.options.autoplay;\n        _.autoPlay();\n\n        _.$slider.trigger('reInit', [_]);\n\n    };\n\n    Slick.prototype.resize = function() {\n\n        var _ = this;\n\n        if ($(window).width() !== _.windowWidth) {\n            clearTimeout(_.windowDelay);\n            _.windowDelay = window.setTimeout(function() {\n                _.windowWidth = $(window).width();\n                _.checkResponsive();\n                if( !_.unslicked ) { _.setPosition(); }\n            }, 50);\n        }\n    };\n\n    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {\n\n        var _ = this;\n\n        if (typeof(index) === 'boolean') {\n            removeBefore = index;\n            index = removeBefore === true ? 0 : _.slideCount - 1;\n        } else {\n            index = removeBefore === true ? --index : index;\n        }\n\n        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {\n            return false;\n        }\n\n        _.unload();\n\n        if (removeAll === true) {\n            _.$slideTrack.children().remove();\n        } else {\n            _.$slideTrack.children(this.options.slide).eq(index).remove();\n        }\n\n        _.$slides = _.$slideTrack.children(this.options.slide);\n\n        _.$slideTrack.children(this.options.slide).detach();\n\n        _.$slideTrack.append(_.$slides);\n\n        _.$slidesCache = _.$slides;\n\n        _.reinit();\n\n    };\n\n    Slick.prototype.setCSS = function(position) {\n\n        var _ = this,\n            positionProps = {},\n            x, y;\n\n        if (_.options.rtl === true) {\n            position = -position;\n        }\n        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';\n        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';\n\n        positionProps[_.positionProp] = position;\n\n        if (_.transformsEnabled === false) {\n            _.$slideTrack.css(positionProps);\n        } else {\n            positionProps = {};\n            if (_.cssTransitions === false) {\n                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';\n                _.$slideTrack.css(positionProps);\n            } else {\n                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';\n                _.$slideTrack.css(positionProps);\n            }\n        }\n\n    };\n\n    Slick.prototype.setDimensions = function() {\n\n        var _ = this;\n\n        if (_.options.vertical === false) {\n            if (_.options.centerMode === true) {\n                _.$list.css({\n                    padding: ('0px ' + _.options.centerPadding)\n                });\n            }\n        } else {\n            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);\n            if (_.options.centerMode === true) {\n                _.$list.css({\n                    padding: (_.options.centerPadding + ' 0px')\n                });\n            }\n        }\n\n        _.listWidth = _.$list.width();\n        _.listHeight = _.$list.height();\n\n\n        if (_.options.vertical === false && _.options.variableWidth === false) {\n            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);\n            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));\n\n        } else if (_.options.variableWidth === true) {\n            _.$slideTrack.width(5000 * _.slideCount);\n        } else {\n            _.slideWidth = Math.ceil(_.listWidth);\n            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));\n        }\n\n        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();\n        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);\n\n    };\n\n    Slick.prototype.setFade = function() {\n\n        var _ = this,\n            targetLeft;\n\n        _.$slides.each(function(index, element) {\n            targetLeft = (_.slideWidth * index) * -1;\n            if (_.options.rtl === true) {\n                $(element).css({\n                    position: 'relative',\n                    right: targetLeft,\n                    top: 0,\n                    zIndex: _.options.zIndex - 2,\n                    opacity: 0\n                });\n            } else {\n                $(element).css({\n                    position: 'relative',\n                    left: targetLeft,\n                    top: 0,\n                    zIndex: _.options.zIndex - 2,\n                    opacity: 0\n                });\n            }\n        });\n\n        _.$slides.eq(_.currentSlide).css({\n            zIndex: _.options.zIndex - 1,\n            opacity: 1\n        });\n\n    };\n\n    Slick.prototype.setHeight = function() {\n\n        var _ = this;\n\n        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {\n            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);\n            _.$list.css('height', targetHeight);\n        }\n\n    };\n\n    Slick.prototype.setOption =\n    Slick.prototype.slickSetOption = function() {\n\n        /**\n         * accepts arguments in format of:\n         *\n         *  - for changing a single option's value:\n         *     .slick(\"setOption\", option, value, refresh )\n         *\n         *  - for changing a set of responsive options:\n         *     .slick(\"setOption\", 'responsive', [{}, ...], refresh )\n         *\n         *  - for updating multiple values at once (not responsive)\n         *     .slick(\"setOption\", { 'option': value, ... }, refresh )\n         */\n\n        var _ = this, l, item, option, value, refresh = false, type;\n\n        if( $.type( arguments[0] ) === 'object' ) {\n\n            option =  arguments[0];\n            refresh = arguments[1];\n            type = 'multiple';\n\n        } else if ( $.type( arguments[0] ) === 'string' ) {\n\n            option =  arguments[0];\n            value = arguments[1];\n            refresh = arguments[2];\n\n            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {\n\n                type = 'responsive';\n\n            } else if ( typeof arguments[1] !== 'undefined' ) {\n\n                type = 'single';\n\n            }\n\n        }\n\n        if ( type === 'single' ) {\n\n            _.options[option] = value;\n\n\n        } else if ( type === 'multiple' ) {\n\n            $.each( option , function( opt, val ) {\n\n                _.options[opt] = val;\n\n            });\n\n\n        } else if ( type === 'responsive' ) {\n\n            for ( item in value ) {\n\n                if( $.type( _.options.responsive ) !== 'array' ) {\n\n                    _.options.responsive = [ value[item] ];\n\n                } else {\n\n                    l = _.options.responsive.length-1;\n\n                    // loop through the responsive object and splice out duplicates.\n                    while( l >= 0 ) {\n\n                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {\n\n                            _.options.responsive.splice(l,1);\n\n                        }\n\n                        l--;\n\n                    }\n\n                    _.options.responsive.push( value[item] );\n\n                }\n\n            }\n\n        }\n\n        if ( refresh ) {\n\n            _.unload();\n            _.reinit();\n\n        }\n\n    };\n\n    Slick.prototype.setPosition = function() {\n\n        var _ = this;\n\n        _.setDimensions();\n\n        _.setHeight();\n\n        if (_.options.fade === false) {\n            _.setCSS(_.getLeft(_.currentSlide));\n        } else {\n            _.setFade();\n        }\n\n        _.$slider.trigger('setPosition', [_]);\n\n    };\n\n    Slick.prototype.setProps = function() {\n\n        var _ = this,\n            bodyStyle = document.body.style;\n\n        _.positionProp = _.options.vertical === true ? 'top' : 'left';\n\n        if (_.positionProp === 'top') {\n            _.$slider.addClass('slick-vertical');\n        } else {\n            _.$slider.removeClass('slick-vertical');\n        }\n\n        if (bodyStyle.WebkitTransition !== undefined ||\n            bodyStyle.MozTransition !== undefined ||\n            bodyStyle.msTransition !== undefined) {\n            if (_.options.useCSS === true) {\n                _.cssTransitions = true;\n            }\n        }\n\n        if ( _.options.fade ) {\n            if ( typeof _.options.zIndex === 'number' ) {\n                if( _.options.zIndex < 3 ) {\n                    _.options.zIndex = 3;\n                }\n            } else {\n                _.options.zIndex = _.defaults.zIndex;\n            }\n        }\n\n        if (bodyStyle.OTransform !== undefined) {\n            _.animType = 'OTransform';\n            _.transformType = '-o-transform';\n            _.transitionType = 'OTransition';\n            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;\n        }\n        if (bodyStyle.MozTransform !== undefined) {\n            _.animType = 'MozTransform';\n            _.transformType = '-moz-transform';\n            _.transitionType = 'MozTransition';\n            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;\n        }\n        if (bodyStyle.webkitTransform !== undefined) {\n            _.animType = 'webkitTransform';\n            _.transformType = '-webkit-transform';\n            _.transitionType = 'webkitTransition';\n            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;\n        }\n        if (bodyStyle.msTransform !== undefined) {\n            _.animType = 'msTransform';\n            _.transformType = '-ms-transform';\n            _.transitionType = 'msTransition';\n            if (bodyStyle.msTransform === undefined) _.animType = false;\n        }\n        if (bodyStyle.transform !== undefined && _.animType !== false) {\n            _.animType = 'transform';\n            _.transformType = 'transform';\n            _.transitionType = 'transition';\n        }\n        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);\n    };\n\n\n    Slick.prototype.setSlideClasses = function(index) {\n\n        var _ = this,\n            centerOffset, allSlides, indexOffset, remainder;\n\n        allSlides = _.$slider\n            .find('.slick-slide')\n            .removeClass('slick-active slick-center slick-current')\n            .attr('aria-hidden', 'true');\n\n        _.$slides\n            .eq(index)\n            .addClass('slick-current');\n\n        if (_.options.centerMode === true) {\n\n            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;\n\n            centerOffset = Math.floor(_.options.slidesToShow / 2);\n\n            if (_.options.infinite === true) {\n\n                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {\n                    _.$slides\n                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)\n                        .addClass('slick-active')\n                        .attr('aria-hidden', 'false');\n\n                } else {\n\n                    indexOffset = _.options.slidesToShow + index;\n                    allSlides\n                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)\n                        .addClass('slick-active')\n                        .attr('aria-hidden', 'false');\n\n                }\n\n                if (index === 0) {\n\n                    allSlides\n                        .eq(allSlides.length - 1 - _.options.slidesToShow)\n                        .addClass('slick-center');\n\n                } else if (index === _.slideCount - 1) {\n\n                    allSlides\n                        .eq(_.options.slidesToShow)\n                        .addClass('slick-center');\n\n                }\n\n            }\n\n            _.$slides\n                .eq(index)\n                .addClass('slick-center');\n\n        } else {\n\n            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {\n\n                _.$slides\n                    .slice(index, index + _.options.slidesToShow)\n                    .addClass('slick-active')\n                    .attr('aria-hidden', 'false');\n\n            } else if (allSlides.length <= _.options.slidesToShow) {\n\n                allSlides\n                    .addClass('slick-active')\n                    .attr('aria-hidden', 'false');\n\n            } else {\n\n                remainder = _.slideCount % _.options.slidesToShow;\n                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;\n\n                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {\n\n                    allSlides\n                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)\n                        .addClass('slick-active')\n                        .attr('aria-hidden', 'false');\n\n                } else {\n\n                    allSlides\n                        .slice(indexOffset, indexOffset + _.options.slidesToShow)\n                        .addClass('slick-active')\n                        .attr('aria-hidden', 'false');\n\n                }\n\n            }\n\n        }\n\n        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {\n            _.lazyLoad();\n        }\n    };\n\n    Slick.prototype.setupInfinite = function() {\n\n        var _ = this,\n            i, slideIndex, infiniteCount;\n\n        if (_.options.fade === true) {\n            _.options.centerMode = false;\n        }\n\n        if (_.options.infinite === true && _.options.fade === false) {\n\n            slideIndex = null;\n\n            if (_.slideCount > _.options.slidesToShow) {\n\n                if (_.options.centerMode === true) {\n                    infiniteCount = _.options.slidesToShow + 1;\n                } else {\n                    infiniteCount = _.options.slidesToShow;\n                }\n\n                for (i = _.slideCount; i > (_.slideCount -\n                        infiniteCount); i -= 1) {\n                    slideIndex = i - 1;\n                    $(_.$slides[slideIndex]).clone(true).attr('id', '')\n                        .attr('data-slick-index', slideIndex - _.slideCount)\n                        .prependTo(_.$slideTrack).addClass('slick-cloned');\n                }\n                for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {\n                    slideIndex = i;\n                    $(_.$slides[slideIndex]).clone(true).attr('id', '')\n                        .attr('data-slick-index', slideIndex + _.slideCount)\n                        .appendTo(_.$slideTrack).addClass('slick-cloned');\n                }\n                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {\n                    $(this).attr('id', '');\n                });\n\n            }\n\n        }\n\n    };\n\n    Slick.prototype.interrupt = function( toggle ) {\n\n        var _ = this;\n\n        if( !toggle ) {\n            _.autoPlay();\n        }\n        _.interrupted = toggle;\n\n    };\n\n    Slick.prototype.selectHandler = function(event) {\n\n        var _ = this;\n\n        var targetElement =\n            $(event.target).is('.slick-slide') ?\n                $(event.target) :\n                $(event.target).parents('.slick-slide');\n\n        var index = parseInt(targetElement.attr('data-slick-index'));\n\n        if (!index) index = 0;\n\n        if (_.slideCount <= _.options.slidesToShow) {\n\n            _.slideHandler(index, false, true);\n            return;\n\n        }\n\n        _.slideHandler(index);\n\n    };\n\n    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {\n\n        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,\n            _ = this, navTarget;\n\n        sync = sync || false;\n\n        if (_.animating === true && _.options.waitForAnimate === true) {\n            return;\n        }\n\n        if (_.options.fade === true && _.currentSlide === index) {\n            return;\n        }\n\n        if (sync === false) {\n            _.asNavFor(index);\n        }\n\n        targetSlide = index;\n        targetLeft = _.getLeft(targetSlide);\n        slideLeft = _.getLeft(_.currentSlide);\n\n        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;\n\n        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {\n            if (_.options.fade === false) {\n                targetSlide = _.currentSlide;\n                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {\n                    _.animateSlide(slideLeft, function() {\n                        _.postSlide(targetSlide);\n                    });\n                } else {\n                    _.postSlide(targetSlide);\n                }\n            }\n            return;\n        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {\n            if (_.options.fade === false) {\n                targetSlide = _.currentSlide;\n                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {\n                    _.animateSlide(slideLeft, function() {\n                        _.postSlide(targetSlide);\n                    });\n                } else {\n                    _.postSlide(targetSlide);\n                }\n            }\n            return;\n        }\n\n        if ( _.options.autoplay ) {\n            clearInterval(_.autoPlayTimer);\n        }\n\n        if (targetSlide < 0) {\n            if (_.slideCount % _.options.slidesToScroll !== 0) {\n                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);\n            } else {\n                animSlide = _.slideCount + targetSlide;\n            }\n        } else if (targetSlide >= _.slideCount) {\n            if (_.slideCount % _.options.slidesToScroll !== 0) {\n                animSlide = 0;\n            } else {\n                animSlide = targetSlide - _.slideCount;\n            }\n        } else {\n            animSlide = targetSlide;\n        }\n\n        _.animating = true;\n\n        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);\n\n        oldSlide = _.currentSlide;\n        _.currentSlide = animSlide;\n\n        _.setSlideClasses(_.currentSlide);\n\n        if ( _.options.asNavFor ) {\n\n            navTarget = _.getNavTarget();\n            navTarget = navTarget.slick('getSlick');\n\n            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {\n                navTarget.setSlideClasses(_.currentSlide);\n            }\n\n        }\n\n        _.updateDots();\n        _.updateArrows();\n\n        if (_.options.fade === true) {\n            if (dontAnimate !== true) {\n\n                _.fadeSlideOut(oldSlide);\n\n                _.fadeSlide(animSlide, function() {\n                    _.postSlide(animSlide);\n                });\n\n            } else {\n                _.postSlide(animSlide);\n            }\n            _.animateHeight();\n            return;\n        }\n\n        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {\n            _.animateSlide(targetLeft, function() {\n                _.postSlide(animSlide);\n            });\n        } else {\n            _.postSlide(animSlide);\n        }\n\n    };\n\n    Slick.prototype.startLoad = function() {\n\n        var _ = this;\n\n        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {\n\n            _.$prevArrow.hide();\n            _.$nextArrow.hide();\n\n        }\n\n        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {\n\n            _.$dots.hide();\n\n        }\n\n        _.$slider.addClass('slick-loading');\n\n    };\n\n    Slick.prototype.swipeDirection = function() {\n\n        var xDist, yDist, r, swipeAngle, _ = this;\n\n        xDist = _.touchObject.startX - _.touchObject.curX;\n        yDist = _.touchObject.startY - _.touchObject.curY;\n        r = Math.atan2(yDist, xDist);\n\n        swipeAngle = Math.round(r * 180 / Math.PI);\n        if (swipeAngle < 0) {\n            swipeAngle = 360 - Math.abs(swipeAngle);\n        }\n\n        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {\n            return (_.options.rtl === false ? 'left' : 'right');\n        }\n        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {\n            return (_.options.rtl === false ? 'left' : 'right');\n        }\n        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {\n            return (_.options.rtl === false ? 'right' : 'left');\n        }\n        if (_.options.verticalSwiping === true) {\n            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {\n                return 'down';\n            } else {\n                return 'up';\n            }\n        }\n\n        return 'vertical';\n\n    };\n\n    Slick.prototype.swipeEnd = function(event) {\n\n        var _ = this,\n            slideCount,\n            direction;\n\n        _.dragging = false;\n        _.swiping = false;\n\n        if (_.scrolling) {\n            _.scrolling = false;\n            return false;\n        }\n\n        _.interrupted = false;\n        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;\n\n        if ( _.touchObject.curX === undefined ) {\n            return false;\n        }\n\n        if ( _.touchObject.edgeHit === true ) {\n            _.$slider.trigger('edge', [_, _.swipeDirection() ]);\n        }\n\n        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {\n\n            direction = _.swipeDirection();\n\n            switch ( direction ) {\n\n                case 'left':\n                case 'down':\n\n                    slideCount =\n                        _.options.swipeToSlide ?\n                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :\n                            _.currentSlide + _.getSlideCount();\n\n                    _.currentDirection = 0;\n\n                    break;\n\n                case 'right':\n                case 'up':\n\n                    slideCount =\n                        _.options.swipeToSlide ?\n                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :\n                            _.currentSlide - _.getSlideCount();\n\n                    _.currentDirection = 1;\n\n                    break;\n\n                default:\n\n\n            }\n\n            if( direction != 'vertical' ) {\n\n                _.slideHandler( slideCount );\n                _.touchObject = {};\n                _.$slider.trigger('swipe', [_, direction ]);\n\n            }\n\n        } else {\n\n            if ( _.touchObject.startX !== _.touchObject.curX ) {\n\n                _.slideHandler( _.currentSlide );\n                _.touchObject = {};\n\n            }\n\n        }\n\n    };\n\n    Slick.prototype.swipeHandler = function(event) {\n\n        var _ = this;\n\n        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {\n            return;\n        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {\n            return;\n        }\n\n        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?\n            event.originalEvent.touches.length : 1;\n\n        _.touchObject.minSwipe = _.listWidth / _.options\n            .touchThreshold;\n\n        if (_.options.verticalSwiping === true) {\n            _.touchObject.minSwipe = _.listHeight / _.options\n                .touchThreshold;\n        }\n\n        switch (event.data.action) {\n\n            case 'start':\n                _.swipeStart(event);\n                break;\n\n            case 'move':\n                _.swipeMove(event);\n                break;\n\n            case 'end':\n                _.swipeEnd(event);\n                break;\n\n        }\n\n    };\n\n    Slick.prototype.swipeMove = function(event) {\n\n        var _ = this,\n            edgeWasHit = false,\n            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;\n\n        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;\n\n        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {\n            return false;\n        }\n\n        curLeft = _.getLeft(_.currentSlide);\n\n        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;\n        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;\n\n        _.touchObject.swipeLength = Math.round(Math.sqrt(\n            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));\n\n        verticalSwipeLength = Math.round(Math.sqrt(\n            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));\n\n        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {\n            _.scrolling = true;\n            return false;\n        }\n\n        if (_.options.verticalSwiping === true) {\n            _.touchObject.swipeLength = verticalSwipeLength;\n        }\n\n        swipeDirection = _.swipeDirection();\n\n        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {\n            _.swiping = true;\n            event.preventDefault();\n        }\n\n        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);\n        if (_.options.verticalSwiping === true) {\n            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;\n        }\n\n\n        swipeLength = _.touchObject.swipeLength;\n\n        _.touchObject.edgeHit = false;\n\n        if (_.options.infinite === false) {\n            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {\n                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;\n                _.touchObject.edgeHit = true;\n            }\n        }\n\n        if (_.options.vertical === false) {\n            _.swipeLeft = curLeft + swipeLength * positionOffset;\n        } else {\n            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;\n        }\n        if (_.options.verticalSwiping === true) {\n            _.swipeLeft = curLeft + swipeLength * positionOffset;\n        }\n\n        if (_.options.fade === true || _.options.touchMove === false) {\n            return false;\n        }\n\n        if (_.animating === true) {\n            _.swipeLeft = null;\n            return false;\n        }\n\n        _.setCSS(_.swipeLeft);\n\n    };\n\n    Slick.prototype.swipeStart = function(event) {\n\n        var _ = this,\n            touches;\n\n        _.interrupted = true;\n\n        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {\n            _.touchObject = {};\n            return false;\n        }\n\n        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {\n            touches = event.originalEvent.touches[0];\n        }\n\n        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;\n        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;\n\n        _.dragging = true;\n\n    };\n\n    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {\n\n        var _ = this;\n\n        if (_.$slidesCache !== null) {\n\n            _.unload();\n\n            _.$slideTrack.children(this.options.slide).detach();\n\n            _.$slidesCache.appendTo(_.$slideTrack);\n\n            _.reinit();\n\n        }\n\n    };\n\n    Slick.prototype.unload = function() {\n\n        var _ = this;\n\n        $('.slick-cloned', _.$slider).remove();\n\n        if (_.$dots) {\n            _.$dots.remove();\n        }\n\n        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {\n            _.$prevArrow.remove();\n        }\n\n        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {\n            _.$nextArrow.remove();\n        }\n\n        _.$slides\n            .removeClass('slick-slide slick-active slick-visible slick-current')\n            .attr('aria-hidden', 'true')\n            .css('width', '');\n\n    };\n\n    Slick.prototype.unslick = function(fromBreakpoint) {\n\n        var _ = this;\n        _.$slider.trigger('unslick', [_, fromBreakpoint]);\n        _.destroy();\n\n    };\n\n    Slick.prototype.updateArrows = function() {\n\n        var _ = this,\n            centerOffset;\n\n        centerOffset = Math.floor(_.options.slidesToShow / 2);\n\n        if ( _.options.arrows === true &&\n            _.slideCount > _.options.slidesToShow &&\n            !_.options.infinite ) {\n\n            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');\n            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');\n\n            if (_.currentSlide === 0) {\n\n                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');\n                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');\n\n            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {\n\n                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');\n                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');\n\n            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {\n\n                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');\n                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');\n\n            }\n\n        }\n\n    };\n\n    Slick.prototype.updateDots = function() {\n\n        var _ = this;\n\n        if (_.$dots !== null) {\n\n            _.$dots\n                .find('li')\n                    .removeClass('slick-active')\n                    .end();\n\n            _.$dots\n                .find('li')\n                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))\n                .addClass('slick-active');\n\n        }\n\n    };\n\n    Slick.prototype.visibility = function() {\n\n        var _ = this;\n\n        if ( _.options.autoplay ) {\n\n            if ( document[_.hidden] ) {\n\n                _.interrupted = true;\n\n            } else {\n\n                _.interrupted = false;\n\n            }\n\n        }\n\n    };\n\n    $.fn.slick = function() {\n        var _ = this,\n            opt = arguments[0],\n            args = Array.prototype.slice.call(arguments, 1),\n            l = _.length,\n            i,\n            ret;\n        for (i = 0; i < l; i++) {\n            if (typeof opt == 'object' || typeof opt == 'undefined')\n                _[i].slick = new Slick(_[i], opt);\n            else\n                ret = _[i].slick[opt].apply(_[i].slick, args);\n            if (typeof ret != 'undefined') return ret;\n        }\n        return _;\n    };\n\n}));\n"

/***/ })
/******/ ]);