// import React, { useEffect, useRef, useState } from 'react'
// import '../App.css';


// const openWidget = (element) => {
//   // creates a widget button at the specified element
//   // window.cloudinary.applyUploadWidget(element,{ 
//   //   cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
//   //   // uploadPreset: 'blog_upload', 
//   //   cropping: true, 
//   //   sources: ['local', 'camera'],
//   //   folder: 'catch_images' }, 
//   //   (error, result) => { 
//   //     if (result) {
//   //       console.log(result)
//   //     }
//   //     if (error) {
//   //       console.log(error);
//   //     }
//   //   });
//     // open widget window manually from any event
//     window.cloudinary.openUploadWidget({
//       cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
//       maxImageFileSize: 25000000,
//       // will auto rescale before uploading if larger than specified pixel dimensions
//       maxImageWidth: 1000,
//       maxImageHeight: 1000,
//       uploadPreset: "fs_upload",
//       resourceType: 'image',
//       sources: [
//           "local",
//           "camera",
//           "facebook",
//           "google_drive",
//           "dropbox",
//           "instagram",
//           "shutterstock"
//       ],
//       showAdvancedOptions: false,
//       // cropping: true,
//       multiple: true,
//       maxFiles: 10,
//       defaultSource: "local",
//       showPoweredBy: false,
//       styles: {
//           palette: {
//               window: "#F5F5F5",
//               sourceBg: "#FFFFFF",
//               windowBorder: "#90a0b3",
//               tabIcon: "#0094c7",
//               inactiveTabIcon: "#69778A",
//               menuIcons: "#0094C7",
//               link: "#008080",
//               action: "#0000FF",
//               inProgress: "#0194c7",
//               complete: "#008080",
//               error: "#c43737",
//               textDark: "#000000",
//               textLight: "#FFFFFF"
//           },
//           fonts: {
//               default: null,
//               "'Poppins', sans-serif": {
//                   url: "https://fonts.googleapis.com/css?family=Poppins",
//                   active: true
//               }
//           }
//       }
//   },
//    (err, info) => {
//      if (!err) {    
//        console.log("Upload Widget event - ", info);
//      }
//     });
// };

// /*


// {event: "success", info: {…}}
// event: "success"
// info:
// access_mode: "public"
// asset_id: "a63ca05914d8b7e28af1d0ac0079627d"
// batchId: "uw-batch2"
// bytes: 36232
// created_at: "2021-07-09T18:06:53Z"
// etag: "17725b1a742c4ce942e622e83613ad74"
// format: "png"
// height: 590
// id: "uw-file5"
// original_extension: "PNG"
// original_filename: "calico prev"
// path: "v1625854013/fishsmart/cflem4ipa5yz86a6qlai.png"
// placeholder: false
// public_id: "fishsmart/cflem4ipa5yz86a6qlai"
// resource_type: "image"
// secure_url: "https://res.cloudinary.com/dqdt8249b/image/upload/v1625854013/fishsmart/cflem4ipa5yz86a6qlai.png"
// signature: "ee77268e2ee09eb5a6a68b2e14d14ed5f0c92f7c"
// tags: []
// thumbnail_url: "https://res.cloudinary.com/dqdt8249b/image/upload/c_limit,h_60,w_90/v1625854013/fishsmart/cflem4ipa5yz86a6qlai.png"
// type: "upload"
// url: "http://res.cloudinary.com/dqdt8249b/image/upload/v1625854013/fishsmart/cflem4ipa5yz86a6qlai.png"
// version: 1625854013
// version_id: "f7f86948111145dadb6fc56fc79f7b7c"
// width: 600
// __proto__: Object
// __proto__: Object



// */

// /*
//     reader.readAsDataURL(file);
//     reader.onloadend = (e) => {
//       // console.log(reader.result);
//       console.log(e)
//       previewData.push(reader.result);

// */

// const readFile = file => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       resolve(reader.result);
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   })
// };

// async function generatePreviewData(fileList) {
//   const previewData = [];
//   fileList.forEach(file => {
//     try {
//       let fileData = readFile(file);
//       previewData.push(fileData);
//     } catch (err) {
//       console.log(err);
//     }
//   })
//   const data = await Promise.all(previewData).then(values => values);
//   return data;
// };



// const UploadWidget = props => {

//   const uploadWidgetRef = useRef();
//   const fileInputRef = useRef();

//   const [counter, setCounter] = useState(0);
//   const [fileInputValue, setFileInputValue] = useState(null);
//   const [previewSources, setPreviewSources] = useState([]);
//   const [loadingPreview, setLoadingPreview] = useState(false);

//   // useEffect(() => {
//   //   console.log('widget load useEffect')
//   //   openWidget(uploadWidgetRef.current);
//   // }, [uploadWidgetRef, openWidget])

//   // update preview when user selects an image
//   useEffect(async () => {
//     if (fileInputValue) {
//       const previewData = await generatePreviewData(fileInputValue);
//       setPreviewSources(previewData);
//       setLoadingPreview(false);
//     }
//   }, [fileInputValue])

//   const handleFileSelect = e => {
//     // clear our previews
//     setPreviewSources([]);
//     setLoadingPreview(true);
//     setFileInputValue(e.target.files);
//   }

//   return (
//         <label className='file-input-label'>
//           Select Pictures
//           <input ref={fileInputRef} onChange={props.onChange ? props.onChange : null} type='file' name='images' multiple accept='image/*' style={{display: 'none'}} />
//         </label>
//   )
// }

// export default UploadWidget;


// /*

//     <div>
//       <div style={{display: 'flex'}}>
//         <label className='file-input-label'>
//           Choose files
//           <input ref={fileInputRef} onChange={handleFileSelect} type='file' name='images' multiple accept='image/*' style={{display: 'none'}} />
//         </label>
//       </div>
//       <div>Photos selected: {fileInputValue ? fileInputValue.length : 0}</div>
//       <div style={{height: 300, width: '100%', overflowY: 'hidden', overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'}}>
//         {previewSources && previewSources.map((image, index) => <img style={{padding: '0px 10px', borderRadius: 5, height: 250, width: 'auto', display: 'inline'}} key={index} alt='image preview' src={image} />)}
//         {loadingPreview && <div>Loading preview...</div>}
//       </div>

//       <button type='button' onClick={() => console.log(fileInputRef.current.files)}>log files</button>

//       <CreateCatchForm catchLocation={{lat : 33.497497, lng: -117.393793}} />
//     </div>

//     */