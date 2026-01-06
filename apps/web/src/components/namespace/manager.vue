<script setup lang="ts">
import { Files } from '@/components/file'
import { RemoveButton } from '@/components/form-ui/buttons'
import { Namespaces, Prefixes, type NamespaceDefinition } from '@/components/namespace'
import EditNamespaceDialog from '@/components/namespace/edit-namespace-dialog.vue'
import { packagedNamespaces } from '@/components/namespace/packaged/packaged'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { reactiveOmit } from '@vueuse/core'
import { EditIcon, InfoIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-vue-next'
import { useForwardPropsEmits, type DialogRootEmits, type DialogRootProps } from 'reka-ui'
import { computed, ref } from 'vue'

const props = defineProps<DialogRootProps & { allowImplicitBase?: boolean }>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = reactiveOmit(props, 'open', 'defaultOpen')
const forward = useForwardPropsEmits(delegatedProps, emits)

const open = defineModel<boolean>('open')
if (props.defaultOpen) {
  open.value = true
}
const activeNamespaces = defineModel<string[]>('activeNamespaces')
const implicitBase = defineModel<string>('implicitBase')

const prefixSuggestions = Prefixes.usePrefixSuggestions()
const files = Files.useFiles()

const customNamespaces = Namespaces.useCustomNamespaces()
const allNamespaces = computed(() =>
  [
    ...customNamespaces.value.map((ns) => ({
      ...ns,
      type: 'custom',
      active: activeNamespaces.value?.includes(ns.prefix) ?? false,
    })),
    ...packagedNamespaces
      .filter(
        (ns) =>
          !customNamespaces.value.some((cns) => cns.prefix === ns.prefix || cns.iri === ns.iri),
      )
      .map((ns) => ({
        ...ns,
        type: 'packaged',
        active: activeNamespaces.value?.includes(ns.prefix) ?? false,
      })),
  ].toSorted((a, b) => {
    if (a.active && !b.active) return -1
    if (!a.active && b.active) return 1
    return a.prefix.localeCompare(b.prefix)
  }),
)

function toggleNamespace(prefix: string, value: boolean) {
  if (!activeNamespaces.value) return

  if (value) {
    if (activeNamespaces.value.includes(prefix)) return
    activeNamespaces.value = [...activeNamespaces.value, prefix]
  } else {
    if (!activeNamespaces.value.includes(prefix)) return
    activeNamespaces.value = activeNamespaces.value.filter((ns) => ns !== prefix)
  }
}

function hasSuggestions(prefix: string) {
  const suggestions = prefixSuggestions.value[prefix]
  return suggestions && suggestions.length > 0
}

function hasPossibleSuggestions(namespace: NamespaceDefinition) {
  return namespace.fetchUrl || namespace.file || namespace.suggestions
}

const searchQuery = ref('')
const filteredNamespaces = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return allNamespaces.value

  return allNamespaces.value.filter(
    (ns) =>
      ns.prefix.toLowerCase().includes(query) ||
      ns.iri.toLowerCase().includes(query) ||
      ns.fetchUrl?.toLowerCase().includes(query),
  )
})

const editDialogOpen = ref(false)
const editingNamespace = ref<NamespaceDefinition | null>(null)

function openEditDialog(namespace: NamespaceDefinition | null) {
  editingNamespace.value = namespace
  editDialogOpen.value = true
}

function handleEdit(updatedNamespace: NamespaceDefinition) {
  const index = customNamespaces.value.findIndex(
    (ns) => ns.prefix === editingNamespace.value?.prefix,
  )

  if (index !== -1) {
    customNamespaces.value[index] = updatedNamespace
  } else {
    customNamespaces.value.push(updatedNamespace)
    toggleNamespace(updatedNamespace.prefix, true)
  }

  if (editingNamespace.value) {
    const oldPrefix = editingNamespace.value.prefix
    const newPrefix = updatedNamespace.prefix

    for (const file of files.value) {
      if (!file.activeNamespaces.includes(oldPrefix)) continue

      Files.updateActiveNamespaces(file.id, [
        ...file.activeNamespaces.filter((ns) => ns !== oldPrefix),
        newPrefix,
      ])
    }
  }

  editingNamespace.value = null
}

function removeNamespace(prefix: string) {
  for (const file of files.value) {
    if (!file.activeNamespaces.includes(prefix)) continue
    Files.updateActiveNamespaces(
      file.id,
      file.activeNamespaces.filter((ns) => ns !== prefix),
    )
  }
  customNamespaces.value = customNamespaces.value.filter((ns) => ns.prefix !== prefix)
}
</script>

<template>
  <Dialog v-bind="forward" v-model:open="open">
    <DialogTrigger class="shrink-0" v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogScrollContent :aria-describedby="undefined" class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Manage namespaces</DialogTitle>
        <DialogDescription v-if="activeNamespaces">
          Select which namespaces are active for the current file.
        </DialogDescription>
      </DialogHeader>

      <EditNamespaceDialog
        v-model:open="editDialogOpen"
        :default-values="editingNamespace || undefined"
        @submit="handleEdit"
      />

      <FieldSet v-if="allowImplicitBase">
        <FieldGroup>
          <Field>
            <FieldLabel>
              Implicit Base IRI for this file
              <Tooltip>
                <TooltipTrigger><InfoIcon /></TooltipTrigger>
                <TooltipContent>
                  Uses the `<code>@prefix : &lt;iri&gt;</code>` directive.
                  <br />
                  <code>@base</code> is currently <strong>not</strong> supported.
                </TooltipContent>
              </Tooltip>
            </FieldLabel>

            <InputGroup>
              <InputGroupInput v-model="implicitBase" placeholder="http://example.org/" />
            </InputGroup>
          </Field>
        </FieldGroup>
      </FieldSet>

      <div class="flex justify-between items-center gap-2">
        <InputGroup>
          <InputGroupInput v-model="searchQuery" placeholder="Search namespaces by prefix or IRI" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <RemoveButton v-if="searchQuery" @click="searchQuery = ''" />
          </InputGroupAddon>
        </InputGroup>
        <Button @click="openEditDialog(null)">
          <PlusIcon />
          Add namespace
        </Button>
      </div>

      <div class="space-y-2 max-h-96 overflow-y-auto">
        <label
          v-for="namespace in filteredNamespaces"
          :key="namespace.prefix"
          class="flex items-center gap-2 hover:bg-background-highlighted p-1 rounded-sm transition-colors"
        >
          <Checkbox
            v-if="activeNamespaces"
            :model-value="activeNamespaces.includes(namespace.prefix)"
            @update:model-value="(value) => toggleNamespace(namespace.prefix, value === true)"
          />
          <span class="font-medium">{{ namespace.prefix }}</span>
          <span class="text-text-lighter text-sm truncate">
            {{ namespace.iri }}
          </span>
          <div class="flex items-center gap-1 ml-auto">
            <Tooltip>
              <TooltipTrigger as-child>
                <span
                  v-if="hasSuggestions(namespace.prefix) || hasPossibleSuggestions(namespace)"
                  :class="
                    cn(
                      'px-1.5 py-0.5 rounded text-xs',
                      hasSuggestions(namespace.prefix)
                        ? 'bg-success/10 text-success'
                        : 'bg-background-highlighted text-text-lighter',
                    )
                  "
                >
                  Suggestions
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {{
                  hasSuggestions(namespace.prefix)
                    ? 'Suggestions available for this namespace.'
                    : 'Suggestions available when the namespace is activated.'
                }}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <span
                  v-if="namespace.type === 'packaged'"
                  class="bg-background-blue px-1.5 py-0.5 rounded text-branding text-xs"
                >
                  Packaged
                </span>
              </TooltipTrigger>
              <TooltipContent> This namespace is packaged with the application. </TooltipContent>
            </Tooltip>
            <Button
              size="icon-sm"
              color="background-highlighted"
              @click="openEditDialog(namespace)"
            >
              <EditIcon />
            </Button>
            <ConfirmDialog
              v-if="namespace.type === 'custom'"
              title="Remove namespace"
              description="Are you sure you want to remove this namespace? This will remove it from all files."
              @confirm="removeNamespace(namespace.prefix)"
            >
              <Button size="icon-sm" color="danger-hover">
                <TrashIcon />
              </Button>
            </ConfirmDialog>
          </div>
        </label>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>
