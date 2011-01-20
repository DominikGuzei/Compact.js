define(['utility/collection/forEach'], function(forEach) {
	
	describe("utility/collection/forEach", function() {
		
		it("Handles every element of an array", function() {
		  var array = [1,2,3];
			forEach(array, function(number, index, array) {
				array[index] = ++number;
			});
			expect(array).toEqual([2,3,4]);
		});
		
		it("Handles every element of an object", function() {
		  var test = {
				first: 1,
				second: 2,
				third: 3
			};
			forEach(test, function(property, key, object) {
				object[key] = ++property;
			});
			expect(test).toEqual({first:2,second:3,third:4});
		});
	
	});
	
});