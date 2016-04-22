'use strict';

angular.module('shopnxApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
     $scope.users = {};
    $scope.errors = {};

    $scope.register = function(form) {
      console.log($scope.user);
      $scope.submitted = true;
      

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          lastname:$scope.user.lastname,
          phone:$scope.user.phone,
          company:$scope.user.company,
          currency:$scope.user.currency,
          role:$scope.user.role
        })
        .then( function() {
          // Account created, redirect to the page with requested a signup
          Auth.redirectToAttemptedUrl();
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
