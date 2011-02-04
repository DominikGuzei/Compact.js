define(['compact/collection/map'], function(map) {
	
	describe("compact/collection/map", function() {
		
		it("Returns a new array with each value iterated over", function() {
		  var array = [1,2,3];
			expect(map(array, function(number, index, array) {
					return number + 1;
				})
			).toEqual([2,3,4]);
		});
		
		it("Returns a new array with each property iterated over", function() {
		  var test = {
				first: 1,
				second: 2,
				third: 3
			};
			expect(map(test, function(property, key, object) {
					return property + 1;
				})
			).toEqual([2,3,4]);
		});
	
	});
	
});