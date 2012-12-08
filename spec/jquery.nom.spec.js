// jQuery.nom Jasmine test suites
//
// @date 20 October 2012
// @author Xing Zhou

describe( "jQuery.nom"
        , function() {
            it( "should exist as a jQuery function"
              , function() {
                  expect(jQuery.fn.nom).toEqual(jasmine.any(Function))
                }
              )
          }
        )

describe( "External API"
        , function() {
            var $this

            describe( "init"
                    , function() {
                        beforeEach(function() {
                          $this = $('<div><div class="nom"><div id="feedback"></div></div></div>')
                        })

                        it( "should exist as a jQuery function"
                          , function() {
                              expect($this.nom('init'))
                                .toExist()
                            }
                          )

                        it( "should store default class selection in $.data"
                          , function() {
                              expect($this.nom('init').data('nom'))
                                .toEqual(jasmine.any(Object))

                              expect($this.nom('init').data('nom').classes)
                                .toContain('.nom')
                            }
                          )

                        it( "should add to the default classes"
                          , function() {
                              $this.nom('init', {classes: ['.nomnom']})
                              expect($this.data('nom').classes)
                                .toContain('.nomnom')
                            }
                          )

                        it( "should set id or class for feedback button"
                          , function() {
                              $this.nom('init', {feedback: "#feedback"})
                              expect($this.data('nom').feedback)
                                .toEqual('#feedback')
                            }
                          )

                        it( "should store the mouseenter event type"
                          , function() {
                             expect($this.nom('init').data('nom').mouseenterEventType)
                              .toEqual('mouseenter.nom')
                            }
                          )

                        it( "should store the mouseleave event type"
                          , function() {
                             expect($this.nom('init').data('nom').mouseleaveEventType)
                              .toEqual('mouseleave.nom')
                            }
                          )

                        it( "should store the mouseleave event type"
                          , function() {
                              expect($this.nom('init').data('nom').mouseleaveEventType)
                                .toEqual('mouseleave.nom')
                            }
                          )

                        it( "should store the click event type"
                          , function() {
                             expect($this.nom('init').data('nom').clickEventType)
                              .toEqual('click.nom')
                            }
                          )

                        it( "should store the css classes for when nom is activated"
                          , function() {
                              expect($this.nom('init').data('nom').activeClass)
                                .toEqual('active')
                            }
                          )
                      }
                    )

            describe( "activate"
                    , function() {

                        beforeEach(function() {
                          $this = $(  '<div>'
                                    + '<div class="nom">'
                                    + '<div id="feedback">'
                                    + '</div>'
                                    + '<div id="nomBackground">'
                                    + '</div>'
                                    + '</div>'
                                    + '</div>')
                          $this.nom('init')
                        })

                        it( "should exist as a jQuery function"
                          , function() {
                              expect($this.nom('activate'))
                                .toExist()
                            }
                          )

                        it( "should call the transition function passed"
                          , function() {
                              var transition = jasmine.createSpy('transition')
                              $this.nom('activate', {transition: transition})

                              expect(transition).toHaveBeenCalled()
                            }
                          )

                        it( "should call the mouseenter function on mouseenter"
                          , function() {
                              var mouseenter = jasmine.createSpy('mouseenter')

                              $this.nom('activate', {mouseenter: mouseenter})
                              $this.find('.nom').each(  function() {
                                                          $(this).trigger('mouseenter')
                                                        }
                                                     )

                              expect(mouseenter).toHaveBeenCalled()
                            }
                          )

                        describe( "on default transition"
                                , function() {
                                    it( "should change the class of the consumed items"
                                      , function() {
                                          $this.nom('activate')

                                          expect($this.find('.nom').hasClass($this.data('nom').activeClass))
                                            .toBe(true)
                                        }
                                      )

                                    it( "should change the class of the #nomBackground"
                                      , function() {
                                          $this.nom('activate')

                                          expect($this.find('#nomBackground').hasClass($this.data('nom').activeClass))
                                            .toBe(true)
                                        }
                                      )
                                  }
                                )
                      }
                    )

            describe( "consume"
                    , function() {
                        beforeEach(function() {
                          $this = $('<div><div class="nom"><div id="feedback"></div></div></div>')
                          $this.nom('init')
                        })

                        it( "should exist as a jQuery function"
                          , function() {
                              expect($this.nom('consume'))
                                .toExist()
                            }
                          )

                        it( "should call the function passed in"
                          , function() {
                              var fn = jasmine.createSpy('fn')
                              $this.nom('consume', null, fn)

                              expect(fn).toHaveBeenCalled()
                            }
                          )

                        it( "should change $.data('nom').consumed length"
                          , function() {
                              // Default consume items should be 0
                              expect($this.data('nom').consumed.length)
                                .toBe(0)

                              $this.nom('consume', null)

                              // Adding elements should change the length of
                              // stored elements
                              expect($this.data('nom').consumed.length)
                                .toBe(1)
                            }
                          )

                        it( "should add the consumed element to $.data('nom').consumed"
                          , function() {
                              $this.find('.nom').each(  function() {
                                                          $this.nom('consume', this)
                                                        }
                                                     )

                              $.each( $this.data('nom').consumed
                                    , function(index, elem) {
                                        $(elem).hasClass('nom')
                                      }
                                    )
                            }
                          )
                      }
                    )

            describe( "deactivate"
                    , function() {
                        beforeEach(function() {
                          $this = $('<div><div class="nom"><div id="feedback"></div></div></div>')
                          $this.nom('init')
                        })

                        it( "should remove the css class from the possible consume elements"
                          , function() {
                              $this.nom('activate')
                              $this.nom('deactivate')

                              $this.find('.nom').each(function() {
                                                        expect($(this).hasClass('active'))
                                                          .toBe(false)
                                                      }
                                                     )
                            }
                          )

                        it( "should remove the mouseenter event listener"
                          , function() {
                              var mouseenter = jasmine.createSpy('mouseenter')
                              $this.nom('activate', {mouseenter: mouseenter})
                              $this.nom('deactivate')

                              $this.find('.nom').each(function() {
                                                        $(this).trigger('mouseenter')
                                                        expect(mouseenter)
                                                          .not
                                                          .toHaveBeenCalled()
                                                      }
                                                     )
                            }
                          )

                        it( "should remove the mouseleave event listener"
                          , function() {
                              var mouseleave = jasmine.createSpy('mouseleave')
                              $this.nom('activate', {mouseleave: mouseleave})
                              $this.nom('deactivate')

                              $this.find('.nom').each(function() {
                                                        $(this).trigger('mouseleave')
                                                        expect(mouseleave)
                                                          .not
                                                          .toHaveBeenCalled()
                                                      }
                                                     )
                            }
                          )

                        it( "should remove the click event listener"
                          , function() {
                              var click = jasmine.createSpy('click')
                              $this.nom('activate', {click: click})
                              $this.nom('deactivate')

                              $this.find('.nom').each(function() {
                                                        $(this).trigger('click')
                                                        expect(click)
                                                          .not
                                                          .toHaveBeenCalled()
                                                      }
                                                     )
                            }
                          )
                      }
                    )

            describe( "output"
                    , function() {
                        beforeEach(function() {
                          $this = $('<div><div class="nom"><div id="feedback"></div></div></div>')
                          $this.nom('init')
                          $this.find('.nom').each(  function() {
                                                      $this.nom('consume', this)
                                                    }
                                                 )
                        })

                        it( "should exist as a jQuery function"
                          , function() {
                              expect($this.nom('output'))
                                .toExist()
                            }
                          )

                        it( "should call the function passed in"
                          , function() {
                              var fn = jasmine.createSpy('fn')

                              $this.nom('output', fn)

                              expect(fn).toHaveBeenCalled()
                          }
                        )

                        it( "should pass the serialized objects to the function"
                          , function() {
                              var result

                              function passThrough(obj) {
                                result = obj
                              }

                              $this.nom('output', passThrough)

                              expect(result).toEqual(jasmine.any(Array))
                            }
                          )

                        it( "should output an array containing json of the consumed elements"
                          , function() {
                              var result = []

                              function revert(obj) {
                                $.each( obj
                                      , function(index, elem) {
                                          result.push(JsonML.toHTML(elem))
                                        }
                                      )
                              }

                              $this.nom('output', revert)

                              // TODO Figure out how to test the output array
                              // for correctness
                              console.log(result)
                            }
                          )
                      }
                    )
          }
        )
