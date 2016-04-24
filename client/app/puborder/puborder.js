'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('puborder', {
        title: 'Orders placed in recent past',
        url: '/puborder',
        templateUrl: 'app/puborder/puborder.html',
        controller: 'PubOrderCtrl',
        authenticate: true
      });
  });
