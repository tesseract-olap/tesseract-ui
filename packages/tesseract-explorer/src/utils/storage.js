const localStorageAvailable = typeof localStorage !== "undefined";

export function getItem(key, defaultValue = "") {
  return localStorageAvailable ? localStorage.getItem(key) : defaultValue;
}

export function getObject(key, defaultValue = "{}") {
  return JSON.parse(getItem(key, defaultValue));
}

export function setItem(key, value) {
  return localStorageAvailable ? localStorage.setItem(key, value) : undefined;
}

export function setObject(key, value) {
  return setItem(key, JSON.stringify(value));
}
