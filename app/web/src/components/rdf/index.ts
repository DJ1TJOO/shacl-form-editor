import { Namespace } from 'rdflib'

export * as Dash from './dash'
export { default as FileProvider, injectFileContext, provideFileContext } from './file-provider.vue'
export * as Shacl from './shacl'
export * as Xsd from './xsd'

export const RDF = Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
