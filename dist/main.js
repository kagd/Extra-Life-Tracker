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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/single-donation-tracker.ts":
/*!****************************************!*\
  !*** ./src/single-donation-tracker.ts ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var SingleDonationTracker = /** @class */ (function () {
    function SingleDonationTracker(settings) {
        this.state = {
            positionInRotation: 0,
        };
        this.settings = settings;
        if (this.settings.displayCount > this.settings.participantIds.length || this.settings.displayCount < 1) {
            this.settings.displayCount = settings.participantIds.length;
        }
    }
    /* Initial setup of the layout and theme based on user settings */
    SingleDonationTracker.prototype.start = function () {
        /* Call updateParticipants to do initial populate and then repeat at interval */
        this.updateParticipants();
        this.refreshIntervalId = setInterval(this.updateParticipants, this.settings.refreshTimeMS);
    };
    SingleDonationTracker.prototype.updateParticipants = function () {
        var _this = this;
        var displayingParticipants = [];
        var participantIds = this.settings.participantIds;
        for (var i = 0; i < this.settings.displayCount; i++) {
            displayingParticipants.push(participantIds[this.state.positionInRotation]);
            if (this.state.positionInRotation === participantIds.length - 1) {
                this.state.positionInRotation = 0;
            }
            else {
                this.state.positionInRotation += 1;
            }
        }
        var participantResults = [];
        for (var i = 0; i < displayingParticipants.length; i++) {
            var params = {
                fuseaction: 'donordrive.participant',
                participantID: displayingParticipants[i],
            };
            this.callAPI(params, function (result) {
                participantResults.push(result);
                if (participantResults.length === displayingParticipants.length) {
                    jquery__WEBPACK_IMPORTED_MODULE_0__("#participant-trackers").html("");
                    for (var j = 0; j < displayingParticipants.length; j++) {
                        for (var k = 0; k < participantResults.length; k++) {
                            if (participantResults[k].participantID === displayingParticipants[j]) {
                                _this.makeParticipantTracker(participantResults[k]);
                            }
                        }
                    }
                }
            });
        }
    };
    SingleDonationTracker.prototype.makeParticipantTracker = function (participantData) {
        // Temp
        participantData.totalRaisedAmount = Math.random() * 1000;
        participantData.fundraisingGoal = 1000;
        // end Temp
        var barWidth = Math.round(participantData.totalRaisedAmount / participantData.fundraisingGoal * 100);
        var amtRaised = this.toCurrency(participantData.totalRaisedAmount) + " / " + this.toCurrency(participantData.fundraisingGoal);
        var tracker = jquery__WEBPACK_IMPORTED_MODULE_0__("\n      <div class=\"participant-tracker-container\">\n        <div class=\"raised-bar\" style=\"width:'" + barWidth + "%;'\"></div>\n        <div class=\"name\">" + participantData.displayName + "</div>\n        <div class=\"raised\">" + amtRaised + "</div>\n      </div>");
        tracker.appendTo('#participant-trackers');
    };
    SingleDonationTracker.prototype.callAPI = function (data, callback) {
        var params = {
            type: 'GET',
            dataType: 'json',
            url: SingleDonationTracker.baseURL,
            data: __assign({}, data, { format: 'json', timestamp: new Date().getTime() }),
            success: function (response) {
                callback(response);
            },
        };
        jquery__WEBPACK_IMPORTED_MODULE_0__["ajax"](params);
    };
    SingleDonationTracker.prototype.isEmpty = function (value) {
        return (value == null || value === "");
    };
    SingleDonationTracker.prototype.toCurrency = function (value) {
        return window.currency(value, SingleDonationTracker.currencyOptions).format();
    };
    SingleDonationTracker.baseURL = "https://www.extra-life.org/index.cfm";
    SingleDonationTracker.currencyOptions = {
        formatWithSymbol: true,
        precision: 0,
        separator: ',',
    };
    return SingleDonationTracker;
}());


/***/ }),

/***/ 0:
/*!**********************************************!*\
  !*** multi ./src/single-donation-tracker.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/single-donation-tracker.ts */"./src/single-donation-tracker.ts");


/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jquery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jquery;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NpbmdsZS1kb25hdGlvbi10cmFja2VyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImpxdWVyeVwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuRTRCO0FBc0M1QjtJQVdFLCtCQUFZLFFBQW1CO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxrQkFBa0IsRUFBRSxDQUFDO1NBQ3RCLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUM5RCxDQUFDO0lBQ0gsQ0FBQztJQUVELGtFQUFrRTtJQUNsRSxx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dkIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixTQUFTLEVBQUUsQ0FBQztRQUNaLFNBQVMsRUFBRSxHQUFHO0tBQ2YsQ0FBQztJQTJHSiw0QkFBQztDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2SkQsd0IiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJpbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbmludGVyZmFjZSBJU3RhdGUge1xuICBwb3NpdGlvbkluUm90YXRpb246IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElTZXR0aW5ncyB7XG4gIHBhcnRpY2lwYW50SWRzOiBudW1iZXJbXTtcbiAgZGlzcGxheUNvdW50OiBudW1iZXI7XG4gIHRlYW1JZDogc3RyaW5nO1xuICByZWZyZXNoVGltZU1TOiBudW1iZXI7XG4gIGxvZ1doZW5VcGRhdGluZzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIElQYXJ0aWNpcGFudCB7XG4gIGRpc3BsYXlOYW1lOiBzdHJpbmc7XG4gIHRvdGFsUmFpc2VkQW1vdW50OiBudW1iZXI7XG4gIGZ1bmRyYWlzaW5nR29hbDogbnVtYmVyO1xuICBwYXJ0aWNpcGFudElEOiBudW1iZXI7XG4gIGNyZWF0ZWRPbjogc3RyaW5nO1xuICBhdmF0YXJJbWFnZVVSTDogc3RyaW5nO1xuICB0aW1lc3RhbXA6IG51bWJlcjtcbiAgdGVhbUlEOiBudW1iZXI7XG4gIGlzVGVhbUNhcHRhaW46IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBJQXBpUGFyYW1zIHtcbiAgZnVzZWFjdGlvbjogc3RyaW5nO1xuICBwYXJ0aWNpcGFudElEOiBudW1iZXI7XG4gIGZvcm1hdDogJ2pzb24nO1xuICB0aW1lc3RhbXA6IHN0cmluZyB8IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElDYWxsQXBpIHtcbiAgZnVzZWFjdGlvbjogc3RyaW5nO1xuICBwYXJ0aWNpcGFudElEOiBudW1iZXI7XG59XG5cbmNsYXNzIFNpbmdsZURvbmF0aW9uVHJhY2tlciB7XG4gIHN0YXRpYyBiYXNlVVJMID0gXCJodHRwczovL3d3dy5leHRyYS1saWZlLm9yZy9pbmRleC5jZm1cIjtcbiAgc3RhdGljIGN1cnJlbmN5T3B0aW9ucyA9IHtcbiAgICBmb3JtYXRXaXRoU3ltYm9sOiB0cnVlLFxuICAgIHByZWNpc2lvbjogMCxcbiAgICBzZXBhcmF0b3I6ICcsJyxcbiAgfTtcbiAgc3RhdGU6IElTdGF0ZTtcbiAgc2V0dGluZ3M6IElTZXR0aW5ncztcbiAgcmVmcmVzaEludGVydmFsSWQ/OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IElTZXR0aW5ncykge1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBwb3NpdGlvbkluUm90YXRpb246IDAsXG4gICAgfTtcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGlzcGxheUNvdW50ID4gdGhpcy5zZXR0aW5ncy5wYXJ0aWNpcGFudElkcy5sZW5ndGggfHwgdGhpcy5zZXR0aW5ncy5kaXNwbGF5Q291bnQgPCAxKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmRpc3BsYXlDb3VudCA9IHNldHRpbmdzLnBhcnRpY2lwYW50SWRzLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICAvKiBJbml0aWFsIHNldHVwIG9mIHRoZSBsYXlvdXQgYW5kIHRoZW1lIGJhc2VkIG9uIHVzZXIgc2V0dGluZ3MgKi9cbiAgc3RhcnQoKSB7XG4gICAgLyogQ2FsbCB1cGRhdGVQYXJ0aWNpcGFudHMgdG8gZG8gaW5pdGlhbCBwb3B1bGF0ZSBhbmQgdGhlbiByZXBlYXQgYXQgaW50ZXJ2YWwgKi9cbiAgICB0aGlzLnVwZGF0ZVBhcnRpY2lwYW50cygpO1xuICAgIHRoaXMucmVmcmVzaEludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aGlzLnVwZGF0ZVBhcnRpY2lwYW50cywgdGhpcy5zZXR0aW5ncy5yZWZyZXNoVGltZU1TKTtcbiAgfVxuXG4gIHVwZGF0ZVBhcnRpY2lwYW50cygpIHtcbiAgICBjb25zdCBkaXNwbGF5aW5nUGFydGljaXBhbnRzOiBudW1iZXJbXSA9IFtdO1xuICAgIGNvbnN0IHtcbiAgICAgIHBhcnRpY2lwYW50SWRzLFxuICAgIH0gPSB0aGlzLnNldHRpbmdzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNldHRpbmdzLmRpc3BsYXlDb3VudDsgaSsrKSB7XG4gICAgICAgIGRpc3BsYXlpbmdQYXJ0aWNpcGFudHMucHVzaChwYXJ0aWNpcGFudElkc1t0aGlzLnN0YXRlLnBvc2l0aW9uSW5Sb3RhdGlvbl0pO1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnBvc2l0aW9uSW5Sb3RhdGlvbiA9PT0gcGFydGljaXBhbnRJZHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUucG9zaXRpb25JblJvdGF0aW9uID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnBvc2l0aW9uSW5Sb3RhdGlvbiArPSAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGFydGljaXBhbnRSZXN1bHRzOiBJUGFydGljaXBhbnRbXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwbGF5aW5nUGFydGljaXBhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIGZ1c2VhY3Rpb246ICdkb25vcmRyaXZlLnBhcnRpY2lwYW50JyxcbiAgICAgICAgcGFydGljaXBhbnRJRDogZGlzcGxheWluZ1BhcnRpY2lwYW50c1tpXSxcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuY2FsbEFQSShwYXJhbXMsIChyZXN1bHQ6IElQYXJ0aWNpcGFudCkgPT4ge1xuICAgICAgICBwYXJ0aWNpcGFudFJlc3VsdHMucHVzaChyZXN1bHQpO1xuXG4gICAgICAgIGlmIChwYXJ0aWNpcGFudFJlc3VsdHMubGVuZ3RoID09PSBkaXNwbGF5aW5nUGFydGljaXBhbnRzLmxlbmd0aCkge1xuICAgICAgICAgICQoXCIjcGFydGljaXBhbnQtdHJhY2tlcnNcIikuaHRtbChcIlwiKTtcblxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGlzcGxheWluZ1BhcnRpY2lwYW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBwYXJ0aWNpcGFudFJlc3VsdHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgaWYgKHBhcnRpY2lwYW50UmVzdWx0c1trXS5wYXJ0aWNpcGFudElEID09PSBkaXNwbGF5aW5nUGFydGljaXBhbnRzW2pdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUGFydGljaXBhbnRUcmFja2VyKHBhcnRpY2lwYW50UmVzdWx0c1trXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG1ha2VQYXJ0aWNpcGFudFRyYWNrZXIocGFydGljaXBhbnREYXRhOiBJUGFydGljaXBhbnQpIHtcbiAgICAvLyBUZW1wXG4gICAgcGFydGljaXBhbnREYXRhLnRvdGFsUmFpc2VkQW1vdW50ID0gTWF0aC5yYW5kb20oKSAqIDEwMDA7XG4gICAgcGFydGljaXBhbnREYXRhLmZ1bmRyYWlzaW5nR29hbCA9IDEwMDA7XG4gICAgLy8gZW5kIFRlbXBcbiAgICBjb25zdCBiYXJXaWR0aCA9IE1hdGgucm91bmQocGFydGljaXBhbnREYXRhLnRvdGFsUmFpc2VkQW1vdW50IC8gcGFydGljaXBhbnREYXRhLmZ1bmRyYWlzaW5nR29hbCAqIDEwMCk7XG4gICAgY29uc3QgYW10UmFpc2VkID0gdGhpcy50b0N1cnJlbmN5KHBhcnRpY2lwYW50RGF0YS50b3RhbFJhaXNlZEFtb3VudCkgKyBcIiAvIFwiICsgdGhpcy50b0N1cnJlbmN5KHBhcnRpY2lwYW50RGF0YS5mdW5kcmFpc2luZ0dvYWwpO1xuXG4gICAgY29uc3QgdHJhY2tlciA9ICQoYFxuICAgICAgPGRpdiBjbGFzcz1cInBhcnRpY2lwYW50LXRyYWNrZXItY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyYWlzZWQtYmFyXCIgc3R5bGU9XCJ3aWR0aDonJHtiYXJXaWR0aH0lOydcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hbWVcIj4keyBwYXJ0aWNpcGFudERhdGEuZGlzcGxheU5hbWUgfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicmFpc2VkXCI+JHsgYW10UmFpc2VkIH08L2Rpdj5cbiAgICAgIDwvZGl2PmApO1xuXG4gICAgdHJhY2tlci5hcHBlbmRUbygnI3BhcnRpY2lwYW50LXRyYWNrZXJzJyk7XG4gIH1cblxuICBjYWxsQVBJKGRhdGE6IElDYWxsQXBpLCBjYWxsYmFjazogKHBhcnRpY2lwYW50OiBJUGFydGljaXBhbnQpID0+IGFueSkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIHVybDogU2luZ2xlRG9uYXRpb25UcmFja2VyLmJhc2VVUkwsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIGZvcm1hdDogJ2pzb24nLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlOiBJUGFydGljaXBhbnQpIHtcbiAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgJC5hamF4KHBhcmFtcyk7XG4gIH1cblxuICBpc0VtcHR5KHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09IFwiXCIpO1xuICB9XG5cbiAgdG9DdXJyZW5jeSggdmFsdWU6IG51bWJlciB8IHN0cmluZyApIHtcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmN1cnJlbmN5KHZhbHVlLCBTaW5nbGVEb25hdGlvblRyYWNrZXIuY3VycmVuY3lPcHRpb25zKS5mb3JtYXQoKTtcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBqcXVlcnk7Il0sInNvdXJjZVJvb3QiOiIifQ==