var liveDemo = (function() {
    var snippetMapping = {};
    var snippetId = 1;

    function codeFor(snippetId) {
        return snippetMapping[snippetId].text();
    }

    function showExecutionResult(snippetId, result) {
        $("#snippetResult-" + snippetId).text("" + result);
    }

    function executeSnippet(snippetId) {
        var code = codeFor(snippetId);
        if (snippetMapping[snippetId].data("exec-inline") === true) {
            showExecutionResult(snippetId, exec(code, window));
        } else {
            var worker = new Worker("js/eval-worker.js");
            worker.postMessage(code);
            worker.addEventListener("message", function(e) {
                showExecutionResult(snippetId, e.data);
            });
        }
        return false;
    }

    return {
        init: function() {
            $("pre code").each(function() {
                var $this = $(this);
                var demoType = $this.data("demo");
                if (demoType) {
                    snippetMapping[snippetId] = $this;
                    var click;
                    if (demoType === "show-output") {
                        $('<div class="fragment"><pre class="evalResult"><code id="snippetResult-' + snippetId + '"></code></pre></div>').insertAfter(this.parentNode);
                        executeSnippet(snippetId);
                        click = 'liveDemo.execute(' + snippetId + ')';
                    } else {
                        click = 'liveDemo.show(' + snippetId + ')';
                    }
                    $('<a class="btn demoButton" href="#" onclick="return ' + click + '"><i class="icon-play"></i></a>').appendTo(this);
                    snippetId++;
                }
            });
        },
        show: function(snippetId) {
            $("#demo-frame").attr("src", "data:text/html," + codeFor(snippetId));
            $("#demo-modal").modal("show");
            return false;
        },
        execute: executeSnippet
    }
})();
