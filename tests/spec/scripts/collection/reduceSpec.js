define([
  'compact/collection/reduce'
], 

function(reduce) {

  describe("compact/collection/reduce", function() {

    it("Returns a single result from a list of array values", function() {
      var array = [1,2,3];
      expect (reduce(array, function(memo, num) {
        return memo + num;
      }, 0) ).toEqual(6);

      var test = {
        first: 1,
        second: 2,
        third: 3
      };
      expect (reduce(test, function(memo, num) {
        return memo + num;
      }, 0) ).toEqual(6);

    });

  });

});