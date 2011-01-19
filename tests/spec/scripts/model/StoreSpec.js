define(['model/Storage'], function(Storage) {
	
	describe("model/Storage", function() {
	  var storage;
		beforeEach(function() {
		  storage = Storage.get();
		});
		
		describe("get", function() {
		  
			it("Returns the single instance of Storage singleton", function() {
				expect(storage).toBe(Storage.instance);
				expect(storage instanceof Storage).toBeTruthy();
			});
		
		});
	
	});
	
});