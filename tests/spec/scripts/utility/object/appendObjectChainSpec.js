define(['utility/object/appendObjectChain'], function(appendObjectChain) {
		
		describe("utility/object/appendObjectChain", function() {
		  
			it("Adds the objects in a chain like a namespace declaration", function() {
			  var namespace = {};
				appendObjectChain(namespace, ['test', 'a', 'path']);
				expect(namespace.test.a.path).toBeDefined();
			});
		
		});
	
});