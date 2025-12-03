import { Dash, injectFileContext, RDF, Shacl, Xsd } from '@/components/rdf'
import { getLocalName } from '@/components/rdf/shacl'
import { BlankNode, Literal, NamedNode, Node } from 'rdflib'
import type { NamedNode as NamedNodeType, Quad_Predicate, Quad_Subject } from 'rdflib/lib/tf-types'
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useFileStore() {
  const { store } = injectFileContext()

  return store
}

export const useShapes = () => {
  const store = useFileStore()
  const shapes = computed(() => {
    return [
      ...store.value
        .each(null, RDF('type'), Shacl.SHACL('NodeShape'))
        .filter((shape) => shape instanceof NamedNode)
        .map((shape) => ({
          value: shape.value,
          name: getLocalName(shape),
          type: 'node' as const,
        })),
      ...store.value
        .each(null, RDF('type'), Shacl.SHACL('PropertyShape'))
        .filter((shape) => shape instanceof NamedNode)
        .map((shape) => ({
          value: shape.value,
          name: getLocalName(shape),
          type: 'property' as const,
        })),
    ]
  })

  function addShape(iri: string | NamedNode, type: 'node' | 'property') {
    Shacl.addShape(store.value, iri, type)
  }

  function removeShape(iri: string | NamedNode) {
    Shacl.removeShape(store.value, iri)
  }

  return { shapes, addShape, removeShape }
}

export const useNodeProperties = ({
  subject,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
}) => {
  const store = useFileStore()

  watch(
    () => toValue(subject),
    (subject, oldSubject) => {
      if (typeof oldSubject === 'undefined') {
        return
      }

      const propertyNodes = store.value
        .statementsMatching(oldSubject, Shacl.SHACL('property'))
        .filter(
          (statement) =>
            statement.object instanceof BlankNode || statement.object instanceof NamedNode,
        )

      if (propertyNodes.length > 0) {
        store.value.removeStatements(propertyNodes)

        if (typeof subject !== 'undefined') {
          for (const propertyNode of propertyNodes) {
            store.value.add(subject, Shacl.SHACL('property'), propertyNode.object)
          }
        }
      }
    },
  )

  const properties = computed(() => {
    const subjectValue = toValue(subject)
    if (typeof subjectValue === 'undefined') {
      return []
    }

    return store.value
      .statementsMatching(subjectValue, Shacl.SHACL('property'))
      .filter(
        (statement) =>
          statement.object instanceof BlankNode || statement.object instanceof NamedNode,
      )
      .map((statement) => {
        const object = statement.object as BlankNode | NamedNode

        let editor = store.value.anyStatementMatching(object, Dash.DASH('editor'))?.object
        if (!(editor instanceof NamedNode)) {
          editor = undefined
        }

        let viewer = store.value.anyStatementMatching(object, Dash.DASH('viewer'))?.object
        if (!(viewer instanceof NamedNode)) {
          viewer = undefined
        }

        let order = store.value.anyStatementMatching(object, Shacl.SHACL('order'))?.object
        if (!(order instanceof Literal)) {
          order = undefined
        }

        let group = store.value.anyStatementMatching(object, Shacl.SHACL('group'))?.object
        if (!(group instanceof NamedNode)) {
          group = undefined
        }

        return {
          value: object,
          editor,
          viewer,
          order,
          group,
        }
      })
  })

  function removeProperty(property: BlankNode | NamedNode) {
    Shacl.removeProperty(store.value, property)
  }

  function createProperty(
    shape: string | NamedNode,
    editor: keyof typeof Dash.editors,
    viewer: keyof typeof Dash.viewers,
  ) {
    Shacl.createProperty(store.value, shape, editor, viewer)
  }

  return { properties, removeProperty, createProperty }
}

export const useParentlessNamedNode = ({
  initialValue,
}: {
  initialValue?: MaybeRefOrGetter<string | undefined>
}) => {
  const namedNode = ref<NamedNode | undefined>()

  const value = computed({
    get() {
      return namedNode.value?.value
    },
    set(value) {
      namedNode.value = value ? new NamedNode(value) : undefined
    },
  })

  watch(
    () => toValue(initialValue),
    (initialValue) => {
      if (typeof initialValue === 'undefined') return
      value.value = initialValue
    },
    { immediate: true },
  )

  return { value, namedNode }
}

export const useNamedNode = ({
  subject,
  predicate,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
}) => {
  const store = useFileStore()

  watch(
    () => [toValue(subject), toValue(predicate)] as const,
    ([subject, predicate], [oldSubject, oldPredicate]) => {
      if (typeof oldSubject === 'undefined' || typeof oldPredicate === 'undefined') {
        return
      }

      const currentNamedNode = store.value.any(oldSubject, oldPredicate)
      if (currentNamedNode instanceof NamedNode) {
        store.value.removeMatches(oldSubject, oldPredicate, null)

        if (typeof subject !== 'undefined' && typeof predicate !== 'undefined') {
          store.value.add(subject, predicate, currentNamedNode)
        }
      }
    },
  )

  const namedNode = computed({
    get() {
      const subjectValue = toValue(subject)
      const predicateValue = toValue(predicate)
      if (typeof subjectValue === 'undefined' || typeof predicateValue === 'undefined') {
        return undefined
      }

      const namedNode = store.value.any(subjectValue, predicateValue)
      if (namedNode instanceof NamedNode) {
        return namedNode
      }
      return undefined
    },
    set(value) {
      const subjectValue = toValue(subject)
      const predicateValue = toValue(predicate)
      if (typeof subjectValue === 'undefined' || typeof predicateValue === 'undefined') {
        return
      }

      store.value.removeMatches(subjectValue, predicateValue, null)
      if (value) {
        store.value.add(subjectValue, predicateValue, value)
      }
    },
  })

  const value = computed({
    get() {
      return namedNode.value?.value
    },
    set(value) {
      namedNode.value = value?.includes(':') ? new NamedNode(value) : undefined
    },
  })

  return { value, namedNode }
}

export const useLiteral = <T extends string | boolean | number | Date = string>({
  subject,
  predicate,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
}) => {
  const store = useFileStore()

  watch(
    () => [toValue(subject), toValue(predicate)] as const,
    ([subject, predicate], [oldSubject, oldPredicate]) => {
      if (typeof oldSubject === 'undefined' || typeof oldPredicate === 'undefined') {
        return
      }

      const currentLiteral = store.value.any(oldSubject, oldPredicate)
      if (currentLiteral instanceof Literal) {
        store.value.removeMatches(oldSubject, oldPredicate, null)

        if (typeof subject !== 'undefined' && typeof predicate !== 'undefined') {
          store.value.add(subject, predicate, currentLiteral)
        }
      }
    },
  )

  const literal = computed({
    get() {
      const subjectValue = toValue(subject)
      const predicateValue = toValue(predicate)
      if (typeof subjectValue === 'undefined' || typeof predicateValue === 'undefined') {
        return undefined
      }

      const literal = store.value.any(subjectValue, predicateValue)
      if (literal instanceof Literal) {
        language.value = literal.language
        datatype.value = literal.datatype
        return literal
      }
      return undefined
    },
    set(value) {
      const subjectValue = toValue(subject)
      const predicateValue = toValue(predicate)
      if (typeof subjectValue === 'undefined' || typeof predicateValue === 'undefined') {
        return
      }

      store.value.removeMatches(subjectValue, predicateValue, null)
      if (value) {
        store.value.add(subjectValue, predicateValue, value)
      }
    },
  })

  const value = computed({
    get() {
      return literal.value ? (Node.toJS(literal.value) as T) : undefined
    },
    set(value) {
      literal.value = value
        ? new Literal(Literal.fromValue<Literal>(value).value, language.value, datatype.value)
        : undefined
    },
  })

  const language = ref<string | undefined>(undefined)
  const datatype = ref<NamedNodeType>(Xsd.string)
  watch(
    () => [language.value, datatype.value] as const,
    ([language, datatype], [oldLanguage, oldDatatype]) => {
      if (oldLanguage === language && oldDatatype === datatype) return
      if (!literal.value) return

      literal.value = new Literal(literal.value.value, language, datatype)
    },
  )

  return { value, literal, language, datatype }
}
