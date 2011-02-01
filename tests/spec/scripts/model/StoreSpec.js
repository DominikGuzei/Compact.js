define(['compact/model/Store', 'compact/model/Model'], function(Store, Model) {
	
	describe("compact/model/Store", function() {

		var store;
		
		beforeEach(function() {
		  store = Store.getInstance();
		});
		
		afterEach(function() {
		  Store.instance = undefined;
		});
		
		describe("getInstance", function() {
		  
			it("Returns the single instance of Storage singleton", function() {
				expect(store).toBe(Store.instance);
				expect(store instanceof Store).toBeTruthy();
			});
		
		});
	
		describe("synchronize", function() {
		  
			var model = new Model();
			var called;
			beforeEach(function() {
			  called = false;
			});
		
			it("Dispatches an event that a model/collection should be created", function() {
				store.addEventListener("create", function(modelToCreate) {
					expect(modelToCreate).toBe(model);
					called = true;
				});
				store.synchronize("create", model);
				expect(called).toBeTruthy();
			});
			
			it("Dispatches an event that a model/collection should be fetched from a server/storage", function() {
				store.addEventListener("read", function(modelToCreate) {
					expect(modelToCreate).toBe(model);
					called = true;
				});
				store.synchronize("read",model);
				expect(called).toBeTruthy();
			});
			
			it("Dispatches an event that a model/collection should be updated to a server/storage", function() {
				store.addEventListener("update", function(modelToCreate) {
					expect(modelToCreate).toBe(model);
					called = true;
				});
				store.synchronize("update",model);
				expect(called).toBeTruthy();
			});
			
			it("Dispatches an event that a model/collection should be deleted on the server/storage", function() {
				store.addEventListener("destroy", function(modelToCreate) {
					expect(modelToCreate).toBe(model);
					called = true;
				});
				store.synchronize("destroy",model);
				expect(called).toBeTruthy();
			});
		
		});
	});
	
});