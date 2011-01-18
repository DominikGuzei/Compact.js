define(['utility/objects'], function(objectsUtility) {
	
	describe("utility/object", function() {
	  
		describe("addProperties", function() {
		  
			it("Adds all properties from source to destination by reference", function() {
			  var source = {
					name: "test",
					number: 1,
					array: [1,2,3],
					object: { name: "intern" }
				};
				
				var destination = {};
				objectsUtility.copyProperties(source, destination, false, true);
				
				expect(destination.name).toEqual(source.name);
				expect(destination.number).toEqual(source.number);
				expect(destination.array).toBe(source.array);
				expect(destination.object).toBe(source.object);
				
			});
			
			it("Adds all properties from source to destination as deep copies", function() {
			  var source = {
					name: "test",
					number: 1,
					array: [1,2,3],
					object: { name: "intern" }
				};
				
				var destination = {};
				objectsUtility.copyProperties(source, destination, false, false);
				
				expect(destination.name).toEqual(source.name);
				expect(destination.number).toEqual(source.number);
				expect(destination.array).not.toBe(source.array);
				expect(destination.array).toEqual(source.array);
				expect(destination.object).not.toBe(source.object);
				expect(destination.object).toEqual(source.object);
			});
			
			it("Overwrites existing properties on destination", function() {
			  var source = {
					name: "source"
				};
				
				var destination = {
					name: "destination"
				};
				
				objectsUtility.copyProperties(source, destination, true, true);
				
				expect(destination.name).toEqual("source");
			});
			
			it("Does not overwrite existing properties on destination", function() {
			  var source = {
					name: "source"
				};
				
				var destination = {
					name: "destination"
				};
				
				objectsUtility.copyProperties(source, destination, false, true);
				
				expect(destination.name).toEqual("destination");
			});
		
		});
		
		describe("buildObjectChain", function() {
		  
			it("Adds the objects in a chain like a namespace declaration", function() {
			  var namespace = {};
				objectsUtility.appendObjectChain(namespace, ['test', 'a', 'path']);
				expect(namespace.test.a.path).toBeDefined();
			});
		
		});
		
		describe("deepCopy", function() {
		  it("Returns an identical copy of any object", function() {
				var test = {
					name: "test",
					number: 1,
					array: [1,2,3],
					object: { name: "intern" },
					complex: { 
						inside: { name: "inside" },
						array: ["test", "values"]
					}
				};
				var copy = objectsUtility.deepCopy(test);
				expect(copy).not.toBe(test);
				expect(copy.name).toEqual("test");
				expect(copy.number).toEqual(1);
				expect(copy.array).not.toBe(test.array);
				expect(copy.array).toEqual([1,2,3]);
				expect(copy.object).not.toBe(test.object);
				expect(copy.object).toEqual({ name: "intern" });
				expect(copy.complex).not.toBe(test.complex);
				expect(copy.complex.inside).not.toBe(test.complex.inside);
				expect(copy.complex.inside).toEqual({ name: "inside" });
				expect(copy.complex.array).not.toBe(test.complex.array);
				expect(copy.complex.array).toEqual(["test", "values"]);
		  });
		});
		
		describe("addCamelCaseSetter", function() {
		  
			it("Adds a function to the object that is named like a setter for the property", function() {
			  var object = {};
				var setter = function() {};
				objectsUtility.addCamelCaseSetter(object, "test", setter);
				expect(object.setTest).toBe(setter);
			});
		
		});
	
	});
	
});