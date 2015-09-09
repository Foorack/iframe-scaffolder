'use strict';

angular.module('iframeScaffolder').controller('ViewCtrl', function ($scope, $stateParams) {
  // Set scaffolder options
  $scope.options = {
    layout : $stateParams.layout,
    theme  : $stateParams.theme || 'default',
    urls   : $stateParams.urls.split(','),
    active : $stateParams.active || 0,
    sharing: $stateParams.sharing || 0,
    title : $stateParams.title,
    description: $stateParams.description
  };
});
