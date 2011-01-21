define(['compact/utility/object/getValues'], function(getValues) {
	
	describe("compact/utility/object/getValues", function() {
		
		it("Returns true if the iterator returs true for any value", function() {
			var test = {
				first: 1,
				second: 2,
				third: 3
			};
			expect( getValues(test) ).toEqual([1,2,3]);
		});
	
	});
	
});