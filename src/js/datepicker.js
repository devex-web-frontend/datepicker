/**
 * @copyright Devexperts
 *
 * @requires DX
 * @requires DX.Dom
 * @requires DX.Tmpl
 * @requires DX.Date
 * @requires DX.Event
 * @namespace
 */
var Datepicker = (function(DX) {
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
		defaults = {
			isVisibleCalendar: false,
			isDisabledWeekends: false,
			disabledDates: [],
			disabledDatesRanges: [],
			CONTAINER_INNER_TMPL: [
				'<span class="' + CN_DATEPICKER_INPUT + '"></span>',
				'<button type="button" class="button">{%= BUTTON_INNER_TMPL %}</button>'
			].join(''),
			BUTTON_INNER_TMPL : '<span>Show Calendar</span>',
			TMPL_DROPDOWN_INNER: [
				'<div class="' + CN_DROPDOWN_CALENDAR + '"></div>'
			].join(''),
			NEXT_BUTTON_TMPL: '<span>next</span>',
			PREV_BUTTON_TMPL: '<span>prev</span>',
			TMPL_CALENDAR: [
				'<div class="' + CN_CALENDAR_INFO + '">',
				'<button class="' + [CN_BUTTON, CN_CALENDAR_SWITCHER, CN_CALENDAR_SWITCHER_PREV].join(' ') +
				'">{%= PREV_BUTTON_TMPL %}</button>',
				'<span class="' + [CN_CALENDAR_MONTH, CN_CALENDAR_MONTH_CURRENT].join(' ') + '"></span>',
				'<span class="' + CN_CALENDAR_YEAR + '"></span>',
				'<button class="' + [CN_BUTTON, CN_CALENDAR_SWITCHER, CN_CALENDAR_SWITCHER_NEXT].join(' ') +
				'">{%= NEXT_BUTTON_TMPL %}</button>',
				'</div>',
				'<div class="' + CN_CALENDAR_HEADER + '"></div>',
				'<div class="' + CN_CALENDAR_DATES + '"></div>'
			].join('')
		};

	function createWidget(input, config) {
		var parent = dom.getParent(input),
			container = dom.createElement('span', {
				className: CN_DATEPICKER,
				innerHTML: DX.Tmpl.process(config.CONTAINER_INNER_TMPL, config)
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

	function isWeekend (date) {
		var day = date.getDay();
		return day === 0 || day === 6
	}

	function isDateInRange(date, range) {
		var firstAvailableDate = new Date(range.min),
			lastAvailableDate = new Date(range.max),
			isGreaterOrEqual = true,
			isLessOrEqual = true;

		if (range.min) {
			isGreaterOrEqual = dateUtil.isGreater(date, firstAvailableDate) ||
				dateUtil.isEqual(date, firstAvailableDate);
		}

		if (range.max) {
			isLessOrEqual = dateUtil.isLess(date, lastAvailableDate) ||
				dateUtil.isEqual(date, lastAvailableDate);
		}

		return isLessOrEqual && isGreaterOrEqual;
	}

	/**
	 * Creates new datepicker
	 * @constructor Datepicker
	 * @param {Node|Element} input
	 * @param {Object} customConfig
	 */
	return function Datepicker(input, customConfig) {
		var dropdown, calendar, elements, container, selectedDate, constraints,
			config,
			dateFormatter = dateUtil.toShortISOString.bind(dateUtil),
			dateParser = function(value) {
				return new Date(value);
			};

		function init() {
			config = Object.assign({}, defaults, customConfig);
			constraints = constraints ? constraints : {};

			updateConstraints();
			initAppearance();
			initDropdown();
			initCalendar();
			initElements();
			initListeners();

			if (config.isVisibleCalendar) showDropdown();

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

		function showDropdown() {
			dropdown.show();
		}

		function updateConfig(event) {
			var updatedConfig = event.detail;
			config = Object.assign({}, config, updatedConfig);
			calendar.update();
		}

		function initAppearance() {
			container = createWidget(input, config);
			if(isDisabled()) {
				DX.Bem.addModifier(container, M_DISABLED);
			}
		}

		function initDropdown() {
			dropdown = new DropDown(input, {
				innerTmpl: config.TMPL_DROPDOWN_INNER,
				modifiers: CN_DATEPICKER
			});
		}
		function initCalendar() {
			var calendarBlock = dropdown.getBlock().querySelector('.' + CN_DROPDOWN_CALENDAR);
			calendar = new Calendar(calendarBlock, {
				tmpl: DX.Tmpl.process(config.TMPL_CALENDAR, config)
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
			elements.dropDownOpener.addEventListener(event.CLICK, dropDownOpenerClickHandler);

			elements.prevSwitcher.addEventListener(event.CLICK, prevSwitcherClickHandler);
			elements.nextSwitcher.addEventListener(event.CLICK, nextSwitcherClickHandler);

			calendar.getEventTarget().addEventListener(Calendar.E_DAY_SELECTED, selectDate);

			dropdown.getEventTarget().addEventListener(DropDown.E_SHOWN, setDefaultValue);

			input.addEventListener(Datepicker.E_UPDATE_CONSTRAINTS, updateConstraints);
			input.addEventListener(Datepicker.E_UPDATE_CONFIG, updateConfig);
			input.addEventListener(Datepicker.E_SHOW_DROPDOWN, showDropdown);
			input.addEventListener(event.BLUR, inputBlurHandler);
		}


		function destroy() {
			removeListeners();
			DX.Event.trigger(input, Datepicker.E_DESTROYED);
			dropdown.destroy();
		}

		function removeListeners() {
			elements.dropDownOpener.removeEventListener(event.CLICK, dropDownOpenerClickHandler);

			elements.prevSwitcher.removeEventListener(event.CLICK, prevSwitcherClickHandler);
			elements.nextSwitcher.removeEventListener(event.CLICK, nextSwitcherClickHandler);

			calendar.getEventTarget().removeEventListener(Calendar.E_DAY_SELECTED, selectDate);

			dropdown.getEventTarget().removeEventListener(DropDown.E_SHOWN, setDefaultValue);

			input.removeEventListener(Datepicker.E_UPDATE_CONSTRAINTS, updateConstraints);
			input.removeEventListener(Datepicker.E_UPDATE_CONFIG, updateConfig);
			input.removeEventListener(Datepicker.E_SHOW_DROPDOWN, showDropdown);
			input.removeEventListener(event.BLUR, inputBlurHandler);
		}


		function isDisabled() {
			return input.disabled;
		}

		function isDropDownShown() {
			return dropdown.isShown();
		}


		function setDefaultValue() {
			var valueDate = dateParser(input.value),
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
				input.value = dateFormatter(selectedDate);
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
			var currentDate = dateObject.date;

			var addDisabledModifier = function() {
				dateObject.modifiers.push(M_DISABLED);
			};

			var isDisabledFlag = !isDateInRange(currentDate, {
				min: constraints.min,
				max: constraints.max
			});

			isDisabledFlag && addDisabledModifier();

			if (!isDisabledFlag && config.isDisabledWeekends && isWeekend(currentDate)) {
				addDisabledModifier();
				isDisabledFlag = true;
			}

			if (!isDisabledFlag && config.disabledDates.length > 0) {
				var isDisabled = config.disabledDates.some(function(date){
					return dateUtil.isEqual(currentDate, date);
				});
				if (isDisabled) {
					addDisabledModifier();
					isDisabledFlag = true;
				}
			}

			if(!isDisabledFlag && config.disabledDatesRanges.length > 0) {
				var isDisabled = config.disabledDatesRanges.some(function(disabledDatesRange) {
					var min, max;
					min = disabledDatesRange[0];
					if (disabledDatesRange.length === 2) {
						max = disabledDatesRange[1];
					}
					return !isDateInRange(currentDate, {
						min: min,
						max: max
					});
				});

				if (isDisabled) {
					addDisabledModifier();
				}
			}
		}

		function dropDownOpenerClickHandler() {
			if (!isDisabled()) {
				showDropdown();
			}
		}
		function prevSwitcherClickHandler() {
			calendar.drawPrevMonth();
			toggleSwitchersState();
		}
		function nextSwitcherClickHandler() {
			calendar.drawNextMonth();
			toggleSwitchersState();
		}
		function inputBlurHandler() {
			fireDateChanged(input);
		}

		init();
		/**
		 * Checks if dropdown is shown
		 * @method isDropDownShown
		 * @returns {Node}
		 */
		this.isDropDownShown = isDropDownShown;

		/**
		 * Destroying datepicker component and its dropdown
		 * @method destroy
		 */
		this.destroy = destroy;

		/**
		 * Gets HTMLNode containing dropdown
		 * @method getBlock
		 * @returns {Node}
		 */
		this.getBlock = function() {
			return container;
		};
		/**
		 * Gets element which listens to events
		 * @method getEventTarget
		 * @returns {Node}
		 */
		this.getEventTarget = function() {
			return input;
		};
		/**
		 * Sets custom date formatter
		 * @method setDateFormatter
		 * @param {Function} customDateFormatter
		 */
		this.setDateFormatter = function(customDateFormatter) {
			dateFormatter = customDateFormatter;
		};
		/**
		 * Sets custom date parser
		 * @method setDateParser
		 * @param {Function} customDateParser
		 */
		this.setDateParser = function(customDateParser) {
			dateParser = customDateParser;
		};
	};
})(DX);
/** @constant
 * @type {string}
 * @default
 * @memberof Datepicker
 */
Datepicker.E_CREATED = 'datepicker:created';
/** @constant
 * @type {string}
 * @default
 * @memberof Datepicker
 */
Datepicker.E_CHANGED = 'datepicker:changed';
/** @constant
 * @type {string}
 * @default
 * @memberof Datepicker
 */
Datepicker.E_UPDATE_CONSTRAINTS = 'datepicker:updateconstraints';

/** @constant
 * @type {string}
 * @default
 * @memberof Datepicker
 */
Datepicker.E_UPDATE_CONFIG = 'datepicker:updateconfig';

/** @constant
 * @type {string}
 * @default
 * @memberof Datepicker
 */
Datepicker.E_SHOW_DROPDOWN = 'datepicker:showdropdown';


/**
 * Disable Datepicker
 * @param {HtmlElement} input
 */
Datepicker.disable = function enableDatepicker(input) {
	'use strict';

	var block = DX.Dom.getAscendantByClassName(input, 'datepicker');

	DX.Bem.addModifier(block, 'disabled');
	input.disabled = true;
};

/**
 * Enable Datepicker
 * @param {HtmlElement} input
 */
Datepicker.enable = function enableDatepicker(input) {
	'use strict';

	var block = DX.Dom.getAscendantByClassName(input, 'datepicker');

	DX.Bem.removeModifier(block, 'disabled');
	input.disabled = false;
};
