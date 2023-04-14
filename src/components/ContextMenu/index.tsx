import { useState } from "react";
import * as ContextMenu from '@radix-ui/react-context-menu';
import { Check } from "phosphor-react";
import { Dot } from "@phosphor-icons/react";

type Props = {
  children: React.ReactNode
}
export default function CustomContextMenu({ children }: Props) {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('pedro');

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[220px] border border-zinc-200 bg-white rounded overflow-hidden p-1 shadow-lg">
          <ContextMenu.Item className="text-sm rounded flex items-center h-6 pr-1 relative pl-6 outline-none select-none hover:bg-zinc-400">
            Back <div className="ml-auto pl-5">⌘+[</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="text-sm rounded flex items-center h-6 pr-1 relative pl-6 outline-none select-none hover:bg-zinc-400" disabled>
            Foward <div className="ml-auto pl-5">⌘+]</div>
          </ContextMenu.Item>
          <ContextMenu.Item className="text-sm rounded flex items-center h-6 pr-1 relative pl-6 outline-none select-none hover:bg-zinc-400">
            Reload <div className="ml-auto pl-5">⌘+R</div>
          </ContextMenu.Item>

          <ContextMenu.Separator className="h-[1px] bg-zinc-200 m-1" />

          <ContextMenu.CheckboxItem
            className="rounded flex items-center text-sm h-6 pr-1 relative pl-6 outline-none select-none hover:bg-zinc-400"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            <ContextMenu.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
              <Check size={16} />
            </ContextMenu.ItemIndicator>
            Show Bookmarks <div className="ml-auto pl-5">⌘+B</div>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            className="rounded flex items-center text-sm h-6 pr-1 relative pl-6 outline-none select-none hover:bg-zinc-400"
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            <ContextMenu.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
              <Check size={16} />
            </ContextMenu.ItemIndicator>
            Show Full URLs
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator className="h-[1px] bg-zinc-200 m-1" />

          <ContextMenu.Label className="pl-6 text-xs text-zinc-400">People</ContextMenu.Label>
          <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
            <ContextMenu.RadioItem className="text-sm rounded flex items-center h-6 pr-1 relative pl-6 outline-none select-none hover:bg-zinc-400" value="pedro">
              <ContextMenu.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                <Dot size={24} />
              </ContextMenu.ItemIndicator>
              Pedro Duarte
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem className="text-sm rounded flex items-center h-6 pr-1 relative pl-6 outline-none select-none hover:bg-zinc-400" value="colm">
              <ContextMenu.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                <Dot size={24} />
              </ContextMenu.ItemIndicator>
              Colm Tuite
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}
