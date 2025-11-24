<script setup lang="ts">
import { Separator } from '@/components/separator'
import { Button } from '@/components/ui/button'
import { DownloadIcon, EyeIcon } from 'lucide-vue-next'
</script>

<template>
  <header class="flex justify-between items-center bg-background px-10 py-2 w-full">
    <div class="flex flex-col text-branding">
      <h1 class="font-bold text-3xl leading-none">SHACL Form Editor</h1>
      <p class="leading-none tracking-wider">Build Validation Schemas Visually</p>
    </div>
    <div class="flex gap-2">
      <Button color="background-highlighted" size="wide">
        <EyeIcon />
        Preview
      </Button>
      <Button size="wide">
        <DownloadIcon />
        Export Schema
      </Button>
    </div>
  </header>
  <Separator />
</template>
