import * as RadixTooltip from '@radix-ui/react-tooltip';

type Props = {
  text: string;
  children: React.ReactNode
}
export default function Tooltip({children, text}: Props) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content 
            className="bg-white border border-zinc-200 px-3 py-2 rounded shadow-md" 
            sideOffset={5}
          >
            {text}
            <RadixTooltip.Arrow className="TooltipArrow" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
