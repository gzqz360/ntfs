# ntfs

> This is a NTFS mount tool based on electronic Vue framework, which helps users mount NTFS disk to solve the problem that NTFS disk can only be read but not written in MAC system,
>As well as unload NTFS disk, format, check, repair disk and other issues
---
###Environmental dependence：
```
node v14.15.4
```
###Front end frame：
```
electron-vue
```
###Install dependencies：
```
npm install
```
###Running projects：
```
npm run dev
```
###Pack：
```
electron-builder --mac --x64
```
###Project directory：
```
├─ .electron-vue

│ └─ build.js    //Called when packaging

├─ build 

│ └─ icons/ 

├─ dist 

│ ├─ electron/ 

│ └─ web/ 

├─ node_modules/ 

├─ src 

│ ├─ main  //Main process

│ │ ├─ index.dev.js 

│ │ └─ index.js 

│ ├─ renderer   //Rendering Progress

│ │ ├─ assets    //resource file

│ │ ├─ components   //assembly

│ │ ├─ lang   //language pack

│ │ ├─ router     //router

│ │ ├─ store 

│ │ ├─ utils    //logic processing

│ │ ├─ view   //view

│ │ ├─ App.vue 

│ │ └─ main.js 

│ └─ index.ejs 

├─ static

├─ .babelrc 

├─ .gitignore 

├─ .eslintrc.js 

├─ .gitignore 

├─ package.json 

└─ README.md


---


