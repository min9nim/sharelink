# sharelink
An online bookmarking service that lets you share and manage useful posts with simple links

<https://sharelink-nextjs.appspot.com/>

<br>

#### Technical stack
- FrontEnd: ES6, Next, React, MobX, scss
- BackEnd: express, mongoose
- DB: MongoDB
- Hosting: Google cloud platform

<br>

#### Backend repository
<https://github.com/min9nim/sharelink-mongoose>

<br>

#### Folder Description

path | file | desc
--- | --- | ---
/pages/ | * | Screen by route
/pages/ | index.js | Main screen `/`
/pages/ | login.js | Screen of `/login`
/pages/ | write.js | Screen of `/write`
/src/ | app.js | Sharelink core business logic
/src/ | restful.js | RESTful API definition referenced by the `app.js`
/comps/ | * | React-components referenced by the screen
/comps/ | Header.js| Screen common Header ares
/comps/ | Layout.js| Screen layout
/comps/ | LinkLoading.js| Loading image to show while loading
/comps/ | Menu.js| Menu layer
/comps/ | Post.js| Repetitive post design shown in the list
/com/ | util.js| Utilities used by the app
/com/ | style.scss| common style of app
/static/ | * | Static resource


<br>

#### Lincense
MIT

