angular.module('erp', ['erp.controllers', 'erp.directives', 'erp.services', 'ui.router'])
angular.module('erp.controllers', [])
angular.module('erp.directives', [])
angular.module('erp.services', ['ngResource'])

angular.module('erp')
  .config(['$qProvider', function($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q) {
      return {
        'response': function(response) {
          if (response.data.code === undefined) {
            return response;
          } else {
            if (response.data.code === 0) {
              return response.data;
            } else {
              alert(response.data.msg);
              return $q.reject(response);
            }
          }
        }
      };
    });
  });

angular.module('erp')
  .config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: '/login/index.html'
      })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: '/app/frame.html',
    })

    .state('app.orders', {
      url: '/orders',
      templateUrl: '/orders/index.html',
    })

    ;
  })

const baseUrl = 'http://www.lifeuxuan.com/index.php';
const URL = {
  'login': '/account/eguard/login'
}

angular.module('erp.services')

.service('API', function($resource) {
  let service = this
  for (var p in URL) {
    (function(param) {
      service[p] = function() {
        return $resource(baseUrl + URL[p])
      }
    })(p);
  }
})

;
angular.module('erp.controllers')

.controller('FrameCtrl', function($scope) {
  $scope.navToggle = function(event) {
    var dom = $(event.target)
    if (dom.is('header') || dom.is('i')) {
      dom.closest('div')
        .find('i').toggleClass('rotate').end()
        .find('ul').toggle()
    }
  }

  $scope.bva = 123

})

;
angular.module('erp.controllers')

.controller('LoginCtrl', function($scope, API) {
  $scope.user = {
    name: '',
    password: ''
  }
  $scope.action = {}

  $scope.action.login = function() {
    API['login']().get({}, function(data) {
      console.log(data);
    });
  }

})
