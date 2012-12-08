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
            console.log('Bind events')

            if (fns) {
              $this.find(elem_class)
                .each(function() {
                        var $$this = $(this)

                        if (fns.mouseenter) {
                          $$this.bind(  data.mouseenterEventType
                                     ,  function(e) {
                                          $$this.toggleClass("over")
                                          fns.mouseenter.apply(this)
                                        }
                                     )
                        }

                        if (fns.mouseleave) {
                          $$this.bind(  data.mouseleaveEventType
                                     ,  function(e) {
                                          $$this.toggleClass("over")
                                          fns.mouseleave.apply(this)
                                        }
                                     )
                        }

                        if (fns.click) {
                          $$this.bind(  data.clickEventType
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

          // Iterate through the classes and bind all the events
          // to the classes that need to be observed
          $.each(data.classes, bindEvents)

          if (fns && fns.transition) {
            // Execute the passed in transition functions
            fns.transition()
          } else {
            $this.find('#' + data.backgroundID)
              .addClass(data.activeClass)
              // adjust height to cover entire parent element
              .css('height', $this.height())

            $.each(data.classes, assignClass)
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
      // 3) removing the click event listener

        function __each() {
          var $this = $(this)
            , data = $this.data('nom')

          if (!data.classes || data.classes.length === 0)
            return

          if (cb_fn) {
            cb_fn()
            return
          }

          function removeCss(index, elem_class) {
            $this.find(elem_class)
              .each(function() {
                      var $$this = $(this)

                      $$this.removeClass(data.activeClass)
                      $$this.unbind(data.mouseenterEventType)
                      $$this.unbind(data.mouseleaveEventType)
                      $$this.unbind(data.clickEventType)
                    }
                   )
          }

          $.each(data.classes, removeCss)

          // Remove the background
          $this.find('#' + data.backgroundID)
            .removeClass(data.activeClass)
            // adjust height to cover entire
            // document
            .css('height', 0)
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

                            if(!data) {
                              console.log('Uninitialized error')
                              return
                            }

                            // Add element to the list
                            data.consumed.push(element)

                            // Apply the function passed
                            if (cb_fn)
                              cb_fn.apply(this, element)
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
