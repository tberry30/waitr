(function () {
  angular
    .module('waitrApp')
    .controller('custRestaurantMenuCtrl', ['restaurantService', '$stateParams', '$ionicHistory', '$state', custRestaurantMenuCtrl]);

  function custRestaurantMenuCtrl(restaurantService, $stateParams, $ionicHistory, $state) {
    var cmc = this;
    cmc.restaurantId = $stateParams.restaurantId;
    cmc.menuTitle = null

    restaurantService.getCurrentRestaurant(cmc.restaurantId)
      .then(function (restaurant) {
        cmc.restaurant = restaurant[0];
        cmc.groupedMenu = _.groupBy(cmc.restaurant.menu, 'section');
      });

    cmc.goBack = function () {
      $ionicHistory.goBack();
    };

    cmc.toggleSection = function (key) {
      if (key === cmc.menuTitle) {
        cmc.menuTitle = null;
      } else {
        cmc.menuTitle = key;
      }
    };
  }

})();

