import { FederationRuntimePlugin } from '@module-federation/runtime/type';

export default function (): FederationRuntimePlugin {
  return {
    name: 'custom-plugin-runtime',
    beforeInit(args) {
      console.log('[runtime time inject] beforeInit: ', args);
      return args;
    },
    beforeLoadShare(args) {
      console.log('[runtime time inject] beforeLoadShare: ', args);

      return args;
    },
  };
}
