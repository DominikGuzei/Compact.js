define([
  'compact/collection/find'
], 

function(find) {

  describe("compact/collection/find", function() {

    it("Returns the first value where the iterator returns true", function() {
      var array = [1,2,3];
      expect( find(array, function(value) {
        return value == 2;
      }) ).toEqual(2);

      var test = {
        first: 1,
        second: 2,
        third: 3
      };
      expect( find(test, function(value) {
        return value == 2;
      }) ).toEqual(2);

    });

  });

});