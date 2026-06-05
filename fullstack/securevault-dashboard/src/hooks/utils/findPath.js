export function findPath(nodes, targetId, trail = []) {
  for (const node of nodes) {
    const current = [...trail, node];
    if (node.id === targetId) return current;
    if (node.children) {
      const result = findPath(node.children, targetId, current);
      if (result) return result;
    }
  }
  return null;
}
