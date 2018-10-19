import Cookies from 'js-cookie';
import _merge from 'lodash/merge';
import _findIndex from 'lodash/findIndex';
import _isPlainObject from 'lodash/isPlainObject';

import apiService from './ApiService';
import { setVisitor } from '../modules/guest';
import { startListeningMessages } from '../modules/chat';

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

    return this.getCache();
  }

  async initNewVisitor() {
    const state = {
      visitor_id: this.generateVisitorId(),
      guest: {
        name: null,
        email: null
      },
      chats: []
    };
    apiService.visitorId = state.visitor_id;
    Cookies.set(COOKIE_VID_NAME, state.visitorId);
    this.updateCache(state);
  }

  async initKnownGuest(visitorId) {
    const state = this.getCache();
    if (this.isCacheValid(state)) {
      apiService.visitorId = state.visitor_id;
      return this.store.dispatch(setVisitor(state));
    }
    const userData = await this.loadUser(visitorId);
    apiService.visitorId = state.visitor_id;
    if (userData.last_action_alert) {
      apiService.lastActionAlert = userData.last_action_alert;
    }
    this.updateCache(userData);
    this.store.dispatch(startListeningMessages());
  }

  getActiveChat() {
    const cache = this.getCache();
    if (_isPlainObject(cache) && Array.isArray(cache.chats)) {
      return cache.chats.find((c) => c.status === 'active');
    }
    return null;
  }

  isCacheValid(state) {
    // empty cache
    if (!state || !state.visitor_id) {
      return false;
    }
    // the cache says we have an active chat.
    // we _always_ want to load fresh data when there
    // is an active chat.
    const hasActiveChat = !!this.getActiveChat();
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
  updateCache(state, shouldUpdateStore = true) {
    const cache = this.getCache();
    const newState = _merge(cache, state);
    // merge recent chats separately by chat id.
    if (Array.isArray(state.chats)) {
      const chats = cache.chats.slice();
      state.chats.forEach((newChat) => {
        const idx = _findIndex(chats, ['id', newChat.id]);
        if (idx !== -1) {
          chats[idx] = _merge(chats[idx], newChat);
        } else {
          chats.push(newChat);
        }
      });
      newState.chats = chats;
    }
    window.parent.localStorage[LS_CACHE_KEY] = JSON.stringify(newState);
    if (shouldUpdateStore) {
      this.store.dispatch(setVisitor(newState));
    }
  }

  /**
   * Load user data with API call.
   *
   * @param {string} visitorId Visitor ID
   */
  async loadUser(visitorId) {
    return apiService.loadUser(visitorId);
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
