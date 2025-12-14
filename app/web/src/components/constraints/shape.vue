<script setup lang="ts">
import { Constraint, type ConstraintProps } from '@/components/constraints'
import { AddButton, RemoveButton } from '@/components/form-ui/buttons'
import { PrefixInput } from '@/components/form-ui/prefix'
import { getNamedNode, injectFileContext, RDF, Shacl } from '@/components/rdf'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLiteral, useNamed } from '@/composables/use-shacl'
import { ForwardIcon, InfoIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { subject } = defineProps<ConstraintProps>()

const { value: node } = useNamed({ subject, predicate: Shacl.SHACL('node') })
const { value: qualifiedMinCount } = useLiteral<number>({
  subject,
  predicate: Shacl.SHACL('qualifiedMinCount'),
})
const { value: qualifiedMaxCount } = useLiteral<number>({
  subject,
  predicate: Shacl.SHACL('qualifiedMaxCount'),
})
const { value: qualifiedValueShapesDisjoint } = useLiteral<boolean>({
  subject,
  predicate: Shacl.SHACL('qualifiedValueShapesDisjoint'),
})

const hasShape = computed(() => typeof node !== 'undefined')

const { store } = injectFileContext()
const router = useRouter()
const route = useRoute()

const canGoToNode = computed(() => {
  if (!node.value) {
    return false
  }
  const nodeNode = getNamedNode(node.value)
  return store.value.holds(nodeNode, RDF('type'), Shacl.SHACL('NodeShape'))
})

function goToNode() {
  if (!node.value) return
  const fileId = typeof route.params.fileId === 'string' ? route.params.fileId : 'MyShaclFile'
  router.push(`/file/${fileId}/${encodeURIComponent(node.value)}`)
}
</script>
<template>
  <Constraint legend="Shape constraints" :collapsible="collapsible">
    <Button @click="goToNode" :disabled="!canGoToNode">
      <ForwardIcon />
      Go to Node
    </Button>

    <Field>
      <FieldLabel>
        Node
        <Tooltip>
          <TooltipTrigger><InfoIcon /></TooltipTrigger>
          <TooltipContent>The shape that values of this property must conform to.</TooltipContent>
        </Tooltip>
      </FieldLabel>

      <AddButton v-if="typeof node === 'undefined'" @click="node = 'http://example.com/MyNode'" />
      <PrefixInput v-model="node" v-else>
        <RemoveButton @click="node = undefined" />
      </PrefixInput>
    </Field>

    <div v-if="hasShape" class="gap-1 grid grid-cols-[1fr_1fr_auto]">
      <Field>
        <FieldLabel>
          Minimum Qualified
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >The minimum number of value nodes that must conform to the given
              shape.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <AddButton v-if="typeof qualifiedMinCount === 'undefined'" @click="qualifiedMinCount = 1" />
        <InputGroup v-else>
          <InputGroupInput v-model="qualifiedMinCount" type="number" :min="0" />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="qualifiedMinCount = undefined" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <FieldLabel>
          Maximum Qualified
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >The maximum number of value nodes that may conform to the given
              shape.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <AddButton
          v-if="typeof qualifiedMaxCount === 'undefined'"
          @click="qualifiedMaxCount = qualifiedMinCount ?? 1"
        />
        <InputGroup v-else>
          <InputGroupInput
            v-model="qualifiedMaxCount"
            type="number"
            :min="qualifiedMinCount ?? 0"
          />
          <InputGroupAddon align="inline-end">
            <RemoveButton @click="qualifiedMaxCount = undefined" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <FieldLabel>
          Disjoint
          <Tooltip>
            <TooltipTrigger><InfoIcon /></TooltipTrigger>
            <TooltipContent
              >When checked, value nodes that conform to this shape may not conform to other
              qualified shapes.</TooltipContent
            >
          </Tooltip>
        </FieldLabel>
        <Checkbox v-model="qualifiedValueShapesDisjoint" />
      </Field>
    </div>
  </Constraint>
</template>
