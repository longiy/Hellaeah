const csInterface = new CSInterface();

// Load JSX files
function loadJSX(fileName) {
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION);
    const jsxFile = `${extensionRoot}/js/${fileName}`;
    csInterface.evalScript(`$.evalFile("${jsxFile}")`);
}

// Load both JSX files
loadJSX('trimBaby.jsx');
loadJSX('extendBaby.jsx');

function evalScript(script) {
    return new Promise((resolve, reject) => {
        csInterface.evalScript(script, (result) => {
            if (result === 'EvalScript error.') {
                reject(new Error(result));
            } else {
                resolve(result);
            }
        });
    });
}

document.getElementById('trimButton').addEventListener('click', async () => {
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Processing...';
    
    try {
        const result = await evalScript('trimBaby()');
        statusEl.textContent = result;
    } catch (error) {
        statusEl.textContent = '❌ Error: ' + error.toString();
    }
});

document.getElementById('extendButton').addEventListener('click', async () => {
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Processing...';
    
    try {
        const result = await evalScript('extendBaby()');
        statusEl.textContent = result;
    } catch (error) {
        statusEl.textContent = '❌ Error: ' + error.toString();
    }
});

window.onerror = function(msg, url, line, col, error) {
    document.getElementById('status').textContent = `Error: ${msg}\nLine: ${line}`;
    return false;
};

console.log('Panel loaded');