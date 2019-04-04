import { index } from 'instantsearch.js/es/widgets';
import { createSuitMixin } from '../mixins/suit';

export default {
  name: 'AisIndex',
  mixins: [createSuitMixin({ name: 'Index' })],
  props: {
    indexName: {
      type: String,
      required: true,
    },
    indexId: {
      type: String,
      required: false,
    },
  },
  inject: {
    instantSearchInstance: {
      name: 'instantSearchInstance',
      default() {
        throw new TypeError(
          `It looks like you forgot to wrap your Algolia search component "<ais-index>" inside of an "<ais-instant-search>" component.`
        );
      },
    },
  },
  provide() {
    return {
      instantSearchInstance: this.indexInstance,
    };
  },
  data() {
    const indexInstance = index({
      indexName: this.indexName,
      indexId: this.indexId || this.idnexName,
    });

    indexInstance.started = true;

    return {
      indexInstance,
    };
  },
  created() {
    this.instantSearchInstance.addWidgets([this.indexInstance]);
  },
  beforeDestroy() {
    if (
      this.widget &&
      this.widget.dispose &&
      this.instantSearchInstance.started // a widget can't be removed if IS is not started
    ) {
      this.instantSearchInstance.removeWidgets([this.indexInstance]);
    }
  },
  render(createElement) {
    return createElement(
      'div',
      {
        class: {
          [this.suit()]: true,
        },
      },
      this.$slots.default
    );
  },
};
