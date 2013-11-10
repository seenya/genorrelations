healthhack2013
==============

Setting up the dev environment:
* Install git
* Download the repo - git clone git@github.com:hqtan/healthhack2013.git
* Install node http://nodejs.org
* Open terminal to the root directory of the repository
* npm install
* node app.js
* navigate to http://localhost:3000


Importing Data
--------------
Data is assumed to be in the format: 
`["gene1", "gene2", "etc"][[geneIndex1, geneIndex2, correlation][repeat pattern]]`
e.g.
`["Pomp", "Blvra", "net1"][[0, 1, 0.7][1, 2, -0.7]]` - means Pomp has a correlation of 0.7 to Blvra.
