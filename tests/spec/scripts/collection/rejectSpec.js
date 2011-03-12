define([
  'compact/collection/reject'
], 

function(reject) {

  describe("compact/collection/reject", function() {

    it("Returns an array with all but those values where the iterator returned true", function() {
      var array = [1,2,3,4,5,6];
      expect( reject(array, function(value) {
        return value % 2 == 0;
      }) ).toEqual([1,3,5]);

      var test = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixt: 6 };
      expect( reject(test, function(value) {
        return value % 2 == 0;
      }) ).toEqual([1,3,5]);

    });

  });

});