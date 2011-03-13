define([
  'compact/model/Model', 
  'compact/model/Store'
], 

function(Model, Store) {

  describe("compact/model/Model", function() {

    var instance;
    var store;
    beforeEach( function() {
      instance = new Model();
      store = Store.getInstance();
    });

    afterEach( function() {
      Store.instance = undefined;
    });

    describe("default attributes", function() {

      it("Has an values object with model domain values", function() {
        expect(instance.attributes).toBeDefined();
      });

      it("Has an undefined id at creation", function() {
        expect(instance.id).toBe(null);
      });

    });

    describe("isNew", function() {

      it("Tells if the model was not yet saved to the server", function() {
        expect(instance.isNew()).toBeTruthy();
        instance.id = 1;
        expect(instance.isNew()).not.toBeTruthy();
      });

    });

    describe("save", function() {

      it("Tells the Store to create the record if it is new", function() {
        var called = false;
        store.addEventListener("create", function(model) {
          expect(model).toBe(instance);
          called = true;
        });

        instance.save();
        expect(called).toBeTruthy();
      });

      it("Tells the Store to update the record if it exists persistently", function() {
        var called = false;
        instance.id = 1;
        store.addEventListener("update", function(model) {
          expect(model).toBe(instance);
          called = true;
        });

        instance.save();
        expect(called).toBeTruthy();
      });

    });

    describe("destroy", function() {

      it("Tells the Store to send a out an event to delete the model", function() {
        var called = false;
        store.addEventListener("destroy", function(model) {
          expect(model).toBe(instance);
          called = true;
        });

        instance.destroy();
        expect(called).toBeTruthy();
      });

    });

    describe("toJSON", function() {

      it("Returns the attributes of the model as json string", function() {
        instance.set({
          name: "value",
          test: { inside: "hello" },
          arr: [1,2,3]
        });
        expect(instance.toJSON()).toEqual('{"name":"value","test":{"inside":"hello"},"arr":[1,2,3]}');
      });

    });
    
    describe("clone", function() {
      
      it("returns an exact clone of the model", function() {
        var testObject = {};
        instance.set({
          obj: testObject 
        })
        
        var clone = instance.clone();
        expect(clone.attributes.obj).not.toBe(testObject);
        expect(clone.attributes.obj).toEqual(testObject);
      });
      
    });

  });

});