
  describe("compact/production/requireLess", function() {
    
    describe("define", function() {
      
      it("defines a module in the private repository", function() {
        
        var Module = {};
        define("test/module", function() { return Module; });
        
        var requireSpy = jasmine.createSpy();
        require(["test/module"], requireSpy);
        
        expect( requireSpy ).toHaveBeenCalledWith( Module );
        
      });
      
      it("loads all dependencies for the module", function() {
        
        var First = {};
        var Second = {};
        var Third = {};
        
        define("dependencies/First", function() { return First; });
        define("dependencies/Second", ['dependencies/First'], 
          function(first) { return { first: first, second: Second }; });
        
        define("dependencies/Third", ['dependencies/Second'], 
          function(second) { return { third: Third, second: second }; });
        
        var ThirdFromRequire = null;
        require(['dependencies/Third'], function(third) { ThirdFromRequire = third; });
        
        expect(ThirdFromRequire).toEqual({
          third: Third,
          second: {
            first: First,
            second: Second
          }
        });
        
      });
      
    });
    
  });
