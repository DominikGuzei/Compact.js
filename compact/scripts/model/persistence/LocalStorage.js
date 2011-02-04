define(['compact/Class', 'compact/model/Store', 
				'compact/object/deepCopy', 
				'compact/collection/map',
				'compact/collection/values',
				'compact/collection/each'], 

function(Class, Store, deepCopy, map, values, each) {
	
	Class("LocalStorage")
	
	.properties ({
		data: {},
		name: "defaultStore",
		highestLocalModelId: 1
	})
	
	.methods ({
		
		/**
		 * Creates or updates the model attributes
		 * Adds a localStorageId to each model to track
		 * if it has been saved to the server. If the
		 * model was saved locally before the localStorageId
		 * is set to the server id if existent.
		 * 
		 * @param {Model} model The model to be saved 
		 */
		put: function(model) {
			if(model.localStorageId == undefined) {
				model.localStorageId = model.id || this.getNextLocalModelId();
			} else {
				if(model.id && model.id != model.localStorageId) {
					delete this.data[model.localStorageId];
					model.localStorageId = model.id;
				}
			}
			this.data[model.localStorageId] = model;
		},
		
		/**
		 * Deletes the model from the localStorage and
		 * removes the localStorageId from the model
		 * 
		 * @param {Model} model The model to destroy 
		 */
		
		destroy: function(model) {
			if(model.localStorageId) {
				delete this.data[model.localStorageId];
			  delete model["localStorageId"];
				return model;
			}
			throw "Model not found: " + model.id;
		},
		
		/**
		 * Saves the whole data JSONified to the LocalStorage 
		 */
		save: function() {
			var modelAttributes = {};
			each(this.data, function(model) {
				modelAttributes[model.localStorageId] = model.attributes;
			});
			localStorage.setItem(this.name, JSON.stringify(modelAttributes));
		},
		
		/**
		 * Saves all model records from localStorage into 
		 * data property and returns it 
		 */
		
		load: function() {
			if(localStorage[this.name]) {
				var modelAttributes = JSON.parse(localStorage[this.name]);
				var self = this;
				
				each(modelAttributes, function(savedAttributes, key) {
					var id = (key[0] == "#") ? undefined : key;
					self.data[key] = new Model({
						id: id,
						attributes: savedAttributes
					});
					self.data[key].localStorageId = key;
				});
				return this.data;
			}
			return false;
		},
		
		/**
		 * Returns an array of all Models generated of the
		 * data saved into the LocalStorage 
		 */
		
		findAll: function() {
			return values(this.data);
		},
		
		/**
		 * Returns the next local model id 
		 */
		getNextLocalModelId: function() {
			return "#" + this.highestLocalModelId++;
		}
		
	})
	.end(this);
	
	return this.LocalStorage;
	
});