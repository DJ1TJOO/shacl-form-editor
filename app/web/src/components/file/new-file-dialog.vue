<script setup lang="ts">
import { Files } from '@/components/file'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import slugify from '@sindresorhus/slugify'
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits, type DialogRootEmits, type DialogRootProps } from 'reka-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = reactiveOmit(props, 'open', 'defaultOpen')
const forward = useForwardPropsEmits(delegatedProps, emits)

const router = useRouter()
const open = defineModel<boolean>('open')
const fileName = ref('')
const slug = computed(() => slugify(fileName.value))

const files = Files.useFiles()
const existingFile = computed(() => files.value.find((file) => file.id === slug.value))

function close() {
  open.value = false
  fileName.value = ''
}

const valid = computed(() => {
  if (fileName.value.trim().length < 1) return false
  if (slug.value.trim().length < 1) return false
  if (existingFile.value) return false

  return true
})

function create() {
  if (!valid.value) return

  Files.createFile(slug.value, fileName.value)

  router.push(`/file/${slug.value}`)
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
          <DialogTitle>New file</DialogTitle>
        </DialogHeader>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>File name</FieldLabel>
              <Input v-model="fileName" placeholder="my-file" />
              <span class="text-text-light text-xs">Stored as '{{ slug }}'</span>
              <FieldError
                :errors="existingFile ? [`File already stored with name '${slug}'`] : []"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <DialogFooter>
          <Button variant="ghost" @click="close">Close</Button>
          <Button type="submit" :disabled="!valid">Create</Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
