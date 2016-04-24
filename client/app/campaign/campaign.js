'use strict';

angular.module('shopnxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('campaign', {
        title: 'Campaigns created  in recent past',
        url: '/campaign',
        templateUrl: 'app/campaign/campaign.html',
        authenticate: true
      });
  });
