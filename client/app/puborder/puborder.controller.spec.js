'use strict';

describe('Controller: PubOrderCtrl', function () {

  // load the controller's module
  beforeEach(module('shopnxApp'));

  var OrderCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PubOrderCtrl = $controller('PubOrderCtrl', {
      $scope: scope
    });
  }));

});
