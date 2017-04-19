Package('Setup.Views.Mixins', {
	Form : new Class({
		initForm : function(formId)
		{
			this.formId = formId;
			this.form = $('#' + formId);
		},

		drawError : function(which, error)
		{
			var fieldSet = this.form.find('#' + which + '-fields');

			fieldSet.removeClass('error success hint')
			if (error != '') fieldSet.addClass('error');

			this.form.find('#' + which + '-error').html(error);
		},

		drawSuccess : function(which, message)
		{
			var fieldSet = this.form.find('#' + which + '-fields');

			fieldSet.removeClass('error sucess hint')
			fieldSet.addClass('success');

			this.form.find('#' + which + '-error').html(message);
		},

		drawHint : function(which, on)
		{
			var fieldSet = this.form.find('#' + which + '-fields');

			if (on) fieldSet.addClass('hint');
			else  fieldSet.removeClass('hint');
		},

		checkDate : function(month, day, year)
		{
			month--;

			var date = new Date(year, month, day);

			return date.getDate() == day && date.getMonth() == month && date.getFullYear() == year;
		},

		validNumber : function(val, checkEmpty, rangeLow, rangeHigh)
		{
			var isNumber = /^\d+$/.test(val);
			var number = parseInt(val, 10);
			if (!checkEmpty && val == '') return 'ERR_NONE';
			if (checkEmpty && val == '') return 'ERR_EMPTY';
			if (!isNumber) return 'ERR_INVALID';
			if (rangeLow && number < rangeLow) return 'ERR_OUTOFRANGE';
			if (rangeHigh && number > rangeHigh) return 'ERR_OUTOFRANGE';
			return 'ERR_NONE';
		},

		validEmail : function(val, checkEmpty)
		{
			val = val.toLowerCase();
			var pattern = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
			if (checkEmpty && val == '') return 'ERR_EMPTY';
			else if (val !== '' && !pattern.test(val)) return 'ERR_INVALID';
			else return 'ERR_NONE';
		},

		validPassword : function(val, checkEmpty, testStrength)
		{
			testStrength = (testStrength === undefined)?true:testStrength
			if (checkEmpty && val == '') return 'ERR_EMPTY';
			if (!checkEmpty && val == '') return 'ERR_NONE';
			if (!testStrength) return 'ERR_NONE';
			else if (val.length < 8) return 'ERR_INVALID';
			else if (!(/[0-9].*/).test(val)) return 'ERR_INVALID';
			else if (!(/[a-z].*/i).test(val)) return 'ERR_INVALID';
			else return 'ERR_NONE';
		},

		validDateParts : function(month, day, year, checkEmpty)
		{
			var validMonth = this.validNumber(month, checkEmpty, 1, 12);
			var validDay = this.validNumber(day, checkEmpty, 1, 31);
			var validYear = this.validNumber(year, checkEmpty, 1900, 2100);

			if (validMonth != 'ERR_NONE') return validMonth;
			if (validDay != 'ERR_NONE') return validDay;
			if (validYear != 'ERR_NONE') return validYear;

			month = (month == '')?0:parseInt(month, 10);
			day = (day == '')?0:parseInt(day, 10);
			year = (year == '')?0:parseInt(year, 10);

			if (checkEmpty)
			{
				if (month == 0 && day == 0 && year == 0) return 'ERR_EMPTY';
				else if (month == 0 || day == 0 || year == 0) return 'ERR_INCOMPLETE';
			}
			else
			{
				if (month == 0 || day == 0 || year == 0) return 'ERR_NONE';
			}

			if (!this.checkDate(month, day, year)) return 'ERR_INVALID';

			return 'ERR_NONE';
		},

		onBlur : function(which)
		{
			this.validate(which, false);
			this.drawHint(which, false);
		},

		onFocus : function(which)
		{
			this.drawError(which, '');
			this.drawHint(which, true);
		}
	})
});
