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
//生成hashcode
export function generatehashcode (file) {
  return new Promise(resolve => {
    var fileReader = new FileReader();
    var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
    var chunkSize = 2097152;
    var chunks = Math.ceil(file.size / chunkSize);
    var currentChunk = 0;
    var spark = new SparkMD5();
    fileReader.onload = function (e) {
      console.log("read chunk nr", currentChunk + 1, "of", chunks);
      spark.appendBinary(e.target.result);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };

    function loadNext() {
      var start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsBinaryString(blobSlice.call(file, start, end));
    };
    loadNext();
  });
}