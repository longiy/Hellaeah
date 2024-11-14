function getTrimBabyScript() {
    return (
        // After Effects Script to adjust Precomp duration and preserve markers
        'app.beginUndoGroup("Adjust Precomp Duration");\n\
        \n\
        var comp = app.project.activeItem;\n\
        if (comp && comp instanceof CompItem) {\n\
            var layer = comp.selectedLayers[0];\n\
            if (layer && layer.source instanceof CompItem) {\n\
                var originalPlayheadPos = comp.time;\n\
                var originalInPoint = layer.inPoint;\n\
                comp.time = originalInPoint;\n\
                var duration = layer.outPoint - layer.inPoint;\n\
                var precomp = layer.source;\n\
                var markers = [];\n\
                \n\
                if (precomp.markerProperty) {\n\
                    var markerProp = precomp.markerProperty;\n\
                    for (var i = 1; i <= markerProp.numKeys; i++) {\n\
                        var markerTime = markerProp.keyTime(i);\n\
                        if (markerTime >= originalInPoint && markerTime <= layer.outPoint) {\n\
                            var markerValue = markerProp.keyValue(i);\n\
                            markers.push({\n\
                                time: markerTime - originalInPoint,\n\
                                value: markerValue\n\
                            });\n\
                        }\n\
                    }\n\
                }\n\
                \n\
                precomp.workAreaStart = 0;\n\
                precomp.workAreaDuration = duration;\n\
                precomp.duration = duration;\n\
                \n\
                for (var i = 1; i <= precomp.numLayers; i++) {\n\
                    var precompLayer = precomp.layer(i);\n\
                    precompLayer.startTime -= originalInPoint;\n\
                }\n\
                \n\
                if (markers.length > 0 && precomp.markerProperty) {\n\
                    var newMarkerProp = precomp.markerProperty;\n\
                    while (newMarkerProp.numKeys > 0) {\n\
                        newMarkerProp.removeKey(1);\n\
                    }\n\
                    for (var j = 0; j < markers.length; j++) {\n\
                        newMarkerProp.setValueAtTime(markers[j].time, markers[j].value);\n\
                    }\n\
                }\n\
                \n\
                var currentTime = comp.time;\n\
                layer.startTime = currentTime;\n\
                layer.inPoint = currentTime;\n\
                layer.outPoint = currentTime + duration;\n\
                comp.time = originalPlayheadPos;\n\
                \n\
                "✓ Precomp trimmed successfully";\n\
            } else {\n\
                "⚠️ Please select a precomp layer.";\n\
            }\n\
        } else {\n\
            "⚠️ Please select a composition.";\n\
        }\n\
        \n\
        app.endUndoGroup();'
    );
}