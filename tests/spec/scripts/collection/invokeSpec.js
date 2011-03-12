define([
  'compact/collection/invoke'
], 

function(invoke) {

  describe("compact/collection/invoke", function() {

    it("executes a method on every element in the collection", function() {
      
      var TestClass = function(){};
      TestClass.prototype.methodToCall = function() {};
      var instance = new TestClass();
      var instance2 = new TestClass();
      spyOn(instance, 'methodToCall');
      spyOn(instance2, 'methodToCall');
      
      invoke([instance, instance2], 'methodToCall', "test");
      
      expect(instance.methodToCall).toHaveBeenCalledWith("test");
      expect(instance2.methodToCall).toHaveBeenCalledWith("test");
      
    });

  });

});