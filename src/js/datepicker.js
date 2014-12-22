/**
 * @copyright Devexperts
 *
 * @requires DX
 * @requires DX.Dom
 * @requires DX.Date
 * @requires DX.Event
 */
var Datepicker = (function(DX, window, document, undefined) {
	'use strict';

	var dom = DX.Dom,
		dateUtil = DX.Date,
		event = DX.Event,
		CN_DATEPICKER = 'datepicker',
		CN_DATEPICKER_INPUT = CN_DATEPICKER + '--input',
		CN_DROPDOWN = 'dropDown',
		CN_DROPDOWN_CALENDAR = CN_DROPDOWN + '--calendar',
		CN_BUTTON = 'button',
		CN_CALENDAR = 'calendar',
		M_SELECTED = 'selected',
		M_DISABLED = 'disabled',
		M_CURRENT_MONTH = 'currentMonth',
		CN_CALENDAR_SWITCHER = CN_CALENDAR + '--switcher',
		CN_CALENDAR_SWITCHER_NEXT = CN_CALENDAR_SWITCHER + '-next',
		CN_CALENDAR_SWITCHER_PREV = CN_CALENDAR_SWITCHER + '-prev',
		CN_CALENDAR_INFO = CN_CALENDAR + '--info',
		CN_CALENDAR_HEADER = CN_CALENDAR + '--header',
		CN_CALENDAR_DATES = CN_CALENDAR + '--dates',
		CN_CALENDAR_MONTH = CN_CALENDAR + '--month',
		CN_CALENDAR_MONTH_CURRENT = CN_CALENDAR_MONTH + '-current',
		CN_CALENDAR_YEAR = CN_CALENDAR + '--year',
		A_MAX_DATE = 'max',
		A_MIN_DATE = 'min',
		tmplContainerInner = [
			'<span class="' + CN_DATEPICKER_INPUT + '"></span>',
			'<button type="button" class="button"><span>Show Calendar</span></button>'
		].join(''),
		TMPL_DROPDOWN_INNER = [
			'<div class="' + CN_DROPDOWN_CALENDAR + '"></div>'
		].join(''),
		TMPL_CALENDAR = [
			'<div class="' + CN_CALENDAR_INFO +'">',
				'<button class="' + [CN_BUTTON, CN_CALENDAR_SWITCHER, CN_CALENDAR_SWITCHER_PREV].join(' ') + '"><span>prev</span></button>',
				'<span class="' + [CN_CALENDAR_MONTH, CN_CALENDAR_MONTH_CURRENT].join(' ') + '"></span>',
				'<span class="' + CN_CALENDAR_YEAR + '"></span>',
				'<button class="' + [CN_BUTTON, CN_CALENDAR_SWITCHER, CN_CALENDAR_SWITCHER_NEXT].join(' ') + '"><span>next</span></button>',
			'</div>',
			'<div class="' + CN_CALENDAR_HEADER + '"></div>',
			'<div class="' + CN_CALENDAR_DATES + '"></div>'
		].join('');


	function createWidget(input) {
		var parent = dom.getParent(input),
			container = dom.createElement('span', {
				className: CN_DATEPICKER,
				innerHTML: tmplContainerInner
			}),
			inputWrapper = container.querySelector('.' + CN_DATEPICKER_INPUT);

		input.type = 'text';
		parent.insertBefore(container, input);
		inputWrapper.appendChild(input);

		return container;
	}

	function fireDateChanged(input) {
		event.trigger(input, Datepicker.E_CHANGED);
	}

	function isSelectableDate(dateObject) {
		return dateObject.modifiers.indexOf(M_DISABLED) === -1 &&
				dateObject.modifiers.indexOf(M_CURRENT_MONTH) > -1;
	}

	function isDateInRange(date, config) {
		var firstAvailableDate = new Date(config.min),
			lastAvailableDate = new Date(config.max),
			isGreaterOrEqual = true,
			isLessOrEqual = true;

		if (config.min) {
			isGreaterOrEqual = dateUtil.isGreater(date, firstAvailableDate) ||
					dateUtil.isEqual(date, firstAvailableDate);
		}

		if (config.max) {
			isLessOrEqual = dateUtil.isLess(date, lastAvailableDate) ||
					dateUtil.isEqual(date, lastAvailableDate);
		}

		return isLessOrEqual && isGreaterOrEqual;
	}

	/**
	 * @constructor
	 */
	return function Datepicker(input) {
		var dropdown, calendar, elements, container, selectedDate, constraints;

		function init() {
			constraints = constraints ? constraints : {};

			updateConstraints();
			initAppearance();
			initDropdown();
			initCalendar();
			initElements();
			initListeners();

			DX.Event.trigger(input, Datepicker.E_CREATED, {
				detail: {
					block: container,
					eventTarget: input
				}
			});
		}

		function updateConstraints() {
			var minDate = input.getAttribute(A_MIN_DATE),
				maxDate = input.getAttribute(A_MAX_DATE);

			constraints.min = minDate ? minDate : undefined;
			constraints.max = maxDate ? maxDate : undefined;
		}

		function initAppearance() {
			container = createWidget(input);
		}

		function initDropdown() {
			dropdown = new DropDown(input, {
				innerTmpl: TMPL_DROPDOWN_INNER,
				modifiers: CN_DATEPICKER
			});
		}

		function initCalendar() {
			var calendarBlock = dropdown.getBlock().querySelector('.' + CN_DROPDOWN_CALENDAR);

			calendar = new Calendar(calendarBlock, {
				tmpl: TMPL_CALENDAR
			});

			calendar.registerProcessor(selectedDateProcessor);
			calendar.registerProcessor(disabledDatesProcessor);
		}

		function initElements() {
			var dropdownBlock = dropdown.getBlock();

			elements = {
				input: input,
				container: container,
				dropDownOpener: container.querySelector('.button'),
				calendarContainer: dropdownBlock.querySelector('.' + CN_DROPDOWN_CALENDAR),
				nextSwitcher: dropdownBlock.querySelector('.' + CN_CALENDAR_SWITCHER_NEXT),
				prevSwitcher: dropdownBlock.querySelector('.' + CN_CALENDAR_SWITCHER_PREV)
			};
		}

		function initListeners() {
			elements.dropDownOpener.addEventListener(event.CLICK, function() {
				dropdown.show();
			});
			elements.prevSwitcher.addEventListener(event.CLICK, function() {
				calendar.drawPrevMonth();
				toggleSwitchersState();
			});
			elements.nextSwitcher.addEventListener(event.CLICK, function() {
				calendar.drawNextMonth();
				toggleSwitchersState();
			});

			calendar.getEventTarget().addEventListener(Calendar.E_DAY_SELECTED, selectDate);

			dropdown.getEventTarget().addEventListener(DropDown.E_SHOWN, setDefaultValue);

			input.addEventListener(Datepicker.E_UPDATE_CONSTRAINTS, updateConstraints);
			input.addEventListener(event.BLUR, function() {
				fireDateChanged(input);
			});
		}

		function setDefaultValue() {
			var valueDate = new Date(input.value),
				date;

			if (dateUtil.isDate(valueDate)) {
				date = valueDate;
				selectedDate = date;
			} else {
				date = new Date();
			}

			calendar.drawMonth(date);
			toggleSwitchersState();
		}

		function toggleSwitchersState() {
			var currentMonth = calendar.getDate(),
				lastAvailableMonth = new Date(constraints.max),
				firstAvailableMonth = new Date(constraints.min);

			if (dateUtil.isDate(lastAvailableMonth)) {
				elements.nextSwitcher.disabled = dateUtil.isEqualMonth(currentMonth, lastAvailableMonth) ||
						dateUtil.isGreaterMonth(currentMonth, lastAvailableMonth);
			} else {
				elements.nextSwitcher.disabled = false;
			}

			if (dateUtil.isDate(firstAvailableMonth)) {
				elements.prevSwitcher.disabled = dateUtil.isEqualMonth(currentMonth, firstAvailableMonth) ||
						dateUtil.isLessMonth(currentMonth, firstAvailableMonth);
			} else {
				elements.prevSwitcher.disabled = false;
			}
		}

		function selectDate(e) {
			var dayModel = e.detail.dayModel;

			if (isSelectableDate(dayModel)) {
				selectedDate = dayModel.date;
				input.value = dateUtil.toShortISOString(selectedDate);
				calendar.update();
				dropdown.hide();
				fireDateChanged(input);
			}
		}

		function selectedDateProcessor(dateObject) {
			if (selectedDate && dateUtil.isEqual(dateObject.date, selectedDate)) {
				dateObject.modifiers.push(M_SELECTED);
			}
		}

		function disabledDatesProcessor(dateObject) {
			var date = dateObject.date;

			if (!isDateInRange(date, constraints)) {
				dateObject.modifiers.push(M_DISABLED);
			}
		}

		init();

		this.getBlock = function() {
			return container;
		};
		this.getEventTarget = function() {
			return input;
		};
	};
})(DX, window, document);

Datepicker.E_CREATED = 'datepicker:created';
Datepicker.E_CHANGED = 'datepicker:changed';
Datepicker.E_UPDATE_CONSTRAINTS = 'datepicker:updateconstraints';
