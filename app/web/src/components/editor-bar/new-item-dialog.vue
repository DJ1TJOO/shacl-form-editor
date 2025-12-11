<script setup lang="ts">
import { PrefixInput } from '@/components/form-ui/prefix'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useShapes } from '@/composables/use-shacl'
import { reactiveOmit, useVModel } from '@vueuse/core'
import { CircleIcon, DiamondIcon, InfoIcon } from 'lucide-vue-next'
import {
  RovingFocusGroup,
  RovingFocusItem,
  useForwardPropsEmits,
  type DialogRootEmits,
  type DialogRootProps,
} from 'reka-ui'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = reactiveOmit(props, 'open', 'defaultOpen')

const forward = useForwardPropsEmits(delegatedProps, emits)

const { addShape } = useShapes()

const router = useRouter()
const type = ref<'node' | 'property'>('node')
const iri = ref('')

const open = useVModel(props, 'open', emits, {
  passive: true,
  defaultValue: !!props.defaultOpen,
}) as Ref<boolean>

function close() {
  open.value = false
}

function reset() {
  type.value = 'node'
  iri.value = ''
}

function create() {
  const shapeIRI = iri.value.trim()
  // @TODO: Validation of iri
  if (shapeIRI.length < 1 || !shapeIRI.includes(':')) {
    return
  }

  if (type.value === 'node') {
    addShape(shapeIRI, 'node')
  } else {
    addShape(shapeIRI, 'property')
  }

  router.push(`/file/MyShaclFile/${encodeURIComponent(shapeIRI)}`)
  reset()
  close()
}
</script>
<template>
  <Dialog v-bind="forward" v-model:open="open">
    <DialogTrigger class="shrink-0" v-if="$slots.default">
      <slot />
    </DialogTrigger>
    <DialogScrollContent :aria-describedby="undefined">
      <form @submit.prevent="create" class="gap-4 grid">
        <DialogHeader>
          <DialogTitle>New node or property</DialogTitle>
        </DialogHeader>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>
                Type
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>Create a new node or property.</TooltipContent>
                </Tooltip>
              </FieldLabel>

              <RovingFocusGroup class="gap-2 grid grid-cols-2">
                <RovingFocusItem as-child>
                  <Button
                    type="button"
                    :color="type === 'node' ? 'default' : 'background-highlighted'"
                    @click="type = 'node'"
                    @focus="type = 'node'"
                  >
                    <DiamondIcon /> Node
                  </Button>
                </RovingFocusItem>
                <RovingFocusItem as-child>
                  <Button
                    type="button"
                    :color="type === 'property' ? 'default' : 'background-highlighted'"
                    @click="type = 'property'"
                    @focus="type = 'property'"
                  >
                    <CircleIcon /> Property
                  </Button>
                </RovingFocusItem>
              </RovingFocusGroup>
            </Field>

            <Field>
              <FieldLabel>
                IRI
                <Tooltip>
                  <TooltipTrigger><InfoIcon /></TooltipTrigger>
                  <TooltipContent>The IRI of the node or property.</TooltipContent>
                </Tooltip>
              </FieldLabel>
              <PrefixInput v-model="iri" placeholder="ex:MyNode" />
            </Field>
          </FieldGroup>
        </FieldSet>
        <DialogFooter>
          <Button type="button" variant="ghost" @click="close">Close</Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
