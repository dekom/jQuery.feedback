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

        // Merge the default `opts` and `options`
        // Store the merged `options` to $.data('nom')
        function __each() {
          var $this = $(this)
            , data = $this.data('nom')
            , classes = ['.nom']
                        // Event types
            , opts =  { mouseenterEventType : 'mouseenter.nom'
                      , mouseleaveEventType : 'mouseleave.nom'
                      , clickEventType : 'click.nom'
                        // Css classes (for default transition classes)
                      , activeClass: 'active'
                      , backgroundSelector: '#nomBackground'
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

        return this.each( __each )
      } // end init()

    , activate: function( fns ) {
      //##  Activate(functions):
      //
      //      Enables the user to be able to select elements to be sent
      //      along with the feedback
      //
      //      Functions:
      //        mouseenter : executed when the mouse enters the observed element
      //        mouseleave : executed when the mouse leaves the observed element
      //        click : executed on click the observed element
      //        transition : executed immediately (default to "light out"
      //        effect)

        // Bind any of the functions passed in to the appropriate events
        function __each() {
          var $this = $(this)
            , data = $this.data('nom')

          if (!data || !data.classes) {
            console.log('No classes set to be consumed.')
            return
          } // No classes set to be consumed

          // Bind the appropriate events to the elements
          // to be observed
          function bindEvents(index, elem_class) {
            if (fns) {
              $this.find(elem_class)
                .each(function() {
                        var $$this = $(this)

                        if (fns.mouseenter) {
                          $$this.on(  data.mouseenterEventType
                                     ,  function(e) {
                                          $$this.toggleClass("over")
                                          fns.mouseenter.apply(this)
                                        }
                                     )
                        }

                        if (fns.mouseleave) {
                          $$this.on(  data.mouseleaveEventType
                                     ,  function(e) {
                                          $$this.toggleClass("over")
                                          fns.mouseleave.apply(this)
                                        }
                                     )
                        }

                        if (fns.click) {
                          $$this.on(  data.clickEventType
                                      , function() {
                                          $$this.toggleClass('consumed')
                                          $this.nom('consume', this, fns.click)
                                        }
                                     )
                        }
                      }
                    )
            }
          }

          // Execute the default transition functions
          // Add '.active' to the observed elements
          // and #nomBackground
          function assignClass(index, elem_class) {
            $this.find(elem_class)
            .each(function() {
                    $(this).addClass(data.activeClass)
                  }
                 )
          }

          function passThrough(evt) {
            var $background = $(data.backgroundSelector)

            $background.hide(0)

            var elem = document.elementFromPoint(evt.pageX, evt.pageY)
            $(elem).trigger(evt)

            $background.show(0)
          }


          // Iterate through the classes and bind all the events
          // to the classes that need to be observed
          $.each(data.classes, bindEvents)
          $.each(data.classes, assignClass)

          if (fns && fns.transition) {
            // Execute the passed in transition functions
            fns.transition()
          } else {
            var $background = $this.find(data.backgroundSelector)

            // Activate the background
            $background.addClass(data.activeClass)
              // adjust height to cover entire parent element
              .css('height', $this.height())

            if (fns) {
              // bind the events to the background to be passed through
              if (fns.mouseenter) {
                $background.on( data.mouseenterEventType
                              , passThrough
                              )
              }

              if (fns.mouseleave) {
                $background.on( data.mouseenterEventType
                              , passThrough
                              )
              }

              if (fns.click) {
                $background.on( data.clickEventType
                              , passThrough
                              )
              }
            }
          }
        }

        return this.each( __each )
      } // end active()

    , deactivate: function( cb_fn ) {
      // Deactivate(cb_fn)
      //
      // Reverse the activation process by
      // 1) removing the css elements
      // 2) removing the mouseenter event listener
      // 3) removing the mouseleave event listener
      // 4) removing the click event listener
      // 5) call the callback function

        function __each() {
          var $this = $(this)
            , data = $this.data('nom')

          if (!data || !data.classes) {
            console.log('No classes set to be consumed.')
            return
          } // No classes set to be consumed

          function removeCss(index, elem_class) {
            $this.find(elem_class)
              .each(function() {
                      var $$this = $(this)

                      $$this.removeClass(data.activeClass)
                      $$this.off(data.mouseenterEventType)
                      $$this.off(data.mouseleaveEventType)
                      $$this.off(data.clickEventType)
                    }
                   )
          }

          $.each(data.classes, removeCss)

          if (cb_fn) {
            cb_fn()
          } else {
            var $background = $(data.backgroundSelector)

            $background.removeClass(data.activeClass)
              .css('height', 0)
              .off(data.mouseenterEventType)
              .off(data.mouseleaveEventType)
              .off(data.clickEventType)
          }
        }

        return this.each( __each )
      } // end deactivate()

    , consume: function( element, cb_fn ) {
      //##  consume( element, cb_fn ):
      //
      //      Adds the calling element to the list of elements that needs to be
      //      reported

        return this.each( function() {
                            var $this = $(this)
                              , data = $this.data('nom')

                            if (!data || !data.classes) {
                              console.log('No classes set to be consumed.')
                              return
                            } // No classes set to be consumed

                            // Add element to the list
                            data.consumed.push(element)

                            // Apply the function passed
                            if (cb_fn)
                              cb_fn.apply(this, [element])
                          }
                        )
      } // end consume()

    , output: function( cb_fn ) {
      //##  Output(cb_fn):
      //
      //      Outputs an array of objects of all the elements collected.
      //
      //      Each array's output object is formatted as:
      //        { element: element.toJson
      //        , style: css map
      //        }

        return this.each( function() {
                            var $this = $(this)
                              , data = $this.data('nom')
                              , jsonArr = []

                            if (!data || !data.classes) {
                              console.log('No classes set to be consumed.')
                              return
                            } // No classes set to be consumed

                            if (!cb_fn)
                              return

                            $.each( data.consumed
                                  , function(index, elem) {
                                      jsonArr.push(JsonML.fromHTML(elem))
                                    }
                                  )

                            cb_fn(data.consumed, jsonArr)
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
