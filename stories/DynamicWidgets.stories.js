import { previewWrapper } from './utils';
import { storiesOf } from '@storybook/vue';

storiesOf('ais-dynamic-widgets', module)
  .addDecorator(previewWrapper())
  .add('simple usage', () => ({
    template: `
    <ais-dynamic-widgets :transform-items="transformItems">
      <ais-refinement-list slot="brand" attribute="brand"></ais-refinement-list>
      <ais-menu slot="categories" attribute="categories"></ais-menu>
      <ais-panel slot="hierarchicalCategories.lvl0">
        <template slot="header">hierarchy</template>
        <ais-hierarchical-menu :attributes="hierarchicalCategories"></ais-hierarchical-menu>
      </ais-panel>
    </ais-dynamic-widgets>`,
    data() {
      return {
        hierarchicalCategories: [
          'hierarchicalCategories.lvl0',
          'hierarchicalCategories.lvl1',
          'hierarchicalCategories.lvl2',
        ],
      };
    },
    methods: {
      transformItems(_attributes, results) {
        if (results._state.query === 'dog') {
          return ['categories'];
        }
        if (results._state.query === 'lego') {
          return ['categories', 'brand'];
        }
        return ['brand', 'hierarchicalCategories.lvl0', 'categories'];
      },
    },
  }));
