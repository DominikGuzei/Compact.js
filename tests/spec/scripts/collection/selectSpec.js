define(['compact/collection/select'], function(select) {
	
	describe("compact/collection/select", function() {
		
		it("Returns an array with all values where the iterator returned true", function() {
		  var array = [1,2,3,4,5,6];
			expect( select(array, function(value){return value % 2 == 0;}) ).toEqual([2,4,6]);
			var test = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixt: 6 };
			expect( select(test, function(value){return value % 2 == 0;}) ).toEqual([2,4,6]);
		});
	
	});
	
});