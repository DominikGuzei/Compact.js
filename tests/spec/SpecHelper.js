
	beforeEach(function() {
	  this.addMatchers({
	    toBeTypeOf: function(expected) {
	      return typeof(this.actual) == expected;
	    }
	  })
	});
