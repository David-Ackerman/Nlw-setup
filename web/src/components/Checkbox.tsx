import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";

interface CheckboxProps {
  title: string;
  checked?: boolean;
  onCheckedChange: () => void;
}

export function Checkbox({ title, onCheckedChange }: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      onCheckedChange={onCheckedChange}
      className='flex items-center gap-3 group'
    >
      <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
        <RadixCheckbox.Indicator>
          <Check size={20} className='text-white' />
        </RadixCheckbox.Indicator>
      </div>
      <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
        {title}
      </span>
    </RadixCheckbox.Root>
  );
}

export function CheckboxForm({
  title,
  onCheckedChange,
  checked,
}: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      onCheckedChange={onCheckedChange}
      checked={checked}
      className='flex items-center gap-3 group'
    >
      <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
        <RadixCheckbox.Indicator>
          <Check size={20} className='text-white' />
        </RadixCheckbox.Indicator>
      </div>
      <span className='text-white leading-tight'>{title}</span>
    </RadixCheckbox.Root>
  );
}
