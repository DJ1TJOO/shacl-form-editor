<script setup lang="ts">
import BarItem from '@/components/editor-bar/bar-item.vue'
import { injectFileContext, Shacl } from '@/components/rdf'
import { getLocalName } from '@/components/rdf/shacl'
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
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CircleIcon, DiamondIcon, InfoIcon, PlusIcon } from 'lucide-vue-next'
import { NamedNode } from 'rdflib'
import { RovingFocusGroup, RovingFocusItem } from 'reka-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { store } = injectFileContext()

const router = useRouter()
const type = ref<'node' | 'property'>('node')
const iri = ref('')

const open = ref(false)
function close() {
  open.value = false
}

function create() {
  const shapeIRI = iri.value.trim()
  // @TODO: Validation of iri
  if (shapeIRI.length < 1) {
    return
  }

  const shapeIRINode = new NamedNode(shapeIRI)
  if (type.value === 'node') {
    Shacl.addShape(store.value, shapeIRINode)
  } else {
    Shacl.addProperty(store.value, shapeIRINode)
  }

  type.value = 'node'
  iri.value = ''
  router.push(`/file/MyShaclFile/${getLocalName(shapeIRINode)}`)
  close()
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger class="shrink-0">
      <BarItem>
        <PlusIcon class="size-4" />
        New node or property
      </BarItem>
    </DialogTrigger>
    <DialogScrollContent :aria-describedby="undefined">
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
                  :color="type === 'node' ? 'default' : 'background-highlighted'"
                  @click="type = 'node'"
                  @focus="type = 'node'"
                >
                  <DiamondIcon /> Node
                </Button>
              </RovingFocusItem>
              <RovingFocusItem as-child>
                <Button
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
            <Input v-model="iri" placeholder="ex:MyNode" />
          </Field>
        </FieldGroup>
      </FieldSet>
      <DialogFooter>
        <Button variant="ghost" @click="close">Close</Button>
        <Button @click="create">Create</Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
