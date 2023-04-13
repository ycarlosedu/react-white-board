import { useEffect } from "react";
import { NodesTypes } from "../components/Canvas";
import { Node, ReactFlowStore, useStoreApi } from "reactflow";

const useSelectNode = (
  element: Node | undefined,
  store: any
) => {
  store.setState((prevState: ReactFlowStore) => {
    return {
      ...prevState, 
      elementSelected: element
    }
  })
};

export default useSelectNode;