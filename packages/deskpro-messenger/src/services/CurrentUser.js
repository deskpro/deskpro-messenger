import _merge from 'lodash/merge';
import _findIndex from 'lodash/findIndex';
import _isPlainObject from 'lodash/isPlainObject';

import apiService from './ApiService';
import { setVisitor } from '../modules/guest';
import { startListeningAlerts } from '../modules/alerts';

const LS_CACHE_KEY = 'dp__vd'; // deskpro (dp) visitor (v) data (d)

class CurrentUser {
  /**
   * Initialize UserState.
   *
   * @param {object} store Redux store with dispatch()/getState() methods.
   * @param {object} config The app configuration object (optional)
   */
  async init(store, config = {}) {
    this.store = store;
    this.config = config;
    const cache = this.getCache();
    if (!cache.visitor_id) {
      await this.initNewVisitor();
    } else {
      await this.initKnownGuest(cache.visitor_id);
    }

    this.store.dispatch(startListeningAlerts());
    return this.getCache();
  }

  async initNewVisitor() {
    const state = {
      visitor_id: this.generateVisitorId(),
      guest: this.config.user || {
        name: null,
        email: null
      },
      chats: []
    };
    apiService.visitorId = state.visitor_id;
    this.updateCache(state);
  }

  async initKnownGuest(visitorId) {
    apiService.visitorId = visitorId;
    const userData = await this.loadUser(visitorId);
    this.updateCache(userData);
  }

  getActiveChat() {
    const cache = this.getCache();
    if (_isPlainObject(cache) && Array.isArray(cache.chats)) {
      return cache.chats.find((c) => c.status === 'open');
    }
    return null;
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
