import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import getters from './getters';
import auth from './auth';
Vue.use(Vuex);
const store = new Vuex.Store({
    modules:{
        auth
    },
    actions,
    getters
})
export default store;