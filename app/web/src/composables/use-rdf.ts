import { injectFileContext, XSD } from '@/components/rdf'
import { RDF } from '@/components/rdf/shacl'
import { Literal, NamedNode } from 'rdflib'
import type {
  NamedNode as NamedNodeType,
  Quad_Object,
  Quad_Predicate,
  Quad_Subject,
} from 'rdflib/lib/tf-types'
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useFileStore() {
  const { store } = injectFileContext()

  return store
}

export function useStatement(
  subject: MaybeRefOrGetter<Quad_Subject | undefined>,
  predicate: MaybeRefOrGetter<Quad_Predicate | undefined>,
  object: MaybeRefOrGetter<Quad_Object | undefined>,
) {
  const store = useFileStore()

  watch(
    () => [toValue(subject), toValue(predicate), toValue(object)],
    ([subject, predicate, object], [oldSubject, oldPredicate, oldObject]) => {
      if (
        typeof oldSubject !== 'undefined' &&
        typeof oldPredicate !== 'undefined' &&
        typeof oldObject !== 'undefined'
      ) {
        store.value.removeMatches(
          oldSubject as Quad_Subject,
          oldPredicate as Quad_Predicate,
          oldObject as Quad_Object,
        )
      }

      if (
        typeof subject !== 'undefined' &&
        typeof predicate !== 'undefined' &&
        typeof object !== 'undefined'
      ) {
        store.value.add(subject as Quad_Subject, predicate as Quad_Predicate, object as Quad_Object)
      }
    },
  )
}

export function useLiteral({
  initialValue,
  initialLanguage,
  initialDatatype,
  subject,
  predicate,
}: {
  initialValue?: MaybeRefOrGetter<string | undefined>
  initialLanguage?: MaybeRefOrGetter<string | null | undefined>
  initialDatatype?: MaybeRefOrGetter<NamedNodeType | undefined>
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
}) {
  const store = useFileStore()
  const literal = ref<Literal | undefined>(undefined)
  const internalLanguage = ref<string | null | undefined>(undefined)
  const internalDatatype = ref<NamedNodeType>(XSD.string)

  function computeDatatype(
    language: string | null | undefined,
    datatype: NamedNodeType | undefined,
  ): NamedNodeType {
    if (language) return RDF('langString')
    if (datatype && !datatype.equals(RDF('langString'))) return datatype
    return XSD.string
  }

  function updateLiteral(value: string | undefined) {
    if (!value) {
      literal.value = undefined
      return
    }

    const newLiteral = new Literal(value, internalLanguage.value, internalDatatype.value)
    if (!literal.value || !literal.value.equals(newLiteral)) {
      literal.value = newLiteral
    }
  }

  useStatement(subject, predicate, literal)

  watch(
    () =>
      [
        toValue(subject),
        toValue(predicate),
        toValue(initialValue),
        toValue(initialLanguage),
        toValue(initialDatatype),
      ] as const,
    ([subject, predicate, initialValue, initialLanguage, initialDatatype]) => {
      if (typeof subject !== 'undefined' && typeof predicate !== 'undefined') {
        const existingStatement = store.value.anyStatementMatching(
          subject as Quad_Subject,
          predicate as Quad_Predicate,
          null,
        )

        if (existingStatement && existingStatement.object instanceof Literal) {
          const storeLiteral = existingStatement.object
          if (!literal.value || !literal.value.equals(storeLiteral)) {
            literal.value = storeLiteral
            internalLanguage.value = storeLiteral.language
            internalDatatype.value = storeLiteral.datatype
            return
          }
        }
      }

      if (typeof initialLanguage !== 'undefined') {
        internalLanguage.value = initialLanguage
      }
      internalDatatype.value = computeDatatype(internalLanguage.value, initialDatatype)

      if (typeof initialValue !== 'undefined') {
        updateLiteral(initialValue)
      }
    },
    { immediate: true },
  )

  const value = computed({
    get() {
      return literal.value?.value
    },
    set(value) {
      updateLiteral(value)
    },
  })

  const language = computed({
    get() {
      return internalLanguage.value
    },
    set(language) {
      internalLanguage.value = language
      if (language) {
        internalDatatype.value = RDF('langString')
      } else if (internalDatatype.value.equals(RDF('langString'))) {
        internalDatatype.value = XSD.string
      }

      if (literal.value) {
        updateLiteral(literal.value.value)
      }
    },
  })

  const datatype = computed({
    get() {
      return internalDatatype.value
    },
    set(datatype) {
      internalDatatype.value = datatype ?? XSD.string
      if (literal.value) {
        updateLiteral(literal.value.value)
      }
    },
  })

  return { value, language, datatype, literal }
}

export const useNamedNode = ({
  initialValue,
  subject,
  predicate,
}: {
  initialValue?: MaybeRefOrGetter<string | undefined>
  subject?: MaybeRefOrGetter<Quad_Subject | undefined>
  predicate?: MaybeRefOrGetter<Quad_Predicate | undefined>
}) => {
  const store = useFileStore()
  const namedNode = ref<NamedNode | undefined>()

  watch(
    () => [toValue(subject), toValue(predicate), toValue(initialValue)] as const,
    ([subject, predicate, initialValue]) => {
      if (typeof subject !== 'undefined' && typeof predicate !== 'undefined') {
        const existingStatement = store.value.anyStatementMatching(
          subject as Quad_Subject,
          predicate as Quad_Predicate,
          null,
        )

        if (existingStatement && existingStatement.object instanceof NamedNode) {
          const storeLiteral = existingStatement.object
          if (!namedNode.value || !namedNode.value.equals(storeLiteral)) {
            namedNode.value = storeLiteral
            return
          }
        }
      }

      if (typeof initialValue !== 'undefined') {
        const newNamedNode = new NamedNode(initialValue)
        if (!namedNode.value || !namedNode.value.equals(newNamedNode)) {
          namedNode.value = newNamedNode
        }
      }
    },
    { immediate: true },
  )

  useStatement(subject, predicate, namedNode)

  const value = computed({
    get() {
      return namedNode.value?.value
    },
    set(value) {
      namedNode.value = value ? new NamedNode(value) : undefined
    },
  })

  return { value, namedNode }
}
