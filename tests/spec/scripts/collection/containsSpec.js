define([
  'compact/collection/contains'
], 

function(contains) {

  describe("compact/collection/contains", function() {

    beforeEach(function(){
      this.value = {};
    });
    
    it("Returns true if the collection contains (===) the given value", function() {
      var array = [1, this.value ,3];
      expect( contains(array, this.value) ).toBe(true);

      var test = {
        first: 1,
        second: this.value,
        third: 3
      };
      expect( contains(test, this.value) ).toBe(true);

    });
    
    it("returns false if the collection doesnt contain the value", function() {
      expect( contains([1, 2, 3], this.value) ).toBe(false);
    });

  });

});