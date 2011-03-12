define([
  'compact/collection/every'
], 

function(every) {

  describe("compact/collection/every", function() {

    it("Returns true if the iterator returs true for all values", function() {
      var array = [1,2,3];
      expect( every(array, function(value) {
        return true;
      }) ).toEqual(true);

      var test = {
        first: 1,
        second: 2,
        third: 3
      };
      
      expect( every(test, function(value) {
        return true;
      }) ).toEqual(true);
    });
    
    it("Returns false if the iterator returns false for any value", function() {
      expect( every([1,2,3], function(value) {
        return value == 2 ? false : true;
      })).toBe(false);
    });

  });

});