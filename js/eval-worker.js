function DummyConsole(result) {
    function stringify(v) {
        try {
            return JSON.stringify(v);
        } catch (e) {
            return "" + v;
        }
    }

    this.log = function(v) {
        if (typeof v === 'object') {
            result.push(stringify(v));
        } else {
            result.push("" + v);
        }
    };
}

function exec(code, context) {
    var result = [];
    var theConsole = context.console;
    context.console = new DummyConsole(result);
    try {
        eval(code);
        return result.join("\n");
    } catch (e) {
        return "" + e;
    } finally {
        context.console = theConsole;
    }
}

// only add listener when running as a webworker
if (typeof self !== "undefined") {
    self.addEventListener("message", function(e) {
        var result = exec(e.data, self);
        self.postMessage(result);
        self.close();
    }, false);
}
