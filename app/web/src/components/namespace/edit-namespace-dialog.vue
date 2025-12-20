<script setup lang="ts">
import type { NamespaceDefinition } from '@/components/namespace'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { reactiveOmit } from '@vueuse/core'
import { InfoIcon } from 'lucide-vue-next'
import { useForwardPropsEmits, type DialogRootEmits, type DialogRootProps } from 'reka-ui'
import { computed, ref, watch } from 'vue'

const props = defineProps<DialogRootProps & { defaultValues?: NamespaceDefinition }>()
const emits = defineEmits<DialogRootEmits & { submit: [namespace: NamespaceDefinition] }>()

const delegatedProps = reactiveOmit(props, 'open', 'defaultValues')

const forward = useForwardPropsEmits(delegatedProps, emits)

const open = defineModel<boolean>('open')

const prefix = ref(props.defaultValues?.prefix || '')
const iri = ref(props.defaultValues?.iri || '')
const fetchUrl = ref(props.defaultValues?.fetchUrl || '')
const contentType = ref(props.defaultValues?.contentType || null)

const contentTypes = [
  'text/html',
  'application/ld+json',
  'text/n3',
  'application/n3',
  'application/nquads',
  'application/n-quads',
  'application/n-triples',
  'application/rdf+xml',
  'application/sparql-update',
  'application/sparql-update-single-match',
  'text/turtle',
  'application/x-turtle',
  'application/xhtml+xml',
] as const

function close() {
  open.value = false
}

function reset() {
  if (props.defaultValues) {
    prefix.value = props.defaultValues.prefix || ''
    iri.value = props.defaultValues.iri || ''
    fetchUrl.value = props.defaultValues.fetchUrl || ''
    contentType.value = props.defaultValues.contentType || 'text/turtle'
  } else {
    prefix.value = ''
    iri.value = ''
    fetchUrl.value = ''
    contentType.value = null
  }
}

watch(() => props.defaultValues, reset, { deep: true })
watch(open, (isOpen) => {
  if (isOpen) {
    reset()
  }
})

const valid = computed(() => {
  if (prefix.value.trim().length < 1) return false
  if (iri.value.trim().length < 1) return false
  return true
})

function submit() {
  if (!valid.value) return

  const namespace: NamespaceDefinition = {
    prefix: prefix.value.trim(),
    iri: iri.value.trim(),
    fetchUrl: fetchUrl.value.trim() || undefined,
    contentType: contentType.value || undefined,
  }

  emits('submit', namespace)
  reset()
  close()
}
</script>

<template>
  <Dialog v-bind="forward" v-model:open="open">
    <DialogScrollContent :aria-describedby="undefined">
      <form @submit.prevent="submit" class="gap-4 grid">
        <DialogHeader>
          <DialogTitle>{{ props.defaultValues ? 'Edit' : 'Add' }} namespace</DialogTitle>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>
                Prefix
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>The prefix for this namespace.</TooltipContent>
                </Tooltip>
              </FieldLabel>
              <Input v-model="prefix" placeholder="ex" />
            </Field>

            <Field>
              <FieldLabel>
                IRI
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent
                    >The IRI (Internationalized Resource Identifier) for this
                    namespace.</TooltipContent
                  >
                </Tooltip>
              </FieldLabel>
              <Input v-model="iri" placeholder="http://example.org/" />
            </Field>

            <Field>
              <FieldLabel>
                Fetch URL
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>
                    Optional URL to fetch namespace definitions from.
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>
              <Input v-model="fetchUrl" placeholder="https://example.org/namespace" />
            </Field>

            <Field>
              <FieldLabel>
                Content Type
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>
                    The content type of the resource at the fetch URL.
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>
              <Select v-model="contentType">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="null">None</SelectItem>
                  <SelectItem v-for="ct in contentTypes" :key="ct" :value="ct">
                    {{ ct }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <Button type="button" variant="ghost" @click="close">Close</Button>
          <Button type="submit" :disabled="!valid">Save</Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
