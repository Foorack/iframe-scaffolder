'use strict';

angular.module('iframeScaffolder').controller('MainCtrl', function ($scope, $state, $stateParams, $http, Scaffolder) {

  // Regex code is obtained from angular https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js
  var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

  $scope.scaffolder = new Scaffolder();
  $scope.layout     = $stateParams.layout || 'menu';
  $scope.theme       =$stateParams.theme || 'default';
  $scope.urls       = $stateParams.urls === '' ? [] : $stateParams.urls.split(',');
  $scope.width      = 600;
  $scope.height     = 450;
  $scope.examples   = [];
  $scope.themes     = [
    { slug: 'default', label: 'Default' },
    { slug: 'blue-grey', label: 'Blue grey' },
    { slug: 'pink', label: 'Pink' },
    { slug: 'grey', label: 'Grey' },
    { slug: 'blue', label: 'Blue' },
    { slug: 'indigo', label: 'Indigo' },
    { slug: 'red', label: 'Red' },
    { slug: 'deep-orange', label: 'Deep orange' },
    { slug: 'yellow', label: 'Yellow' },
    { slug: 'teal', label: 'Teal' },
    { slug: 'green', label: 'Gree' }
  ];

  $scope.getTheme = function(slug) {
    var theme = null;
    angular.forEach($scope.themes, function(one) {
      if( one.slug === slug ) {
        theme = one;
      }
    });
    return theme;
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
    $scope.urls.push(url.replace(/,/g, '%2C'));
    // Reset form value
    $scope.newUrl = null;
  };

  $scope.removeUrl = function(index) {
    $scope.urls.splice(index, 1);
  };

  $scope.getViewUrl = function() {
    var params = {
      urls: $scope.urls.join(','),
      layout: $scope.layout,
      theme: $scope.theme
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
    angular.extend($scope, angular.copy(example));
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
      $scope.urls[index] = label + '|' + $scope.scaffolder.url(index, true);
    // Create a new URL without prefix
    } else {
      $scope.urls[index] = $scope.scaffolder.url(index, true);
    }
  };

  $scope.$watch('urls + layout', function() {
    // New instance of the scaffolder class
    $scope.scaffolder = new Scaffolder($scope.urls, $scope.layout);
  }, true);

});
