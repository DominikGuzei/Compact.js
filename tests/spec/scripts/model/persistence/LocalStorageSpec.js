define(['model/Store', 'model/Model', 'model/persistence/LocalStorage'], 

function(Store, Model, LocalStorage) {
	
	describe("model/persistence/LocalStorage", function() {

		var store;
		var localStore;
		beforeEach(function() {
		  store = Store.getInstance();
		  localStore = new LocalStorage();
		});
		
		afterEach(function() {
		  Store.instance = undefined;
		});
		
		describe("initializing", function() {
		  
			it("Has a default name 'defaultStore'", function() {
				expect(localStore.name).toEqual("defaultStore");
			});
		
			it("Has a name applied", function() {
			  localStore = new LocalStorage({
					name: "mystore"
				});
				expect(localStore.name).toEqual("mystore");
			});
			
			it("Has an empty data object", function() {
				expect(localStore.data).toEqual({});
			});
			
			it("Inits highestLocalModelId property to zero", function() {
			  expect(localStore.highestLocalModelId).toEqual(1);
			});
		
		});
		
		describe("getNextLocalModelId", function() {
		  
			it("Returns the next local model id", function() {
			  expect(localStore.getNextLocalModelId()).toEqual("#1");
				expect(localStore.getNextLocalModelId()).toEqual("#2");
				expect(localStore.getNextLocalModelId()).toEqual("#3");
			});
		
		});
		
		describe("creating", function() {
		  
			it("Adds the model with the id if defined", function() {
			  var modelAttrs = {
					name: "Dominik"
				};
				var model = new Model({
					id: "1",
					attributes: modelAttrs
				});
				localStore.put(model);
				expect(localStore.data["1"]).toEqual(model);
				
			});
			
			it("Adds the model with the next localStorageId", function() {
			  
				var model = new Model();
				localStore.put(model);
				expect(localStore.data[model.localStorageId]).toBe(model);
				var model2 = new Model();
				localStore.put(model2);
				expect(localStore.data[model2.localStorageId]).toBe(model2);
				
			});
		
		});
		
		describe("destroy", function() {
		  
			it("Deletes the model with the given id", function() {
			  
				var model = new Model();
				localStore.put(model);
				var id = model.localStorageId;
				localStore.destroy(model);
				expect(localStore.data[id]).toBeUndefined();
				expect(model.localStorageId).toBeUndefined();
				
			});
		
		});
		
		
		
		describe("findAll", function() {
		  
			it("Returns an array of all models", function() {
			  
				var model = new Model();
				var model2 = new Model();
				var model3 = new Model();
				
				localStore.put(model);
				localStore.put(model2);
				localStore.put(model3);
				
				var result = localStore.findAll();
				expect(result.length).toEqual(3);
				expect(result[0]).toBe(model);
				expect(result[1]).toBe(model2);
				expect(result[2]).toBe(model3);
			});
		
		});
		
		describe("saving", function() {
		  
			it("Saves the whole data JSONified to the LocalStorage", function() {
			  localStore = new LocalStorage({
					name: "saveTestStore"
				});
				var model = new Model({
					attributes: {
						name: "Dominik"
					}
				});
				model.localStorageId = "1";
				
				var model2 = new Model({
					attributes: {
						name: "Dave"
					}
				});
				model2.localStorageId = "#1";
				
				localStore.put(model);
				localStore.put(model2);
				
				localStore.save();

				expect(JSON.parse(localStorage["saveTestStore"])).toEqual({
					"1": {
						name: "Dominik"
					},
					"#1": {
						name: "Dave"
					}
				});
			});
		
		});
		
		describe("load", function() {
		  
			it("reads all model records from localStorage into data property and returns it", function() {
			  
				var localStore = new LocalStorage({
					name: "testReadFromLocalStorage"
				});
				
				var model = new Model({
					id: "1",
					attributes: {
						name: "Dominik"
					}
				});
				
				var model2 = new Model({
					attributes: {
						name: "Dave"
					}
				});
				model2.localStorageId = "#1";
				localStore.put(model);
				localStore.put(model2);
				localStore.save();
				
				var localStore2 = new LocalStorage({
					name: "testReadFromLocalStorage"
				});
				
				localStore2.load();

				expect(localStore2.data["1"].id).toEqual(model.id);
				expect(localStore2.data["1"].localStorageId).toEqual(model.localStorageId);
				expect(localStore2.data["1"].attributes).toEqual(model.attributes);
				
				expect(localStore2.data["#1"].id).toEqual(model2.id);
				expect(localStore2.data["#1"].localStorageId).toEqual(model2.localStorageId);
				expect(localStore2.data["#1"].attributes).toEqual(model2.attributes);
			});
			
			it("Returns false if there is no data saved at the localStorage", function() {
			  
				var localStore = new LocalStorage({
					name: "balubadsfaldkfb"
				});
				expect(localStore.load()).not.toBeTruthy();
			
			});
		
		});
		
	});
	
});