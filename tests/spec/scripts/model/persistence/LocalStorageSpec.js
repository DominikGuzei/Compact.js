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
			  expect(localStore.highestLocalModelId).toEqual(0);
			});
		
		});
		
		describe("saving", function() {
		  
			it("Saves the whole data JSONified to the LocalStorage", function() {
			  localStore = new LocalStorage({
					name: "saveTestStore"
				});
				
				localStore.data = {
					myModel: {
						name: "Dominik",
						myObject: {
							bla: "blub"
						},
						date: new Date(),
						arrayData: [1,2,3]
					},
					secondModel: {
						name: "second"
					}
				};
				localStore.save();
				expect(localStorage["saveTestStore"]).toEqual(JSON.stringify(localStore.data));
			});
		
		});
		
		describe("getNextLocalModelId", function() {
		  
			it("Returns the next local model id", function() {
			  expect(localStore.getNextLocalModelId()).toEqual("#0");
				expect(localStore.getNextLocalModelId()).toEqual("#1");
				expect(localStore.getNextLocalModelId()).toEqual("#2");
			});
		
		});
		
		describe("creating", function() {
		  
			it("Adds the model with the id if defined", function() {
			  var modelAttrs = {
					name: "Dominik"
				};
				var model = new Model({
					id: 1,
					attributes: modelAttrs
				});
				localStore.put(model);
				expect(localStore.data["1"]).toEqual(modelAttrs);
				
			});
			
			it("Adds the model with the next localStorageId", function() {
			  
				var model = new Model();
				localStore.put(model);
				expect(localStore.data[model.localStorageId]).toEqual(model.attributes);
				var model2 = new Model();
				localStore.put(model2);
				expect(localStore.data[model.localStorageId]).toEqual(model2.attributes);
				
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
		
		describe("read", function() {
		  
			it("Saves all model records from localStorage into data property and returns it", function() {
			  
				var localStore = new LocalStorage({
					name: "testReadFromLocalStorage"
				});
				localStore.data = {
					"1": {
						name: "Dominik"
					},
					"2": {
						name: "Dave"
					}
				};
				localStore.save();
				
				var localStore2 = new LocalStorage({
					name: "testReadFromLocalStorage"
				});
				expect(localStore2.read()).toEqual(localStore.data);
				expect(localStore2.data).toEqual(localStore.data);
			
			});
			
			it("Returns false if there is no data saved at the localStorage", function() {
			  
				var localStore = new LocalStorage({
					name: "balubadsfaldkfb"
				});
				expect(localStore.read()).not.toBeTruthy();
			
			});
		
		});
		
	});
	
});