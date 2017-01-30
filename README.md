#pathway-commons

##Build
The following tools are required to start the build process: nodejs, and npm

For OSX, run the following commands in order to install these tools. (Source: http://blog.teamtreehouse.com/install-node-js-npm-mac)

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node
```

Follow the steps below to download and install application

1. Download or clone repository from github into any directory
2. Run ```npm install``` in the directory in order to install all node dependencies

This project uses npm as a build tool. The following commands are available:

####document
Run ```npm run document``` to generate documentation and place resulting html files in the docs folder

####build
Run ```npm run build``` to do a production build of the application and output the result to the public folder.

####start
Run ```npm run start``` to document and then build the application
