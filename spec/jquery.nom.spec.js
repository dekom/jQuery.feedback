// jQuery.nom Jasmine test suites
//
// @date 20 October 2012
// @author dekom

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

                        it( "should store the mouseover event type"
                          , function() {
                             expect($this.nom('init').data('nom').mouseoverEventType)
                              .toEqual('mouseover.nom')
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
                              expect($this.nom('init').data('nom').elemActiveClass)
                                .toEqual('nomActive')

                              expect($this.nom('init').data('nom').backgroundActiveClass)
                                .toEqual('nomActiveBackground')
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

                        it( "should call the mouseover function on mouseover"
                          , function() {
                              var mouseover = jasmine.createSpy('mouseover')
                                , event = $this.data('nom').mouseoverEventType

                              console.log(event)

                              $this.nom('activate', {mouseover: mouseover})
                              $this.find('.nom').each(  function() {
                                                          $(this).trigger(event)
                                                        }
                                                     )

                              expect(mouseover).toHaveBeenCalled()
                            }
                          )

                        it( "should call the click function"
                          , function() {
                              var click = jasmine.createSpy('click')
                                , event = $this.data('nom').clickEventType

                              $this.nom('activate', {click: click})
                              $this.find('.nom').each(  function() {
                                                          $(this).trigger(event)
                                                        }
                                                     )

                              expect(click).toHaveBeenCalled()
                          })

                        describe( "on default transition"
                                , function() {
                                    it( "should change the class of the selected items"
                                      , function() {
                                          $this.nom('activate')

                                          expect($this.find('.nom').hasClass($this.data('nom').elemActiveClass))
                                            .toBe(true)
                                        }
                                      )

                                    it( "should change the class of the #nomBackground"
                                      , function() {
                                          $this.nom('activate')

                                          expect($this.find('#nomBackground').hasClass($this.data('nom').backgroundActiveClass))
                                            .toBe(true)
                                        }
                                      )
                                  }
                                )
                      }
                    )

            describe( "select"
                    , function() {
                        beforeEach(function() {
                          $this = $('<div><div class="nom"><div id="feedback"></div></div></div>')
                          $this.nom('init')
                        })

                        it( "should exist as a jQuery function"
                          , function() {
                              expect($this.nom('select'))
                                .toExist()
                            }
                          )
                      }
                    )

            describe( "output"
                    , function() {
                        beforeEach(function() {
                          $this = $('<div class="nom"><div id="feedback"></div></div>')
                          $this.nom('init')
                        })

                        it( "should exist as a jQuery function"
                          , function() {
                              expect($this.nom('output'))
                                .toExist()
                            }
                          )
                      }
                    )
          }
        )
