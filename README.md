# PDF Test

This repository showcases a problem building a React App with an embedded React PDF Document component. In short, the PDF displays without any issues when running for local development, but doesn't display after the app has been built for production. It fails with the following error:

```
Uncaught ReferenceError: require is not defined
    at pdf.worker.min.347589700aee6bfb7b8a.js:1:21
```

This error is being thrown because the minified `pdf.worker.js` file produced by the build references hardcoded files from the hard drive of the machine that produced the build, and naturally the paths are broken when serving them statically.

### Steps to reproduce:

**First, verify that the app works fine when doing local development:**

* Make sure you are running Node 17.7.1
* Open a terminal
* Clone this repository
* `cd pdf-test`
* Run the app locally: `npm i && npm start`
* Go to `http://localhost:3000` in your browser
* You should see the PDF document render correctly (it will say "This is a test PDF document")
* Go back to your terminal and stop the npm process

**Run the production build and see the failed error:**

* Run the production build: `npm run build`
* Switch into the build directory: `cd build/`
* Serve the static files locally on port 3000: `python3 -m http.server 3000`
* Go to `http://localhost:3000` in your browser
* You will see an error saying that the PDF failed to load.
* Open your browser console. You will see an error similar to the following: `pdf.worker.min.347589700aee6bfb7b8a.js:1 Uncaught ReferenceError: require is not defined
    at pdf.worker.min.347589700aee6bfb7b8a.js:1:21`
* Go back to your terminal and stop the Python process

**Examining the minified `pdf.worker.min.js` file:**

* In your favorite code editor, open the `build/static/media/pdf.worker.min.<hash>.js` file
* Notice that all of the `require` statements reference absolute file paths from when they were built. For instance, in my minified JS file, I have require statements that look like this:

```
// Note: my local computer account is "administrator"
require("/Users/administrator/code/pdf-test/node_modules/@babel/runtime/helpers/defineProperty.js").default
```

Obviously, this is referencing the node_modules directory that is used for development. Since this is a production build, I would expect that the requires reference a static asset within the production build itself, or would be packed into the minified JS file.

### What I have already tried

I have thoroughly exhausted all of the suggestions on https://github.com/wojtekmaj/react-pdf/issues/782. None of them worked.

### Additional Info

* Node 17.7.1
* React 18.2.0
* React-PDF 7.7.1
* Python 3.12.3
* Chrome Version 124.0.6367.92 (Official Build) (x86_64)
* MacOS 14.4.1 (intel)
