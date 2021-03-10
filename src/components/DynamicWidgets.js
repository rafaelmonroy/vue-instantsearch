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

function getVueAttribute(vnode) {
  if (!vnode.componentOptions) {
    return undefined;
  }

  if (vnode.componentOptions.propsData.attribute) {
    return vnode.componentOptions.propsData.attribute;
  }
  if (Array.isArray(vnode.componentOptions.propsData.attributes)) {
    return vnode.componentOptions.propsData.attributes[0];
  }

  if (Array.isArray(vnode.componentOptions.children)) {
    // return first child with a truthy attribute
    return vnode.componentOptions.children.reduce(
      (acc, curr) => (acc ? acc : getVueAttribute(curr)),
      undefined
    );
  }

  return undefined;
}

export default {
  name: 'AisDynamicWidgets',
  mixins: [createWidgetMixin({ connector: connectDynamicWidgets })],
  props: {
    transformItems: {
      type: Function,
      default() {
        return items => items;
      },
    },
  },
  render(createElement) {
    if (!this.state) {
      return createElement(
        'div',
        { attrs: { hidden: true } },
        this.$slots.default
      );
    }

    const components = new Map();
    this.$slots.default.forEach(vnode => {
      const attribute = getVueAttribute(vnode);
      if (attribute) components.set(attribute, vnode);
    });

    return createElement(
      'div',
      {},
      this.state.attributesToRender.map(attribute => components.get(attribute))
    );
  },
  computed: {
    widgetParams() {
      return {
        transformItems: this.transformItems,
        // we do not pass "widgets" to the connector, since Vue is in charge of rendering
        widgets: [],
      };
    },
  },
};
