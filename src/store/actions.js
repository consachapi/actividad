import axios from 'axios';
import { apiUrl, apiAuth } from '@/constants/config';

const actions = {

    // /////////////////////////////////////////////
    // COMPONENTS
    // /////////////////////////////////////////////

    // Vertical NavMenu
    updateVerticalNavMenuWidth({ commit }, width) {
      commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width)
    },

    // VxAutoSuggest
    updateStarredPage({ commit }, payload) {
      commit('UPDATE_STARRED_PAGE', payload)
    },

    // The Navbar
    arrangeStarredPagesLimited({ commit }, list) {
      commit('ARRANGE_STARRED_PAGES_LIMITED', list)
    },
    arrangeStarredPagesMore({ commit }, list) {
      commit('ARRANGE_STARRED_PAGES_MORE', list)
    },

    // /////////////////////////////////////////////
    // UI
    // /////////////////////////////////////////////

    toggleContentOverlay({ commit }) {
      commit('TOGGLE_CONTENT_OVERLAY')
    },
    updateTheme({ commit }, val) {
      commit('UPDATE_THEME', val)
    },

    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    updateUserInfo({ commit }, payload) {
      commit('UPDATE_USER_INFO', payload)
    },

    role({ commit }) {
      return new Promise((resolve, reject) => {
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        axios({
          url: `${ apiUrl }/v1/usuario/datos`,
          method: 'GET'
        })
        .then(response => {
          if(response.status === 200){
            const role = response.data.data[0].roles.length > 1 ? response.data.data[0].roles.find(item => item === "llankasun_realm_admin") : response.data.data[0].roles.find(item => item === "llankasun_realm_residente");
            commit('role_user', role);
          }
          resolve(response);
        })
        .catch(error => {
          commit('role_error');
          if (error.response) {
            reject(error);
          } else {
            reject(new Error('ERROR_NETWORK'));
          }
        });
      });
    },

    login({ commit }, params) {
      return new Promise((resolve, reject) => {
        delete axios.defaults.headers.common['Access-Control-Allow-Origin'];
        axios({
          url: `${ apiAuth }/protocol/openid-connect/token`,
          data: params,
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })
        .then(response => {
          if(response.status === 200){
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            commit('auth_success', response.data);
          }
          resolve(response);
        })
        .catch(err => {
          commit('auth_error');
          localStorage.removeItem('token');
          reject(err.response);
        })
      })
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
          commit('logout')
          localStorage.removeItem('token');
          resolve()
      })
    },
}

export default actions
