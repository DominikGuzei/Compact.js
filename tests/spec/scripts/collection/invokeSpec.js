define([
  'compact/collection/invoke'
], 

function(invoke) {

  describe("compact/collection/invoke", function() {

    it("executes a method on every element in the collection", function() {
      
      var TestModule = function(){};
      TestModule.prototype.methodToCall = function() {};
      var instance = new TestModule();
      var instance2 = new TestModule();
      spyOn(instance, 'methodToCall');
      spyOn(instance2, 'methodToCall');
      
      invoke([instance, instance2], 'methodToCall', "test");
      
      expect(instance.methodToCall).toHaveBeenCalledWith("test");
      expect(instance2.methodToCall).toHaveBeenCalledWith("test");
      
    });

  });

});