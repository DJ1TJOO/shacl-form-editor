import { Shacl } from '@/components/rdf'

export const knownPrefixes = [
  {
    value: 'http://www.w3.org/ns/shacl#',
    label: 'shacl',
  },
  {
    value: 'http://schema.org/',
    label: 'schema',
  },
  {
    value: 'http://example.com/',
    label: 'exa',
  },
  {
    value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    label: 'rdf',
  },
  {
    value: 'http://www.w3.org/2000/01/rdf-schema#',
    label: 'rdfs',
  },
  {
    value: 'http://www.w3.org/2002/07/owl#',
    label: 'owl',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#',
    label: 'xsd',
  },
]

// @TODO: retrieve from the store, and possible from the internet
export const tmpPrefixOptions = [
  {
    value: 'http://www.w3.org/ns/shacl#BlankNode',
    label: 'sh:BlankNode',
  },
  {
    value: 'http://www.w3.org/ns/shacl#IRI',
    label: 'sh:IRI',
  },
  {
    value: 'http://www.w3.org/ns/shacl#Literal',
    label: 'sh:Literal',
  },
  {
    value: 'http://www.w3.org/ns/shacl#BlankNodeOrIRI',
    label: 'sh:BlankNodeOrIRI',
  },
  {
    value: 'http://www.w3.org/ns/shacl#BlankNodeOrLiteral',
    label: 'sh:BlankNodeOrLiteral',
  },
  {
    value: 'http://www.w3.org/ns/shacl#IRIOrLiteral',
    label: 'sh:IRIOrLiteral',
  },
  {
    value: 'http://schema.org/Person',
    label: 'schema:Person',
  },
  {
    value: 'http://schema.org/Organization',
    label: 'schema:Organization',
  },
  {
    value: 'http://schema.org/Place',
    label: 'schema:Place',
  },
  {
    value: 'http://schema.org/Event',
    label: 'schema:Event',
  },
  {
    value: 'http://schema.org/Thing',
    label: 'schema:Thing',
  },
  {
    value: 'http://example.com/FirstName',
    label: 'exa:FirstName',
  },
  {
    value: 'http://example.com/LastName',
    label: 'exa:LastName',
  },
  {
    value: 'http://example.com/Email',
    label: 'exa:Email',
  },
  {
    value: 'http://example.com/Phone',
    label: 'exa:Phone',
  },
  {
    value: 'http://example.com/Address',
    label: 'exa:Address',
  },
  {
    value: 'http://example.com/City',
    label: 'exa:City',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#string',
    label: 'xsd:string',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#integer',
    label: 'xsd:integer',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#decimal',
    label: 'xsd:decimal',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#float',
    label: 'xsd:float',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#double',
    label: 'xsd:double',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#boolean',
    label: 'xsd:boolean',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#date',
    label: 'xsd:date',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#time',
    label: 'xsd:time',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#dateTime',
    label: 'xsd:dateTime',
  },
  {
    value: 'http://www.w3.org/2001/XMLSchema#duration',
    label: 'xsd:duration',
  },
  {
    value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
    label: 'rdf:langString',
  },
]

export function prefixedToAbsolute(prefixed: string) {
  const prefix = knownPrefixes.find((prefix) => prefixed.startsWith(prefix.label + ':'))
  if (prefix) {
    return prefix.value + prefixed.split(':')[1]
  }

  return prefixed
}

// The user may provide a URI with a different protocol or separator, we guess that they want to use the same prefix, so we need to extract the base URI
// @TODO: discuss if this feature is needed, could cause confusion if the user wants to use a differnt protocol or separator for an existing prefix
function getBaseURI(uri: string): string {
  let base = uri.replace(/^https?:\/\//, '')

  if (base.endsWith('#') || base.endsWith('/')) {
    base = base.slice(0, -1)
  } else {
    const hashIndex = base.lastIndexOf('#')
    const slashIndex = base.lastIndexOf('/')
    const separatorIndex = Math.max(hashIndex, slashIndex)
    if (separatorIndex > 0) {
      base = base.substring(0, separatorIndex)
    }
  }

  return base
}

export function absoluteToPrefixed(absolute: string) {
  const absoluteBase = getBaseURI(absolute)
  const localName = Shacl.getLocalName(absolute)
  if (!localName) return absolute

  const prefix = knownPrefixes.find(({ value }) => getBaseURI(value) === absoluteBase)
  if (!prefix) return absolute

  return `${prefix.label}:${localName}`
}
