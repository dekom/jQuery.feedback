// **jQuery.nom (nom)** captures the DOM elements as text or blob along with a
// screenshot.  This information can be sent to the server to enable better
// user feedback.

(function( $ ) {
  'use strict';

  var methods = {
    init: function( options ) {

      var settings = $.extend( {
        classes: ['nom']
      }, options );
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
