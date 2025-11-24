<script setup lang="ts">
import { Separator } from '@/components/separator'
import { FolderGit } from 'lucide-vue-next'
</script>

<template>
  <footer class="flex flex-col items-center bg-background px-10 py-2 w-full text-xs">
    <a
      href="https://github.com/DJ1TJOO/shacl-form-editor"
      target="_blank"
      class="font-bold text-branding"
    >
      SHACL Form Editor v0.0.0
      <FolderGit class="inline-block size-4" />
    </a>
    <span>
      Created by
      <a href="https://github.com/DJ1TJOO" target="_blank" class="font-bold text-branding"
        >Thomas (DJ1TJOO)</a
      >
    </span>
    <span
      >Under
      <a
        href="https://github.com/DJ1TJOO/shacl-form-editor/blob/main/LICENSE"
        target="_blank"
        class="font-bold text-branding"
        >MIT License</a
      ></span
    >
  </footer>
  <Separator />
</template>
