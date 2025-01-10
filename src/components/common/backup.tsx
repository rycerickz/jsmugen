// "use client";

// import Engine from "@/components/engine";
// import FileManager from "@/components/file-manager";

// import { processSFF } from "@/utils/sff";

// export default function App() {
//   const onLoaded = async (files: File[]) => {
//     console.log("Files", files);

//     const sff = files.find((file) => file.name.endsWith(".sff"));

//     if (sff) {
//       const sffResult = await processSFF(sff);
//       console.log("sffResult:",sffResult);
//     }
//   };

//   return (
//     <html lang="en">
//       <body>
//         <FileManager onLoaded={onLoaded} />
//         <Engine />
//       </body>
//     </html>
//   );
// }
