import { Dash, injectFileContext, Shacl, Xsd } from '@/components/rdf'
import { watchIgnorable } from '@vueuse/core'
import { BlankNode, Literal, NamedNode, Node } from 'rdflib'
import type { NamedNode as NamedNodeType, Quad_Predicate, Quad_Subject } from 'rdflib/lib/tf-types'
import { computed, reactive, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useFileStore() {
  const { store } = injectFileContext()

  return store
}

export const useShapes = () => {
  const store = useFileStore()
  const shapes = computed(() => Shacl.getAllShapes(store.value))

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

function useRdfNode<T extends Node>({
  subject,
  predicate,
  nodeClass,
  onNodeFromStore,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeClass: new (...args: any[]) => T // Class constructor for a node type
  onNodeFromStore?: (node: T) => void
}) {
  const store = useFileStore()

  watch(
    () => [toValue(subject), toValue(predicate)] as const,
    ([subject, predicate], [oldSubject, oldPredicate]) => {
      if (typeof oldSubject === 'undefined' || typeof oldPredicate === 'undefined') {
        return
      }

      const currentNode = store.value.any(oldSubject, oldPredicate)
      if (currentNode instanceof nodeClass) {
        store.value.removeMatches(oldSubject, oldPredicate, null)

        if (typeof subject !== 'undefined' && typeof predicate !== 'undefined') {
          store.value.add(subject, predicate, currentNode)
        }
      }
    },
  )

  const node = computed({
    get() {
      const subjectValue = toValue(subject)
      const predicateValue = toValue(predicate)
      if (typeof subjectValue === 'undefined' || typeof predicateValue === 'undefined') {
        return undefined
      }

      const foundNode = store.value.any(subjectValue, predicateValue)
      if (foundNode instanceof nodeClass) {
        onNodeFromStore?.(foundNode)
        return foundNode
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

  return node
}

export const useNamed = ({
  subject,
  predicate,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
}) => {
  const node = useRdfNode({
    subject,
    predicate,
    nodeClass: NamedNode,
  })

  const value = computed({
    get() {
      return node.value?.value
    },
    set(value) {
      node.value = value?.includes(':') ? new NamedNode(value) : undefined
    },
  })

  return { value, node }
}

/**
 * Converts a checkbox value to a true or unset value.
 * @param value - The checkbox value.
 * @returns The true or unset value.
 */
export const booleanFromCheckboxValue = (value: boolean | 'on' | 'off' | 'indeterminate') => {
  const realValue =
    typeof value === 'boolean' ? value : value === 'on' ? true : value === 'off' ? false : undefined
  return realValue === true ? true : undefined
}

export const useLiteral = <T extends string | boolean | number | Date = string>({
  subject,
  predicate,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
}) => {
  const language = ref<string | undefined>(undefined)
  const datatype = ref<NamedNodeType>(Xsd.string)

  const node = useRdfNode({
    subject,
    predicate,
    nodeClass: Literal,
    onNodeFromStore: (foundLiteral) => {
      language.value = foundLiteral.language
      datatype.value = foundLiteral.datatype
    },
  })

  const value = computed({
    get() {
      return node.value ? (Node.toJS(node.value) as T) : undefined
    },
    set(value) {
      node.value =
        typeof value === 'string'
          ? new Literal(value, language.value, datatype.value)
          : typeof value !== 'undefined'
            ? Literal.fromValue<Literal>(value)
            : undefined
    },
  })

  watch(
    () => [language.value, datatype.value] as const,
    ([language, datatype], [oldLanguage, oldDatatype]) => {
      if (oldLanguage === language && oldDatatype === datatype) return
      if (!node.value) return

      node.value = new Literal(node.value.value, language, datatype)
    },
  )

  return { value, node, language, datatype }
}

function useRdfNodeList<T extends Node>({
  subject,
  predicate,
  nodeClass,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeClass: new (...args: any[]) => T // Class constructor for a node type
}) {
  const store = useFileStore()

  watch(
    () => [toValue(subject), toValue(predicate)] as const,
    ([subject, predicate], [oldSubject, oldPredicate]) => {
      if (typeof oldSubject === 'undefined' || typeof oldPredicate === 'undefined') {
        return
      }

      const currentNodes = store.value
        .statementsMatching(oldSubject, oldPredicate)
        .filter((statement) => statement.object instanceof nodeClass)
        .map((statement) => statement.object as T)

      if (currentNodes.length > 0) {
        store.value.removeMatches(oldSubject, oldPredicate, null)

        if (typeof subject !== 'undefined' && typeof predicate !== 'undefined') {
          for (const node of currentNodes) {
            store.value.add(subject, predicate, node)
          }
        }
      }
    },
  )

  const nodes = computed({
    get() {
      const subjectValue = toValue(subject)
      const predicateValue = toValue(predicate)
      if (typeof subjectValue === 'undefined' || typeof predicateValue === 'undefined') {
        return []
      }

      const foundNodes = store.value
        .statementsMatching(subjectValue, predicateValue)
        .filter((statement) => statement.object instanceof nodeClass)
        .map((statement) => {
          const node = statement.object as T
          return node
        })

      return foundNodes
    },
    set(values) {
      const subjectValue = toValue(subject)
      const predicateValue = toValue(predicate)
      if (typeof subjectValue === 'undefined' || typeof predicateValue === 'undefined') {
        return
      }

      store.value.removeMatches(subjectValue, predicateValue, null)
      if (values && values.length > 0) {
        for (const value of values) {
          store.value.add(subjectValue, predicateValue, value)
        }
      }
    },
  })

  return nodes
}

export const useNamedList = ({
  subject,
  predicate,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
}) => {
  const nodes = useRdfNodeList({
    subject,
    predicate,
    nodeClass: NamedNode,
  })

  const items = reactive<{ value: string; node: NamedNode }[]>([])

  const { ignoreUpdates: ignoreItemUpdates } = watchIgnorable(
    items,
    (newItems) => {
      if (!newItems || newItems.length === 0) {
        nodes.value = []
        return
      }

      ignoreNodeUpdates(() => {
        nodes.value = newItems
          .filter((item) => item.value?.includes(':'))
          .map((item) => new NamedNode(item.value))
      })
    },
    { deep: true },
  )

  const { ignoreUpdates: ignoreNodeUpdates } = watchIgnorable(
    nodes,
    (newNodes) => {
      const newItems = newNodes.map((node) => ({
        value: node.value,
        node,
      }))

      ignoreItemUpdates(() => {
        items.splice(0, items.length, ...newItems)
      })
    },
    { immediate: true },
  )

  return { items, ignoreNodeUpdates, ignoreItemUpdates }
}

export const useLiteralList = <T extends string | boolean | number | Date = string>({
  subject,
  predicate,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
}) => {
  const nodes = useRdfNodeList({
    subject,
    predicate,
    nodeClass: Literal,
  })

  type LiteralItem = {
    value: T
    node: Literal
    language?: string | null
    datatype: NamedNodeType
  }

  // Cast because of this issue: https://github.com/vuejs/core/issues/2136
  const items = reactive<LiteralItem[]>([]) as LiteralItem[]

  const { ignoreUpdates: ignoreItemUpdates } = watchIgnorable(
    items,
    (newItems) => {
      if (!newItems || newItems.length === 0) {
        nodes.value = []
        return
      }

      const newNodes: Literal[] = []

      for (const item of newItems) {
        if (typeof item.value === 'undefined') continue

        let literal: Literal
        if (typeof item.value === 'string') {
          literal = new Literal(item.value, item.language, item.datatype ?? Xsd.string)
        } else {
          literal = Literal.fromValue<Literal>(item.value)
        }

        newNodes.push(literal)
      }

      ignoreNodeUpdates(() => {
        nodes.value = newNodes
      })
    },
    { deep: true },
  )

  const { ignoreUpdates: ignoreNodeUpdates } = watchIgnorable(
    nodes,
    (newNodes) => {
      const newItems: LiteralItem[] = newNodes.map((node) => ({
        value: Node.toJS(node) as T,
        node,
        language: node.language,
        datatype: node.datatype,
      }))

      ignoreItemUpdates(() => {
        items.splice(0, items.length, ...newItems)
      })
    },
    { immediate: true },
  )

  return { items, ignoreNodeUpdates, ignoreItemUpdates }
}
