define(['compact/collection/values'], function(getValues) {
	
	describe("compact/collection/values", function() {
		
		it("Returns an array of values for each item in the collection", function() {
			var test = {
				first: 1,
				second: 2,
				third: 3
			};
			expect( getValues(test) ).toEqual([1,2,3]);
		});
	
	});
	
});