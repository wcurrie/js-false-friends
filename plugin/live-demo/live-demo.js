var liveDemo = (function() {
    var snippetMapping = {};
    var snippetId = 1;

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

    function exec(code) {
        var result = [];
        var console = new DummyConsole(result);
        try {
            eval(code);
            return result.join("\n");
        } catch (e) {
            return e;
        }
    }

    function codeFor(snippetId) {
        return snippetMapping[snippetId].text();
    }

    function executeSnippet(snippetId) {
        var code = codeFor(snippetId);
        $("#snippetResult-" + snippetId).text("" + exec(code));
        return false;
    }

    return {
        init: function() {
            $("pre code").each(function() {
                var $this = $(this);
                snippetMapping[snippetId] = $this;
                var demoType = $this.data("demo");
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
