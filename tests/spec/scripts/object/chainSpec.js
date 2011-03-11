define([
  'compact/object/chain'
], 

function(chain) {

  describe("compact/object/chain", function() {

    it("Adds the objects in a chain like a namespace declaration", function() {
      var namespace = {};
      chain(namespace, ['test', 'a', 'path']);
      expect(namespace.test.a.path).toBeDefined();
    });

  });

});