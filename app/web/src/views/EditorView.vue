<script setup lang="ts">
import { EditorBar } from '@/components/editor-bar'
import { Shape } from '@/components/shape'
import { SideBar } from '@/components/side-bar'
import { Toolbox } from '@/components/toolbox'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupComboboxInput,
  InputGroupInput,
  InputGroupSelectTrigger,
  InputGroupSelectTriggerIcon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowUpIcon, CheckIcon, InfoIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const isLeftSideBarOpen = ref(true)
const isRightSideBarOpen = ref(true)

const gridTemplateColumns = computed(() => {
  const leftWidth = isLeftSideBarOpen.value ? '16rem' : '44px'
  const rightWidth = isLeftSideBarOpen.value ? '24rem' : 'calc(24rem + 16rem - 44px)'

  if (isRightSideBarOpen.value) {
    return `${leftWidth} 1fr ${rightWidth}`
  }
  return `${leftWidth} 1fr`
})
</script>

<template>
  <EditorBar />
  <main class="gap-3 grid p-1" :style="{ gridTemplateColumns }">
    <SideBar :child-class="!isLeftSideBarOpen && 'h-full justify-center'">
      <Shape :open="isLeftSideBarOpen" shape="node" @update:open="isLeftSideBarOpen = $event" />
      <Toolbox :open="isLeftSideBarOpen" @update:open="isLeftSideBarOpen = $event" />
    </SideBar>
    <div class="space-y-3">
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
      <div class="bg-background mx-auto rounded-lg max-w-md h-40"></div>
    </div>
    <SideBar v-if="isRightSideBarOpen">
      <div class="space-y-2 bg-background p-2 rounded-lg h-screen">
        <Checkbox />
        <Textarea placeholder="Enter your text here..." />
        <RadioGroup default-value="comfortable">
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="r1" value="default" />
            <Label for="r1">Default</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="r2" value="comfortable" />
            <Label for="r2">Comfortable</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="r3" value="compact" />
            <Label for="r3">Compact</Label>
          </div>
        </RadioGroup>
        <InputGroup>
          <InputGroupInput type="number" step="0.1" placeholder="ex:alice" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" variant="ghost" color="danger">
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="ex:alice" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" variant="ghost" color="danger">
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <div class="flex gap-2">
          <Button size="sm" variant="outline"> Add </Button>
          <Button size="sm">
            <XIcon />
          </Button>
          <Button size="icon-sm">
            <XIcon />
          </Button>
          <Button size="icon">
            <XIcon />
          </Button>
          <Button> <XIcon /> some text </Button>
        </div>
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end"> 12 results </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="example.com" class="pl-1!" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger as-child>
                <InputGroupButton class="rounded-full" size="icon-sm" variant="ghost">
                  <InfoIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupTextarea placeholder="Ask, Search or Chat..." />
          <InputGroupAddon align="block-end">
            <InputGroupButton variant="outline" size="icon-sm" class="rounded-full">
              <PlusIcon />
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <InputGroupButton variant="ghost"> Auto </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" class="[--radius:0.95rem]">
                <DropdownMenuItem>Auto</DropdownMenuItem>
                <DropdownMenuItem>Agent</DropdownMenuItem>
                <DropdownMenuItem>Manual</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupText class="ml-auto"> 52% used </InputGroupText>
            <Separator orientation="vertical" class="h-4!" />
            <InputGroupButton variant="default" class="rounded-full" size="icon-sm">
              <ArrowUpIcon />
              <span class="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="@shadcn" />
          <InputGroupAddon align="inline-end">
            <div
              class="flex justify-center items-center bg-primary rounded-full size-4 text-primary-foreground"
            >
              <CheckIcon class="size-4" />
            </div>
          </InputGroupAddon>
        </InputGroup>

        <Combobox>
          <ComboboxAnchor>
            <InputGroup>
              <InputGroupComboboxInput placeholder="Search..." />

              <InputGroupAddon align="inline-end">
                <ComboboxTrigger />
                <InputGroupButton size="icon-sm" variant="ghost" color="danger">
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </ComboboxAnchor>

          <ComboboxList>
            <ComboboxEmpty> No results. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem value="red">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span>Red</span>
                </div>
              </ComboboxItem>

              <ComboboxItem value="blue">
                <div class="flex items-center gap-2">
                  <ComboboxItemIndicator />
                  <span>Blue</span>
                </div>
              </ComboboxItem>
            </ComboboxGroup>
            <ComboboxSeparator />
          </ComboboxList>
        </Combobox>

        <Select>
          <InputGroup>
            <InputGroupSelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </InputGroupSelectTrigger>
            <InputGroupAddon align="inline-end">
              <InputGroupSelectTriggerIcon />
              <InputGroupButton size="icon-sm" variant="ghost" color="danger">
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <SelectContent>
            <SelectItem value="apple"> Apple </SelectItem>
            <SelectItem value="banana"> Banana </SelectItem>
            <SelectItem value="blueberry"> Blueberry </SelectItem>
            <SelectItem value="grapes"> Grapes </SelectItem>
            <SelectItem value="pineapple"> Pineapple </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </SideBar>
  </main>
</template>
