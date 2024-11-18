export function removeEmptyProps(obj) {
  for (const key in obj) {
    if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
      delete obj[key]
    }
  }
  return obj
}
export function getImageUrl(name) {
  return new URL(
    // 本地资源路径
    `../assets/images/${name}`,
    import.meta.url
  );
};