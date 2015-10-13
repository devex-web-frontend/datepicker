describe('Datepicker', function() {
	var tmpl = '<input type="date" id="test">',
		predefinedTmpl = '<input id="test" type="date" min="2010-06-15" max="2010-10-05" value="2010-08-16" data-week-start="1"/>';

	beforeEach(function() {
		document.body.innerHTML = tmpl;
		window.DropDown = DropDownMock;
		window.Calendar = CalendarMock;
	});

	afterEach(function() {
		document.body.innerHTML = '';
		window.DropDown = window.Calendar = null;
	});

	describe('Constructor', function() {
		it('should generate wrapper', function() {
			var input = document.getElementById('test'),
				datepicker = new Datepicker(input);

			expect(document.querySelector('.datepicker')).not.toBeNull();
			expect(document.querySelector('.datepicker--input')).not.toBeNull();
			expect(document.querySelector('.button')).not.toBeNull();
		});

		it('should save original input', function() {
			var input = document.getElementById('test'),
				datepicker = new Datepicker(input),
				newInput = document.querySelector('.datepicker input');

			expect(input).toBe(newInput);
		});

		it('should change input type to text', function() {
			var input = document.getElementById('test');

			new Datepicker(input);

			expect(input.type).toBe('text');
		});

		it('should fire E_CREATED once and pass block and eventTarget as e.detail', function() {
			var input = document.getElementById('test'),
				spy = jasmine.createSpy('created');

			input.addEventListener(Datepicker.E_CREATED, spy);

			new Datepicker(input);

			expect(spy).toHaveBeenCalled();
			expect(spy.calls.length).toBe(1);
			expect(spy.mostRecentCall.args[0].detail.block).toBe(document.querySelector('.datepicker'));
			expect(spy.mostRecentCall.args[0].detail.eventTarget).toBe(input);
		});
	});

	describe('Methods', function() {
		describe('#getBlock()', function() {
			it('should return created wrapper', function() {
				var datepicker = new Datepicker(document.getElementById('test'));

				expect(datepicker.getBlock()).toBe(document.querySelector('.datepicker'));
			});
		});

		describe('#getEventTarget()', function() {
			it('should return input passed', function() {
				var input = document.getElementById('test'),
					datepicker = new Datepicker(input);

				expect(datepicker.getEventTarget()).toBe(input);
			});
		});

		describe('#setDateFormatter()', function() {
			iit('should set provided function as default date formatter', function() {
				var input = document.getElementById('test'),
					datepicker = new Datepicker(input),
					customFormatter = function() {
						return 'date!'
					};

				datepicker.setDateFormatter(customFormatter);



				DX.Event.trigger(document.querySelector('.calendar'), Calendar.E_DAY_SELECTED, {
					detail: {
						dayModel: {
							date: new Date(2014, 0, 1),
							modifiers: ['currentMonth'],
							calendarMonth: new Date(2014, 0, 1)
						}
					}
				});
				waitsFor(function() {
					return input.value !== '';
				}, 500);

				runs(function() {
					expect(input.value).toBe('date!');
				});

			});
		});
	});

	describe('Calendar.E_DAY_SELECTED', function() {
		it('should change input value on event fire', function() {
			var input = document.getElementById('test');
			new Datepicker(input);

			waitsFor(function() {
				return input.value !== '';
			}, 500);

			DX.Event.trigger(document.querySelector('.calendar'), Calendar.E_DAY_SELECTED, {
				detail: {
					dayModel: {
						date: new Date(2014, 0, 1),
						modifiers: ['currentMonth'],
						calendarMonth: new Date(2014, 0, 1)
					}
				}
			});

			runs(function() {
				expect(input.value).toBe('2014-01-01');
			});

		});
	});

	describe('Constants', function() {
		it('should provide event names as public constants', function() {
			expect(Datepicker.E_CHANGED).toBe('datepicker:changed');
			expect(Datepicker.E_UPDATE_CONSTRAINTS).toBe('datepicker:updateconstraints');
		});
	});
});