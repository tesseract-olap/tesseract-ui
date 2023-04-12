const SCRIPT_TYPE = "application/javascript";

let Worker = typeof window === "object" ? window.Worker : null;

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
    const BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    const blob = new BlobBuilder();
    blob.append(str);
    return URL.createObjectURL(blob.getBlob(SCRIPT_TYPE));
  }
}

/**
 * Returns a wrapper around Web Worker code that is constructible.
 */
export function shimWorker(fn: (self: Worker) => void) {

  /** */
  function ShimWorker(forceFallback?: boolean) {
    const that = this;

    if (Worker && !forceFallback) {
      const source = fn.toString().trim();
      const objURL = createSourceObject(`(${source})(this);`);

      this._worker = new Worker(objURL);
      URL.revokeObjectURL(objURL);
      return;
    }

    const threadShim = {
      onmessage(evt) {},
      onmessageerror(evt) {},
      postMessage(m) {
        console.debug("Message from shim worker to main:", m);
        setTimeout(() => {
          that.onmessage({data: m, target: threadShim});
        });
      },
      terminate() {
        console.debug("Worker terminated by shim worker.");
      }
    };

    fn.call(threadShim, threadShim);

    this.threadShim = threadShim;
    this.isThisThread = true;
    this.onerror = undefined;
    this.onmessage = undefined;
    this.onmessageerror = undefined;
  }

  Object.defineProperties(ShimWorker.prototype, {
    onerror: {
      get() {
        return this._worker.onerror;
      },
      set(fn) {
        this._worker.onerror = fn;
      }
    },
    onmessage: {
      get() {
        return this._worker.onmessage;
      },
      set(fn) {
        this._worker.onmessage = fn;
      }
    },
    onmessageerror: {
      get() {
        return this._worker.onmessageerror;
      },
      set(fn) {
        this._worker.onmessageerror = fn;
      }
    }
  });

  ShimWorker.prototype.postMessage = function(msg) {
    const worker = this._worker;
    if (worker) return worker.postMessage(msg);

    setTimeout(() =>  {
      this?.threadShim?.onmessage({data: msg, target: this});
    });
    return console.debug("Message from main thread to ShimWorker:", msg);
  };

  ShimWorker.prototype.terminate = function() {
    const worker = this._worker;
    if (worker) return worker.terminate();

    return console.debug("ShimWorker terminated by main.");
  };

  return ShimWorker;
}
