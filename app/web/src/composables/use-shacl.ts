import { useFileStore } from '@/components/file'
import { RDF, Shacl, Xsd } from '@/components/rdf'
import { watchIgnorable } from '@vueuse/core'
import { BlankNode, IndexedFormula, Literal, NamedNode, Node } from 'rdflib'
import type { NamedNode as NamedNodeType, Quad_Predicate, Quad_Subject } from 'rdflib/lib/tf-types'
import {
  computed,
  reactive,
  readonly as readonlyVue,
  ref,
  toValue,
  watch,
  type DeepReadonly,
  type MaybeRefOrGetter,
  type Ref,
  type UnwrapNestedRefs,
} from 'vue'

function useReadonly<T extends object, ReadOnly extends boolean>(value: T, readonly?: ReadOnly) {
  return (readonly ? readonlyVue(value) : value) as ReadOnly extends true
    ? DeepReadonly<UnwrapNestedRefs<T>>
    : T
}

export const useShapeType = ({
  subject,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
}) => {
  const { items: types } = useNamedList({ subject, predicate: RDF('type'), readonly: true })
  return computed(() => {
    if (types.some((type) => type.value === Shacl.SHACL('NodeShape').value)) return 'node'
    if (types.some((type) => type.value === Shacl.SHACL('PropertyShape').value)) return 'property'
    return undefined
  })
}

export const useShapes = () => {
  const store = useFileStore()
  const shapes = computed(() => Shacl.getAllShapes(store.value))

  function addNodeShape(props: Omit<Shacl.AddNodeShape, 'store'>) {
    Shacl.addNodeShape({
      store: store.value,
      ...props,
    })
  }

  function addPropertyShape(props: Omit<Shacl.AddPropertyShape, 'store'>) {
    Shacl.addPropertyShape({
      store: store.value,
      ...props,
    })
  }

  function removeShape(iri: string | NamedNode) {
    Shacl.removeShape(store.value, iri)
  }

  return { shapes, addNodeShape, addPropertyShape, removeShape }
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

    return Shacl.getNodeProperties(store.value, subjectValue)
  })

  function removeProperty(property: BlankNode | NamedNode) {
    Shacl.removeProperty(store.value, property)
  }

  return { properties, removeProperty }
}

export const useGlobalNamed = ({
  initialValue,
  store: customStore,
}: {
  initialValue?: MaybeRefOrGetter<string | undefined>
  store?: Ref<IndexedFormula>
}) => {
  const store = customStore ?? useFileStore()
  const initialValueString = toValue(initialValue)
  const node = ref<NamedNode | undefined>(
    initialValueString ? new NamedNode(initialValueString) : undefined,
  )

  const value = computed({
    get() {
      return node.value?.value
    },
    set(value) {
      const oldNode = node.value
      const newNode = value ? new NamedNode(value) : undefined

      if (oldNode && newNode && oldNode.value !== newNode.value) {
        const statementsAsSubject = [...store.value.statementsMatching(oldNode, null, null)]
        const statementsAsPredicate = [...store.value.statementsMatching(null, oldNode, null)]
        const statementsAsObject = [...store.value.statementsMatching(null, null, oldNode)]

        for (const st of statementsAsSubject) {
          store.value.remove(st)
          store.value.add(newNode, st.predicate, st.object, st.graph)
        }

        for (const st of statementsAsPredicate) {
          store.value.remove(st)
          store.value.add(st.subject, newNode, st.object, st.graph)
        }

        for (const st of statementsAsObject) {
          store.value.remove(st)
          store.value.add(st.subject, st.predicate, newNode, st.graph)
        }
      }

      node.value = newNode
    },
  })

  return { value, node }
}

function useRdfNode<T extends Node>({
  subject,
  predicate,
  nodeClass,
  onNodeFromStore,
  readonly = false,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeClass: new (...args: any[]) => T // Class constructor for a node type
  onNodeFromStore?: (node: T) => void
  readonly?: boolean
}) {
  const store = useFileStore()

  if (!readonly) {
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
  }

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

export const useNamed = <ReadOnly extends boolean = false>({
  subject,
  predicate,
  readonly,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
  readonly?: ReadOnly
}) => {
  const node = useRdfNode({
    subject,
    predicate,
    nodeClass: NamedNode,
    readonly,
  })

  const value = computed({
    get() {
      return node.value?.value
    },
    set(value) {
      node.value = value?.includes(':') ? new NamedNode(value) : undefined
    },
  })

  return { value: useReadonly(value, readonly), node: useReadonly(value, readonly) }
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

export const useLiteral = <
  T extends string | boolean | number | Date = string,
  ReadOnly extends boolean = false,
>({
  subject,
  predicate,
  readonly,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
  readonly?: ReadOnly
}) => {
  const language = ref<string | undefined>(undefined)
  const datatype = ref<NamedNodeType>(Xsd.string)

  const node = useRdfNode({
    subject,
    predicate,
    nodeClass: Literal,
    onNodeFromStore: (foundLiteral) => {
      ignoreLanguageAndDatatypeUpdates(() => {
        language.value = foundLiteral.language
        datatype.value = foundLiteral.datatype
      })
    },
    readonly,
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

  const { ignoreUpdates: ignoreLanguageAndDatatypeUpdates } = watchIgnorable(
    () => [language.value, datatype.value] as const,
    ([language, datatype], [oldLanguage, oldDatatype]) => {
      if (oldLanguage === language && oldDatatype === datatype) return
      if (!node.value) return

      node.value = new Literal(node.value.value, language, datatype)
    },
  )

  return {
    value: useReadonly(value, readonly),
    node: useReadonly(node, readonly),
    language: useReadonly(language, readonly),
    datatype: useReadonly(datatype, readonly),
  }
}

function useRdfNodeList<T extends Node>({
  subject,
  predicate,
  nodeClass,
  readonly = false,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeClass: new (...args: any[]) => T // Class constructor for a node type
  readonly?: boolean
}) {
  const store = useFileStore()

  if (!readonly) {
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
  }

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

export const useNamedList = <ReadOnly extends boolean = false>({
  subject,
  predicate,
  readonly,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
  readonly?: ReadOnly
}) => {
  const nodes = useRdfNodeList({
    subject,
    predicate,
    nodeClass: NamedNode,
    readonly,
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

  return {
    items: useReadonly(items, readonly),
    ignoreNodeUpdates,
    ignoreItemUpdates,
  }
}

export const useLiteralList = <
  T extends string | boolean | number | Date = string,
  ReadOnly extends boolean = false,
>({
  subject,
  predicate,
  readonly,
}: {
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
  readonly?: ReadOnly
}) => {
  const nodes = useRdfNodeList({
    subject,
    predicate,
    nodeClass: Literal,
    readonly,
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

  return { items: useReadonly(items, readonly), ignoreNodeUpdates, ignoreItemUpdates }
}
