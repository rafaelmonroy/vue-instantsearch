<template>
  <div
    v-if="state"
    :class="suit()"
  >
    <slot
      v-bind="state"
      :results="results"
    >
      <span :class="suit('text')">{{ state.nbHits.toLocaleString() }} results found in {{ state.processingTimeMS.toLocaleString() }}ms</span>
    </slot>
  </div>
</template>

<script>
import { createWidgetMixin } from '../mixins/widget';
import { connectStats } from 'instantsearch.js/es/connectors';
import { createSuitMixin } from '../mixins/suit';

export default {
  name: 'AisStats',
  mixins: [
    createWidgetMixin({ connector: connectStats }),
    createSuitMixin({ name: 'Stats' }),
  ],
  computed: {
    widgetParams() {
      return {};
    },
    results() {
      // THIS IS ABSOLURETLY WRONG
      return this.state.instantSearchInstance.tree.helper.lastResults;
    },
  },
};
</script>
