import federation from "@module-federation/webpack-bundler-runtime";
$INITOPTIONS_PLUGIN_IMPORTS$

const scopeToInitDataMapping = __webpack_require__.MF.initializeSharingData?.scopeToSharingDataMapping ?? {};
const shared = {};
for (let [scope, stages] of Object.entries(scopeToInitDataMapping)) {
  for (let stage of stages) {
    if (Array.isArray(stage)) {
      const [name, version, factory, eager] = stage
      if (shared[name]) {
          shared[name].scope.push(scope)
      } else {
          shared[name] = {
              version,
              get: factory,
              scope: [scope],
          }
      }
    }
  }
}

__webpack_require__.federation = {};
__webpack_require__.federation.initOptions = {};
__webpack_require__.federation.initOptions.remotes = $INITOPTIONS_REMOTES$;
__webpack_require__.federation.initOptions.shared = shared;
__webpack_require__.federation.initOptions.plugins = $INITOPTIONS_PLUGINS$;

const idToExternalAndNameMapping = __webpack_require__.MF.remotesLoadingData?.moduleIdToRemoteDataMapping ?? {};
const idToRemoteMap = {};
for (let [id, external] of Object.entries(idToExternalAndNameMapping)) {
  for (let remote of __webpack_require__.federation.initOptions.remotes) {
    if (id.slice('webpack/container/remote/'.length).startsWith(remote.alias)) {
      idToRemoteMap[id] = [{ externalType: "script", request: remote.entry, remoteName: remote.name }]
    }
  }
}

const moduleToConsumeDataMapping = __webpack_require__.MF.consumesLoadingData?.moduleIdToConsumeDataMapping ?? {};
const moduleToHandlerMapping = {};
for (let [moduleId, data] of Object.entries(moduleToConsumeDataMapping)) {
  moduleToHandlerMapping[moduleId] = {
    getter: data.fallback,
    shareInfo: {
      shareConfig: {
        fixedDependencies: false,
        requiredVersion: data.requiredVersion,
        strictVersion: data.strictVersion,
        singleton: data.singleton,
        eager: data.eager,
      },
      scope: [data.shareScope],
    },
    shareKey: data.shareKey,
  }
}

const installedModules = {}
const initPromises = [];
const initTokens = [];
const remotesLoadingChunkMapping = __webpack_require__.MF.remotesLoadingData?.chunkMapping ?? {};
const consumesLoadingChunkMapping = __webpack_require__.MF.consumesLoadingData?.chunkMapping ?? {};

__webpack_require__.federation.runtime = federation.runtime;
__webpack_require__.federation.instance = federation.instance;
__webpack_require__.federation.proxyShareScopeMap = federation.proxyShareScopeMap;
__webpack_require__.federation.hasProxyShareScopeMap = federation.hasProxyShareScopeMap;
__webpack_require__.federation.bundlerRuntimeOptions = {
  remotes: {
    idToRemoteMap,
    chunkMapping: remotesLoadingChunkMapping,
    idToExternalAndNameMapping,
    webpackRequire: __webpack_require__,
  }
}

__webpack_require__.federation.bundlerRuntime = {
  remotes: (chunkId, promises) => federation.bundlerRuntime.remotes({ chunkId, promises, chunkMapping: remotesLoadingChunkMapping, idToExternalAndNameMapping, idToRemoteMap, webpackRequire: __webpack_require__ }),
  consumes: (chunkId, promises) => federation.bundlerRuntime.consumes({ chunkId, promises, chunkMapping: consumesLoadingChunkMapping, moduleToHandlerMapping, installedModules, webpackRequire: __webpack_require__ }),
  I: (name, initScope) => federation.bundlerRuntime.I({ shareScopeName: name, initScope, initPromises, initTokens, webpackRequire: __webpack_require__ }),
  S: federation.bundlerRuntime.S,
  installInitialConsumes: federation.bundlerRuntime.installInitialConsumes
}

__webpack_require__.MF.remotesLoading = __webpack_require__.federation.bundlerRuntime.remotes;
__webpack_require__.MF.consumesLoading = __webpack_require__.federation.bundlerRuntime.consumes;
__webpack_require__.MF.initializeSharing = __webpack_require__.federation.bundlerRuntime.I;

__webpack_require__.federation.instance = __webpack_require__.federation.runtime.init(__webpack_require__.federation.initOptions);
