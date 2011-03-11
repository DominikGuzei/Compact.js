define([
  'compact/object/clone'
], 

function(clone) {

  describe("compact/object/clone", function() {

    describe("clone", function() {
      it("Returns an identical copy of any object", function() {

        var test = {
          name: "test",
          number: 1,
          array: [1,2,3],
          object: { name: "intern" },
          complex: {
            inside: { name: "inside" },
            array: ["test", "values"]
          },
          date: new Date(),
          undef: undefined,
          nul: null
        };
        var copy = clone(test);
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
        expect(copy.date).toEqual(test.date);
        expect(copy.date).not.toBe(test.date);

        expect(copy.undef).toBe(undefined);
        expect(copy.nul).toBe(null);
      });

    });

  });

});