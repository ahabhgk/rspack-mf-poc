import federation from "@module-federation/webpack-bundler-runtime";
$INITOPTIONS_PLUGIN_IMPORTS$

const scopeToInitDataMapping = __webpack_require__.initializeSharingData?.scopeToSharingDataMapping ?? {};
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
__webpack_require__.federation.initOptions.name = $INITOPTIONS_NAME$;
__webpack_require__.federation.initOptions.remotes = $INITOPTIONS_REMOTES$;
__webpack_require__.federation.initOptions.shared = shared;
__webpack_require__.federation.initOptions.plugins = $INITOPTIONS_PLUGINS$;

const idToExternalAndNameMapping = __webpack_require__.remotesLoadingData?.moduleIdToRemoteDataMapping ?? {};
const idToRemoteMap = {};
for (let [id, external] of Object.entries(idToExternalAndNameMapping)) {
  for (let remote of __webpack_require__.federation.initOptions.remotes) {
    if (id.slice('webpack/container/remote/'.length).startsWith(remote.alias)) {
      idToRemoteMap[id] = [{ externalType: remote.externalType, request: remote.entry, remoteName: remote.name }]
    }
  }
}

const moduleToConsumeDataMapping = __webpack_require__.consumesLoadingData?.moduleIdToConsumeDataMapping ?? {};
const moduleToHandlerMapping = {};
for (let [moduleId, data] of Object.entries(moduleToConsumeDataMapping)) {
  moduleToHandlerMapping[moduleId] = {
    getter: data.fallback,
    shareInfo: {
      shareConfig: {
        fixedDependencies: false,
        // webpack is a stringifyHoley version, but vmok and rspack is a version string
        requiredVersion: !isRequiredVersion(data.requiredVersion) ? rangeToString(data.requiredVersion) : data.requiredVersion,
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
const remotesLoadingChunkMapping = __webpack_require__.remotesLoadingData?.chunkMapping ?? {};
const consumesLoadingChunkMapping = __webpack_require__.consumesLoadingData?.chunkMapping ?? {};
const containerShareScope = __webpack_require__.initializeExposesData?.containerShareScope;

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
  installInitialConsumes: (initialConsumes) => federation.bundlerRuntime.installInitialConsumes({ webpackRequire: __webpack_require__, installedModules, initialConsumes, moduleToHandlerMapping }),
  initContainerEntry: (shareScope, initScope) => federation.bundlerRuntime.initContainerEntry({ shareScope, initScope, shareScopeKey: containerShareScope, webpackRequire: __webpack_require__ }),
}

__webpack_require__.f.remotes = __webpack_require__.federation.bundlerRuntime.remotes;
__webpack_require__.f.consumes = __webpack_require__.federation.bundlerRuntime.consumes;
__webpack_require__.I = __webpack_require__.federation.bundlerRuntime.I;
__webpack_require__.initContainer = __webpack_require__.federation.bundlerRuntime.initContainerEntry;
__webpack_require__.getContainer = (module, getScope) => {
  var moduleMap = __webpack_require__.initializeExposesData.moduleMap;
  __webpack_require__.R = getScope;
  getScope = (
    Object.prototype.hasOwnProperty.call(moduleMap, module)
      ? moduleMap[module]()
      : Promise.resolve().then(() => {{
        throw new Error('Module "' + module + '" does not exist in container.');
      }})
  );
  __webpack_require__.R = undefined;
  return getScope;
};


__webpack_require__.federation.instance = __webpack_require__.federation.runtime.init(__webpack_require__.federation.initOptions);

if (__webpack_require__.consumesLoadingData?.initialConsumes) {
  __webpack_require__.federation.bundlerRuntime.installInitialConsumes(__webpack_require__.consumesLoadingData.initialConsumes);
}

// helpers
function isRequiredVersion(str) {
  if (typeof str !== 'string') return false;
	return /^([\d^=v<>~]|[*xX]$)/.test(str);
}

function rangeToString(range) {
	// see webpack/lib/util/semver.js for original code
	var r=range[0],n="";if(1===range.length)return"*";if(r+.5){n+=0==r?">=":-1==r?"<":1==r?"^":2==r?"~":r>0?"=":"!=";for(var e=1,a=1;a<range.length;a++){e--,n+="u"==(typeof(t=range[a]))[0]?"-":(e>0?".":"")+(e=2,t)}return n}var g=[];for(a=1;a<range.length;a++){var t=range[a];g.push(0===t?"not("+o()+")":1===t?"("+o()+" || "+o()+")":2===t?g.pop()+" "+g.pop():rangeToString(t))}return o();function o(){return g.pop().replace(/^\((.+)\)$/,"$1")}
}
