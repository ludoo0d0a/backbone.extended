/* global Backbone */

/*
Enhance Backbone
Usage : 
BackboneExtend = require('backbone.extended');
BackboneExtend.setup(Backbone);
*/
(function (root, factory) {
  if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = factory(require("backbone"));
  } else if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["backbone"], function(Backbone) {
      // Use global variables if the locals are undefined.
      return factory(Backbone || root.Backbone);
    });
  } else {
    factory(Backbone);
  }
}(this, function(Backbone) {
  

  //https://coderwall.com/p/dj_ueg/make-backbone-js-use-put-for-patch-requests
  // Override Backbone.sync to use the PUT HTTP method for PATCH requests
  // when doing Model#save({...}, { patch: true });
  var originalSync = Backbone.sync;
  Backbone.sync = function(method, model, options) {
      if (method === 'patch') options.type = 'PUT';
      return originalSync(method, model, options);
  };
  
  //http://andrewhenderson.me/tutorial/how-to-detect-backbone-memory-leaks/
  //https://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
  Backbone.View.prototype.close = function(opts){
    
    this.stopListening();
    this.undelegateEvents();
  
    //http://hjortureh.tumblr.com/post/23041479297/backbone-js-send-zombies-to-heaven
    // unbind events that are set on this view (unbind=off)
    //this.off();
    this.unbind();
    
    // remove all models bindings made by this view
    if (this.model){
      this.model.off( null, null, this );
    }
    
    //Do not remove placeholder
    if (this.$el && opts && opts.empty){
      this.$el.empty();
    }else{
      this.remove();//will call stopListening
    }
    
    delete this.$el; // Delete the jQuery wrapped object variable
    delete this.el; // Delete the variable reference to this node
      
    if (this.onClose){
      this.onClose();
    }
  };
  
  //TODO: dummy unuseful log function
  Backbone.setup = function(){
    console.log("Backbone.extended activated");
  };

  return Backbone;
  
}));

