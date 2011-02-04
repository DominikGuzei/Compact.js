define(['compact/object/copyProperties'], function(copyProperties) {
	
	describe("compact/object/copyProperties", function() {
	  
		it("Adds all properties from source to destination by reference", function() {
		  var source = {
				name: "test",
				number: 1,
				array: [1,2,3],
				object: { name: "intern" }
			};
			
			var destination = {};
			copyProperties(source, destination, false, true);
			
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
			copyProperties(source, destination, false, false);
			
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
			
			copyProperties(source, destination, true, true);
			
			expect(destination.name).toEqual("source");
		});
		
		it("Does not overwrite existing properties on destination", function() {
		  var source = {
				name: "source"
			};
			
			var destination = {
				name: "destination"
			};
			
			copyProperties(source, destination, false, true);
			
			expect(destination.name).toEqual("destination");
		});
	
	});
	
});