﻿'use strict';
define(['core/app/detourService'], function (detour) {
    detour.registerController([
      'PerspectiveEditCtrl',
      ['$timeout', '$parse', '$scope', 'logger', '$detour','$http',
      function ($timeout, $parse,$scope, logger, $detour, $http) {

          var validator = $("form[name=myForm]").validate({
              errorClass: "inputError"
          });

          $scope.save = function () {
              if (!validator.form()) {
                  return null;
              }

              var form = $("form[name=myForm]");
              var promise = $http({
                  url: form.attr('action'),
                  method: "POST",
                  data: form.serialize() + '&submit.Save=Save',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
              }).then(function (response) {
                  logger.success('Save succeeded');
                  return response;
              }, function (reason) {
                  logger.error('Save Failed： ' + reason.data.Message);
              });
              return promise;
          };

          $scope.saveAndView = function () {
              var promise = $scope.save();
              promise.then(function (response) {
                  var getter = $parse('id');
                  var id = getter(response.data);
                  if(id)
                      $detour.transitionTo('PerspectiveEdit', { Id: id });
              });
              return promise;
          };

          $scope.saveAndBack = function () {
              var promise = $scope.save();
              promise.then(function () {
                  $scope.exit();
              });
              return promise;
          };
          
          $scope.exit = function () {
              $detour.transitionTo('PerspectiveList');
          };
      }]
    ]);
});