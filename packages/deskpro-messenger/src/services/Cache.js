import _get from 'lodash/get';
import _set from 'lodash/set';
import _findIndex from 'lodash/findIndex';
import _merge from 'lodash/merge';

const LS_CACHE_KEY = 'dp__vd'; // deskpro (dp) visitor (v) data (d)

const getPropertyPath = (obj, path) => {
  return [].concat(path).reduce((accPath, item) => {
    let key;
    if (typeof item === 'string') {
      key = item;
    } else if (Array.isArray(item)) {
      const arr = _get(obj, accPath);
      if (Array.isArray(arr) && arr.length) {
        if (item.length > 0) {
          const idx = _findIndex(arr, item);
          key = idx >= 0 ? idx : arr.length;
        } else {
          key = arr.length;
        }
      } else {
        key = 0;
      }
    } else {
      // non-supported type of key.
      return accPath;
    }
    return accPath.length ? `${accPath}.${key}` : key;
  }, '');
};

export class LocalCache {
  set cache(value) {
    window.parent.localStorage[LS_CACHE_KEY] = JSON.stringify(value);
  }

  get cache() {
    return JSON.parse(window.parent.localStorage[LS_CACHE_KEY] || '{}');
  }

  setValue(path, value) {
    const cache = this.cache;
    const propertyPath = getPropertyPath(cache, path);
    this.cache = _set(cache, propertyPath, value);
  }

  getValue(path, def = undefined) {
    const cache = this.cache;
    const propertyPath = getPropertyPath(cache, path);
    return _get(cache, propertyPath) || def;
  }

  mergeArray(path, newValue, byKey = 'id') {
    const arr = [].concat(this.getValue(path) || []);
    newValue.forEach((item) => {
      const idx = _findIndex(arr, [byKey, item[byKey]]);
      if (idx >= 0) {
        arr[idx] = _merge(arr[idx], item);
      } else {
        arr.push(item);
      }
    });
    this.setValue(path, arr);
  }
}

const cache = new LocalCache();
export default cache;
