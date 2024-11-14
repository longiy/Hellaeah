// After Effects Script to adjust Precomp duration and preserve markers
app.beginUndoGroup("Adjust Precomp Duration");

var comp = app.project.activeItem;
if (comp && comp instanceof CompItem) {
    var layer = comp.selectedLayers[0];
    if (layer && layer.source instanceof CompItem) {
        // Store initial playhead position as a number
        var originalPlayheadPos = comp.time;
        
        // Store original inPoint and move playhead there
        var originalInPoint = layer.inPoint;
        comp.time = originalInPoint;
        
        // Get the duration
        var duration = layer.outPoint - layer.inPoint;
        
        // Get the precomp
        var precomp = layer.source;
        
        // Store markers before changing duration
        var markers = [];
        if (precomp.markerProperty) {
            var markerProp = precomp.markerProperty;
            for (var i = 1; i <= markerProp.numKeys; i++) {
                var markerTime = markerProp.keyTime(i);
                // Only store markers that fall within our new trimmed area
                if (markerTime >= originalInPoint && markerTime <= layer.outPoint) {
                    var markerValue = markerProp.keyValue(i);
                    // Store marker with its relative time from inPoint
                    markers.push({
                        time: markerTime - originalInPoint,
                        value: markerValue
                    });
                }
            }
        }
        
        // Update work area first
        precomp.workAreaStart = 0;
        precomp.workAreaDuration = duration;
        
        // Now set the new duration
        precomp.duration = duration;
        
        // Shift all layers inside the precomp
        for (var i = 1; i <= precomp.numLayers; i++) {
            var precompLayer = precomp.layer(i);
            precompLayer.startTime -= originalInPoint;
        }
        
        // Restore markers in the new timing
        if (markers.length > 0 && precomp.markerProperty) {
            var newMarkerProp = precomp.markerProperty;
            // Remove all existing markers first
            while (newMarkerProp.numKeys > 0) {
                newMarkerProp.removeKey(1);
            }
            // Add stored markers at their new relative positions
            for (var j = 0; j < markers.length; j++) {
                newMarkerProp.setValueAtTime(markers[j].time, markers[j].value);
            }
        }
        
        // Move to current CTI position
        var currentTime = comp.time;
        layer.startTime = currentTime;
        layer.inPoint = currentTime;
        layer.outPoint = currentTime + duration;
        
        // Move playhead back to original position
        comp.time = originalPlayheadPos;
        
    } else {
        alert("Please select a precomp layer.");
    }
} else {
    alert("Please select a composition.");
}

app.endUndoGroup();