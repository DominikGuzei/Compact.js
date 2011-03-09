
  define(['compact/model/Collection', 'compact/model/Model'], 
  
  function(Collection, Model) {
    
    beforeEach(function() {
      this.collection = new Collection();
    });
    
    describe("get(id)", function() {
      
      it("returns null if no model with given id was found", function() {
        expect(this.collection.get(1)).toBe(undefined);  
      });
      
      it("returns the model if one exists with given id", function() {
        var model = new Model({ id: 1 });
        this.collection.models[0] = model;
        
        expect(this.collection.get(1)).toBe( model );  
      });
      
    });
    
    describe("add", function() {
      
      it("Adds the given model to the collection", function() {
        var model = new Model({ id: 1 });
        this.collection.add(model);
        
        expect(this.collection.get(1)).toBe( model );
      });
      
    });
    
    describe("remove", function() {
      
      beforeEach(function() {
        this.model = new Model({ id: 1 });
        this.collection.add( this.model );
      });
      
      it("Removes the given model from the collection", function() {
        this.collection.remove( this.model );
        expect(this.collection.get(1)).toBe(undefined);
      });
      
      it("Returns the removed model", function() {
        expect(this.collection.remove( this.model )).toBe( this.model );
      });
      
    });
    
  });
