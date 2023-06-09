import { useState } from "react";
import * as ContextMenu from '@radix-ui/react-context-menu';
import { Check } from "phosphor-react";
import { Dot } from "@phosphor-icons/react";
import ConfirmationDialog from "../ConfirmationDialog";

type Props = {
  children: React.ReactNode
  onDeleteAllNodes: () => void;
  onDeleteAllEdges: () => void;
  onMouseMove: (event: any) => void;
}

const handleReload = () => {
  window.location.reload();
}
export default function CustomContextMenu({ children, onDeleteAllNodes, onDeleteAllEdges, onMouseMove }: Props) {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('pedro');
  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleModal(open: boolean) {
    setIsModalOpen(open)
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger onMouseMove={onMouseMove}>{children}</ContextMenu.Trigger>

      <ConfirmationDialog handleClose={handleModal} isOpen={isModalOpen} onConfirm={onDeleteAllNodes} />

      <ContextMenu.Portal>
        <ContextMenu.Content className="contextContent">

          <ContextMenu.Item disabled className="contextItem">
            Back <div className="contextItemRight">⌘+[</div>
          </ContextMenu.Item>
          <ContextMenu.Item disabled className="contextItem">
            Foward <div className="contextItemRight">⌘+]</div>
          </ContextMenu.Item>
          <ContextMenu.Item onClick={handleReload} className="contextItem">
            Reload <div className="contextItemRight">⌘+R</div>
          </ContextMenu.Item>

          <ContextMenu.Separator className="separator" />

          <ContextMenu.Item onClick={() => setIsModalOpen(true)} className="contextItem hover:bg-red-600">
              Delete all Nodes and Edges
          </ContextMenu.Item>

          <ContextMenu.Item onClick={onDeleteAllEdges} className="contextItem hover:bg-red-600">
            Delete all Edges
          </ContextMenu.Item>

          <ContextMenu.Separator className="separator" />

          <ContextMenu.CheckboxItem
            className="contextItem"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
            disabled
          >
            <ContextMenu.ItemIndicator className="itemIndicator">
              <Check size={16} />
            </ContextMenu.ItemIndicator>
            Show Bookmarks <div className="contextItemRight">⌘+B</div>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            className="contextItem"
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            <ContextMenu.ItemIndicator className="itemIndicator">
              <Check size={16} />
            </ContextMenu.ItemIndicator>
            Show Full URLs
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator className="separator" />

          <ContextMenu.Label className="label">People</ContextMenu.Label>
          <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
            <ContextMenu.RadioItem className="contextItem" value="pedro">
              <ContextMenu.ItemIndicator className="itemIndicator">
                <Dot size={24} />
              </ContextMenu.ItemIndicator>
              Pedro Duarte
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem className="contextItem" value="colm">
              <ContextMenu.ItemIndicator className="itemIndicator">
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
