'use strict';

angular.module('iframeScaffolder').controller('MainCtrl', function ($scope, $state, $stateParams, $http, Scaffolder) {

  // Regex code is obtained from angular https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js
  var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

  $scope.scaffolder = new Scaffolder();
  // Mosaic settings
  $scope.settings = {
    'layout': $stateParams.layout || 'menu',
    'theme': $stateParams.theme || 'default',
    'urls': !$stateParams.urls || $stateParams.urls === '' ? [] : $stateParams.urls.split(',')
  };

  $scope.width      = 600;
  $scope.height     = 450;
  $scope.examples   = [];
  $scope.themes     = {
    "default": "Default",
    "ebony-clay": "Ebony clay",
    "picton-blue": "Picton blue",
    "silver-tree": "Silver tree",
    "eucalyptus": "Eucalyptus",
    "sunset-orange": "Sunset orange",
    "monza-red": "Monza red"
  };

  // Get sample datasets
  $http.get('assets/examples.json').success(function(data) {
    $scope.examples = data;
  });

  $scope.isUrlValid = function(value) {
    return $scope.extractUrl(value) !== null;
  };

  $scope.extractUrl = function(value) {
    var url = null;
    // The given value can be an URL
    if( URL_REGEXP.test(value) ) { return value; }
    // Or an iframe...
    try {
      // We parse the code to extract the src value
      url = $(value).attr('src');
      // Some iframe use the // syntax which is not considered as a good value
      if( url.indexOf('//') === 0) { url = 'http:' + url; }
    } catch(e) {
      // We couldnt't parse the value, there is nothing to do
      return null;
    }
    // The url extracted must also be valid
    return url !== undefined && URL_REGEXP.test(url) ? url : null;
  };

  $scope.addUrl = function() {
    var url = $scope.extractUrl($scope.newUrl);
    // Avoid adding null value
    if(url === null) { return; }
    // Add the url to the list
    $scope.settings.urls.push(url.replace(/,/g, '%2C'));
    // Reset form value
    $scope.newUrl = null;
  };

  $scope.removeUrl = function(index) {
    $scope.settings.urls.splice(index, 1);
  };

  $scope.getViewUrl = function() {
    var params = {
      urls: $scope.settings.urls.join(','),
      layout: $scope.settings.layout,
      theme: $scope.settings.theme
    };
    return $state.href('view', params, {absolute: true});
  };

  $scope.getViewIframe = function() {
    var url = $scope.getViewUrl(),
      width = $scope.useFluid ? '100%' : $scope.width || 600,
     height = $scope.height || 450;
    return '<iframe src="' + url + '" width="' + width + '" height="' + height + '" frameborder="0" allowfullscreen></iframe>';
  };

  $scope.pickExample = function() {
    var example = $scope.examples[Math.floor(Math.random() * $scope.examples.length)];
    angular.extend($scope.settings, angular.copy(example));
  };

  $scope.editLabel = function(index) {
    $scope.labels = {};
    $scope.labels[index] = $scope.scaffolder.label(index, '');
  };

  $scope.saveLabel = function(index) {
    // Get the label and remove unauthorized pipes
    var label = ($scope.labels[index] || '').replace(/\||,/gi, ' ');
    $scope.labels = {};
    // Create a new URL with the label as prefix
    if(label !== '') {
      $scope.settings.urls[index] = label + '|' + $scope.scaffolder.url(index, true);
    // Create a new URL without prefix
    } else {
      $scope.settings.urls[index] = $scope.scaffolder.url(index, true);
    }
  };

  $scope.$watch('settings', function() {
    // New instance of the scaffolder class
    $scope.scaffolder = new Scaffolder($scope.settings.urls, $scope.settings.layout);
  }, true);

});
