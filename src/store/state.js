import navbarSearchAndPinList from "@/layouts/components/navbar/navbarSearchAndPinList"
import themeConfig from "@/../themeConfig.js"
import colors from "@/../themeConfig.js"

const userDefaults = {
  uid         : 0,          // From Auth
  displayName : "Usuario", // From Auth
  about       : "Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.",
  //photoURL    : require("@/assets/images/portrait/small/avatar-s-11.jpg"), // From Auth
  photoURL    : require("@/assets/images/pages/user.png"), // From Auth
  status      : "online",
  userRole    : "admin"
}

const is_touch_device = () => {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
      return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || window.DocumentTouch) {
      return true;
  }
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}


// /////////////////////////////////////////////
// State
// /////////////////////////////////////////////

const state = {
    AppActiveUser           : userDefaults,
    bodyOverlay             : false,
    isVerticalNavMenuActive : true,
    is_touch_device         : is_touch_device(),
    mainLayoutType          : themeConfig.mainLayoutType || "vertical",
    navbarSearchAndPinList  : navbarSearchAndPinList,
    reduceButton            : themeConfig.sidebarCollapsed,
    verticalNavMenuWidth    : "default",
    verticalNavMenuItemsMin : false,
    scrollY                 : 0,
    starredPages            : navbarSearchAndPinList["pages"].data.filter((page) => page.is_bookmarked),
    theme                   : themeConfig.theme || "light",
    themePrimaryColor       : colors.primary,
    windowWidth: null,

    success: false,
    token: localStorage.getItem('token') || '',
    role: '',
}

export default state
