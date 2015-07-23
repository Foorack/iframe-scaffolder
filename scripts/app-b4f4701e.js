"use strict";angular.module("iframeScaffolder",["ngSanitize","ui.router","ui.bootstrap","ui.validate","ui.sortable","zeroclipboard","ngMaterial"]).config(["$stateProvider","$urlRouterProvider","$sceProvider","$tooltipProvider","uiZeroclipConfigProvider",function(e,t,l,a,s){e.state("home",{url:"/",params:{urls:{value:""},layout:{value:"menu"},theme:{value:"default"},title:{value:null},description:{value:null}},templateUrl:"app/main/main.html",controller:"MainCtrl"}).state("view",{url:"/view?urls&layout&theme&title&description",templateUrl:"app/view/view.html",controller:"ViewCtrl"}).state("fork",{url:"/fork?urls&layout&theme&title&description",controller:"ForkCtrl"}),t.otherwise("/"),l.enabled(!1),a.options({appendToBody:!0}),s.setZcConf({swfPath:"./assets/swf/ZeroClipboard.swf"})}]).run(["$rootScope","$location","$window",function(e,t,l){e.$on("$stateChangeSuccess",function(){l.ga&&l.ga("send","pageview",{page:t.url()})})}]),angular.module("iframeScaffolder").controller("ViewCtrl",["$scope","$stateParams",function(e,t){e.layout=t.layout,e.theme=t.theme||"default",e.urls=t.urls.split(","),e.title=t.title,e.description=t.description}]),angular.module("iframeScaffolder").controller("MainCtrl",["$scope","$state","$stateParams","$http","Scaffolder",function(e,t,l,a,s){var i=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;e.scaffolder=new s,e.settings={layout:l.layout||"menu",theme:l.theme||"default",urls:l.urls&&""!==l.urls?l.urls.split(","):[],title:l.title,description:l.description},e.width=600,e.height=450,e.examples=[],e.themes=[{slug:"default",label:"Default"},{slug:"blue-grey",label:"Blue grey"},{slug:"pink",label:"Pink"},{slug:"grey",label:"Grey"},{slug:"blue",label:"Blue"},{slug:"indigo",label:"Indigo"},{slug:"red",label:"Red"},{slug:"deep-orange",label:"Deep orange"},{slug:"yellow",label:"Yellow"},{slug:"teal",label:"Teal"},{slug:"green",label:"Gree"}],e.getTheme=function(t){var l=null;return angular.forEach(e.themes,function(e){e.slug===t&&(l=e)}),l},a.get("assets/examples.json").success(function(t){e.examples=t}),e.isUrlValid=function(t){return null!==e.extractUrl(t)},e.extractUrl=function(e){var t=null;if(i.test(e))return e;try{t=$(e).attr("src"),0===t.indexOf("//")&&(t="http:"+t)}catch(l){return null}return void 0!==t&&i.test(t)?t:null},e.addUrl=function(){var t=e.extractUrl(e.newUrl);null!==t&&(e.settings.urls.push(t.replace(/,/g,"%2C")),e.newUrl=null)},e.removeUrl=function(t){e.settings.urls.splice(t,1)},e.getViewParams=function(){return{urls:e.settings.urls.join(","),layout:e.settings.layout,theme:e.settings.theme,title:e.settings.title,description:e.settings.description}},e.getViewUrl=function(){return t.href("view",e.getViewParams(),{absolute:!0})},e.getViewIframe=function(){var t=e.getViewUrl(),l=e.useFluid?"100%":e.width||600,a=e.height||450;return'<iframe src="'+t+'" width="'+l+'" height="'+a+'" frameborder="0" allowfullscreen></iframe>'},e.pickExample=function(){var t=e.examples[Math.floor(Math.random()*e.examples.length)];angular.extend(e.settings,angular.copy(t))},e.editLabel=function(t){e.labels={},e.labels[t]=e.scaffolder.label(t,"")},e.saveLabel=function(t){var l=(e.labels[t]||"").replace(/\||,/gi," ");e.labels={},e.settings.urls[t]=""!==l?l+"|"+e.scaffolder.url(t,!0):e.scaffolder.url(t,!0)},e.$watch("settings",function(){e.scaffolder=new s(e.settings.urls,e.settings.layout)},!0)}]),angular.module("iframeScaffolder").controller("ForkCtrl",["$state","$stateParams",function(e,t){e.go("home",t)}]),angular.module("iframeScaffolder").controller("ScaffolderCtrl",["$scope","Scaffolder",function(e,t){e.scaffolder=new t,e.iframeWidth=function(){switch(e.iframeLayout){case"horizontal":return 100/e.urls.length+"%";case"head":return"50%";case"menu":return"75%";case"tabs":return"100%";case"narrative":return"100%"}},e.iframeHeight=function(t,l,a){return"horizontal"===e.iframeLayout||"menu"===e.iframeLayout||"head"===e.iframeLayout&&l||"tail"===e.iframeLayout&&a?"100%":"tabs"===e.iframeLayout||"narrative"===e.iframeLayout?"auto":100/(e.urls.length-1)+"%"},e.menuLinkClasses=function(t){var l=e.scaffolder,a="narrative"===e.iframeLayout;return{active:l.isActive(t),"pull-left":a&&l.isPrevious(t),"pull-right":a&&l.isNext(t),hidden:a&&!l.isNext(t)&&!l.isPrevious(t)}},e.$watch("urls + iframeLayout",function(){e.scaffolder=new t(e.urls,e.iframeLayout)},!0)}]),angular.module("iframeScaffolder").directive("scaffolder",function(){return{restrict:"E",controller:"ScaffolderCtrl",templateUrl:"components/scaffolder/scaffolder.html",scope:{urls:"=",iframeLayout:"=",theme:"=",title:"=",description:"="}}}),angular.module("iframeScaffolder").service("Scaffolder",function(){function e(e,t,l){return angular.extend(this,{urls:e||[],layout:t||"menu"}),this.activate(l||0),this}return e.prototype.url=function(e,t){var l=this.urls[e];return this.isVisible(e)||t?this.hasLabel(e)?l.split("|")[1]:l:void 0},e.prototype.isActive=function(e){return e===this.active},e.prototype.activate=function(e){this.active=e<this.urls.length?e:0},e.prototype.getActive=function(){return{label:this.label(this.active),url:this.url(this.active)}},e.prototype.isVisible=function(e){return!this.hasMenu()||this.isActive(e)},e.prototype.isPrevious=function(e){return e===this.active-1},e.prototype.isNext=function(e){return e===this.active+1},e.prototype.hasLabel=function(e){return this.urls[e]&&this.urls[e].indexOf("|http")>-1},e.prototype.label=function(e,t){var l=this.urls[e];return this.hasLabel(e)?l.split("|")[0]:"undefined"!=typeof t&&null!==t?t:l},e.prototype.hasMenu=function(){return["menu","tabs","narrative"].indexOf(this.layout)>-1},e}),function(e){try{e=angular.module("iframeScaffolder")}catch(t){e=angular.module("iframeScaffolder",[])}e.run(["$templateCache",function(e){e.put("app/main/main.html",'<div class="introduction"><a class="introduction__logo-container" target="_blank" href="//www.google.com/trends/"><md-button class="md-fab md-mini" aria-label="Back to Google Trends"><md-icon md-svg-src="assets/images/arrow_back.svg"></md-icon></md-button><md-icon md-svg-src="assets/images/google.svg" aria-label="Google" class="introduction__logo-container__google"></md-icon><h1 class="introduction__logo-container__trends">Trends</h1></a><div class="container"><h2>Iframe Scaffolder</h2><p class="lead text-muted">This tool helps you to quickly arrange several iframes together.</p></div></div><div class="container"><div class="row editor"><div class="col-md-4"><div class="panel editor__step panel-default"><div class="editor__step__label"></div><form class="panel-body" name="addUrlForm" role="form" ng-submit="addUrl()"><div class="input-group"><input type="text" required="" ui-validate="{ isUrl: \'isUrlValid($value)\' }" name="newUrl" ng-model="newUrl" class="form-control" placeholder="An URL or an iframe code"> <span class="input-group-btn"><button class="btn btn-primary" ng-disabled="!addUrlForm.$valid" type="submit" tooltip="Create an iframe with this URL">Add</button></span></div><div ng-show="addUrlForm.newUrl.$error.isUrl && !addUrlForm.newUrl.$error.required" class="editor__step__error text-danger small">This is not a valid URL or iframe.</div></form><ul class="list-group" ui-sortable="" ng-model="settings.urls"><li class="list-group-item editor__step__url" ng-repeat="url in settings.urls track by $index"><div><div class="btn-group btn-group-xs pull-right editor__step__url__actions"><button type="button" class="btn btn-default" tooltip="Change the label describing this iframe" ng-click="editLabel($index)">Edit label</button> <button type="button" class="btn btn-default" ng-click="removeUrl($index)" tooltip="Remove this iframe"><i class="glyphicon glyphicon-trash"></i></button> <span class="btn btn-default"><i class="glyphicon glyphicon-move"></i></span></div><a ng-href="{{scaffolder.url($index, true)}}" target="_blank" class="editor__step__url__value">{{scaffolder.label($index)}}</a></div><form ng-submit="saveLabel($index)" ng-show="!!labels[$index] || labels[$index] === \'\'" class="editor__step__url__edit-label"><div class="input-group input-group-sm"><input type="text" ng-model="labels[$index]" class="form-control"> <span class="input-group-btn"><button class="btn btn-default" type="submit">Save</button></span></div></form></li></ul></div><div class="panel editor__step panel-default" ng-class="{ \'editor__step--disable\': !settings.urls.length }"><div class="editor__step__label"></div><div class="panel-body"><p>Choose a layout&nbsp; <small class="text-muted">(how iframes are arranged)</small></p><div class="text-center btn-group"><button class="btn btn-default btn-sm" ng-class="{active: settings.layout == \'menu\'}" ng-click="settings.layout = \'menu\'" tooltip="Toggle iframes using a menu">≡◻</button> <button class="btn btn-default btn-sm" ng-class="{active: settings.layout == \'narrative\'}" ng-click="settings.layout = \'narrative\'" tooltip="Toggle iframes using next and previous buttons">⍃ ⍄</button> <button class="btn btn-default btn-sm" ng-class="{active: settings.layout == \'tabs\'}" ng-click="settings.layout = \'tabs\'" tooltip="Toggle iframes using tabs">⎍⎍</button> <button class="btn btn-default btn-sm" ng-class="{active: settings.layout == \'horizontal\'}" ng-click="settings.layout = \'horizontal\'" tooltip="All iframes have equal width">▯▯▯</button> <button class="btn btn-default btn-sm" ng-class="{active: settings.layout == \'head\'}" ng-click="settings.layout = \'head\'" tooltip="The first iframe use half of the screen, the others a stacked">▯▤</button> <button class="btn btn-default btn-sm" ng-class="{active: settings.layout == \'tail\'}" ng-click="settings.layout = \'tail\'" tooltip="The last iframe use half of the screen, the others a stacked">▤▯</button></div></div></div><div class="panel editor__step panel-default" ng-class="{ \'editor__step--disable\': !settings.urls.length }"><div class="editor__step__label"></div><div class="panel-body"><div class="pull-right dropdown"><span class="btn-group"><i class="scaffolder--{{settings.theme}}__preview editor__step__theme-preview disabled btn btn-xs"></i> <button class="btn btn-default btn-xs dropdown-toggle">{{ getTheme(settings.theme).label }} &nbsp;<i class="caret"></i></button></span><ul class="dropdown-menu" role="menu"><li ng-repeat="theme in themes" class="editor__step__theme"><a ng-click="settings.theme = theme.slug"><i class="scaffolder--{{theme.slug}}__preview editor__step__theme__preview"></i> {{theme.label}}</a></li></ul></div>Choose a theme&nbsp;</div></div><div class="panel editor__step panel-default" ng-class="{ \'editor__step--disable\': !settings.urls.length }"><div class="editor__step__label"></div><div class="panel-body form-horizontal"><div class="form-group"><label for="input-title" class="control-label col-sm-4">Choose a title</label><div class="col-sm-8"><input type="text" class="form-control" ng-model="settings.title" id="input-title"></div></div><div class="form-group editor__step__last-group"><label for="input-description" class="control-label col-sm-4">Describe</label><div class="col-sm-8"><textarea class="form-control" ng-model="settings.description" id="input-description"></textarea></div></div></div></div><div class="panel editor__step panel-default" ng-class="{ \'editor__step--disable\': !urls.length }"><div class="editor__step__label"></div><div class="panel-body"><p><button class="btn btn-primary btn-xs pull-right" ui-zeroclip="" zeroclip-model="getViewIframe()" title="Copy the embed code to you clipboard.">Copy</button> Export the iframe</p><p><textarea class="form-control" readonly="">{{getViewIframe()}}</textarea></p><div class=""><div class="pull-left editor__step__iframe-label"><strong>Change the size&nbsp;</strong><br><label class="editor__step__iframe-label__fluid"><input type="checkbox" ng-model="useFluid"> Use a fluid width</label></div><div class="text-right editor__step__iframe-size"><input type="number" ng-disabled="useFluid" ng-model="width" min="50" class="form-control input-sm editor__step__iframe-size__size"> x <input type="number" ng-model="height" min="50" class="form-control input-sm editor__step__iframe-size__size"></div></div></div></div><div class="text-muted small editor__credits hidden-xs hidden-sm"></div></div><div class="col-md-8"><div class="panel panel-default editor__preview"><div class="editor__preview__empty-alert" ng-hide="settings.urls.length"><div class="lead editor__preview__empty-alert__message"><p>Add an iframe\'s URL on the <span class="hidden-sm hidden-xs">left&nbsp;</span>panel to preview the mosaic here.</p><p><a ng-click="pickExample()" class="btn btn-link" ng-show="examples.length">See an example.</a> {{example}}</p></div></div><div class="panel-heading"><div class="input-group"><input class="form-control" type="text" value="{{getViewUrl()}}" readonly=""> <span class="input-group-btn"><a class="btn btn-link" href="{{getViewUrl()}}" target="_blank" tooltip="Open the iframe in a new window"><i class="glyphicon glyphicon-new-window"></i></a> <a class="btn btn-link" tooltip="Permalink to edit the same mosaic" ui-sref="fork(getViewParams())"><i class="glyphicon glyphicon-edit"></i></a></span></div></div><div class="editor__preview__scaffolder"><scaffolder urls="settings.urls" iframe-layout="settings.layout" theme="settings.theme" title="settings.title" description="settings.description"></scaffolder></div></div></div></div></div>')}])}(),function(e){try{e=angular.module("iframeScaffolder")}catch(t){e=angular.module("iframeScaffolder",[])}e.run(["$templateCache",function(e){e.put("app/view/view.html",'<div class="view"><div class="view__scaffolder"><scaffolder urls="urls" iframe-layout="layout" theme="theme" title="title" description="description"></scaffolder></div></div>')}])}(),function(e){try{e=angular.module("iframeScaffolder")}catch(t){e=angular.module("iframeScaffolder",[])}e.run(["$templateCache",function(e){e.put("components/scaffolder/scaffolder.html",'<div class="scaffolder scaffolder--{{iframeLayout}} scaffolder--{{theme}}" layout="column" layout-align="start start"><div class="scaffolder__header" ng-if="title || description"><h3 class="scaffolder__header__title" ng-if="title">{{ title }}</h3><p class="scaffolder__header__description lead" ng-if="description">{{ description }}</p></div><div class="scaffolder__container" flex=""><aside ng-show="scaffolder.hasMenu()" class="scaffolder__container__menu"><ul class="nav nav-pills" ng-class="{ \'nav-stacked\': iframeLayout === \'menu\' }"><li ng-repeat="url in urls track by $index" ng-class="menuLinkClasses($index)" class="scaffolder__container__menu__item"><a ng-click="scaffolder.activate($index)">{{scaffolder.label($index, "Iframe " + ($index+1))}}</a></li></ul><h4 class="scaffolder__container__title">{{scaffolder.getActive().label}}</h4></aside><iframe frameborder="0" class="scaffolder__container__iframe" width="{{iframeWidth($index, $first, $last)}}" height="{{iframeHeight($index, $first, $last)}}" ng-class="{\'scaffolder__container__iframe--last\': $last, \'scaffolder__container__iframe--first\': $first}" ng-src="{{scaffolder.url($index)}}" ng-show="scaffolder.isVisible($index)" ng-repeat="url in urls track by $index"></iframe></div><div class="scaffolder__footer"><a target="_blank" href="//www.google.com/trends/"><img src="assets/images/googletrends.png" alt="Google Trends"></a></div></div>')}])}();