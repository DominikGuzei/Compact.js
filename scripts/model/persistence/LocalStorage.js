define(['Class', 'model/Store', 'utility/object/deepCopy'], function(Class, Store, deepCopy) {
	
	Class("LocalStorage")
	
	.properties ({
		data: {},
		name: "defaultStore",
		highestLocalModelId: 0
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
			if(!model.localStorageId) {
				model.localStorageId = model.id || this.getNextLocalModelId();
			} else {
				if(model.id != model.localStorageId) {
					delete this.data[model.localStorageId];
					model.localStorageId = model.id;
				}
			}
			this.data[model.localStorageId] = deepCopy(model.attributes);
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
			}
		},
		
		/**
		 * Saves the whole data JSONified to the LocalStorage 
		 */
		save: function() {
			localStorage.setItem(this.name, JSON.stringify(this.data));
		},
		
		/**
		 * Saves all model records from localStorage into 
		 * data property and returns it 
		 */
		
		read: function() {
			if(localStorage[this.name]) {
				this.data = JSON.parse(localStorage[this.name]);
				return this.data;
			}
			return false;
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