<script setup lang="ts">
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldSetCollapsible,
  FieldSetTrigger,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
import { InputList } from '@/components/ui/input-list'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowUpIcon, CheckIcon, InfoIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-vue-next'
import { CollapsibleContent } from 'reka-ui'
import { ref } from 'vue'

let nextEntryId = 0

type PatternEntry = {
  id: number
  pattern: string
  flags: string
}

const createPatternEntry = (): PatternEntry => ({
  id: nextEntryId++,
  pattern: '',
  flags: '',
})

const patternEntries = ref<PatternEntry[]>([createPatternEntry()])

type ClassEntry = {
  id: number
  class: string
}

const createClassEntry = (): ClassEntry => ({
  id: nextEntryId++,
  class: '',
})

const classEntries = ref<ClassEntry[]>([createClassEntry()])
</script>

<template>
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
    <Button size="sm" variant="outline" color="background-blue"> Add </Button>
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
            <InfoIcon />
            <span> Red</span>
          </div>
        </ComboboxItem>

        <ComboboxItem value="blue">
          <div class="flex items-center gap-2">
            <ComboboxItemIndicator />
            <InfoIcon />
            <span> Blue</span>
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

  <FieldGroup>
    <FieldSetCollapsible>
      <FieldSetTrigger>
        <FieldLegend>Payment Method </FieldLegend>
        <FieldDescription>
          All transactions are secure and encrypted All transactions are secure and encrypted All
          transactions are secure and encrypted
        </FieldDescription>
      </FieldSetTrigger>
      <CollapsibleContent>
        <FieldGroup>
          <Field>
            <FieldLabel for="checkout-7j9-card-name-43j">
              Name on Card

              <Tooltip>
                <TooltipTrigger as-child><InfoIcon /></TooltipTrigger>
                <TooltipContent>This is content in a tooltip.</TooltipContent>
              </Tooltip>
            </FieldLabel>
            <Input id="checkout-7j9-card-name-43j" placeholder="Evil Rabbit" required />
          </Field>
          <Field>
            <FieldLabel for="checkout-7j9-card-number-uw1"> Card Number </FieldLabel>
            <Input id="checkout-7j9-card-number-uw1" placeholder="1234 5678 9012 3456" required />
            <FieldDescription> Enter your 16-digit card number </FieldDescription>
          </Field>
          <div class="gap-1 grid grid-cols-3">
            <Field>
              <FieldLabel for="checkout-exp-month-ts6"> Month </FieldLabel>
              <Select default-value="">
                <SelectTrigger id="checkout-exp-month-ts6">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01"> 01 </SelectItem>
                  <SelectItem value="02"> 02 </SelectItem>
                  <SelectItem value="03"> 03 </SelectItem>
                  <SelectItem value="04"> 04 </SelectItem>
                  <SelectItem value="05"> 05 </SelectItem>
                  <SelectItem value="06"> 06 </SelectItem>
                  <SelectItem value="07"> 07 </SelectItem>
                  <SelectItem value="08"> 08 </SelectItem>
                  <SelectItem value="09"> 09 </SelectItem>
                  <SelectItem value="10"> 10 </SelectItem>
                  <SelectItem value="11"> 11 </SelectItem>
                  <SelectItem value="12"> 12 </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel for="checkout-7j9-exp-year-f59"> Year </FieldLabel>
              <Select default-value="">
                <SelectTrigger id="checkout-7j9-exp-year-f59">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024"> 2024 </SelectItem>
                  <SelectItem value="2025"> 2025 </SelectItem>
                  <SelectItem value="2026"> 2026 </SelectItem>
                  <SelectItem value="2027"> 2027 </SelectItem>
                  <SelectItem value="2028"> 2028 </SelectItem>
                  <SelectItem value="2029"> 2029 </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel for="checkout-7j9-cvv"> CVV </FieldLabel>
              <Input id="checkout-7j9-cvv" placeholder="123" required />
            </Field>
            <FieldError class="col-span-full">The year is invalid.</FieldError>
          </div>
        </FieldGroup>
      </CollapsibleContent>
    </FieldSetCollapsible>
    <FieldSeparator />
    <FieldSet>
      <FieldLegend>Billing Address</FieldLegend>
      <FieldDescription> The billing address associated with your payment method </FieldDescription>
      <FieldGroup>
        <Field orientation="horizontal">
          <Checkbox id="checkout-7j9-same-as-shipping-wgm" :default-value="true" />
          <FieldLabel for="checkout-7j9-same-as-shipping-wgm" class="font-normal">
            Same as shipping address
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel for="checkout-7j9-optional-comments"> Comments </FieldLabel>
          <Textarea
            id="checkout-7j9-optional-comments"
            placeholder="Add any additional comments"
            class="resize-none"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
    <Field orientation="horizontal">
      <Button type="submit"> Submit </Button>
      <Button variant="outline" type="button"> Cancel </Button>
    </Field>
  </FieldGroup>

  <FieldSet
    ><FieldGroup>
      <Field>
        <FieldLabel> Class </FieldLabel>
        <InputList
          v-model="classEntries"
          :min="0"
          :max="5"
          :create="createClassEntry"
          :get-key="(entry: ClassEntry) => entry.id"
          v-slot="{ entry, remove, isRemovable }"
        >
          <InputGroup>
            <InputGroupInput v-model="entry.class" placeholder="Class (e.g. Person)" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                variant="ghost"
                color="danger"
                v-if="isRemovable"
                @click="remove"
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </InputList>
      </Field>
    </FieldGroup>
    <FieldGroup>
      <Field class="gap-0.5 grid grid-cols-[1fr_auto]">
        <div class="grid grid-cols-subgrid col-span-2">
          <FieldLabel> Patterns </FieldLabel>
          <FieldLabel v-if="patternEntries.length > 0"> Flags </FieldLabel>
        </div>
        <InputList
          v-model="patternEntries"
          :min="0"
          :max="1"
          :create="createPatternEntry"
          :get-key="(entry: PatternEntry) => entry.id"
          v-slot="{ entry, remove, isRemovable }"
        >
          <div class="grid grid-cols-subgrid col-span-2">
            <InputGroup>
              <InputGroupInput v-model="entry.pattern" placeholder="Pattern (e.g. [a-b])" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  color="danger"
                  type="button"
                  v-if="isRemovable"
                  @click="remove"
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <Select v-model="entry.flags">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Flags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none"> None </SelectItem>
                <SelectItem value="i"> i </SelectItem>
                <SelectItem value="m"> m </SelectItem>
                <SelectItem value="g"> g </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </InputList>
      </Field>
    </FieldGroup>
  </FieldSet>
</template>
