angular.scenario.dsl('trigger', function() {
	return function(selector, eventType) {
		return this.addFutureAction('fire event ' + eventType, function($window, $document, done) {
			var element = $document.find(selector).get(0);

			function eventHandler() {
				element.removeEventListener(eventType, eventHandler);
				done();
			}
			element.addEventListener(eventType, eventHandler);

			DX.Event.trigger(element, eventType);
		});
	};
});