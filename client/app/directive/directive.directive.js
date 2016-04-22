'use strict';

angular.module('shopnxApp')
 .filter('customFilter', ['$filter', function ($filter) {
            var filterFilter = $filter('filter');
            var standardComparator = function standardComparator(obj, text) {
                text = ('' + text).toLowerCase();
                return ('' + obj).toLowerCase().indexOf(text) > -1;
            };

            return function customFilter(array, expression) {
                function customComparator(actual, expected) {

                    var isBeforeActivated = expected.before;
                    var isAfterActivated = expected.after;
                    var isLower = expected.lower;
                    var isHigher = expected.higher;
                    var higherLimit;
                    var lowerLimit;
                    var itemDate;
                    var queryDate;


                    if (ng.isObject(expected)) {

                        //date range
                        if (expected.before || expected.after) {
                            try {
                                if (isBeforeActivated) {
                                    higherLimit = expected.before;

                                    itemDate = new Date(actual);
                                    queryDate = new Date(higherLimit);

                                    if (itemDate > queryDate) {
                                        return false;
                                    }
                                }

                                if (isAfterActivated) {
                                    lowerLimit = expected.after;


                                    itemDate = new Date(actual);
                                    queryDate = new Date(lowerLimit);

                                    if (itemDate < queryDate) {
                                        return false;
                                    }
                                }

                                return true;
                            } catch (e) {
                                return false;
                            }

                        } else if (isLower || isHigher) {
                            //number range
                            if (isLower) {
                                higherLimit = expected.lower;

                                if (actual > higherLimit) {
                                    return false;
                                }
                            }

                            if (isHigher) {
                                lowerLimit = expected.higher;
                                if (actual < lowerLimit) {
                                    return false;
                                }
                            }

                            return true;
                        }
                        //etc

                        return true;

                    }
                    return standardComparator(actual, expected);
                }

                var output = filterFilter(array, expression, customComparator);
                return output;
            };
        }])

 .directive('exportTable', ['$filter', function($filter) {
  return {
    scope: {
      exportTable: '='
    },
    templateUrl: 'exportTable.html',
    link: function (scope, element, attr, ctrl) {
      var flattenObject = function(ob) {
        var toReturn = {};

        for (var i in ob) {
          if (!ob.hasOwnProperty(i)) continue;

          if ((typeof ob[i]) == 'object') {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
              if (!flatObject.hasOwnProperty(x)) continue;

              toReturn[i + '_' + x] = flatObject[x];
            }
          } else if (i.indexOf('_type') == -1) {
            toReturn[i] = ob[i];
          }
        }
        return toReturn;
      };

      scope.sync = function() {
        scope.prettified = [];
        var header = {};
        angular.forEach(scope.exportTable, function(object) {
          var flat = flattenObject(object);
          angular.forEach(flat, function(value, key) {
            if (!header[key])
              header[key] = key;
          });
        });
        var array = [];
        angular.forEach(header, function(object, key) {
          if (key.indexOf('.') == -1 && key.indexOf('$') == -1)
            array.push(key);
        });
        array = $filter('orderBy')(array, 'toString()');
        scope.prettified.push(array);
        angular.forEach(scope.exportTable, function(object) {
          var a = [];
          var flat = flattenObject(object);
          angular.forEach(array, function(value) {
            if (!flat[value])
              a.push('N/A');
            else
              a.push(flat[value]);
          });
          scope.prettified.push(a);
        });
        return scope.prettified;
      };
    }
  };
}])
 .directive('stDateRange', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    before: '=',
                    after: '='
                },
                templateUrl: 'stDateRange.html',

                link: function (scope, element, attr, table) {

                    var inputs = element.find('input');
                    var inputBefore = angular.element(inputs[0]);
                    var inputAfter = angular.element(inputs[1]);
                    var predicateName = attr.predicate;


                    [inputBefore, inputAfter].forEach(function (input) {

                        input.bind('blur', function () {


                            var query = {};

                            if (!scope.isBeforeOpen && !scope.isAfterOpen) {

                                if (scope.before) {
                                    query.before = scope.before;
                                }

                                if (scope.after) {
                                    query.after = scope.after;
                                }

                                scope.$apply(function () {
                                    table.search(query, predicateName);
                                })
                            }
                        });
                    });

                    function open(before) {
                        return function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            if (before) {
                                scope.isBeforeOpen = true;
                            } else {
                                scope.isAfterOpen = true;
                            }
                        }
                    }

                    scope.openBefore = open(true);
                    scope.openAfter = open();
                }
            }
        }])
        .directive('stNumberRange', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    lower: '=',
                    higher: '='
                },
                templateUrl: 'stNumberRange.html',
                link: function (scope, element, attr, table) {
                    var inputs = element.find('input');
                    var inputLower = angular.element(inputs[0]);

                    var inputHigher = angular.element(inputs[1]);
                    var predicateName = attr.predicate;

                    [inputLower, inputHigher].forEach(function (input, index) {

                        input.bind('blur', function () {
                            var query = {};

                            if (scope.lower) {
                                query.lower = scope.lower;
                            }

                            if (scope.higher) {
                                query.higher = scope.higher;
                            }

                            scope.$apply(function () {
                                table.search(query, predicateName)
                            });
                        });
                    });
                }
            };
        }])

 .directive('modal', function(){
        return {
            template: '<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content" ng-transclude><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Modal title</h4></div></div></div></div>', 
            restrict: 'E',
            transclude: true,
            replace:true,
            scope:{visible:'=', onSown:'&', onHide:'&'},   
            link:function postLink(scope, element, attrs){
                
                $(element).modal({
                    show: false, 
                    keyboard: attrs.keyboard, 
                    backdrop: attrs.backdrop
                });
                
                scope.$watch(function(){return scope.visible;}, function(value){
                    
                    if(value == true){
                        $(element).modal('show');
                    }else{
                        $(element).modal('hide');
                    }
                });
                
                $(element).on('shown.bs.modal', function(){
                  scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                  });
                });
                
                $(element).on('shown.bs.modal', function(){
                  scope.$apply(function(){
                      scope.onSown({});
                  });
                });

                $(element).on('hidden.bs.modal', function(){
                  scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                  });
                });
                
                $(element).on('hidden.bs.modal', function(){
                  scope.$apply(function(){
                      scope.onHide({});
                  });
                });
            }
        };
    }
)

 .directive('modalHeader', function(){
    return {
        template:'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">{{title}}</h4></div>',
        replace:true,
        restrict: 'E',
        scope: {title:'@'}
    };
})

 .directive('modalBody', function(){
    return {
        template:'<div class="modal-body" ng-transclude></div>',
        replace:true,
        restrict: 'E',
        transclude: true
    };
})

 .directive('modalFooter', function(){
    return {
        template:'<div class="modal-footer" ng-transclude></div>',
        replace:true,
        restrict: 'E',
        transclude: true
    };
})

  .directive('crudTable',['Modal','$injector','$loading','socket','toastr', 'Settings', function (Modal,$injector,$loading,socket,toastr, Settings) {
    return {
      templateUrl: 'app/directive/table.html',
      restrict: 'EA',
      scope: {obj:'='},
      link: function (scope, element, attrs) {
        // var cols = ['name','info','parent','image'];
        scope.title = attrs.api+'s';
        var cols = JSON.parse(attrs.cols);
        var obj = [];
        scope.noedit = attrs.noedit;
        scope.nodelete = attrs.nodelete;
        scope.noadd = attrs.noadd;
        // console.log();
        // scope.disabledColumn = attrs.disabledcolumn;
        angular.forEach(cols, function(o) {
          // var k,v;
          angular.forEach(o, function(v, k) {
            var v1;
            if(v==='number' || v==='float' || v==='integer' || v==='currency'){ v1 = 'parseFloat';}
            else{ v1 = 'lowercase';}
            obj.push({heading:k,dataType:v, sortType:v1});
          });
        });
        scope.cols = obj;
        // scope.Utils = {
        //    keys : Object.keys,
        //    values : Object.values
        // }
        var api = $injector.get(attrs.api);
        scope.data = [];
        // scope.loadingTable = true;
        $loading.start('crudTable');
        scope.data =api.query(function() {
          // scope.loadingTable = false;
          $loading.finish('crudTable');
          socket.syncUpdates(attrs.api.toLowerCase(), scope.data);
        });
        scope.edit = function(item) {
          var title; if(item._id){ title = 'Editing ' + item._id;} else{ title = 'Add New';}
          Modal.show(item,{title:title, api:attrs.api, columns: obj, disabledColumn: attrs.disabledcolumn});
        };
        scope.changeActive = function(b){ // success handler
          b.active = !b.active;
          api.update({ id:b._id }, b).$promise.then(function() {

          }, function(error) { // error handler
              console.log(error);
              toastr.error(error.statusText + ' (' +  error.status + ')');
              b.active = !b.active;
          });
        };

        scope.delete = function(item) {
          // if(Settings.demo){
          //   toastr.error('Delete not allowed in demo mode');
          //   return;
          // }
          api.delete({id:item._id});
        };

        scope.$on('$destroy', function () {
          socket.unsyncUpdates(attrs.api.toLowerCase());
        });
      }
    };}])
  

.directive('modalWindow', ['$timeout', function ($timeout) {
  return {
    priority: 1,
    link: function (scope, element) {
      $timeout(function () {
        // var elem = element[0].querySelector('[autofocus]').focus();
        var elem = element[0].querySelector('input');
        if(elem){
          elem.focus();
        }
      });
    }
  };
}])

// .directive('checkCoupon',function(Coupon) {
//     return {
//         require: 'ngModel',
//         link: function(scope, element, attrs, ctrl) {
//             scope.$watch(attrs.ngModel, function (val) {
//             console.log(val);
//               if(val){
//               // ctrl.$setValidity('phoneLoading', false);
//               Coupon.get({id:val}, function (data) {
//                 if(data){
//                   var customer = data.data[0];
//                   scope.customer.name = customer.name;
//                   scope.customer.email = customer.email;
//                   scope.customer.address = customer.address;
//                   scope.customer.city = customer.city;
//                   ctrl.$setValidity('isCustomer', true);
//                 }else{
//                   ctrl.$setValidity('isCustomer', false);
//                 }
//               });
//             }else{
//                   ctrl.$setValidity('isCustomer', false);
//                   scope.customer = '';
//             }
//           });
//         }
//     };
//
// })

// .directive('autoFillCustomer',function(Customer) {
//     return {
//         require: 'ngModel',
//         link: function(scope, element, attrs,ctrl) {
//             scope.$watch(attrs.ngModel, function (val) {
//                 if(val){
//                 // ctrl.$setValidity('phoneLoading', false);
//                 Customer.findOne({filter:{where:{phone:val}}}).then(function (data) {
//                   if(data){
//                     var customer = data.data[0];
//                     scope.customer.name = customer.name;
//                     scope.customer.email = customer.email;
//                     scope.customer.address = customer.address;
//                     scope.customer.city = customer.city;
//                     ctrl.$setValidity('isCustomer', true);
//                   }else{
//                     ctrl.$setValidity('isCustomer', false);
//                   }
//                 });
//               }else{
//                     ctrl.$setValidity('isCustomer', false);
//                     scope.customer = '';
//               }
//             });
//         }
//     };
//
// })

.directive('sortableColumns', [function () {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'views/sortable-columns.tpl.html',
        scope:{
            columns:'=',
            itemsToSort:'='
        },
        link:function(scope){
            scope.columnClicked = function(column){
                    if(scope.columns.columnToSort.predicate === column.predicate){
                        scope.columns.columnToSort.reverse = !scope.columns.columnToSort.reverse;
                    }else{
                        scope.columns.columnToSort = column;
                    }
                    scope.sortBy(scope.columns.columnToSort);
            };

            scope.sortBy = function(column){
              console.log(column);
                scope.itemsToSort = _.sortBy(scope.itemsToSort,function(obj){
                    switch (column.dataType){
                        case 'number':
                            return Number(obj[column.predicate]);
                        case 'date':
                            return new Date(obj[column.predicate]);
                        default:
                            return obj[column.predicate].toString();
                    }
                });

                if(column.reverse){
                    scope.itemsToSort = scope.itemsToSort.reverse();
                }
            };
            scope.columns.columnToSort = scope.columns[1];
            scope.sortBy(scope.columns.columnToSort);
        }
    };

}])

.directive('onlyNumbers', function() {
    return function(scope, element, attrs) {
        var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190];
        element.bind('keydown', function(event) {
            if($.inArray(event.which,keyCode) === -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
})

.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!==null){
                  return e1 === e2;
                }
            };
            scope.$watch(checker, function (n) {

                //set the form control to valid if both
                //passwords are the same, else invalid
                control.$setValidity('passwordNoMatch', n);
            });
        }
    };
}])
.directive('ngConfirmClick', ['$modal',
    function($modal) {

      var ModalInstanceCtrl = function($scope, $modalInstance) {
        $scope.ok = function() {
          $modalInstance.close();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      };

      return {
        restrict: 'A',
        scope:{
          ngConfirmClick:'&',
          item:'='
        },
        link: function(scope, element, attrs) {
          element.bind('click', function() {
            var message = attrs.ngConfirmMessage || 'Are you sure to delete? ';

            /*
            //This works
            if (message && confirm(message)) {
              scope.$apply(attrs.ngConfirmClick);
            }
            //*/

            //*This doesn't works

            var modalHtml = '<div class="modal-header">Confirm Delete</div>';
            modalHtml += '<div class="modal-body">' + message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-danger" ng-click="ok()">Delete</button><button class="btn" ng-click="cancel()">Cancel</button></div>';

            var modalInstance = $modal.open({
              template: modalHtml,
              controller: ModalInstanceCtrl,
              windowClass: 'modal-danger'
            });

            modalInstance.result.then(function() {
              scope.ngConfirmClick({item:scope.item}); //raise an error : $digest already in progress
            }, function() {
              //Modal dismissed
            });
            //*/

          });

        }
      };
    }
  ])
  .directive('errSrc', [function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src !== attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };
}]);
