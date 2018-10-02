import Cookies from 'js-cookie';
import apiService from './ApiService';
import { setVisitor } from '../modules/guest';

const COOKIE_VID_NAME = 'dp__v'; // deskpro (dp) visitor (v)
const LS_CACHE_KEY = 'dp__vd'; // deskpro (dp) visitor (v) data (d)

class CurrentUser {
  /**
   * Initialize UserState.
   *
   * @param {object} store Redux store with dispatch()/getState() methods.
   */
  async init(store) {
    this.store = store;
    const cookieVid = Cookies.get(COOKIE_VID_NAME);
    if (!cookieVid) {
      await this.initNewVisitor();
    } else {
      await this.initKnownGuest(cookieVid);
    }
  }

  async initNewVisitor() {
    const state = {
      visitorId: this.generateVisitorId(),
      guest: {
        name: null,
        email: null
      },
      chat: {
        recentChats: []
      }
    };
    Cookies.set(COOKIE_VID_NAME, state.visitorId);
    this.updateCache(state);
    return this.store.dispatch(setVisitor(state));
  }

  async initKnownGuest(visitorId) {
    const state = this.getCache();
    if (this.isCacheValid(state)) {
      return this.store.dispatch(setVisitor(state));
    }
    const userData = await this.loadUser(visitorId);
    this.updateCache(userData);
  }

  isCacheValid(state) {
    // empty cache
    if (!state || !state.visitorId) {
      return false;
    }
    // the cache says we have an active chat.
    // we _always_ want to load fresh data when there
    // is an active chat.
    const hasActiveChat =
      state.chat.recentChats.filter((c) => c.status === 'active').length > 0;
    if (hasActiveChat) {
      return false;
    }
    // otherwise, theres no reason to update the cache at all
    return true;
  }

  /**
   * Retrieves and parse cache from the localStorage.
   */
  getCache() {
    return JSON.parse(window.parent.localStorage[LS_CACHE_KEY] || '{}');
  }

  /**
   * Updates current cache for the session data.
   *
   * @param {object} state State object
   */
  updateCache(state) {
    const cache = this.getCache();
    const newState = {
      visitorId: state.visitorId || cache.visitorId,
      guest: { ...(cache.guest || {}), ...(state.guest || {}) },
      chat: { ...(cache.chat || {}), ...(state.chat || {}) }
    };
    window.parent.localStorage[LS_CACHE_KEY] = JSON.stringify(newState);
    this.store.dispatch(setVisitor(newState));
  }

  /**
   * Load user data with API call.
   *
   * @param {string} visitorId Visitor ID
   */
  async loadUser(visitorId) {
    apiService.loadUser(visitorId);
  }

  /**
   * Generates visitor ID.
   */
  generateVisitorId() {
    let id = `${Math.floor(new Date().getTime() / 1000 / 60)}-`;

    const chars1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const chars2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < 8; i += 1) {
      id += chars1.charAt(Math.floor(Math.random() * chars1.length));
    }
    id += '-';
    for (let i = 0; i < 8; i += 1) {
      id += chars1.charAt(Math.floor(Math.random() * chars1.length));
    }
    id += '-';
    for (let i = 0; i < 6; i += 1) {
      id += chars1.charAt(Math.floor(Math.random() * chars1.length));
    }
    id += '-';
    for (let i = 0; i < 3; i += 1) {
      id += chars2.charAt(Math.floor(Math.random() * chars2.length));
    }

    return id;
  }
}

const currentUser = new CurrentUser();

export default currentUser;
