define(['compact/collection/some'], function(some) {
	
	describe("compact/collection/some", function() {
		
		it("Returns true if the iterator returs true for any value", function() {
		  var array = [1,2,3];
			expect( some(array, function(value){return value == 2;}) ).toEqual(true);
			var test = {
				first: 1,
				second: 2,
				third: 3
			};
			expect( some(test, function(value){return value == 2;}) ).toEqual(true);
		});
	
	});
	
});