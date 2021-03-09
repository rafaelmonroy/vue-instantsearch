<template>
  <div
    class="ais-DynamicWidgets"
    v-show="state"
  >
    <div
      class="ais-DynamicWidgets-widget"
      v-for="attribute in attributesToRender"
      :key="attribute"
    >
      <slot :name="attribute" />
    </div>
  </div>
</template>

<script>
import { createWidgetMixin } from '../mixins/widget';
function getAttribute(widget, initOptions) {
  try {
    const { widgetParams } = widget.getWidgetRenderState(initOptions);

    const attribute =
      'attribute' in widgetParams
        ? widgetParams.attribute
        : widgetParams.attributes[0];

    if (typeof attribute !== 'string') throw new Error();

    return attribute;
  } catch (e) {
    throw new Error(
      `Could not find the attribute of the widget:

${JSON.stringify(widget)}

Please check whether the widget's getWidgetRenderState returns widgetParams.attribute correctly.`
    );
  }
}

const connectDynamicWidgets = function connectDynamicWidgets(
  renderFn,
  unmountFn = () => {}
) {
  return widgetParams => {
    const { widgets, transformItems = items => items } = widgetParams;

    const localWidgets = new Map();

    return {
      $$type: 'ais.dynamicWidgets',
      init(initOptions) {
        widgets.forEach(widget => {
          const attribute = getAttribute(widget, initOptions);
          localWidgets.set(attribute, { widget, isMounted: false });
        });
      },
      render(renderOptions) {
        const { parent } = renderOptions;
        const renderState = this.getWidgetRenderState(renderOptions);

        const widgetsToUnmount = [];
        const widgetsToMount = [];

        localWidgets.forEach(({ widget, isMounted }, attribute) => {
          const shouldMount =
            renderState.attributesToRender.indexOf(attribute) > -1;

          if (!isMounted && shouldMount) {
            widgetsToMount.push(widget);
            localWidgets.set(attribute, {
              widget,
              isMounted: true,
            });
          } else if (isMounted && !shouldMount) {
            widgetsToUnmount.push(widget);

            localWidgets.set(attribute, {
              widget,
              isMounted: false,
            });
          }
        });

        parent.addWidgets(widgetsToMount);
        // make sure this only happens after the regular render, otherwise it
        // happens too quick, since render is "deferred" for the next microtask,
        // so this needs to be a whole task later
        setTimeout(() => parent.removeWidgets(widgetsToUnmount), 0);

        renderFn(
          Object.assign({}, renderState, {
            instantSearchInstance: renderOptions.instantSearchInstance,
          }),
          false
        );
      },
      dispose() {
        unmountFn();
      },
      getRenderState(renderState) {
        // @TODO: decide whether it makes sense to return anything,
        // knowing that you could have multiple instances of dynamic
        // and they are hard/impossible to distinguish at this point
        return renderState;
      },
      getWidgetRenderState({ results }) {
        if (!results) {
          return { attributesToRender: [], widgetParams };
        }

        // retrieve the facet order out of the results:
        // results.facetOrder.map(facet => facet.attribute)
        const attributesToRender = transformItems([], results);

        return { attributesToRender, widgetParams };
      },
    };
  };
};

export default {
  mixins: [createWidgetMixin({ connector: connectDynamicWidgets })],
  props: {
    transformItems: {
      type: Function,
      default() {
        return items => items;
      },
    },
  },
  computed: {
    attributesToRender() {
      if (this.state) {
        return this.state.attributesToRender;
      }
      // render all widgets (hidden) before first render
      return Object.keys(this.$slots);
    },
    widgetParams() {
      return {
        transformItems: this.transformItems,
        // we do not pass "widgets" to the connector, since Vue is in charge of rendering
        widgets: [],
      };
    },
  },
};
</script>
