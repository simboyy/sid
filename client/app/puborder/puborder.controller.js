'use strict';

angular.module('shopnxApp')
  .controller('PubOrderCtrl', function ($scope, Order,User, toastr) {
    $scope.orderStatusLov = Order.status;
    $scope.orders = Order.pub.query({},function(res){
      var total=0;
      for(var i=0;i<res.length;i++){
      //     var subTotal = 0;
      var  item=res[i];
          for (var j = 0; j < item.items.length; j++) {

                // items[i].total = 0;
              
               var p = item.items[j].price;
               var q = item.items[j].quantity;
               total+=(p*q);
               // var x.sub.push(total);
             }
          // res.total = total;
          console.log(total);
      }
      res.total = total;
    });

    $scope.getTotal = function(item){
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

 $scope.getUser = function(item){
      // console.log(item);
      var total = 0

      // console.log(total);

      return total;

 }
    console.log($scope.orders);
    $scope.changeStatus = function(order){
      Order.update({ id:order._id }, order).$promise.then(function(res) {
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
  });
