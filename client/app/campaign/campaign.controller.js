'use strict';

angular.module('shopnxApp')
.directive("showNotifications", ["$interval", function($interval) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            //On click
            $(elem).click(function() {
                $(this).popover("open");
            });

            //On interval
            $interval(function() {
                $(elem).popover("open");
            }, 1000);
        }
    }
}])
.controller('CampaignCtrl', function ($scope,$rootScope, Cart,$modal ,$log,$timeout, $mdSidenav,Campaign, toastr) {
//clear items added to campaign from cart
   Cart.cart.clearItems();
   Cart.cart.products = 20;

   console.log(Cart);

  var vm = this;

   vm.toggleLeft = buildDelayedToggler('left');
    vm.toggleRight = buildToggler('right');
    vm.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }

  vm.items = ['item1', 'item2', 'item3'];

  vm.animationsEnabled = true;

  vm.open = function (campaigns ,p,creative,size) {
    console.log(creative);
    $rootScope.toMerge = campaigns;
    $rootScope.toMergeCreative = creative;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'creative.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.openCreative = function (campaigns ,p,creative,size) {
    console.log(creative);
    $rootScope.toMerge = campaigns;
    $rootScope.toMergeCreative = creative;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'preview.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

vm.openToggle = function (campaigns ,p,creative,size) {

  $rootScope.toMergeItems = p;
  $rootScope.toMergeCampaign = campaigns;
  console.log(campaigns);
  console.log(p);
  
  $scope.items = campaigns;
  

}

 

 vm.openChat = function (campaigns ,p,creative,size) {
    console.log(campaigns._id);
    $rootScope.toDelete = campaigns._id;
    $rootScope.toMerge = campaigns;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'chat.html',
      controller: 'ChatInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


   vm.openRequest = function (campaigns ,p,creative,size) {
    console.log(campaigns._id);
    $rootScope.toDelete = campaigns._id;
    $rootScope.toMerge = campaigns;

    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'request.html',
      controller: 'RequestInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  vm.toggleAnimation = function () {
    vm.animationsEnabled = !vm.animationsEnabled;
  };

    vm.cmp = {};
    vm.campaignStatusLov = Campaign.status;
    vm.campaignStatus =  [
      {name:'', val:402},
      {name:'Avail Check', val:201},
      {name:'Buy', val:202},
    ];

 

    // vm.messages = [
    //   {
    //     'username': 'Matt',
    //     'content': 'Hi!'
    //   },
    //   {
    //     'username': 'Elisa',
    //     'content': 'Whats up?'
    //   },
    //   {
    //     'username': 'Matt',
    //     'content': 'I found this nice AngularJS Directive'
    //   },
    //   {
    //     'username': 'Elisa',
    //     'content': 'Looks Great!'
    //   }
    // ];

    // vm.username = 'Matt';

    // vm.sendMessage = function(message, username) {
    //   if(message && message !== '' && username) {
    //     vm.messages.push({
    //       'username': username,
    //       'content': message
    //     });
    //   }
    // };

    vm.campaigns = Campaign.my.query({},function(res){

      
      var total=0;
      // console.log(res.campaignName);
      // for(var i=0;i<res.length;i++){
      //     var subTotal = 0;
          for(var j=0;j<res.length;j++){
            total = 0;
          // console.log();
              // subTotal += res[i].shipping.charge;
              var item = res[j];

              console.log(item.items);
              // var x = item.items
              // var x.sub = [];

             for (var i = 0; i < item.items.length; i++) {

                // items[i].total = 0;
              
               var p = item.items[i].price;
               var q = item.items[i].quantity;
               total+=(p*q);
               // var x.sub.push(total);
             }
             console.log(total);
          }
          res.total = total;
          console.log(total);
      // }
      // res.total = total;
    });


    vm.getTotal = function(item){
      // console.log(item);
      var total = 0

      for (var i = 0; i < item.items.length; i++) {

                // items[i].total = 0;
              
               var p = item.items[i].price;
               var q = item.items[i].quantity;
               total+=(p*q);
               // var x.sub.push(total);
             }
      // console.log(total);

      return total;

 }


    vm.action = function(campaign) {
      // method
      console.log(campaign);
     Campaign.delete({id:campaign._id},function(){
            console.log("Campaign deleted");

              Campaign.save(campaign).$promise.then(function() {
               toastr.success("Campaign info saved successfully","Success");
          });
          });

    }

   
    vm.changeStatus = function(campaign){
      Campaign.update({ id:campaign._id }, campaign).$promise.then(function(res) {
        console.log(res);
      }, function(error) { // error handler
        console.log(error);
        if(error.data.errors){
          var err = error.data.errors;
          toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
        }
        else{
          var msg = error.data.message;
          toastr.error(msg);
        }
      });
    };

    var toNumber = function (value) {
      value = value * 1;
      return isNaN(value) ? 0 : value;
  };


  })

.controller('ModalInstanceCtrl', function ($scope,$rootScope, Campaign,$modalInstance,toastr, items) {

  var toMergeCampaign = $rootScope.toMerge;
  var toMergeCreative = $rootScope.toMergeCreative;
  var items 


  // console.log(toMergeCampaign);
  console.log(items);



  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function (items) {

    var newStatus = {
      name: 'Creative Available',
      val: 300
    }

    if (items.creative) { items.status = {}; items.status = newStatus;}
    
  
    var toMergeCreative = items;
    var updated = _.merge(toMergeCampaign,items.items);


    // console.log(items);
    console.log(updated);
     // Campaign.update({ id:updated._id }, updated).$promise.then(function(res) {
     //    console.log(res);
     //  }, function(error) { // error handler
     //    console.log(error);
     //    if(error.data.errors){
     //      var err = error.data.errors;
     //      toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
     //    }
     //    else{
     //      var msg = error.data.message;
     //      toastr.error(msg);
     //    }
     //  });

        Campaign.delete({id:updated._id},function(){
            console.log("Campaign deleted");

              Campaign.save(updated).$promise.then(function() {
               toastr.success("Campaign info saved successfully","Success");
          });
          });
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('ChatInstanceCtrl', function ($scope,$rootScope,Auth,User,$cookieStore, Campaign,$modalInstance,toastr, items) {
  var toMergeCampaign = $rootScope.toMerge;
  var toDeleteCampaign = $rootScope.toDelete;

  console.log(toDeleteCampaign);

  if($cookieStore.get('token')) {
      $scope.currentUser = User.get();
    }
  
  console.log($scope.currentUser);

  // console.log($rootScope.toMerge);

  $scope.items = items;
  $scope.items.creative = {};
  $scope.selected = {
    item: $scope.items[0]
  };


  $scope.you = {
        userId: '4562KDJYE72930DST283DFY202Dd',
        avatar: 'http://www.orangecountyjailministryorlando.com/wp-content/uploads/2015/01/Woman_Avatar.gif',
        userName: 'Anna'
    };

  $scope.messages = items.messages;

  $scope.sendMessage = function(message) {

      console.log('sendMessage');
      items.messages.push(message);
      console.log();

      var updated = _.merge($rootScope.toMerge,items);
      console.log(updated);

      Campaign.update({ id:$rootScope.toDelete}, updated).$promise.then(function(res) {
        console.log(res);
      }, function(error) { // error handler
        console.log(error);
        if(error.data.errors){
          var err = error.data.errors;
          toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
        }
        else{
          var msg = error.data.message;
          toastr.error(msg);
        }
      });
        console.log($rootScope.toDelete);
        // Campaign.delete({id:$rootScope.toDelete},function(){
        //     console.log("Campaign deleted");

        //       Campaign.save(updated).$promise.then(function() {
        //        toastr.success("Campaign info saved successfully","Success");
        //   });
        //   });

  };

  $scope.$on('simple-chat-message-posted', function() {
            console.log('onMessagePosted');
        });

  $scope.ok = function (items) {


    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

 
})

.controller('RequestInstanceCtrl', function ($scope,$rootScope,Auth,User,$cookieStore, MockMessagesService, Campaign,$modalInstance,toastr, items) {
  var toMergeCampaign = $rootScope.toMerge;
  var toDeleteCampaign = $rootScope.toDelete;

  console.log(toDeleteCampaign);

  if($cookieStore.get('token')) {
      $scope.currentUser = User.get();
    }
  
  console.log($scope.currentUser);

  // console.log($rootScope.toMerge);

  $scope.items = items;
  $scope.items.creative = {};
  $scope.selected = {
    item: $scope.items[0]
  };


  $scope.you = {
        userId: '4562KDJYE72930DST283DFY202Dd',
        avatar: 'http://www.orangecountyjailministryorlando.com/wp-content/uploads/2015/01/Woman_Avatar.gif',
        userName: 'Anna'
    };

  $scope.messages = items.messages;

  $scope.sendMessage = function(message) {

      console.log('sendMessage');
      items.messages.push(message);
      console.log();

      var updated = _.merge($rootScope.toMerge,items);
      console.log(updated);

      Campaign.update({ id:$rootScope.toDelete}, updated).$promise.then(function(res) {
        console.log(res);
      }, function(error) { // error handler
        console.log(error);
        if(error.data.errors){
          var err = error.data.errors;
          toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
        }
        else{
          var msg = error.data.message;
          toastr.error(msg);
        }
      });
        console.log($rootScope.toDelete);
        // Campaign.delete({id:$rootScope.toDelete},function(){
        //     console.log("Campaign deleted");

        //       Campaign.save(updated).$promise.then(function() {
        //        toastr.success("Campaign info saved successfully","Success");
        //   });
        //   });

  };

  $scope.$on('simple-chat-message-posted', function() {
            console.log('onMessagePosted');
        });

  $scope.ok = function (items) {


    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

 
});