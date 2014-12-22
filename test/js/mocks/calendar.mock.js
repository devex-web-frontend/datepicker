var CalendarMock = (function(DX, window, document, undefined) {
	'use strict';

	return function Calendar(container, config) {
		var block = DX.Dom.createElement('div', {
			className: 'calendar',
			innerHTML: config.tmpl
		});

		container.appendChild(block);

		CalendarMock.___instance = this;

		this.drawMonth = function() {

		};
		this.drawPrevMonth = function() {

		};
		this.drawNextMonth = function() {

		};
		this.registerProcessor = function() {

		};
		this.deregisterProcessor = function() {

		};
		this.getDate = function() {

		};
		this.update = function() {

		};
		this.getBlock = function() {
			return block;
		};
		this.getEventTarget = function() {
			return block;
		};
	};
})(DX, window, document);

CalendarMock.E_CREATED = 'calendar:created';
CalendarMock.E_DAY_SELECTED = 'calendar:dayselected';

CalendarMock.config = {
	dayAbbrs: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'],
	startOfWeekIndex: 0,
	monthNames: [
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december'
	],
	tmpl: [
		'<div class=".calendar--info">',
		'<span class="calendar--month calendar--month-current"></span>',
		'<span class="calendar--year"></span>',
		'</div>',
		'<div class="calendar--header"></div>',
		'<div class="calendar--dates"></div>'
	]
};
