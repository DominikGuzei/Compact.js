define([
  'compact/array/indexOf', 
], 

function(indexOf) {

  describe("compact/array/indexOf", function() {
    
    it("returns the index of given element in the array", function() {
      
      var searchedElement = {};
      var array = [0,1,searchedElement,2,3];
      
      expect(indexOf(array, searchedElement)).toBe(2);
      
    });
    
  });
  
});