define(['compact/utility/object/deepCopy'], function(deepCopy) {
	
	describe("compact/utility/object/deepCopy", function() {
		
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
				var copy = deepCopy(test);
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
	
	});
	
});