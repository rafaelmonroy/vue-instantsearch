<template>
  <ais-instant-search-ssr>
    <slot />
  </ais-instant-search-ssr>
</template>

<script>
import { AisInstantSearchSsr, createServerRootMixin } from 'vue-instantsearch';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

export default {
  components: { AisInstantSearchSsr },
  mixins: [
    createServerRootMixin({
      searchClient,
      indexName: 'products',
    }),
  ],
  serverPrefetch() {
    return this.instantsearch.findResultsState(this).then(algoliaState => {
      this.$ssrContext.nuxt.algoliaState = algoliaState;
    });
  },
  beforeMount() {
    const results = window.__NUXT__.algoliaState;

    this.instantsearch.hydrate(results);
  },
};
</script>
