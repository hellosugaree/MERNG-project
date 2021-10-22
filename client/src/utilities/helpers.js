
export const generateFileDataArray = async (fileList) => {
  const readFile = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })
  };
  const previewData = [];
  for (let i = 0; i < fileList.length; i++) {
    try {
      const file = fileList[i];
      let fileData = readFile(file);
      previewData.push(fileData);
    } catch (err) {
      console.log(err);
    }
  }
  const data = await Promise.all(previewData).then(values => values);
  return data;
};