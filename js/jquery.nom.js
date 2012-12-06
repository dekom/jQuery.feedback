// **jQuery.nom (nom)** captures the DOM elements as text or blob along with a
// screenshot.  This information can be sent to the server to enable better
// user feedback.
//
//  External API:
//  init: to setup parameters for nomming
//  activate: to enable DOM element selection for consumption
//  consume: to consume the element for consumption
//  output: outputs the serialized version of the consume elements

(function( $ ) {
  'use strict';

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
                              , classes = ['.nom']
                                          // Event types
                              , opts =  { mouseoverEventType : 'mouseover.nom'
                                        , clickEventType : 'click.nom'
                                          // Css classes (for default transition classes)
                                        , activeClass: 'active'
                                        , backgroundID: 'nomBackground'
                                        , consumed : []
                                        }

                            if (options) {
                              if (options.classes)
                                // Merge the classes array
                                $.merge(classes, options.classes)

                              // Merge the options
                              $.extend(true, opts, options)
                            }

                            opts.classes = classes

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
      //        mouseover : executed on mouseover the observed element
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
                                $this.find(elem_class).each(  function() {
                                                                var $$this = $(this)

                                                                if (fns.mouseover) {
                                                                  $$this.bind(data.mouseoverEventType, fns.mouseover)
                                                                  $$this.bind( 'mouseenter mouseleave'
                                                                            , function(e) {
                                                                                $$this.toggleClass("over")
                                                                                $$this.trigger(data.mouseoverEventType)
                                                                              }
                                                                             )
                                                                }

                                                                if (fns.click) {
                                                                  $$this.bind( data.clickEventType
                                                                            , function() {
                                                                                $this.nom('consume', this, fns.click)
                                                                              }
                                                                            )
                                                                  $$this.bind( 'click'
                                                                            , function() {
                                                                                $$this.toggleClass('consumed')
                                                                                $$this.trigger(data.clickEventType)
                                                                              }
                                                                            )
                                                                }
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
                                // Add '.active' to the observed elements
                                // and #nomBackground
                                function raiseElements(index, elem_class) {

                                  $this.find(elem_class).each( function() {
                                                        $(this).addClass(data.activeClass)
                                                      }
                                                    )
                                }

                                // Dim background
                                ; ( function dimBackground() {
                                      $this.find('#' + data.backgroundID)
                                        .addClass(data.activeClass)
                                        // adjust height to cover entire
                                        // document
                                        .css('height', $this.height())
                                    }
                                  )()

                                $.each(data.classes, raiseElements)
                              })()
                          }
                        )
      } // end active()

    , deactivate: function( cb_fn ) {
      // Deactivate(cb_fn)
      //
      // Reverse the activation process by
      // 1) removing the css elements
      // 2) removing the mouseover event listener
      // 3) removing the click event listener

        return this.each( function() {
                            var $this = $(this)
                              , data = $this.data('nom')

                            if (!data.classes || data.classes.length === 0)
                              return

                            if (cb_fn) {
                              cb_fn()
                              return
                            }

                            function removeCss(index, elem_class) {
                              $this.find(elem_class).each(function() {
                                                            var $$this = $(this)

                                                           $$this.removeClass(data.activeClass)
                                                           $$this.unbind(data.mouseoverEventType)
                                                           $$this.unbind(data.clickEventType)
                                                          }
                                                         )
                            }

                            $.each(data.classes, removeCss)

                            ;(function removeBackground() {
                                $this.find('#' + data.backgroundID)
                                  .removeClass(data.activeClass)
                                  // adjust height to cover entire
                                  // document
                                  .css('height', 0)
                            })()
                          }
                        )
      } // end deactivate()

    , consume: function( element, cb_fn ) {
      //##  consume( element, cb_fn ):
      //
      //      Adds the calling element to the list of elements that needs to be
      //      reported

        return this.each( function() {
                            var $this = $(this)
                              , data = $this.data('nom')

                            if(data) {
                              data.consumed.push(element)

                              if (cb_fn)
                                cb_fn.apply($this, element)
                            } else
                              $.error('Uninitialized error')
                          }
                        )
      } // end consume()

    , output: function( cb_fn ) {
      //##  Output(cb_fn):
      //
      //      Outputs a JSON object of all the elements collected.

        return this.each( function() {
                            var $this = $(this)
                              , data = $this.data('nom')
                              , jsonArr = []

                            if (!cb_fn)
                              return

                            $.each( data.consumed
                                  , function(index, elem) {
                                      jsonArr.push(JsonML.fromHTML(elem))
                                    }
                                  )

                            cb_fn(jsonArr)
                          }
                        )
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
