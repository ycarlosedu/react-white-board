export const saveItems = (name: string, item: any) => {
  localStorage.setItem(name, JSON.stringify(item))
}

export const getItems = (name: string) => {
  const items = localStorage.getItem(name) || ''
  return JSON.parse(items)
}

export const LOCAL_STORAGE = {
  NODES: 'NODES',
  EDGES: 'EDGES'
}