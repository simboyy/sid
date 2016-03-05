'use strict';

angular.module('shopnxApp')
  .controller('ProductCtrl', function ($scope, socket, Product, Category, Brand, Statistic,Feature, Modal, toastr, $loading, Settings) {
    var cols = [
      {heading:'sku',dataType:'text', sortType:'lowercase'},
      {heading:'name',dataType:'text', sortType:'lowercase'},
      {heading:'info',dataType:'text', sortType:'lowercase'}
    ];


    // var cols = ['sku','name','nameLower','slug','status','info','uid', 'active','img'];
    $scope.variantsNew = {"name":"Mailing List","price":25,"size":"800x400","maxSize":"","formart":"PNG,GIF,JPEG"},{"name":"SMS","price":25,"size":"","maxSize":"","formart":"text"};
    $scope.statsNew = {"key":"Digital Subscribers","val":"50 K"},{"key":"SMS Reach","val":"25 K"},{"key":"Total Audience","val":"126 K"};
    $scope.file = {};
    $scope.products = [];
    $scope.product = {};
    $scope.variant = {};
    $scope.newStats = {};
    $scope.newFeature = {};
    $scope.newKF = {};
    $scope.product.logo = [];
    $scope.product.stats = [];
    $scope.product.variants = [];
    $scope.product.features = [];
    $scope.product.keyFeatures = [];
    // $scope.selected = {};
    // $scope.selected.feature = [];
    $scope.features = Feature.query();
     $scope.statistics = Statistic.query();
    // $scope.items=$scope.features.map(function(name){ return { key:key,val:val}; })
    // $scope.selected.feature[0] = {"key":"Fit","val":"Tight"};
    $loading.start('products');
    $scope.products = Product.query({}, function() {
      $loading.finish('products');
      socket.syncUpdates('product', $scope.products);
    });

    $scope.categories = Category.query(function() {
      socket.syncUpdates('category', $scope.categories);
    });
    $scope.brands = Brand.query(function() {
      socket.syncUpdates('brand', $scope.brands);
    });
    $scope.edit = function(product) {
      var title; if(product.name){ title = 'Editing ' + product.name;} else{ title = 'Add New';}
      Modal.show(product,{title:title, api:'Product', columns: cols});
    };
    $scope.delete = function(product) {
      // if(Settings.demo){
      //   toastr.error('Delete not allowed in demo mode');
      //   return;
      // }
      if(confirm('Are you sure to delete the product?')){
        Product.delete({id:product._id});
      }
    };

    $scope.preview = function (adspace) {
      console.log(adspace);
      // body...
    }
    $scope.save = function(product){
      // if(Settings.demo){
      //   toastr.error('Save not allowed in demo mode');
      //   return;
      // }
      console.log(product);

      
      $scope.product = product;
      if('variants' in $scope.product){
      }else{
          $scope.product.variants = [];
      }
      if('keyFeatures' in $scope.product){
      }else{
          $scope.product.keyFeatures = [];
      }
      if('features' in $scope.product){
      }else{
          $scope.product.features = [];
      }

      if('size' in $scope.variantsNew){
        $scope.product.variants.push($scope.variantsNew);
        // console.log($scope.product.variants);
      }
      // console.log($scope.newKF);
      if('val' in $scope.newKF){
        $scope.product.keyFeatures.push($scope.newKF.val);
        console.log($scope.product.keyFeatures);
      }
      if('key' in $scope.newFeature){
        $scope.product.features.push($scope.newFeature);
        // console.log($scope.product.features);
      }
      if('key' in $scope.statsNew){
         alert("found some feature stats");
         console.log($scope.statsNew);
           $scope.product.stats.push($scope.statsNew);
      }

      $scope.variant = {};
      $scope.newKF = {};
      $scope.newFeature = {};
      $scope.newStats = {};
      // $scope.feature.key = feature.key.name;
      // $scope.product.feature = $scope.selected.feature;

      // console.log($scope.selected.feature);
      if('_id' in product){
          Product.update({ id:$scope.product._id }, $scope.product).$promise.then(function(data) {
            console.log(data);
            toastr.success("Product info saved successfully","Success");
          }, function(error) { // error handler
            var err = error.data.errors;
            toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
          });
        }
        else{
          Product.save($scope.product).$promise.then(function() {
            toastr.success("Product info saved successfully","Success");
          }, function(error) { // error handler
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message,err[Object.keys(err)].name);
          });
        }
    };
    $scope.changeActive = function(b){ // success handler
      b.active = !b.active;
      Product.update({ id:b._id }, b).$promise.then(function() {

      }, function(error) { // error handler
          // console.log(error);
          toastr.error(error.statusText + ' (' +  error.status + ')');
          b.active = !b.active;
      });
    };

    $scope.deleteFeature = function(index,product) {
      $scope.product.features.splice(index, 1);
      $scope.save(product)
    };

    $scope.deleteKF = function(index,product) {
      $scope.product.keyFeatures.splice(index, 1);
      $scope.save(product)
    };

    $scope.deleteVariants = function(index,product) {
      $scope.product.variants.splice(index, 1);
      $scope.save(product)
    };

    $scope.productDetail = function(product){
        if(product){ $scope.product = product; }
        else{ $scope.product = {}; }
    };

  });
