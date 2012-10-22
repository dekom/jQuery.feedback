// **jQuery.nom (nom)** captures the DOM elements as text or blob along with a
// screenshot.  This information can be sent to the server to enable better
// user feedback.
//
// TODO Create external API to guide planning and coding
//
//  External API:
//  init: to setup parameters for nomming
//  activate: to enable DOM element selection for consumption
//  select: to select the element for consumption
//  output: outputs the serialized version of the selected elements

(function( $ ) {
  'use strict';

  var methods = {
    //  Init(options, cb_fn):
    //    @params an options object to configure jQuery.nom.
    //    @return $(this)
    //
    //    Configures the plugin.
    //
    //    The valid options are:
    //      classes:  an array of class attributes that can be selected for
    //      feedback
    init: function( options, cb_fn ) {
      var settings = $.extend( {
        classes: ['nom']
      }, options );

      return $(this);
    },

    //  Active(cb_fn):
    //    @return $(this)
    //
    //    Readies the plugin to accept elements for reporting
    active: function( cb_fn ) {
      return $(this);
    },

    //  Select(element, cb_fn):
    //    @params the element that's to be selected
    //    @return $(this)
    //
    //    Adds the element to the list of elements that needs to be reported
    select: function( element, cb_fn ) {
      return $(this);
    },

    //  Output(cb_fn):
    //    @return $(this)
    //
    //    Outputs a JSON object of all the elements collected.
    output: function( cb_fn ) {
      return $(this);
    }
  };

  // Handles method calls
  $.fn.nom = function( method  ) {
    // Return the jQuery object passed into the function, to maintain
    // extensibility
    if (methods[method]) {
      return methods[method].apply( this,
        Array.prototype.slice.call(arguments, 1) );
    } else if ( typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' + method + ' does not exist on jQuery.nom ' );
    }
  }; // end $.fn.nom
})( jQuery ); // end (function($))
