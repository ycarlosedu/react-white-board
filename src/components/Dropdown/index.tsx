import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Tooltip from '../Tooltip';

type ItemsProps = {
  text: string;
  onClick: () => void;
}

type Props = {
  children: React.ReactNode;
  items: ItemsProps[];
  tooltip?: string;
}
export default function Dropdown({children, items, tooltip = ''}: Props) {
  return (
    <DropdownMenu.Root>

      {tooltip ? (
        <Tooltip text={tooltip}>
          <DropdownMenu.Trigger asChild>
            {children}
          </DropdownMenu.Trigger>
        </Tooltip>
      ) : (
        <DropdownMenu.Trigger asChild>
          {children}
        </DropdownMenu.Trigger>
      )}

      <DropdownMenu.Portal>
        <DropdownMenu.Content data-side='top' className="bg-white min-w-[100px] rounded p-1" sideOffset={5}>
          {items?.map((item) => (
            <DropdownMenu.Item key={item.text} className="hover:bg-zinc-200 p-2 rounded">
              <button onClick={item.onClick}>
                {item.text}
              </button>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
