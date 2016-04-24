'use strict';

angular.module('shopnxApp')

  .directive('dividerCollectionRepeat', function($parse) {
    return {
      priority: 1001,
      compile: compile
    };

    function compile (element, attr) {
      var height = attr.itemHeight || '73';
        attr.$set('itemHeight', 'item.isDivider ? 37 : ' + height);

      element.children().attr('ng-hide', 'item.isDivider');
      element.prepend(
        '<div class="divider custom-item-divider ng-hide" ng-show="item.isDivider" ng-bind="item.divider"></div>'
      );
    }
  })
.filter('groupByMonthYear', function($parse) {

    var dividers = {};

    return function(input) {
      if (!input || !input.length) return;
      
      var output = [], 
         item,
        previousDate, 
        currentDate;

      for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
        currentDate = moment(item.campaignDate);
        if (!previousDate ||
          currentDate.month() != previousDate.month() ||
          currentDate.year() != previousDate.year()) {

          var dividerId = currentDate.format('MMYYYY');
          
          if (!dividers[dividerId]) {
            dividers[dividerId] = {
              isDivider: true,
              divider: currentDate.format('MMMM YYYY') 
            };
          }
          
          output.push(dividers[dividerId]);
          
        }
        output.push(item);

        previousDate = currentDate;
      }

      return output;
    };

  })

// .filter('groupByDayMonthYear', function($parse) {

//     var dividers = {};


//     return function(input) {
//       if (!input || !input.length) return;
//       var item = "";
//       var output = [], 
//         previousDate, 
//         currentDate;

//       for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
  
//         // console.log(item.campaignDate);
//         currentDate = moment(item.campaignDate);
//           // console.log(currentDate);
//         if (!previousDate ||
//           !currentDate.isSame(previousDate)) {

//           var dividerId = currentDate.format('DDMMYYYY');
          
//           if (!dividers[dividerId]) {
//             dividers[dividerId] = {
//               isDivider: true,
//               _id: dividerId,
//               divider: currentDate.format('DD MMMM YYYY') 
//             };
//           }
          
//           output.push(dividers[dividerId]);
          
//         }
//         output.push(item);

//         previousDate = currentDate;
//       }

//       return output;
//     };

//   })
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


  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  })
  .controller('RightCtrl', function ($scope, $rootScope ,$timeout,  Campaign ,$mdSidenav, $log) {

    var itemToMergeCampaign = $rootScope.toMergeCampaign;
    var itemToMergeItem = $rootScope.toMergeItems;


    $scope.close = function (items) {
      console.log(itemToMergeCampaign);
      console.log(itemToMergeItem);

  var newStatus =  {name:'Waiting Responds', val:201};

    if (items) { itemToMergeItem.status = {}; itemToMergeItem.status = newStatus;}
    

    var updated = _.merge(itemToMergeCampaign,items.itemToMergeItem);


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

        // Campaign.delete({id:updated._id},function(){
        //     console.log("Campaign deleted");

        //       Campaign.save(updated).$promise.then(function() {
        //        toastr.success("Campaign info saved successfully","Success");
        //   });
        //   });



  
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };


  })
.controller('MediaCtrl', function ($scope,$rootScope, $modal ,$log,Campaign,$timeout, $mdSidenav, toastr) {



  var vm = this;

  var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

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

    vm.selectedTab = 0;
    
    vm.changeTab = function() {
        if (vm.selectedTab === 2) {
            vm.selectedTab = 0;
        }
        else {
            vm.selectedTab++;
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

  var toMergeItems = p;
  var toMergeCampaign = campaigns;
  console.log(campaigns);
  console.log(p);
  
  $scope.items = campaigns;
  

}

  $scope.request  = function (items) {
  
   console.log(items);
  


    // console.log(items);
    console.log(items);
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
   
  };

 vm.openChat = function (campaigns ,p,creative,size) {
    console.log(campaigns);
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

  vm.toggleAnimation = function () {
    vm.animationsEnabled = !vm.animationsEnabled;
  };

    vm.cmp = {};
    vm.campaignStatusLov = Campaign.status;
    vm.campaignStatus =  [
      {name:'', val:402},
      {name:'Approve', val:305},
      {name:'Reject', val:500}
    ];

    vm.campaignStatusCreativeAdded =  [
      {name:'', val:402},
      {name:'Completed', val:309},
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

    vm.items = Campaign.pub.query({},function(res){

      
      var total=0;
      
      // for(var i=0;i<res.length;i++){
      //     var subTotal = 0;
          for(var j=0;j<res.length;j++){

           // console.log(res[j].campaignDate);


            var date = new Date(res[j].campaignDate);
            console.log(date);
            res[j].date = {
                d: date.getDate(),
                m: monthNames[date.getMonth()],
                y: date.getFullYear() 
              };

            total = 0;
          // console.log();
              // subTotal += res[i].shipping.charge;
              var item = res[j];

              // console.log(item.items);
              // var x = item.items
              // var x.sub = [];

             for (var i = 0; i < item.items.length; i++) {
              
               var p = item.items[i].price;
               var q = item.items[i].quantity;
               total+=(p*q);
               // var x.sub.push(total);
             }
             // console.log(total);
          }
          res.total = total;
          console.log(res);
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

 console.log(vm.campaigns);

    vm.action = function(campaign) {
      // method
      console.log(campaign.items);


      Campaign.update({ id:campaign._id }, campaign.items).$promise.then(function(res) {
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

     // Campaign.delete({id:campaign._id},function(){
     //        console.log("Campaign deleted");

     //          Campaign.save(campaign).$promise.then(function() {
     //           toastr.success("Campaign info saved successfully","Success");
     //      });
     //      });

    }

   
    vm.changeStatus = function(campaign){

       // Campaign.delete({id:campaign._id},function(){
       //      console.log("Campaign deleted");

       //        Campaign.save(campaign).$promise.then(function() {
       //         toastr.success("Campaign updated saved successfully","Success");
       //    });
       //    });

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
.controller('ChatInstanceCtrl', function ($scope,$rootScope,Auth,User,$cookieStore, MockMessagesService, Campaign,$modalInstance,toastr, items) {
  var toMergeCampaign = $rootScope.toMerge;

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


//   $scope.you = {
//         userId: $rootScope.user.email,
//         avatar: 'http://www.orangecountyjailministryorlando.com/wp-content/uploads/2015/01/Woman_Avatar.gif',
//         userName: $rootScope.user.name
//     };

// console.log($scope.you);
  $scope.messages = items.messages;

  $scope.sendMessage = function(message) {

      console.log('sendMessage');
      items.messages.push(message);
      console.log();

      var updated = _.merge($rootScope.toMerge,items);
      console.log(updated);

      // Campaign.update({ id:updated._id }, updated).$promise.then(function(res) {
      //   console.log(res);
      // }, function(error) { // error handler
      //   console.log(error);
      //   if(error.data.errors){
      //     var err = error.data.errors;
      //     toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
      //   }
      //   else{
      //     var msg = error.data.message;
      //     toastr.error(msg);
      //   }
      // });

        Campaign.delete({id:updated._id},function(){
            console.log("Campaign deleted");

              Campaign.save(updated).$promise.then(function() {
               toastr.success("Campaign info saved successfully","Success");
          });
          });

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
.filter("timelogGroupingFilter", function () {

    return function (orig, same, getID) {
        if (!(orig instanceof Array)) return orig;
        if (orig.length == 0) return orig;

        var result = [];

        var cur = [];
        var i = 0;
        for (i = 0; i < orig.length; i ++) {
            if (i == 0 || same(orig[i], orig[i-1])) {
                cur.push(orig[i]);
            } else {
                result.push({
                    id: getID(orig[i-1]),
                    items: cur
                });

                cur = [orig[i]];
            }

        }
        result.push({
            id: getID(orig[orig.length - 1]),
            items: cur
        });

        var toKey=function(item){
            return moment(item.logdate).format("YYYY-MM-DD");
          };

        function pushtoexists(itemDateMap,item,date){
            for(var j=0; j<itemDateMap.length; j++){
                if(itemDateMap[j].date == date){
                    itemDateMap[j].logtimes.push(item);
                    return true;
                }
            }
            return false;
        }
        function push_item(itemDateMap,item,date){
            itemDateMap.push({
                'date':date,
                'item':[item]
            });
        }
        var addArrayToMap = function(items){
            var itemDateMap = [];

            for(var i=0; i<items.length; i++){
                var item = items[i]; 
                var date = toKey(item);

                var push_obj = pushtoexists(itemDateMap,item,date);
                if(itemDateMap.length == 0 || push_obj== false){
                    push_item(itemDateMap,item,date);
                }

            }

            return {
                "campaigns":itemDateMap,
                };
          };


        for (i = 0; i < result.length; i ++) {
            var map = addArrayToMap(result[i].items);
            result[i].data = map.item_list;
            result[i].$$hashKey = i;

        }

        return result;
    };
});
