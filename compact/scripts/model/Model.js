define(['compact/Class',
        'compact/format/json',
        'compact/model/Accessible', 
        'compact/model/Store'], 

function(Class, JSON, Accessible, Store) {
	
	Class("Model") .mixin(Accessible)
	
	.properties ({
		id: null,
		attributes: {}
	})
	
	.methods ({
		
		setter: function(key, value) {
		  this.attributes[key] = value;
		},
		
		getter: function(key) {
		  return this.attributes[key];
		},
		
		save: function() {
			var method = this.isNew() ? "create" : "update";
			Store.getInstance().synchronize(method, this);
		},
		
		destroy: function() {
			Store.getInstance().synchronize("destroy", this);
		},
		
		isNew: function() {
			return this.id ? false : true;
		},
		
		toJSON: function() {
			return JSON.stringify(this.attributes);
		}
	})
	.end(this);
	
	return this.Model;
	
});