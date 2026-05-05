import { useState, useMemo } from "react";

function searchTree(nodes, query, ancestorIds = []) {
  let matchedIds = new Set();
  let expandIds  = new Set();

  for (const node of nodes) {
    const matches = node.name.toLowerCase().includes(query.toLowerCase());

    if (node.type === "folder" && node.children) {
      const childResult = searchTree(node.children, query, [...ancestorIds, node.id]);
      childResult.matchedIds.forEach((id) => matchedIds.add(id));
      childResult.expandIds.forEach((id)  => expandIds.add(id));

      if (childResult.matchedIds.size > 0) {
        expandIds.add(node.id);
        ancestorIds.forEach((id) => expandIds.add(id));
      }
    }

    if (matches) {
      matchedIds.add(node.id);
      ancestorIds.forEach((id) => expandIds.add(id));
    }
  }

  return { matchedIds, expandIds };
}

export function useSearch(tree) {
  const [query, setQuery] = useState("");

  const { matchedIds, expandIds } = useMemo(() => {
    if (!query.trim()) return { matchedIds: null, expandIds: null };
    return searchTree(tree, query.trim());
  }, [query, tree]);

  return { query, setQuery, matchedIds, expandIds };
}
