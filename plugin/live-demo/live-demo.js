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
                    var thisSnippet = snippetId++;
                    snippetMapping[thisSnippet] = $this;
                    var click;
                    if (demoType === "show-output") {
                        $('<div class="fragment"><pre class="evalResult"><code id="snippetResult-' + thisSnippet + '"></code></pre></div>').insertAfter(this.parentNode);
                        executeSnippet(thisSnippet);
                        click = 'liveDemo.execute(' + thisSnippet + ')';
                    } else {
                        click = 'liveDemo.show(' + thisSnippet + ')';
                    }
                    $('<a class="btn demoButton" href="#" onclick="return ' + click + '"><i class="icon-play"></i></a>').appendTo(this);
                    $this.keydown(function(e) {
                        if (e.which === 13 && e.metaKey) {
                            executeSnippet(thisSnippet)
                        }
                    })
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
