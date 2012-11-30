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

            beforeEach(function() {
              $this = $('<div class="nom"></div>')
            })

            describe( "init"
                    , function() {
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

                        it( "should add event listener to feedback button"
                          , function() {
                              $this.nom('init', {feedback: "#feedback"})
                            }
                          )
                      }
                    )

            describe( "active"
                    , function() {
                      it( "should exist as a jQuery function"
                        , function() {
                            expect($this.nom('active'))
                              .toExist()
                          }
                        )

                      it( "" )
                      }
                    )

            describe( "select"
                    , function() {
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
