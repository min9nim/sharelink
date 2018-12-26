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
folder | file | desc
--- | --- | ---
/pages/ | * | Screen by route
/pages/ | index.js | Main screen `/`
/pages/ | login.js | Screen of `/login`
/pages/ | write.js | Screen of `/write`
/src/ | app.js | Sharelink core business logic
/src/ | restful.js | RESTful API definition referenced by the `app.js`
/comps/ | * | React-components referenced by the screen
/comps/ | Header.js| Screen common Header area
/comps/ | Layout.js| Screen layout
/comps/ | LinkLoading.js| Loading image to show while loading
/comps/ | Menu.js| Menu layer
/comps/ | Post.js| Repetitive post design shown in the list
/com/ | util.js| Utilities used by the app
/com/ | style.scss| common style of app
/static/ | * | Static resource
/server/ | app.js | customized Nextjs server 

<br>

### React component dependency
<img src="https://sharelink-nextjs.appspot.com/static/component-dependency.svg">

<br>

#### RESTful API

method | path | payload | desc
--- | --- | --- | ---
GET | /links?idx=i&cnt=n | - | get `n` lists of link from `i` index
POST | /links | linkObj | add new link
GET | /links/my | userID | get list added by me
GET | /links/like | userID | get list liked by me
GET | /links/read |  userID | get list read by me
GET | /links/toread |  userID | get list of toread
PUT | /links/like | userID | mark link liked
PUT | /links/unlike | userID | cancel like
PUT | /links/read | userID | mark link read
PUT | /links/unread | userID | cancel read
PUT | /links/toread | userID | mark link toread
PUT | /links/untoread | userID | cancel toread
PUT | /links | linkObj | update link
DELETE | links | linkID | delete link 

<br>


#### Lincense
MIT

