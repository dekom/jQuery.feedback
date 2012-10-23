// jQuery.nom Jasmine test suites
//
// @date 20 October 2012
// @author dekom

describe("jQuery.nom", function() {
  it("should exist as a jQuery function", function() {
    expect(jQuery.nom).toEqual(jasmine.any(Function));
  });
});
