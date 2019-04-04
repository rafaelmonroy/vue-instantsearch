import { storiesOf } from '@storybook/vue';
import { previewWrapper } from './utils';

const instantSearchHits = `
  <ais-hits>
    <ol
      slot-scope="{ items }"
      class="playground-hits"
    >
      <li
        v-for="item in items"
        :key="item.objectID"
        class="playground-hits-item"
      >
        <div
          class="playground-hits-image"
          :style="{ backgroundImage: 'url(' + item.image + ')' }"
        />
        <div class="playground-hits-desc">
          <p>
            <ais-highlight attribute="name" :hit="item" />
          </p>
          <p>Rating: {{ item.rating }}✭</p>
          <p>Price: {{ item.price }}$</p>
        </div>
      </li>
    </ol>
  </ais-hits>
`;

const instantSearchHitsThumbnail = `
  <ais-hits>
    <ol
      slot-scope="{ items }"
      class="playground-hits"
    >
      <li
        v-for="item in items"
        :key="item.objectID"
        class="playground-hits-item"
      >
        <ais-highlight attribute="name" :hit="item" />
      </li>
    </ol>
  </ais-hits>
`;

storiesOf('ais-index', module)
  .addDecorator(previewWrapper())
  .add('simple usage', () => ({
    data() {
      return {
        enable: true,
      };
    },
    methods: {
      add() {
        if (!this.enable) {
          this.enable = true;
        }
      },
      remove() {
        if (this.enable) {
          this.enable = false;
        }
      },
    },
    template: `
      <div>
        <button @click="add()" :disabled="enable" style="margin-right: 10px; margin-bottom: 15px;">Add widgets</button>
        <button @click="remove()" :disabled="!enable">Remove widgets</button>

        <ais-index index-name="instant_search_price_desc">
          <div
            :style="{
              border: '1px solid black',
              marginBottom: '15px',
              padding: '10px',
            }"
          >
            <h3 style="margin-bottom:15px">instant_search_price_desc</h3>
            <ais-configure :hitsPerPage.camel="2" />
            <ais-search-box v-if="enable" />
            ${instantSearchHits}

            <ais-index index-name="bestbuy">
              <div
                :style="{
                  border: '1px solid black',
                  marginBottom: '15px',
                  padding: '10px',
                }"
              >
                <h3 style="margin-bottom:15px">bestbuy</h3>
                <ais-configure :hitsPerPage.camel="1" />
                <ais-search-box v-if="enable" />
                ${instantSearchHits}
              </div>
            </ais-index>
          </div>
        </ais-index>
      </div>
    `,
  }))
  .add('with Tabs', () => ({
    template: `
      <div>
        <ais-search-box />
        <br />
        <v-tabs
          color="cyan"
          slider-color="yellow"
          dark
        >
          <v-tab ripple>All</v-tab>
          <v-tab ripple>instant_search</v-tab>
          <v-tab ripple>bestbuy</v-tab>
          <v-tab ripple>instant_search_price_desc</v-tab>

          <v-tab-item>
            <v-card flat>
              <ais-configure :hitsPerPage.camel="5" />

              <ais-index index-name="instant_search">
                <br />
                <h3>instant_search</h3>
                ${instantSearchHitsThumbnail}
              </ais-index>

              <ais-index index-name="bestbuy">
                <h3>bestbuy</h3>
                ${instantSearchHitsThumbnail}
              </ais-index>

              <ais-index index-name="instant_search_price_desc">
                <h3>instant_search_price_desc</h3>
                ${instantSearchHitsThumbnail}
              </ais-index>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <ais-index
                index-name="instant_search"
                index-id="instant_search_tab"
              >
                <ais-configure :hitsPerPage.camel="5" />
                ${instantSearchHits}
              </ais-index>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <ais-index index-name="bestbuy" index-id="bestbuy_tab">
                <ais-configure :hitsPerPage.camel="5" />
                ${instantSearchHits}
              </ais-index>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <ais-index
                index-name="instant_search_price_desc"
                index-id="instant_search_price_desc_tabs"
              >
                <ais-configure :hitsPerPage.camel="5" />
                ${instantSearchHits}
              </ais-index>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </div>
    `,
  }));
