describe('Datepicker', function() {
	var months = ['january', 'february', 'march', 'april', 'may', 'june',
		'july', 'august', 'september', 'october', 'november', 'december'];

	describe('simple template', function() {
		beforeEach(function() {
			browser().navigateTo('/test/js/html/simple.html');
		});
		afterEach(function() {
			browser().navigateTo('');
		});

		describe('dropdown', function() {
			it('should show dropdown after click on .button', function() {
				element('.datepicker .button').click();

				expect(element('.dropDown-shown').count()).toBe(1);
			});
		});

		describe('calendar', function() {
			it('should draw current month by default', function() {
				element('.datepicker .button').click();
				sleep(0.05);

				expect(element('.calendar--month-current').text()).toBe(months[new Date().getMonth()])
			});

			it('should show current month every time when dropdown is shown and date not selected', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--switcher-prev').click();
				sleep(0.05);
				expect(element('.calendar--month-current').text()).not().toBe(months[new Date().getMonth()]);

				element('body').click();
				sleep(0.05);
				element('.datepicker .button').click();
				sleep(0.05);

				expect(element('.calendar--month-current').text()).toBe(months[new Date().getMonth()]);
			});
		});
	});

	describe('predefined template', function() {
		beforeEach(function() {
			browser().navigateTo('/test/js/html/predefined.html');
		});
		afterEach(function() {
			browser().navigateTo('');
		});

		describe('calendar', function() {
			it('should draw month by input.value', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				expect(element('.calendar--month-current').text()).toBe('august');
			});

			it('should show month of selected date every time when dropdown is shown', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--switcher-prev').click();
				sleep(0.05);
				expect(element('.calendar--month-current').text()).toBe('july');

				element('body').click();
				sleep(0.05);
				element('.datepicker .button').click();
				sleep(0.05);

				expect(element('.calendar--month-current').text()).toBe('august');
			});

			it('should select predefined date', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				expect(element('.calendar--day-selected').count()).toBe(1);
				expect(element('.calendar--day-selected').text()).toBe('16');
			});

			it('should draw next month if clicked on .calendar--switcher-next', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--switcher-next').click();
				expect(element('.calendar--month-current').text()).toBe('september');
			});

			it('should draw previous month if clicked on .calendar--switcher-prev', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--switcher-prev').click();
				expect(element('.calendar--month-current').text()).toBe('july');
			});

			it('should disable possibility to draw next month if next month follows after date from max attribute', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--switcher-next').click();
				expect(element('.calendar--switcher-next[disabled]').count()).toBe(0);
				element('.calendar--switcher-next').click();
				expect(element('.calendar--switcher-next[disabled]').count()).toBe(1);
			});

			it('should disable possibility to draw previous month if previous month follows before date from min attribute', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--switcher-prev').click();
				expect(element('.calendar--switcher-prev[disabled]').count()).toBe(0);
				element('.calendar--switcher-prev').click();
				expect(element('.calendar--switcher-prev[disabled]').count()).toBe(1);
			});


			it('should select date when user click on .calendar--day', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--dates:last-child .calendar--day:nth-child(14)').click();
				sleep(0.05);
				expect(element('.calendar--day-selected').count()).toBe(1);
			});

			it('should hide dropdown when user select date', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				expect(element('.dropDown-datepicker.dropDown-shown').count()).toBe(1);

				element('.calendar--dates:last-child .calendar--day:nth-child(14)').click();
				expect(element('.dropDown-datepicker.dropDown-shown').count()).toBe(0);
			});

			it('should change constraints when "datepicker:updateconstraints" received on input element', function() {
				element('input').attr('max', '');
				element('.datepicker .button').click();
				sleep(0.05);
				trigger('input', 'datepicker:updateconstraints');
				sleep(0.05);
				element('.calendar--switcher-next').click();
				sleep(0.05);
				element('.calendar--switcher-next').click();
				sleep(0.05);

				expect(element('.calendar--day-disabled').count()).toBe(0);
			});
		});

		describe('input field', function() {
			it('should write selected date to input as short ISO string', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--dates:last-child .calendar--day:nth-child(14)').click();
				expect(element('input').val()).toBe('2010-08-14');
			});

			it('should not change value if clicked on disabled date', function() {
				element('.datepicker .button').click();
				sleep(0.05);
				element('.calendar--switcher-prev').click();
				element('.calendar--switcher-prev').click();

				element('.calendar--day-disabled:nth-child(2)').click();
				expect(element('input').val()).toBe('2010-08-16');
			});
		});
	});
});