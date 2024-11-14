// extendBaby.jsx
function extendBaby() {
    app.beginUndoGroup("Extend and Offset Composition");
    
    var compA = app.project.activeItem;
    if (compA && compA instanceof CompItem) {
        var selectedLayer = compA.selectedLayers[0];
        if (selectedLayer) {
            var compADuration = compA.duration;
            var originalInPoint = selectedLayer.inPoint;
            var timeOffset = originalInPoint;
            
            if (selectedLayer.source instanceof CompItem) {
                var compB = selectedLayer.source;
                var markers = [];
                
                if (compB.markerProperty) {
                    var markerProp = compB.markerProperty;
                    for (var i = 1; i <= markerProp.numKeys; i++) {
                        markers.push({
                            time: markerProp.keyTime(i),
                            value: markerProp.keyValue(i)
                        });
                    }
                }
                
                var layersOriginalState = [];
                for (var i = 1; i <= compB.numLayers; i++) {
                    var layer = compB.layer(i);
                    layersOriginalState.push({
                        index: i,
                        startTime: layer.startTime,
                        inPoint: layer.inPoint,
                        outPoint: layer.outPoint
                    });
                }
                
                compB.duration = compADuration;
                
                for (var i = 0; i < layersOriginalState.length; i++) {
                    var originalState = layersOriginalState[i];
                    var layer = compB.layer(originalState.index);
                    
                    layer.startTime = originalState.startTime + timeOffset;
                    
                    if (originalState.inPoint < compADuration) {
                        layer.inPoint = Math.max(0, originalState.inPoint + timeOffset);
                    }
                    if (originalState.outPoint > 0) {
                        layer.outPoint = Math.min(compADuration, originalState.outPoint + timeOffset);
                    }
                }
                
                if (markers.length > 0 && compB.markerProperty) {
                    var newMarkerProp = compB.markerProperty;
                    while (newMarkerProp.numKeys > 0) {
                        newMarkerProp.removeKey(1);
                    }
                    for (var j = 0; j < markers.length; j++) {
                        var newTime = Math.max(0, Math.min(compADuration, markers[j].time + timeOffset));
                        newMarkerProp.setValueAtTime(newTime, markers[j].value);
                    }
                }
                
                selectedLayer.startTime = 0;
                selectedLayer.inPoint = 0;
                selectedLayer.outPoint = compADuration;
                
                return "✓ Composition extended successfully";
            }
            return "⚠️ Selected layer must be a composition.";
        }
        return "⚠️ Please select a layer.";
    }
    return "⚠️ Please select a composition.";
    
    app.endUndoGroup();
}