function getExtendBabyScript() {
    return (
        'app.beginUndoGroup("Extend and Offset Composition");\n\
        \n\
        var compA = app.project.activeItem;\n\
        if (compA && compA instanceof CompItem) {\n\
            var selectedLayer = compA.selectedLayers[0];\n\
            if (selectedLayer) {\n\
                var compADuration = compA.duration;\n\
                var originalInPoint = selectedLayer.inPoint;\n\
                var timeOffset = originalInPoint;\n\
                \n\
                if (selectedLayer.source instanceof CompItem) {\n\
                    var compB = selectedLayer.source;\n\
                    var markers = [];\n\
                    \n\
                    if (compB.markerProperty) {\n\
                        var markerProp = compB.markerProperty;\n\
                        for (var i = 1; i <= markerProp.numKeys; i++) {\n\
                            markers.push({\n\
                                time: markerProp.keyTime(i),\n\
                                value: markerProp.keyValue(i)\n\
                            });\n\
                        }\n\
                    }\n\
                    \n\
                    var layersOriginalState = [];\n\
                    for (var i = 1; i <= compB.numLayers; i++) {\n\
                        var layer = compB.layer(i);\n\
                        layersOriginalState.push({\n\
                            index: i,\n\
                            startTime: layer.startTime,\n\
                            inPoint: layer.inPoint,\n\
                            outPoint: layer.outPoint\n\
                        });\n\
                    }\n\
                    \n\
                    compB.duration = compADuration;\n\
                    \n\
                    for (var i = 0; i < layersOriginalState.length; i++) {\n\
                        var originalState = layersOriginalState[i];\n\
                        var layer = compB.layer(originalState.index);\n\
                        \n\
                        layer.startTime = originalState.startTime + timeOffset;\n\
                        \n\
                        if (originalState.inPoint < compADuration) {\n\
                            layer.inPoint = Math.max(0, originalState.inPoint + timeOffset);\n\
                        }\n\
                        if (originalState.outPoint > 0) {\n\
                            layer.outPoint = Math.min(compADuration, originalState.outPoint + timeOffset);\n\
                        }\n\
                    }\n\
                    \n\
                    if (markers.length > 0 && compB.markerProperty) {\n\
                        var newMarkerProp = compB.markerProperty;\n\
                        while (newMarkerProp.numKeys > 0) {\n\
                            newMarkerProp.removeKey(1);\n\
                        }\n\
                        for (var j = 0; j < markers.length; j++) {\n\
                            var newTime = Math.max(0, Math.min(compADuration, markers[j].time + timeOffset));\n\
                            newMarkerProp.setValueAtTime(newTime, markers[j].value);\n\
                        }\n\
                    }\n\
                    \n\
                    selectedLayer.startTime = 0;\n\
                    selectedLayer.inPoint = 0;\n\
                    selectedLayer.outPoint = compADuration;\n\
                    \n\
                    "✓ Composition extended successfully";\n\
                } else {\n\
                    "⚠️ Selected layer must be a composition.";\n\
                }\n\
            } else {\n\
                "⚠️ Please select a layer.";\n\
            }\n\
        } else {\n\
            "⚠️ Please select a composition.";\n\
        }\n\
        \n\
        app.endUndoGroup();'
    );
}
