// GTA 5 settings.xml parser by Jeroen Baert
// https://github.com/Forceflow/gta5settingsparser

var $xml;


// ==========================================================
// Value -> setting translations
// ==========================================================

var AA_TYPE_SETTINGS = {};
AA_TYPE_SETTINGS["0"] = "Off";
AA_TYPE_SETTINGS["1"] = "FXAA";
AA_TYPE_SETTINGS["2"] = "TAA";


var RES_SCALING_SETTINGS = {};
RES_SCALING_SETTINGS["0"] = "Off";
RES_SCALING_SETTINGS["1"] = "SSAA";
RES_SCALING_SETTINGS["2"] = "FSR 1";
RES_SCALING_SETTINGS["3"] = "FSR 3";
RES_SCALING_SETTINGS["4"] = "DLSS / DLAA";


var RT_QUALITY_SETTINGS = {};
RT_QUALITY_SETTINGS["0"] = "Off";
RT_QUALITY_SETTINGS["1"] = "High";
RT_QUALITY_SETTINGS["2"] = "Very High";
RT_QUALITY_SETTINGS["3"] = "Ultra";


var DX_VERSION_SETTINGS = {};
DX_VERSION_SETTINGS["0"] = "DirectX 10";
DX_VERSION_SETTINGS["1"] = "DirectX 10.1";
DX_VERSION_SETTINGS["2"] = "DirectX 11";


var TESSELLATION_SETTINGS = {};
TESSELLATION_SETTINGS["0"] = "Off";
TESSELLATION_SETTINGS["1"] = "Normal";
TESSELLATION_SETTINGS["2"] = "High";
TESSELLATION_SETTINGS["3"] = "Very High";


var TEXTURE_QUALITY_SETTINGS = {};
TEXTURE_QUALITY_SETTINGS["0"] = "Normal";
TEXTURE_QUALITY_SETTINGS["1"] = "High";
TEXTURE_QUALITY_SETTINGS["2"] = "Very High";


var SHADER_QUALITY_SETTINGS = {};
SHADER_QUALITY_SETTINGS["0"] = "Normal";
SHADER_QUALITY_SETTINGS["1"] = "High";
SHADER_QUALITY_SETTINGS["2"] = "Very High";


var SHADOW_QUALITY_SETTINGS = {};
SHADOW_QUALITY_SETTINGS["0"] = "Low";
SHADOW_QUALITY_SETTINGS["1"] = "Normal";
SHADOW_QUALITY_SETTINGS["2"] = "High";
SHADOW_QUALITY_SETTINGS["3"] = "Very High";


var GRASS_QUALITY_SETTINGS = {};
GRASS_QUALITY_SETTINGS["0"] = "Normal";
GRASS_QUALITY_SETTINGS["1"] = "High";
GRASS_QUALITY_SETTINGS["2"] = "Very High";
GRASS_QUALITY_SETTINGS["3"] = "Ultra";


var WATER_QUALITY_SETTINGS = {};
WATER_QUALITY_SETTINGS["0"] = "Normal";
WATER_QUALITY_SETTINGS["1"] = "High";
WATER_QUALITY_SETTINGS["2"] = "Very High";
WATER_QUALITY_SETTINGS["3"] = "Ultra";


var PARTICLE_QUALITY_SETTINGS = {};
PARTICLE_QUALITY_SETTINGS["0"] = "Normal";
PARTICLE_QUALITY_SETTINGS["1"] = "High";
PARTICLE_QUALITY_SETTINGS["2"] = "Very High";
PARTICLE_QUALITY_SETTINGS["3"] = "Ultra";


var REFLECTION_QUALITY_SETTINGS = {};
REFLECTION_QUALITY_SETTINGS["0"] = "Normal";
REFLECTION_QUALITY_SETTINGS["1"] = "High";
REFLECTION_QUALITY_SETTINGS["2"] = "Very High";
REFLECTION_QUALITY_SETTINGS["3"] = "Ultra";


var SHADOW_SHOFTSHADOWS_SETTINGS = {};
SHADOW_SHOFTSHADOWS_SETTINGS["0"] = "Sharp";
SHADOW_SHOFTSHADOWS_SETTINGS["1"] = "Soft";
SHADOW_SHOFTSHADOWS_SETTINGS["2"] = "Softer";
SHADOW_SHOFTSHADOWS_SETTINGS["3"] = "Softest";
SHADOW_SHOFTSHADOWS_SETTINGS["4"] = "AMD CHS";
SHADOW_SHOFTSHADOWS_SETTINGS["5"] = "Nvidia PCSS";


var POSTFX_SETTINGS = {};
POSTFX_SETTINGS["0"] = "Normal";
POSTFX_SETTINGS["1"] = "High";
POSTFX_SETTINGS["2"] = "Very High";
POSTFX_SETTINGS["3"] = "Ultra";


var AO_SETTINGS = {};
AO_SETTINGS["0"] = "Off";
AO_SETTINGS["1"] = "Normal";
AO_SETTINGS["2"] = "High";


var valid_xml = true;


// ==========================================================
// Initialisation
// ==========================================================

$(document).ready(function () {
    watcharea();
});


function watcharea() {

    $('textarea#inifile').on('change', function () {
        parse();
    });

    $('textarea#inifile').keyup(function () {
        parse();
    });
}


// ==========================================================
// XML parsing
// ==========================================================

function parseXML() {

    valid_xml = true;

    var inifile = $('textarea#inifile').val();

    if (inifile == "") {
        valid_xml = false;
        return;
    }

    try {
        var xmlDoc = $.parseXML(inifile);
    }
    catch (err) {
        valid_xml = false;
        return;
    }

    $xml = $(xmlDoc);
}


function writeLine(line) {
    $("#parsed").val(
        $("#parsed").val() + line + "  \n"
    );
}


// ==========================================================
// Settings parser
// ==========================================================

function writeSettings() {

    // Detect GTA V Enhanced.
    // Enhanced uses AAType while Legacy uses FXAA/MSAA/TXAA fields.
    var enhanced = $xml.find("AAType").length > 0;


    // ======================================================
    // Edition / GPU / DirectX
    // ======================================================

    if (enhanced) {
        writeLine("GTA V Enhanced");
    } else {
        writeLine("GTA V Legacy");
    }


    var videocard = $xml.find("VideoCardDescription").text();
    var dx_version = $xml.find("DX_Version").attr("value");

    if (dx_version in DX_VERSION_SETTINGS) {
        writeLine(
            videocard + " - " +
            DX_VERSION_SETTINGS[dx_version]
        );
    }


    // ======================================================
    // Resolution / display mode / VSync
    // ======================================================

    var width = $xml.find("ScreenWidth").attr("value");
    var height = $xml.find("ScreenHeight").attr("value");
    var refreshrate = $xml.find("RefreshRate").attr("value");
    var windowed = $xml.find("Windowed").attr("value");

    var windowMode;


    if (enhanced) {

        switch (windowed) {

            case "0":
                windowMode = "Fullscreen";
                break;

            case "1":
                windowMode = "Windowed";
                break;

            case "2":
                windowMode = "Borderless";
                break;

            case "3":
                windowMode = "Borderless Fullscreen";
                break;

            default:
                windowMode = "Unknown (" + windowed + ")";
        }

    } else {

        windowMode =
            windowed == 0 ?
            "Fullscreen" :
            "Windowed";
    }


    var vsync;


    if (enhanced) {

        var vsyncValue =
            $xml.find("VSync").attr("value");

        vsync =
            vsyncValue == "0" ?
            "V-sync off" :
            "V-sync on";

    } else {

        var vsyncValue =
            $xml.find("Vsync").attr("value");

        vsync =
            vsyncValue == "0" ?
            "No V-sync" :
            "V-sync on";
    }


    writeLine(
        width + " x " +
        height + ", " +
        refreshrate + " hz, " +
        windowMode + ", " +
        vsync
    );


    // ======================================================
    // Anti-aliasing
    // ======================================================

    if (enhanced) {

        var aaType =
            $xml.find("AAType").attr("value");


        if (aaType in AA_TYPE_SETTINGS) {

            writeLine(
                "Anti-aliasing: " +
                AA_TYPE_SETTINGS[aaType]
            );

        } else {

            writeLine(
                "Anti-aliasing: Unknown (" +
                aaType +
                ")"
            );
        }


        if (aaType == "2") {

            var taaQuality =
                $xml.find("TAA_Quality").attr("value");

            var taaSharpen =
                $xml.find("TAA_SharpenIntensity").attr("value");


            if (taaQuality !== undefined) {
                writeLine(
                    "TAA Quality: " +
                    taaQuality
                );
            }


            if (taaSharpen !== undefined) {
                writeLine(
                    "TAA Sharpening: " +
                    (
                        parseFloat(taaSharpen) * 100
                    ).toFixed(0) +
                    "%"
                );
            }
        }

    } else {

        var FXAA =
            $xml.find("FXAA_Enabled").attr("value");


        if (
            FXAA == "false" ||
            FXAA == "0"
        ) {
            FXAA = "FXAA off";
        } else {
            FXAA = "FXAA on";
        }


        var MSAA =
            $xml.find("MSAA").attr("value");


        if (MSAA != 0) {

            MSAA =
                "MSAA " +
                MSAA +
                "x";


            var TXAA =
                $xml.find("TXAA_Enabled").attr("value");


            if (
                TXAA == "false" ||
                TXAA == "0"
            ) {
                TXAA = "TXAA off";
            } else {
                TXAA = "TXAA on";
            }


            writeLine(
                FXAA + ", " +
                MSAA + ", " +
                TXAA
            );

        } else {

            writeLine(
                FXAA +
                ", MSAA off"
            );
        }
    }


    // ======================================================
    // Enhanced upscaling
    // ======================================================

    if (enhanced) {

        var resScalingType =
            $xml.find("ResScalingType").attr("value");


        if (
            resScalingType in
            RES_SCALING_SETTINGS
        ) {

            writeLine(
                "Upscaling: " +
                RES_SCALING_SETTINGS[
                    resScalingType
                ]
            );
        }


        // DLSS / DLAA
        if (resScalingType == "4") {

            var dlssQuality =
                $xml.find("dlssQuality").attr("value");

            var dlssSharpen =
                $xml.find("dlssSharpen").attr("value");


            if (dlssQuality !== undefined) {

                writeLine(
                    "DLSS Quality: " +
                    dlssQuality
                );
            }


            if (dlssSharpen !== undefined) {

                writeLine(
                    "DLSS Sharpening: " +
                    (
                        parseFloat(
                            dlssSharpen
                        ) * 100
                    ).toFixed(0) +
                    "%"
                );
            }
        }


        // FSR 3
        if (resScalingType == "3") {

            var fsr3Quality =
                $xml.find("fsr3Quality").attr("value");

            var fsr3Sharpen =
                $xml.find("fsr3Sharpen").attr("value");


            if (fsr3Quality !== undefined) {

                writeLine(
                    "FSR 3 Quality: " +
                    fsr3Quality
                );
            }


            if (fsr3Sharpen !== undefined) {

                writeLine(
                    "FSR 3 Sharpening: " +
                    (
                        parseFloat(
                            fsr3Sharpen
                        ) * 100
                    ).toFixed(0) +
                    "%"
                );
            }
        }
    }


    // ======================================================
    // Population / LOD
    // ======================================================

    var population_density =
        $xml.find("CityDensity").attr("value");

    population_density =
        (
            parseFloat(
                population_density
            ) * 100
        ).toFixed(0);


    var population_variety =
        $xml
            .find("PedVarietyMultiplier")
            .attr("value");

    population_variety =
        (
            parseFloat(
                population_variety
            ) * 100
        ).toFixed(0);


    var distance_scaling =
        $xml.find("LodScale").attr("value");

    distance_scaling =
        (
            parseFloat(
                distance_scaling
            ) * 100
        ).toFixed(0);


    writeLine(
        "Population density: " +
        population_density +
        "%"
    );

    writeLine(
        "Population variety: " +
        population_variety +
        "%"
    );

    writeLine(
        "Distance scaling: " +
        distance_scaling +
        "%"
    );


    // Enhanced-only population / LOD
    if (enhanced) {

        var pedLodBias =
            $xml.find("PedLodBias").attr("value");

        var vehicleLodBias =
            $xml.find("VehicleLodBias").attr("value");

        var vehicleVariety =
            $xml
                .find("VehicleVarietyMultiplier")
                .attr("value");


        if (pedLodBias !== undefined) {

            writeLine(
                "Pedestrian LOD Bias: " +
                (
                    parseFloat(
                        pedLodBias
                    ) * 100
                ).toFixed(0) +
                "%"
            );
        }


        if (vehicleLodBias !== undefined) {

            writeLine(
                "Vehicle LOD Bias: " +
                (
                    parseFloat(
                        vehicleLodBias
                    ) * 100
                ).toFixed(0) +
                "%"
            );
        }


        if (vehicleVariety !== undefined) {

            writeLine(
                "Vehicle variety: " +
                (
                    parseFloat(
                        vehicleVariety
                    ) * 100
                ).toFixed(0) +
                "%"
            );
        }
    }


    // ======================================================
    // Texture quality
    // ======================================================

    var texture_quality =
        $xml.find("TextureQuality").attr("value");

    if (
        texture_quality in
        TEXTURE_QUALITY_SETTINGS
    ) {

        writeLine(
            "Texture quality: " +
            TEXTURE_QUALITY_SETTINGS[
                texture_quality
            ]
        );

    } else {

        writeLine(
            "UNKNOWN TEXTURE QUALITY"
        );
    }


    // ======================================================
    // Shader quality
    // ======================================================

    var shader_quality =
        $xml.find("ShaderQuality").attr("value");

    if (
        shader_quality in
        SHADER_QUALITY_SETTINGS
    ) {

        writeLine(
            "Shader quality: " +
            SHADER_QUALITY_SETTINGS[
                shader_quality
            ]
        );

    } else {

        writeLine(
            "UNKNOWN SHADER QUALITY"
        );
    }


    // ======================================================
    // Shadow quality
    // ======================================================

    var shadow_quality =
        $xml.find("ShadowQuality").attr("value");

    if (
        shadow_quality in
        SHADOW_QUALITY_SETTINGS
    ) {

        writeLine(
            "Shadow quality: " +
            SHADOW_QUALITY_SETTINGS[
                shadow_quality
            ]
        );

    } else {

        writeLine(
            "UNKNOWN SHADOW QUALITY"
        );
    }


    // ======================================================
    // Reflection quality
    // ======================================================

    var reflection_quality =
        $xml.find("ReflectionQuality").attr("value");

    if (
        reflection_quality in
        REFLECTION_QUALITY_SETTINGS
    ) {

        writeLine(
            "Reflection quality: " +
            REFLECTION_QUALITY_SETTINGS[
                reflection_quality
            ]
        );

    } else {

        writeLine(
            "UNKNOWN REFLECTION QUALITY"
        );
    }


    // Reflection MSAA - Legacy only
    if (!enhanced) {

        var reflection_msaa =
            $xml.find("ReflectionMSAA").attr("value");


        if (reflection_msaa == 0) {

            writeLine(
                "Reflection MSAA: Off"
            );

        } else {

            writeLine(
                "Reflection MSAA: " +
                reflection_msaa +
                "x"
            );
        }
    }


    // ======================================================
    // Water quality
    // ======================================================

    var water_quality =
        $xml.find("WaterQuality").attr("value");

    if (
        water_quality in
        WATER_QUALITY_SETTINGS
    ) {

        writeLine(
            "Water quality: " +
            WATER_QUALITY_SETTINGS[
                water_quality
            ]
        );

    } else {

        writeLine(
            "UNKNOWN WATER QUALITY"
        );
    }


    // ======================================================
    // Particle quality
    // ======================================================

    var particle_quality =
        $xml.find("ParticleQuality").attr("value");

    if (
        particle_quality in
        PARTICLE_QUALITY_SETTINGS
    ) {

        writeLine(
            "Particle quality: " +
            PARTICLE_QUALITY_SETTINGS[
                particle_quality
            ]
        );

    } else {

        writeLine(
            "UNKNOWN PARTICLE QUALITY"
        );
    }


    // ======================================================
    // Grass quality
    // ======================================================

    var grass_quality =
        $xml.find("GrassQuality").attr("value");

    if (
        grass_quality in
        GRASS_QUALITY_SETTINGS
    ) {

        writeLine(
            "Grass quality: " +
            GRASS_QUALITY_SETTINGS[
                grass_quality
            ]
        );

    } else {

        writeLine(
            "UNKNOWN GRASS QUALITY"
        );
    }


    // ======================================================
    // Soft shadows
    // ======================================================

    var shadow_softshadows =
        $xml
            .find("Shadow_SoftShadows")
            .attr("value");

    if (
        shadow_softshadows in
        SHADOW_SHOFTSHADOWS_SETTINGS
    ) {

        writeLine(
            "Soft shadows: " +
            SHADOW_SHOFTSHADOWS_SETTINGS[
                shadow_softshadows
            ]
        );

    } else {

        writeLine(
            "UNKNOWN SOFT SHADOW QUALITY"
        );
    }


    // ======================================================
    // Post FX
    // ======================================================

    var postfx =
        $xml.find("PostFX").attr("value");

    if (
        postfx in
        POSTFX_SETTINGS
    ) {

        writeLine(
            "Post FX: " +
            POSTFX_SETTINGS[
                postfx
            ]
        );

    } else {

        writeLine(
            "UNKNOWN POST FX SETTING"
        );
    }


    // ======================================================
    // Motion Blur
    // ======================================================

    var motion_blur_strength =
        $xml
            .find("MotionBlurStrength")
            .attr("value");

    motion_blur_strength =
        (
            parseFloat(
                motion_blur_strength
            ) * 100
        ).toFixed(0);

    writeLine(
        "Motion Blur: " +
        motion_blur_strength +
        "%"
    );


    // ======================================================
    // Depth of Field
    // ======================================================

    var dof =
        $xml.find("DoF").attr("value");

    if (
        dof == "false" ||
        dof == "0"
    ) {

        writeLine(
            "Depth of Field: Off"
        );

    } else {

        writeLine(
            "Depth of Field: On"
        );
    }


    // ======================================================
    // Anisotropic Filtering
    // ======================================================

    var anisotropic_filtering =
        $xml
            .find("AnisotropicFiltering")
            .attr("value");

    if (anisotropic_filtering == 0) {

        writeLine(
            "Anisotropic Filtering: Off"
        );

    } else {

        writeLine(
            "Anisotropic Filtering: " +
            anisotropic_filtering +
            "x"
        );
    }


    // ======================================================
    // Ambient Occlusion
    // ======================================================

    var ao;


    if (enhanced) {

        ao =
            $xml.find("SSAOType").attr("value");

    } else {

        ao =
            $xml.find("SSAO").attr("value");
    }


    if (ao in AO_SETTINGS) {

        writeLine(
            "Ambient Occlusion: " +
            AO_SETTINGS[ao]
        );

    } else {

        writeLine(
            "UNKNOWN AMBIENT OCCLUSION SETTING"
        );
    }


    // ======================================================
    // Tessellation
    // ======================================================

    var tessellation =
        $xml.find("Tessellation").attr("value");

    if (
        tessellation in
        TESSELLATION_SETTINGS
    ) {

        writeLine(
            "Tessellation: " +
            TESSELLATION_SETTINGS[
                tessellation
            ]
        );

    } else {

        writeLine(
            "UNKNOWN TESSELLATION SETTING"
        );
    }


    // ======================================================
    // Advanced graphics
    // ======================================================

    var longshadows =
        $xml
            .find("Shadow_LongShadows")
            .attr("value");

    if (
        longshadows == "true" ||
        longshadows == 1
    ) {

        writeLine(
            "Long Shadows: On"
        );

    } else {

        writeLine(
            "Long Shadows: Off"
        );
    }


    // High resolution shadows
    var ultrashadows =
        $xml
            .find("UltraShadows_Enabled")
            .attr("value");

    if (
        ultrashadows == "true" ||
        ultrashadows == 1
    ) {

        writeLine(
            "High Resolution Shadows: On"
        );

    } else {

        writeLine(
            "High Resolution Shadows: Off"
        );
    }


    // High detail streaming while flying
    var flying_streaming =
        $xml
            .find("HdStreamingInFlight")
            .attr("value");

    if (
        flying_streaming == "true" ||
        flying_streaming == 1
    ) {

        writeLine(
            "HD Streaming while Flying: On"
        );

    } else {

        writeLine(
            "HD Streaming while Flying: Off"
        );
    }


    // Extended Distance Scaling
    var extended_distance_scaling =
        $xml
            .find("MaxLodScale")
            .attr("value");

    extended_distance_scaling =
        (
            parseFloat(
                extended_distance_scaling
            ) * 100
        ).toFixed(0);

    writeLine(
        "Extended Distance Scaling: " +
        extended_distance_scaling +
        "%"
    );


    // Extended Shadow Distance
    var extended_shadow_distance =
        $xml
            .find("Shadow_Distance")
            .attr("value");

    extended_shadow_distance =
        (
            parseFloat(
                extended_shadow_distance - 1
            ) * 100
        ).toFixed(0);

    writeLine(
        "Extended Shadow Distance: " +
        extended_shadow_distance +
        "%"
    );


    // ======================================================
    // Enhanced video features
    // ======================================================

    if (enhanced) {

        // NVIDIA Reflex
        var reflexMode =
            $xml.find("ReflexMode").attr("value");


        if (reflexMode !== undefined) {

            switch (reflexMode) {

                case "0":
                    writeLine(
                        "NVIDIA Reflex: Off"
                    );
                    break;

                case "1":
                    writeLine(
                        "NVIDIA Reflex: On"
                    );
                    break;

                case "2":
                    writeLine(
                        "NVIDIA Reflex: On + Boost"
                    );
                    break;

                default:
                    writeLine(
                        "NVIDIA Reflex: Unknown (" +
                        reflexMode +
                        ")"
                    );
            }
        }


        // Frame Generation
        var frameGenType =
            $xml
                .find("FrameGenType")
                .attr("value");

        if (frameGenType !== undefined) {

            writeLine(
                "Frame Generation Type: " +
                frameGenType
            );
        }


        var dlssFrameGen =
            $xml
                .find("dlssFrameGenMode")
                .attr("value");

        if (dlssFrameGen !== undefined) {

            writeLine(
                "DLSS Frame Generation: " +
                (
                    dlssFrameGen == "0" ?
                    "Off" :
                    "On"
                )
            );
        }


        var fsr3FrameGen =
            $xml
                .find("fsr3FrameGenMode")
                .attr("value");

        if (fsr3FrameGen !== undefined) {

            writeLine(
                "FSR 3 Frame Generation: " +
                (
                    fsr3FrameGen == "0" ?
                    "Off" :
                    "On"
                )
            );
        }
    }


    // ======================================================
    // Enhanced Ray Tracing
    // ======================================================

    if (enhanced) {

        var rtEnabled =
            $xml
                .find("Raytracing_Enabled")
                .attr("value");


        if (rtEnabled !== undefined) {

            writeLine(
                "Ray Tracing: " +
                (
                    rtEnabled == "true" ?
                    "On" :
                    "Off"
                )
            );
        }


        if (rtEnabled == "true") {


            // Helper for RT settings with quality values
            function writeRTSetting(
                enabledTag,
                qualityTag,
                label
            ) {

                var enabled =
                    $xml
                        .find(enabledTag)
                        .attr("value");

                var quality =
                    $xml
                        .find(qualityTag)
                        .attr("value");


                if (enabled === undefined) {
                    return;
                }


                if (enabled != "true") {

                    writeLine(
                        label + ": Off"
                    );

                    return;
                }


                if (quality !== undefined) {

                    if (
                        quality in
                        RT_QUALITY_SETTINGS
                    ) {

                        writeLine(
                            label +
                            ": " +
                            RT_QUALITY_SETTINGS[
                                quality
                            ]
                        );

                    } else {

                        writeLine(
                            label +
                            ": Unknown (" +
                            quality +
                            ")"
                        );
                    }

                } else {

                    writeLine(
                        label + ": On"
                    );
                }
            }


            writeRTSetting(
                "RTShadows_Enabled",
                "RTShadows_Quality",
                "RT Shadows"
            );


            writeRTSetting(
                "RTAmbientOcclusion_Enabled",
                "RTAmbientOcclusion_Quality",
                "RT Ambient Occlusion"
            );


            writeRTSetting(
                "RTReflection_Enabled",
                "RTReflection_Quality",
                "RT Reflections"
            );


            writeRTSetting(
                "RTIndirectDiffuse_Enabled",
                "RTIndirectDiffuse_Quality",
                "RT Global Illumination"
            );


            // RT Character Shadows
            var characterShadows =
                $xml
                    .find(
                        "RTCharacterShadow_Enabled"
                    )
                    .attr("value");

            if (
                characterShadows !==
                undefined
            ) {

                writeLine(
                    "RT Character Shadows: " +
                    (
                        characterShadows ==
                        "true" ?
                        "On" :
                        "Off"
                    )
                );
            }


            // RT GI second bounce
            var secondBounce =
                $xml
                    .find(
                        "RTIndirectDiffuse_SecondBounce_Enabled"
                    )
                    .attr("value");

            if (
                secondBounce !==
                undefined
            ) {

                writeLine(
                    "RT GI Second Bounce: " +
                    (
                        secondBounce ==
                        "true" ?
                        "On" :
                        "Off"
                    )
                );
            }


            // Full resolution RT reflections
            var fullResReflections =
                $xml
                    .find(
                        "RTReflection_FullRes_Enabled"
                    )
                    .attr("value");

            if (
                fullResReflections !==
                undefined
            ) {

                writeLine(
                    "Full Resolution RT Reflections: " +
                    (
                        fullResReflections ==
                        "true" ?
                        "On" :
                        "Off"
                    )
                );
            }
        }
    }
}


// ==========================================================
// Parse
// ==========================================================

function parse() {

    $("#parsed").val('');

    parseXML();


    if (!valid_xml) {

        writeLine(
            "No XML or invalid XML pasted. " +
            "Make sure you paste the full contents of your " +
            "settings.xml file in the area on the left!"
        );

        return;
    }


    writeSettings();

    writeLine(
        "Generated with Dark360's GTA 5 settings parser"
    );
}
