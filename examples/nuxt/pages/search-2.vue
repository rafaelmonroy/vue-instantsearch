<template>
  <InstantSearch>
    <ais-index
      index-name="instant_search_demo_query_suggestions"
      index-id="querySuggestions"
    >
      <ais-search-box />
      <ais-configure :hits-per-page.camel="5" />
      <ais-hits>
        <template
          slot="item"
          slot-scope="{ item }"
        >
          <ais-highlight
            attribute="query"
            :hit="item"
          />
        </template>
      </ais-hits>
      <ais-pagination />
    </ais-index>
    <ais-search-box />
    <ais-stats />
    <ais-index
      index-id="refinement"
      index-name="instant_search"
    >
      <ais-refinement-list attribute="brand" />
    </ais-index>
    <ais-hits>
      <template
        slot="item"
        slot-scope="{ item }"
      >
        <p>
          <ais-highlight
            attribute="name"
            :hit="item"
          />
        </p>
        <p>
          <ais-highlight
            attribute="brand"
            :hit="item"
          />
        </p>
      </template>
    </ais-hits>
    <ais-pagination />
  </InstantSearch>
</template>

<script>
import {
  AisIndex,
  AisConfigure,
  AisRefinementList,
  AisHits,
  AisHighlight,
  AisSearchBox,
  AisStats,
  AisPagination,
} from 'vue-instantsearch';
import InstantSearch from '../components/InstantSearch.vue';

export default {
  components: {
    InstantSearch,
    AisIndex,
    AisConfigure,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination,
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://unpkg.com/instantsearch.css@7.1.0/themes/algolia-min.css',
        },
      ],
    };
  },
};
</script>

<style>
.ais-Hits-list {
  text-align: left;
}
.ais-Hits-list:empty {
  margin: 0;
}
.ais-InstantSearch {
  margin: 1em;
}
</style>
