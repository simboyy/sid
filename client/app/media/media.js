'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('media', {
        title: 'Campaigns created  in recent past',
        url: '/media',
        templateUrl: 'app/media/media.html',
        authenticate: true
      });
  });
