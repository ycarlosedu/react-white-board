export const saveItems = (name: string, item: any) => {
  localStorage.setItem(name, JSON.stringify(item))
}

export const getItems = (name: string, defaultValue: any = '') => {
  const items = localStorage?.getItem(name)
  return items ? JSON.parse(items) : defaultValue;
}

export const LOCAL_STORAGE = {
  NODES: 'NODES',
  EDGES: 'EDGES'
}