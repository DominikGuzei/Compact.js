define([
  'compact/Module',
  'compact/model/Store',
  'compact/model/Model',
  'compact/collection/Collectable',
  'compact/object/values',
  'compact/collection/each'
], 
  
function(Module, Store, Model, Collectable, values, each) {

  return Module("LocalStorage") .mixin( Collectable )

  .initialize (function(name, data){
    this.data = data || {};
    this.name = name || "defaultStore";
    this.highestLocalModelId = 1;
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
      }
      else {
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
     * @return the destroyed model or null if not found
     */

    destroy: function(model) {
      if(model.localStorageId) {
        delete this.data[model.localStorageId];
        delete model["localStorageId"];
        return model;
      }
      return null;
    },

    /**
     * Saves the whole data JSONified to the LocalStorage
     */
    save: function() {
      var modelAttributes = {};
      this.each( function(model) {
        modelAttributes[model.localStorageId] = model.data;
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

        each(modelAttributes, function(savedAttributes, key) {
          var id = (key[0] == "#") ? undefined : parseInt(key);

          this.data[key] = new Model(savedAttributes, id);
          this.data[key].localStorageId = (key[0] == "#") ? key : parseInt(key);;

        }, this);

        return this.data;
      }
      return false;
    },

    /**
     * Returns an array of all Models generated of the
     * data saved into the LocalStorage
     */

    all: function() {
      return values(this.data);
    },

    /**
     * Returns the next local model id
     */
    getNextLocalModelId: function() {
      return "#" + this.highestLocalModelId++;
    },

    _collectableCollection: function() {
      return this.data
    }

  })
  .end();

});