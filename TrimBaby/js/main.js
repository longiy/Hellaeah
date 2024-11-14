const csInterface = new CSInterface();

function evalScript(script) {
    return new Promise((resolve, reject) => {
        csInterface.evalScript(script, (result) => {
            console.log('Script result:', result); // Debug log
            if (result === 'EvalScript error.') {
                reject(new Error(result));
            } else {
                resolve(result);
            }
        });
    });
}

// Add click handler
document.getElementById('trimButton').addEventListener('click', async () => {
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Processing...';
    
    try {
        console.log('Executing script...'); // Debug log
        const result = await evalScript(getTrimBabyScript());
        console.log('Script completed:', result); // Debug log
        statusEl.textContent = result;
    } catch (error) {
        console.error('Script error:', error); // Debug log
        statusEl.textContent = '❌ Error: ' + error.toString();
    }
});

// Add debug info
window.onerror = function(msg, url, line, col, error) {
    document.getElementById('status').textContent = `Error: ${msg}\nLine: ${line}`;
    console.error('Window error:', msg, url, line, col, error);
    return false;
};

// Log startup
console.log('Panel loaded');