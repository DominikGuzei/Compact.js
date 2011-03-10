
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
      
      beforeEach(function() {
        this.model = new Model({ id: 1 });
      });
      
      it("Adds the given model to the collection", function() {
        this.collection.add(this.model);
        expect(this.collection.get(1)).toBe( this.model );
      });
      
      it("Dispatches an add event with the added model as data", function() {
        var callback = jasmine.createSpy();
        this.collection.addEventListener("add", callback);
        this.collection.add(this.model);
        expect(callback).toHaveBeenCalledWith(this.model);
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
      
      it("Dispatches an remove event if a model was removed", function() {
        var callback = jasmine.createSpy();
        this.collection.addEventListener("remove", callback);
        this.collection.remove( this.model );
        expect(callback).toHaveBeenCalledWith( this.model );
      });
      
    });
    
  });
