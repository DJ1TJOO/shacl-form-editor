import type { NamespaceDefinition } from '..'
import cidocCrmRdf from './CIDOC_CRM_v7.1.3.rdf?raw'
import crmdigRdf from './CRMdig_v3.2.1.rdfs?raw'
import dashSparqlTtl from './dash-sparql.ttl?raw'
import dashTtl from './dash.ttl?raw'
import doapRdf from './doap.rdf?raw'
import ebucoreRdf from './ebucore.rdf?raw'
import frbrCoreRdf from './frbr-core.rdf?raw'
import grv1Owl from './gr-v1.owl?raw'
import icaltzdRdf from './icaltzd.rdf?raw'
import lvontRdf from './lvont.rdf?raw'
import geonamesOntologyRdf from './ontology_v3.3.rdf?raw'
import ricO11Rdf from './RiC-O_1-1.rdf?raw'
import semRdf from './sem.rdf?raw'
import siocRdf from './sioc.rdf?raw'
import skosXlRdf from './skos-xl.rdf?raw'

// This list is based on https://github.com/zazuko/rdf-vocabularies
// We try to have a fetch url for each namespace, so it can be updated automatically, but if it's not possible, we use a file or suggestions
export const packagedNamespaces: NamespaceDefinition[] = [
  {
    prefix: 'acl',
    iri: 'http://www.w3.org/ns/auth/acl#',
    fetchUrl: 'https://www.w3.org/ns/auth/acl#',
    contentType: 'text/turtle',
  },
  {
    prefix: 'as',
    iri: 'https://www.w3.org/ns/activitystreams#',
    fetchUrl: 'https://www.w3.org/ns/activitystreams.jsonld',
    contentType: 'application/ld+json',
  },
  {
    prefix: 'bibo',
    iri: 'http://purl.org/ontology/bibo/',
    fetchUrl: 'https://www.dublincore.org/specifications/bibo/bibo/bibo.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'cc',
    iri: 'http://creativecommons.org/ns#',
    fetchUrl: 'https://creativecommons.org/schema.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'cert',
    iri: 'http://www.w3.org/ns/auth/cert#',
    fetchUrl: 'https://www.w3.org/ns/auth/cert.n3',
    contentType: 'text/n3',
  },
  {
    prefix: 'cnt',
    iri: 'http://www.w3.org/2011/content#',
    fetchUrl: 'http://www.w3.org/2011/content#',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'constant',
    iri: 'http://qudt.org/vocab/constant/',
    fetchUrl: 'https://qudt.org/vocab/constant/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'crm',
    iri: 'http://www.cidoc-crm.org/cidoc-crm/',
    file: cidocCrmRdf, // Blocked by CORS, so we use a file
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'csvw',
    iri: 'http://www.w3.org/ns/csvw#',
    fetchUrl: 'https://www.w3.org/ns/csvw.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'ctag',
    iri: 'http://commontag.org/ns#',
    fetchUrl:
      'https://raw.githubusercontent.com/taurenshaman/semantic-web/master/data/commontag.owl',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'cur',
    iri: 'http://qudt.org/vocab/currency/',
    fetchUrl: 'https://qudt.org/vocab/currency/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dash-sparql',
    iri: 'http://datashapes.org/sparql#',
    file: dashSparqlTtl, // Blocked by CORS, so we use a file, http://datashapes.org/sparql.ttl
    contentType: 'text/turtle',
  },
  {
    prefix: 'dash',
    iri: 'http://datashapes.org/dash#',
    file: dashTtl, // Blocked by CORS, so we use a file, http://datashapes.org/dash.ttl
    contentType: 'text/turtle',
  },
  {
    prefix: 'dbo',
    iri: 'http://dbpedia.org/ontology/',
    fetchUrl: 'https://dbpedia.org/ontology/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dc11',
    iri: 'http://purl.org/dc/elements/1.1/',
    fetchUrl:
      'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/dublin_core_elements.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dcam',
    iri: 'http://purl.org/dc/dcam/',
    fetchUrl:
      'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/dublin_core_abstract_model.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dcat',
    iri: 'http://www.w3.org/ns/dcat#',
    fetchUrl: 'https://www.w3.org/ns/dcat3.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dcmitype',
    iri: 'http://purl.org/dc/dcmitype/',
    fetchUrl:
      'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/dublin_core_type.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dcterms',
    iri: 'http://purl.org/dc/terms/',
    fetchUrl:
      'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/dublin_core_terms.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dig',
    iri: 'http://www.ics.forth.gr/isl/CRMdig/',
    file: crmdigRdf, // Blocked by CORS, so we use a file, https://www.cidoc-crm.org/crmdig/sites/default/files/CRMdig_v3.2.1.rdfs
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'discipline',
    iri: 'http://qudt.org/vocab/discipline/',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/discipline/discipline.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'doap',
    iri: 'http://usefulinc.com/ns/doap#',
    file: doapRdf, // Blocked by CORS, so we use a file, http://usefulinc.com/ns/doap
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'dprod',
    iri: 'https://ekgf.github.io/dprod/',
    fetchUrl:
      'https://raw.githubusercontent.com/EKGF/dprod/refs/heads/main/ontology/dprod/dprod-ontology.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dpv',
    iri: 'https://w3id.org/dpv#',
    fetchUrl: 'https://w3id.org/dpv#',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dqv',
    iri: 'http://www.w3.org/ns/dqv#',
    fetchUrl: 'https://www.w3.org/ns/dqv.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'dtype',
    iri: 'http://www.linkedmodel.org/schema/dtype#',
    fetchUrl: 'https://www.linkedmodel.org/schema/dtype',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'duv',
    iri: 'http://www.w3.org/ns/duv#',
    fetchUrl: 'https://www.w3.org/ns/duv.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'earl',
    iri: 'http://www.w3.org/ns/earl#',
    fetchUrl: 'https://www.w3.org/ns/earl.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'ebucore',
    iri: 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#',
    file: ebucoreRdf, // Blocked by CORS, so we use a file, https://www.ebu.ch/metadata/ontologies/ebucore/ebucore.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'exif',
    iri: 'http://www.w3.org/2003/12/exif/ns#',
    fetchUrl: 'https://www.w3.org/2003/12/exif/ns#',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'foaf',
    iri: 'http://xmlns.com/foaf/0.1/',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/foaf/foaf.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'frbr',
    iri: 'http://purl.org/vocab/frbr/core#',
    file: frbrCoreRdf, // Blocked by CORS, so we use a file, http://purl.org/vocab/frbr/core.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'geo',
    iri: 'http://www.opengis.net/ont/geosparql#',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/geo/geo.nq', // @TODO: 'https://opengeospatial.github.io/ogc-geosparql/geosparql11/geo.ttl', Fails to parse, maybe has something to do with base URI or PREFIX : <xxx>
    contentType: 'application/n-quads',
  },
  {
    prefix: 'geof',
    iri: 'http://www.opengis.net/def/function/geosparql/',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/geof/geof.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'geor',
    iri: 'http://www.opengis.net/def/rule/geosparql/',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/geor/geor.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'gml',
    iri: 'http://www.opengis.net/ont/gml#',
    fetchUrl: 'https://schemas.opengis.net/gml/3.2.1/gml_32_geometries.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'gn',
    iri: 'https://www.geonames.org/ontology#',
    file: geonamesOntologyRdf, // Blocked by CORS, so we use a file, https://www.geonames.org/ontology/ontology_v3.3.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'gr',
    iri: 'http://purl.org/goodrelations/v1#',
    file: grv1Owl, // Blocked by CORS, so we use a file, http://purl.org/goodrelations/v1.owl
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'grddl',
    iri: 'http://www.w3.org/2003/g/data-view#',
    fetchUrl: 'https://www.w3.org/2003/g/data-view.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'gs1',
    iri: 'https://gs1.org/voc/',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/gs1/gs1.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'gtfs',
    iri: 'http://vocab.gtfs.org/terms#',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/gtfs/gtfs.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'http',
    iri: 'http://www.w3.org/2011/http#',
    fetchUrl: 'https://www.w3.org/2011/http.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'hydra',
    iri: 'http://www.w3.org/ns/hydra/core#',
    fetchUrl: 'https://www.w3.org/ns/hydra/core.jsonld',
    contentType: 'application/ld+json',
  },
  {
    prefix: 'ical',
    iri: 'http://www.w3.org/2002/12/cal/icaltzd#',
    file: icaltzdRdf, // Blocked by CORS, so we use a file, https://www.w3.org/2002/12/cal/icaltzd.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'la',
    iri: 'https://linked.art/ns/terms/',
    fetchUrl: 'https://linked.art/ns/terms/index.xml',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'ldp',
    iri: 'http://www.w3.org/ns/ldp#',
    fetchUrl: 'https://www.w3.org/ns/ldp.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'list',
    iri: 'http://www.w3.org/2000/10/swap/list#',
    fetchUrl: 'https://www.w3.org/2000/10/swap/list.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'locn',
    iri: 'http://www.w3.org/ns/locn#',
    fetchUrl: 'https://www.w3.org/ns/legacy_locn.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'log',
    iri: 'http://www.w3.org/2000/10/swap/log#',
    fetchUrl: 'https://www.w3.org/2000/10/swap/log.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'lvont',
    iri: 'http://lexvo.org/ontology#',
    file: lvontRdf, // Blocked by CORS, so we use a file, http://lexvo.org/ontology
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'm4i',
    iri: 'http://w3id.org/nfdi4ing/metadata4ing#',
    fetchUrl: 'https://nfdi4ing.pages.rwth-aachen.de/metadata4ing/metadata4ing/ontology.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'ma',
    iri: 'http://www.w3.org/ns/ma-ont#',
    fetchUrl: 'https://www.w3.org/ns/ma-ont.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'mads',
    iri: 'http://www.loc.gov/mads/rdf/v1#',
    fetchUrl: 'https://id.loc.gov/ontologies/madsrdf/v1.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'math',
    iri: 'http://www.w3.org/2000/10/swap/math#',
    fetchUrl: 'https://www.w3.org/2000/10/swap/math.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'oa',
    iri: 'http://www.w3.org/ns/oa#',
    fetchUrl: 'https://www.w3.org/ns/oa.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'og',
    iri: 'http://ogp.me/ns#',
    fetchUrl: 'https://ogp.me/ns/ogp.me.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'oidc',
    iri: 'http://www.w3.org/ns/solid/oidc#',
    fetchUrl: 'https://www.w3.org/ns/solid/oidc.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'org',
    iri: 'http://www.w3.org/ns/org#',
    fetchUrl: 'https://www.w3.org/ns/org.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'owl',
    iri: 'http://www.w3.org/2002/07/owl#',
    fetchUrl: 'https://www.w3.org/2002/07/owl.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'pim',
    iri: 'http://www.w3.org/ns/pim/space#',
    fetchUrl: 'https://www.w3.org/ns/pim/space.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'prefix',
    iri: 'http://qudt.org/vocab/prefix/',
    fetchUrl: 'https://qudt.org/vocab/prefix/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'prov',
    iri: 'http://www.w3.org/ns/prov#',
    fetchUrl: 'https://www.w3.org/ns/prov.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'qb',
    iri: 'http://purl.org/linked-data/cube#',
    fetchUrl:
      'https://raw.githubusercontent.com/UKGovLD/publishing-statistical-data/master/specs/src/main/vocab/cube.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'qkdv',
    iri: 'http://qudt.org/vocab/dimensionvector/',
    fetchUrl: 'https://qudt.org/vocab/dimensionvector/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'quantitykind',
    iri: 'http://qudt.org/vocab/quantitykind/',
    fetchUrl: 'https://qudt.org/vocab/quantitykind/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'qudt',
    iri: 'http://qudt.org/schema/qudt/',
    fetchUrl: 'https://qudt.org/schema/qudt/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'rdau',
    iri: 'http://rdaregistry.info/Elements/u/',
    fetchUrl: 'https://www.rdaregistry.info/xml/Elements/u.xml',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'rdf',
    iri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    fetchUrl: 'https://www.w3.org/1999/02/22-rdf-syntax-ns.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'rdfa',
    iri: 'http://www.w3.org/ns/rdfa#',
    fetchUrl: 'https://www.w3.org/ns/rdfa.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'rdfs',
    iri: 'http://www.w3.org/2000/01/rdf-schema#',
    fetchUrl: 'https://www.w3.org/2000/01/rdf-schema.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'rev',
    iri: 'http://purl.org/stuff/rev#',
    fetchUrl:
      'https://raw.githubusercontent.com/iand/vocabdotorg/refs/heads/main/www/src/review/review.rdf', // Blocked by CORS, http://vocab.org/review/review.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'rico',
    iri: 'https://www.ica.org/standards/RiC/ontology#',
    file: ricO11Rdf, // Blocked by CORS, so we use a file, https://www.ica.org/standards/RiC/RiC-O_1-1.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'rr',
    iri: 'http://www.w3.org/ns/r2rml#',
    fetchUrl: 'https://www.w3.org/ns/r2rml.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'rss',
    iri: 'http://purl.org/rss/1.0/',
    fetchUrl:
      'https://raw.githubusercontent.com/taurenshaman/semantic-web/master/data/rss-schema.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'schema',
    iri: 'http://schema.org/',
    fetchUrl: 'https://schema.org/version/latest/schemaorg-current-http.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'sd',
    iri: 'http://www.w3.org/ns/sparql-service-description#',
    fetchUrl: 'https://www.w3.org/ns/sparql-service-description.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'sdmx',
    iri: 'http://purl.org/linked-data/sdmx#',
    fetchUrl:
      'https://raw.githubusercontent.com/UKGovLD/publishing-statistical-data/master/specs/src/main/vocab/sdmx.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'sem',
    iri: 'http://semanticweb.cs.vu.nl/2009/11/sem/',
    file: semRdf, // Blocked by CORS, so we use a file, https://semanticweb.cs.vu.nl/2009/11/sem/sem.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'set',
    iri: 'http://www.w3.org/2000/10/swap/set#',
    fetchUrl: 'https://www.w3.org/2000/10/swap/set.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'sf',
    iri: 'http://www.opengis.net/ont/sf#',
    fetchUrl: 'http://schemas.opengis.net/sf/1.0/simple_features_geometries.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'sh',
    iri: 'http://www.w3.org/ns/shacl#',
    fetchUrl: 'https://www.w3.org/ns/shacl.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'shex',
    iri: 'http://www.w3.org/ns/shex#',
    fetchUrl: 'https://www.w3.org/ns/shex.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'shsh',
    iri: 'http://www.w3.org/ns/shacl-shacl#',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/shsh/shsh.nq', // @TODO: Fails to parse, https://www.w3.org/ns/shacl-shacl.ttl
    contentType: 'application/n-quads',
  },
  {
    prefix: 'sioc',
    iri: 'http://rdfs.org/sioc/ns#',
    file: siocRdf, // Blocked by CORS, so we use a file, https://raw.githubusercontent.com/taurenshaman/semantic-web/master/data/sioc.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'skos',
    iri: 'http://www.w3.org/2004/02/skos/core#',
    fetchUrl: 'https://www.w3.org/2009/08/skos-reference/skos.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'skosxl',
    iri: 'http://www.w3.org/2008/05/skos-xl#',
    file: skosXlRdf, // Blocked by CORS, so we use a file, https://www.w3.org/2008/05/skos-xl.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'solid',
    iri: 'http://www.w3.org/ns/solid/terms#',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/solid/solid.nq', // @TODO: Fails to parse, https://www.w3.org/ns/solid/terms.ttl
    contentType: 'application/n-quads',
  },
  {
    prefix: 'sosa',
    iri: 'http://www.w3.org/ns/sosa/',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/sosa/sosa.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'sou',
    iri: 'http://qudt.org/vocab/sou/',
    fetchUrl: 'https://qudt.org/vocab/sou/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'ssn',
    iri: 'http://www.w3.org/ns/ssn/',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/ssn/ssn.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'stat',
    iri: 'http://www.w3.org/ns/posix/stat#',
    fetchUrl: 'https://www.w3.org/ns/posix/stat.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'string',
    iri: 'http://www.w3.org/2000/10/swap/string#',
    fetchUrl: 'https://www.w3.org/2000/10/swap/string.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'test',
    iri: 'http://www.w3.org/2006/03/test-description#',
    fetchUrl: 'https://www.w3.org/2006/03/test-description.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'time',
    iri: 'http://www.w3.org/2006/time#',
    fetchUrl: 'https://www.w3.org/2006/time.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'unit',
    iri: 'http://qudt.org/vocab/unit/',
    fetchUrl: 'https://qudt.org/vocab/unit/',
    contentType: 'text/turtle',
  },
  {
    prefix: 'vaem',
    iri: 'http://www.linkedmodel.org/schema/vaem#',
    fetchUrl: 'https://www.linkedmodel.org/schema/vaem',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'vann',
    iri: 'http://purl.org/vocab/vann/',
    fetchUrl:
      'https://raw.githubusercontent.com/iand/vocabdotorg/refs/heads/main/www/src/vann/vann-vocab-20100607.rdf', // Blocked by CORS, so we use a file, https://vocab.org/vann/vann-vocab-20100607.rdf
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'vcard',
    iri: 'http://www.w3.org/2006/vcard/ns#',
    fetchUrl: 'https://www.w3.org/2006/vcard/ns.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'void',
    iri: 'http://rdfs.org/ns/void#',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/void/void.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'vs',
    iri: 'http://www.w3.org/2003/06/sw-vocab-status/ns#',
    fetchUrl: 'https://www.w3.org/2003/06/sw-vocab-status/ns.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'vso',
    iri: 'http://purl.org/vso/ns#',
    fetchUrl: 'https://www.heppnetz.de/ontologies/vso/ns.owl',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'wdrs',
    iri: 'http://www.w3.org/2007/05/powder-s#',
    fetchUrl: 'https://www.w3.org/2007/05/powder-s.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'wgs',
    iri: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
    fetchUrl: 'https://www.w3.org/2003/01/geo/wgs84_pos.rdf',
    contentType: 'application/rdf+xml',
  },
  {
    prefix: 'xhv',
    iri: 'http://www.w3.org/1999/xhtml/vocab#',
    fetchUrl:
      'https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/xhv/xhv.nq', // Could not find original source
    contentType: 'application/n-quads',
  },
  {
    prefix: 'xkos',
    iri: 'http://rdf-vocabulary.ddialliance.org/xkos#',
    fetchUrl: 'https://raw.githubusercontent.com/linked-statistics/xkos/refs/heads/master/xkos.ttl',
    contentType: 'text/turtle',
  },
  {
    prefix: 'xsd',
    iri: 'http://www.w3.org/2001/XMLSchema#',
    fetchUrl: 'https://raw.githubusercontent.com/ruby-rdf/rdf/master/etc/xsd.ttl',
    contentType: 'text/turtle',
  },
]
