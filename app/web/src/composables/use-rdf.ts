import { injectFileContext } from '@/components/rdf'
import { Literal, Statement } from 'rdflib'
import type { Quad, Quad_Object, Quad_Predicate, Quad_Subject } from 'rdflib/lib/tf-types'
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
  const statement = ref<Quad | undefined>(undefined)

  function removeStatement() {
    if (statement.value) {
      store.value.remove(statement.value)
      statement.value = undefined
    }
  }

  function updateStatement(subject: Quad_Subject, predicate: Quad_Predicate, object: Quad_Object) {
    if (statement.value) {
      store.value.remove(statement.value)
    }

    const newStatement = store.value.add(subject, predicate, object) as Statement | null
    if (!newStatement) {
      // Already exists
      statement.value = store.value.anyStatementMatching(subject, predicate, object)
    } else {
      statement.value = newStatement
    }
  }

  watch(
    () => [toValue(subject), toValue(predicate), toValue(object)],
    ([subject, predicate, object]) => {
      if (
        typeof subject === 'undefined' ||
        typeof predicate === 'undefined' ||
        typeof object === 'undefined'
      ) {
        removeStatement()
        return
      }

      updateStatement(subject as Quad_Subject, predicate as Quad_Predicate, object as Quad_Object)
    },
  )
}

export function useLiteral(
  subject: MaybeRefOrGetter<Quad_Subject | undefined>,
  predicate: MaybeRefOrGetter<Quad_Predicate | undefined>,
) {
  const object = ref<Quad_Object | undefined>(undefined)
  useStatement(subject, predicate, object)

  const value = computed({
    get() {
      return object.value?.value
    },
    set(value) {
      object.value = value ? new Literal(value) : undefined
    },
  })

  return value
}
