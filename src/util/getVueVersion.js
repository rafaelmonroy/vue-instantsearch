export function getVueVersion() {
  if (typeof window !== 'undefined' && typeof window.Vue !== 'undefined') {
    return window.Vue.version; // for umd
  } else {
    return require('vue').version;
  }
}
