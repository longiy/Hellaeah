// trimBaby.jsx
function trimBaby() {
    app.beginUndoGroup("Adjust Precomp Duration");
    
    var comp = app.project.activeItem;
    if (comp && comp instanceof CompItem) {
        var layer = comp.selectedLayers[0];
        if (layer && layer.source instanceof CompItem) {
            var originalPlayheadPos = comp.time;
            var originalInPoint = layer.inPoint;
            comp.time = originalInPoint;
            var duration = layer.outPoint - layer.inPoint;
            var precomp = layer.source;
            var markers = [];
            
            if (precomp.markerProperty) {
                var markerProp = precomp.markerProperty;
                for (var i = 1; i <= markerProp.numKeys; i++) {
                    var markerTime = markerProp.keyTime(i);
                    if (markerTime >= originalInPoint && markerTime <= layer.outPoint) {
                        var markerValue = markerProp.keyValue(i);
                        markers.push({
                            time: markerTime - originalInPoint,
                            value: markerValue
                        });
                    }
                }
            }
            
            precomp.workAreaStart = 0;
            precomp.workAreaDuration = duration;
            precomp.duration = duration;
            
            for (var i = 1; i <= precomp.numLayers; i++) {
                var precompLayer = precomp.layer(i);
                precompLayer.startTime -= originalInPoint;
            }
            
            if (markers.length > 0 && precomp.markerProperty) {
                var newMarkerProp = precomp.markerProperty;
                while (newMarkerProp.numKeys > 0) {
                    newMarkerProp.removeKey(1);
                }
                for (var j = 0; j < markers.length; j++) {
                    newMarkerProp.setValueAtTime(markers[j].time, markers[j].value);
                }
            }
            
            layer.startTime = comp.time;
            layer.inPoint = comp.time;
            layer.outPoint = comp.time + duration;
            comp.time = originalPlayheadPos;
            
            return "✓ Precomp trimmed successfully";
        }
        return "⚠️ Please select a precomp layer.";
    }
    return "⚠️ Please select a composition.";
    
    app.endUndoGroup();
}