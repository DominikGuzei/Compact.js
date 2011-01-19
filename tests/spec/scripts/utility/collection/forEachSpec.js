define(['utility/collection/forEach'], function(forEach) {
	
	describe("utility/collection/forEach", function() {
		
		it("Handles every element of an array", function() {
		  var array = [1,2,3];
			forEach(array, function(number, index, array) {
				array[index] = ++number;
			});
			expect(array).toEqual([2,3,4]);
		});
	
	});
	
});