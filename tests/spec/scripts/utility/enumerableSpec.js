
define(['compact/Mixin',
        'compact/Class', 
        'compact/utility/enumerable'], 

function(Mixin, Class, enumerable) {
	
	describe("compact/utility/enumerable", function() {	
		
		/**
		 * Declaring a test class that is used 
		 * throughout this spec file. 
		 */
		var namespace = this;
		
		Class("Enumerable") .mixin( enumerable )
		.properties({
		  collection: {
		    num: 1,
		    obj: {
		      test: "test"
		    },
		    arr: [1,2]
		  }
		})
		.methods({
		  _enumerableCollection: function() {
		    return this.collection;
		  }
		})
		.end(namespace)
		
		
		/**
		 * Create a instance of the test class
		 * before each spec. 
		 */
		beforeEach(function() {
		  this.instance = new namespace.Enumerable();
		});
		
		
		describe("each", function() {
		  
		  it("it calls the iterator with every element in the collection", function() {
  		  var counter = 0;
  			this.instance.each(function(value, index, collection) {
  				counter++;
  			});
  			expect(counter).toEqual(3);
  		});
		  
		});
		
		describe("find", function() {
		  
		  it("Returns the first value where the iterator returns true", function() {
		    
		    var foundValue = this.instance.find( function(value, index, collection) {
  		    if(value == collection.arr) {
            return true;
  		    }
  		  })
  		  expect(foundValue).toBe(this.instance.collection.arr);
  		  
		  });

		});
		
		describe("map", function() {

  		it("Replaces each value of collection with return value", function() {
  		  
  		  var modifiedCollection = this.instance.map(function(value, index, collection) {
  		    return null;
  		  });
  		  
  			expect(modifiedCollection.num).toEqual(null);
  			expect(modifiedCollection.obj).toEqual(null);
  			expect(modifiedCollection.arr).toEqual(null);
  		});

		});
		
		describe("reduce", function() {

  		it("Returns a single result from a list of array values", function() {
  		  
  		  var result = this.instance.reduce( function(memo, value, index, collection){
  		    var propertyCounter = 0;
  		    if(typeof(value) == 'object') {
  		      for(key in value) {
  		        if(value.hasOwnProperty(key)) {
  		          propertyCounter++;
  		        }
  		      }
  		    } else if(typeof(value) == 'array') {
  		      propertyCounter += value.length;
  		    } else {
  		      propertyCounter++;
  		    }
  		    return memo + propertyCounter;
  		  }, 0);
  		  
  			expect (result).toEqual(4);
  		});

		});
		
		describe("select", function() {
		  
		  it("Returns an array with all values where the iterator returned true", function() {
  			
  			var result = this.instance.select( function(value, index, collection) {
  			  if(typeof(value) == 'object') {
  			    return true;
  			  }
  			});
  			
  			expect(result).toEqual( [ { test: "test" },  [1,2] ] );
  			
  		});
		  
		});
		
		describe("any", function() {
		  
		  it("Returns true if the iterator returs true for any value", function() {
  		  var result = false;
  			result = this.instance.any(function(value, index, collection) {
  			  if(value == 1) {
  			    return true;
  			  }
  			});
  			expect(result).toBe(true);
  			
  			result = this.instance.any(function(value, index, collection) {
  			  return false;
  			});
  			expect(result).toBe(false);
  		});
		  
		});
		
	});
	
});