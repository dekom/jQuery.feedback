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
  'use strict'

  //# Public Methods
  //
  // All methods return the jQuery object passed into the function,
  // to maintain extensibility
  var methods =
    { init: function( options, cb_fn ) {
      //##  Init(options, cb_fn):
      //
      //      @params an options object to configure jQuery.nom.
      //
      //      Configures the plugin.
      //
      //      Should be called on the feedback button
      //
      //      The valid options are:
      //        classes:  an array of class attributes that can be selected
      //        for feedback

        return this.each( function() {
                            var $this = $(this)
                              , data = $this.data('nom')
                              , opts = {}
                              , classes = ['.nom']

                            // Merge the classes array
                            if (options) {
                              if (options.classes)
                                $.merge(classes, options.classes)

                              // Merge the options
                              $.extend(true, opts, options)
                            }

                            opts.classes = classes
                            opts.elements = []

                            if (!data) {
                              // Bound settings to data
                              $this.data('nom', opts)
                            }
                          }
                        )
      } // end init()

    , activate: function( fns ) {
      //##  Activate(functions):
      //
      //      Enables the user to be able to select elements to be sent
      //      along with the feedback
      //
      //      Functions:
      //        mouseOver : executed on mouseover the observed element
      //        click : executed on click the observed element
      //        transition : executed immediately (default to "light out"
      //        effect)
      //
      //      Visually: dim the entire page
      //      Functionally: bind mouse over and mouse click event listeners
      //        for selection and assign cb_fn to the click event

        return this.each( function() {
                            var $this = $(this)
                              , data = $this.data('nom')
                              , mouseOver = 'mouseover.nom'
                              , click = 'click.nom'
                              , zIndex = 1000

                            if (!data || !data.classes) {
                              console.log('No classes set to be consumed.')
                              return
                            } // No classes set to be consumed

                            // Bind the appropriate events to the elements
                            // to be observed
                            function bindEvents(index, elem_class) {
                              console.log('Bind events')

                              if (fns)
                                $(elem_class).each( function() {
                                                      var $this = $(this)

                                                      if (fns.mouseOver)
                                                        $this.bind(mouseOver, fns.mouseOver)

                                                      if (fns.click)
                                                        $this.bind(click, fns.click)
                                                    }
                                                  )
                            }

                            $.each(data.classes, bindEvents)

                            ;(function transition() {
                                console.log('Transition')

                                // Execute the transition function passed in
                                if (fns && fns.transition) {
                                  fns.transition()
                                  return
                                }

                                // Execute the default set of transition functions
                                // Add '.nomActive' to the observed elements
                                // and #nomBackground
                                function raiseElements(index, elem_class) {
                                  console.log('Raise elements')

                                  $(elem_class).each( function() {
                                                        $(this).toggleClass('nomActive')
                                                      }
                                                    )
                                }

                                // Dim events
                                ; ( function dimBackground() {
                                      console.log('Dim background')
                                      $('#nomBackground')
                                        .toggleClass('nomActiveBackground')
                                        // adjust height to cover entire
                                        // document
                                        .css('height', $(document).height())
                                    }
                                  )()

                                $.each(data.classes, raiseElements)
                              })()
                          }
                        )
      } // end active()

    , select: function( element, cb_fn ) {
      //##  Select(element, cb_fn):
      //
      //      @params the element that's to be selected
      //
      //      Adds the element to the list of elements that needs to be
      //      reported

        return $(this)
      } // end select()

    , output: function( cb_fn ) {
      //##  Output(cb_fn):
      //
      //      Outputs a JSON object of all the elements collected.

        return $(this)
      } // end output()
    }

  //# jQuery Methods Handling
  $.fn.nom = function nom( method  ) {
    if (methods[method]) {

      return methods[method].apply( this
                                  , Array.prototype.slice.call(arguments, 1)
                                  )

    } else if ( typeof method === 'object' || !method ) {

      return methods.init.apply( this, arguments )

    } else {

      $.error( 'Method ' + method + ' does not exist on jQuery.nom ' )

    }
  } // end $.fn.nom()
})( jQuery ) // end (function($))
