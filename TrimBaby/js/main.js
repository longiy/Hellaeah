const csInterface = new CSInterface();

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
        const result = await evalScript(getTrimBabyScript());
        statusEl.textContent = result;
    } catch (error) {
        statusEl.textContent = '❌ Error: ' + error.toString();
    }
});

document.getElementById('extendButton').addEventListener('click', async () => {
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Processing...';
    
    try {
        const result = await evalScript(getExtendBabyScript());
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