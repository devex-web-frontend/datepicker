var DropDownMock = (function(DX, window, document, undefined) {
	'use strict';

	return function DropDown(control, config) {
		var block = DX.Dom.createElement('div', {
					className: 'dropDown',
					innerHTML: config.innerTmpl
				}),
				data,
				selectedIndex,
				isDdShown = false;

		document.body.appendChild(block);

		DropDownMock.___instance = this;

		DX.Event.trigger(control, DropDownMock.E_CREATED, {
			detail: {
				block: block,
				eventTarget: block
			}
		});

		this.setDataList = function(dataList) {
			data = dataList;
		};
		this.setSelectedIndex = function(index) {
			selectedIndex = index;
		};
		this.getSelectedIndex = function() {
			return selectedIndex;
		};
		this.show = function() {
			isDdShown = true;
			DX.Event.trigger(block, DropDownMock.E_SHOWN);
		};
		this.hide = function() {
			isDdShown = false;
			DX.Event.trigger(block, DropDownMock.E_HIDDEN);
		};
		this.isShown = function() {
			return isDdShown;
		};
		this.getBlock = function() {
			return block;
		};
		this.getEventTarget = function() {
			return block;
		};
	};
})(DX, window, document);

DropDownMock.E_CREATED = 'dropdown:created';
DropDownMock.E_SHOWN = 'dropdown:shown';
DropDownMock.E_HIDDEN = 'dropdown:hidden';
DropDownMock.E_CHANGED = 'dropdown:changed';

