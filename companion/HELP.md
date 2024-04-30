# Generic HTTP Server

Will server files from the given folder to `/instance/<module-label>`

## Allowed file types

- .html
- .js
- .css

## Complex website options

if you are creating a complex website notice that the url base is no longer just `/` but `/instance/<module-label>`
for example if building a react site with vite you need to set a new base in the vite.config file
