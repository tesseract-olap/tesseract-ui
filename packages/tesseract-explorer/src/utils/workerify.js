const TARGET = typeof Symbol === "undefined" ? "__target" : Symbol();
const SCRIPT_TYPE = "application/javascript";
const BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
const URL = window.URL || window.webkitURL;

let Worker = window.Worker;

if (Worker) {
  let testWorker;
  const objURL = createSourceObject("self.onmessage = function () {}");
  const testArray = new Uint8Array(1);

  try {
    // No workers via blobs in Edge 12 and IE 11 and lower :(
    if ((/(?:Trident|Edge)\/(?:[567]|12)/i).test(navigator.userAgent)) {
      throw new Error("Not available");
    }
    testWorker = new Worker(objURL);

    // Native browser on some Samsung devices throws for transferables, let's detect it
    testWorker.postMessage(testArray, [testArray.buffer]);
  }
  catch (e) {
    Worker = null;
  }
  finally {
    URL.revokeObjectURL(objURL);
    if (testWorker) {
      testWorker.terminate();
    }
  }
}

/** */
function createSourceObject(str) {
  try {
    return URL.createObjectURL(new Blob([str], {type: SCRIPT_TYPE}));
  }
  catch (e) {
    const blob = new BlobBuilder();
    blob.append(str);
    return URL.createObjectURL(blob.getBlob(SCRIPT_TYPE));
  }
}

/**
 * Returns a wrapper around Web Worker code that is constructible.
 */
export function shimWorker(fn) {
  return function ShimWorker(forceFallback) {
    const workerInstance = this;

    if (Worker && !forceFallback) {
      const source = fn.toString().replace(/^.+?\{([\s\S]+)\}/, "$1").trim();
      const objURL = createSourceObject(`var self = this; ${source}`);

      this[TARGET] = new Worker(objURL);
      URL.revokeObjectURL(objURL);
      return this[TARGET];
    }

    const selfShim = {
      postMessage(m) {
        console.debug("Message from shim worker to main thread:", m);
        if (workerInstance.onmessage) {
          setTimeout(() => {
            workerInstance.onmessage({data: m, target: selfShim});
          });
        }
      },
      terminate() {
        console.debug("Worker terminated by shim worker.");
      }
    };

    fn.call(selfShim, selfShim);
    this.postMessage = function(m) {
      console.debug("Message from main thread to shim worker:", m);
      setTimeout(() =>  {
        selfShim.onmessage({data: m, target: workerInstance});
      });
    };
    this.terminate = function() {
      console.debug("Worker terminated by main thread.");
    };
    this.isThisThread = true;
  };
}
