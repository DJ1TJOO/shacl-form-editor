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

const props = defineProps<
  DialogRootProps & { fileId: string; fileName: string; redirectOnRename?: boolean }
>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = reactiveOmit(props, 'open', 'defaultOpen')
const forward = useForwardPropsEmits(delegatedProps, emits)

const router = useRouter()
const open = defineModel<boolean>('open')
const fileId = ref(props.fileName)
const slug = computed(() => slugify(fileId.value))

const files = Files.useFiles()
const existingFile = computed(() => files.value.find((file) => file.id === slug.value))

function close() {
  open.value = false
}

const valid = computed(() => {
  if (fileId.value.trim().length < 1) return false
  if (slug.value.trim().length < 1) return false
  if (existingFile.value) return false

  return true
})

function rename() {
  if (!valid.value) return

  const success = Files.renameFile(props.fileId, slug.value, fileId.value, true)
  if (!success) return

  if (props.redirectOnRename) {
    router.push(`/file/${slug.value}`)
  }
  close()
}
</script>

<template>
  <Dialog v-bind="forward" v-model:open="open">
    <DialogTrigger class="shrink-0" v-if="$slots.default">
      <slot />
    </DialogTrigger>
    <DialogScrollContent :aria-describedby="undefined">
      <form @submit.prevent="rename" class="gap-4 grid">
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
        </DialogHeader>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>File name</FieldLabel>
              <Input v-model="fileId" :placeholder="fileName" />
              <span class="text-text-light text-xs">Stored as '{{ slug }}'</span>
              <FieldError
                :errors="existingFile ? [`File already stored with name '${slug}'`] : []"
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <DialogFooter>
          <Button variant="ghost" @click="close">Close</Button>
          <Button type="submit" :disabled="!valid">Rename</Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
