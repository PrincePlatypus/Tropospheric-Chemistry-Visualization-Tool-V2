/**
 * Template and instances for map layers
 */

// --- Define Variable Properties ---
// Maps the 'variableLabel' to its specific unit, dimension, and default display layer.
export const VARIABLE_DEFINITIONS = {
  NO2: {
    unit: 'trillion molecules/cm²',
    dimension: 'Tropospheric Vertical Column Density', // Example dimension
    // --- NEW PROPERTY: Specifies the default layer ID from MAP_LAYERS ---
    defaultLayerId: 'NO2_Hourly',
    // --- ---
    chartColorRamp:
      {
        "statistics": 
        [
          0,
          30000000000000000,
          169933132046326.3,
          1037511280757571.9
        ],
        "stops": 
        [
          {
            "value": 0,
            "color": "rgba(254, 237, 176, 1)"
          },
          {
            "value": 117647058823529.4,
            "color": "rgba(253, 236, 175, 1)"
          },
          {
            "value": 235294117647058.8,
            "color": "rgba(253, 234, 173, 1)"
          },
          {
            "value": 352941176470588.25,
            "color": "rgba(253, 233, 172, 1)"
          },
          {
            "value": 470588235294117.6,
            "color": "rgba(253, 232, 171, 1)"
          },
          {
            "value": 588235294117647,
            "color": "rgba(253, 230, 169, 1)"
          },
          {
            "value": 705882352941176.5,
            "color": "rgba(253, 229, 168, 1)"
          },
          {
            "value": 823529411764705.9,
            "color": "rgba(253, 227, 167, 1)"
          },
          {
            "value": 941176470588235.2,
            "color": "rgba(253, 226, 165, 1)"
          },
          {
            "value": 1058823529411764.8,
            "color": "rgba(252, 225, 164, 1)"
          },
          {
            "value": 1176470588235294,
            "color": "rgba(252, 223, 163, 1)"
          },
          {
            "value": 1294117647058823.5,
            "color": "rgba(252, 222, 161, 1)"
          },
          {
            "value": 1411764705882353,
            "color": "rgba(252, 220, 160, 1)"
          },
          {
            "value": 1529411764705882.2,
            "color": "rgba(252, 219, 159, 1)"
          },
          {
            "value": 1647058823529411.8,
            "color": "rgba(252, 218, 157, 1)"
          },
          {
            "value": 1764705882352941.2,
            "color": "rgba(252, 216, 156, 1)"
          },
          {
            "value": 1882352941176470.5,
            "color": "rgba(251, 215, 155, 1)"
          },
          {
            "value": 2000000000000000,
            "color": "rgba(251, 213, 154, 1)"
          },
          {
            "value": 2117647058823529.5,
            "color": "rgba(251, 212, 152, 1)"
          },
          {
            "value": 2235294117647058.8,
            "color": "rgba(251, 211, 151, 1)"
          },
          {
            "value": 2352941176470588,
            "color": "rgba(251, 209, 150, 1)"
          },
          {
            "value": 2470588235294117.5,
            "color": "rgba(251, 208, 148, 1)"
          },
          {
            "value": 2588235294117647,
            "color": "rgba(251, 207, 147, 1)"
          },
          {
            "value": 2705882352941176.5,
            "color": "rgba(250, 205, 146, 1)"
          },
          {
            "value": 2823529411764706,
            "color": "rgba(250, 204, 145, 1)"
          },
          {
            "value": 2941176470588235.5,
            "color": "rgba(250, 202, 144, 1)"
          },
          {
            "value": 3058823529411764.5,
            "color": "rgba(250, 201, 142, 1)"
          },
          {
            "value": 3176470588235294,
            "color": "rgba(250, 200, 141, 1)"
          },
          {
            "value": 3294117647058823.5,
            "color": "rgba(250, 198, 140, 1)"
          },
          {
            "value": 3411764705882353,
            "color": "rgba(250, 197, 139, 1)"
          },
          {
            "value": 3529411764705882.5,
            "color": "rgba(249, 195, 138, 1)"
          },
          {
            "value": 3647058823529411.5,
            "color": "rgba(249, 194, 136, 1)"
          },
          {
            "value": 3764705882352941,
            "color": "rgba(249, 193, 135, 1)"
          },
          {
            "value": 3882352941176471,
            "color": "rgba(249, 191, 134, 1)"
          },
          {
            "value": 4000000000000000,
            "color": "rgba(249, 190, 133, 1)"
          },
          {
            "value": 4117647058823530,
            "color": "rgba(249, 189, 132, 1)"
          },
          {
            "value": 4235294117647059,
            "color": "rgba(248, 187, 131, 1)"
          },
          {
            "value": 4352941176470588.5,
            "color": "rgba(248, 186, 130, 1)"
          },
          {
            "value": 4470588235294117.5,
            "color": "rgba(248, 184, 128, 1)"
          },
          {
            "value": 4588235294117647,
            "color": "rgba(248, 183, 127, 1)"
          },
          {
            "value": 4705882352941176,
            "color": "rgba(248, 182, 126, 1)"
          },
          {
            "value": 4823529411764706,
            "color": "rgba(247, 180, 125, 1)"
          },
          {
            "value": 4941176470588235,
            "color": "rgba(247, 179, 124, 1)"
          },
          {
            "value": 5058823529411765,
            "color": "rgba(247, 178, 123, 1)"
          },
          {
            "value": 5176470588235294,
            "color": "rgba(247, 176, 122, 1)"
          },
          {
            "value": 5294117647058824,
            "color": "rgba(247, 175, 121, 1)"
          },
          {
            "value": 5411764705882353,
            "color": "rgba(246, 174, 120, 1)"
          },
          {
            "value": 5529411764705883,
            "color": "rgba(246, 172, 119, 1)"
          },
          {
            "value": 5647058823529412,
            "color": "rgba(246, 171, 118, 1)"
          },
          {
            "value": 5764705882352942,
            "color": "rgba(246, 169, 117, 1)"
          },
          {
            "value": 5882352941176471,
            "color": "rgba(245, 168, 116, 1)"
          },
          {
            "value": 6000000000000000,
            "color": "rgba(245, 167, 115, 1)"
          },
          {
            "value": 6117647058823529,
            "color": "rgba(245, 165, 114, 1)"
          },
          {
            "value": 6235294117647059,
            "color": "rgba(245, 164, 113, 1)"
          },
          {
            "value": 6352941176470588,
            "color": "rgba(245, 163, 112, 1)"
          },
          {
            "value": 6470588235294118,
            "color": "rgba(244, 161, 111, 1)"
          },
          {
            "value": 6588235294117647,
            "color": "rgba(244, 160, 110, 1)"
          },
          {
            "value": 6705882352941177,
            "color": "rgba(244, 159, 109, 1)"
          },
          {
            "value": 6823529411764706,
            "color": "rgba(244, 157, 108, 1)"
          },
          {
            "value": 6941176470588236,
            "color": "rgba(243, 156, 107, 1)"
          },
          {
            "value": 7058823529411765,
            "color": "rgba(243, 154, 106, 1)"
          },
          {
            "value": 7176470588235294,
            "color": "rgba(243, 153, 105, 1)"
          },
          {
            "value": 7294117647058823,
            "color": "rgba(242, 152, 104, 1)"
          },
          {
            "value": 7411764705882353,
            "color": "rgba(242, 150, 104, 1)"
          },
          {
            "value": 7529411764705882,
            "color": "rgba(242, 149, 103, 1)"
          },
          {
            "value": 7647058823529411,
            "color": "rgba(242, 148, 102, 1)"
          },
          {
            "value": 7764705882352942,
            "color": "rgba(241, 146, 101, 1)"
          },
          {
            "value": 7882352941176471,
            "color": "rgba(241, 145, 100, 1)"
          },
          {
            "value": 8000000000000000,
            "color": "rgba(241, 143, 99, 1)"
          },
          {
            "value": 8117647058823529,
            "color": "rgba(240, 142, 99, 1)"
          },
          {
            "value": 8235294117647060,
            "color": "rgba(240, 141, 98, 1)"
          },
          {
            "value": 8352941176470589,
            "color": "rgba(240, 139, 97, 1)"
          },
          {
            "value": 8470588235294118,
            "color": "rgba(239, 138, 96, 1)"
          },
          {
            "value": 8588235294117647,
            "color": "rgba(239, 137, 96, 1)"
          },
          {
            "value": 8705882352941177,
            "color": "rgba(239, 135, 95, 1)"
          },
          {
            "value": 8823529411764706,
            "color": "rgba(238, 134, 94, 1)"
          },
          {
            "value": 8941176470588235,
            "color": "rgba(238, 133, 94, 1)"
          },
          {
            "value": 9058823529411764,
            "color": "rgba(238, 131, 93, 1)"
          },
          {
            "value": 9176470588235294,
            "color": "rgba(237, 130, 92, 1)"
          },
          {
            "value": 9294117647058824,
            "color": "rgba(237, 129, 92, 1)"
          },
          {
            "value": 9411764705882352,
            "color": "rgba(237, 127, 91, 1)"
          },
          {
            "value": 9529411764705882,
            "color": "rgba(236, 126, 90, 1)"
          },
          {
            "value": 9647058823529412,
            "color": "rgba(236, 124, 90, 1)"
          },
          {
            "value": 9764705882352942,
            "color": "rgba(236, 123, 89, 1)"
          },
          {
            "value": 9882352941176470,
            "color": "rgba(235, 122, 89, 1)"
          },
          {
            "value": 10000000000000000,
            "color": "rgba(235, 120, 88, 1)"
          },
          {
            "value": 10117647058823530,
            "color": "rgba(234, 119, 88, 1)"
          },
          {
            "value": 10235294117647060,
            "color": "rgba(234, 118, 87, 1)"
          },
          {
            "value": 10352941176470588,
            "color": "rgba(233, 116, 87, 1)"
          },
          {
            "value": 10470588235294118,
            "color": "rgba(233, 115, 86, 1)"
          },
          {
            "value": 10588235294117648,
            "color": "rgba(233, 114, 86, 1)"
          },
          {
            "value": 10705882352941176,
            "color": "rgba(232, 112, 86, 1)"
          },
          {
            "value": 10823529411764706,
            "color": "rgba(232, 111, 85, 1)"
          },
          {
            "value": 10941176470588234,
            "color": "rgba(231, 110, 85, 1)"
          },
          {
            "value": 11058823529411766,
            "color": "rgba(231, 108, 85, 1)"
          },
          {
            "value": 11176470588235294,
            "color": "rgba(230, 107, 84, 1)"
          },
          {
            "value": 11294117647058824,
            "color": "rgba(230, 106, 84, 1)"
          },
          {
            "value": 11411764705882352,
            "color": "rgba(229, 104, 84, 1)"
          },
          {
            "value": 11529411764705884,
            "color": "rgba(229, 103, 84, 1)"
          },
          {
            "value": 11647058823529412,
            "color": "rgba(228, 102, 83, 1)"
          },
          {
            "value": 11764705882352942,
            "color": "rgba(227, 100, 83, 1)"
          },
          {
            "value": 11882352941176470,
            "color": "rgba(227, 99, 83, 1)"
          },
          {
            "value": 12000000000000000,
            "color": "rgba(226, 98, 83, 1)"
          },
          {
            "value": 12117647058823530,
            "color": "rgba(226, 96, 83, 1)"
          },
          {
            "value": 12235294117647058,
            "color": "rgba(225, 95, 83, 1)"
          },
          {
            "value": 12352941176470588,
            "color": "rgba(224, 94, 83, 1)"
          },
          {
            "value": 12470588235294118,
            "color": "rgba(224, 93, 83, 1)"
          },
          {
            "value": 12588235294117648,
            "color": "rgba(223, 91, 83, 1)"
          },
          {
            "value": 12705882352941176,
            "color": "rgba(223, 90, 83, 1)"
          },
          {
            "value": 12823529411764706,
            "color": "rgba(222, 89, 83, 1)"
          },
          {
            "value": 12941176470588236,
            "color": "rgba(221, 88, 83, 1)"
          },
          {
            "value": 13058823529411764,
            "color": "rgba(220, 86, 83, 1)"
          },
          {
            "value": 13176470588235294,
            "color": "rgba(220, 85, 83, 1)"
          },
          {
            "value": 13294117647058822,
            "color": "rgba(219, 84, 83, 1)"
          },
          {
            "value": 13411764705882354,
            "color": "rgba(218, 83, 83, 1)"
          },
          {
            "value": 13529411764705882,
            "color": "rgba(217, 81, 83, 1)"
          },
          {
            "value": 13647058823529412,
            "color": "rgba(217, 80, 83, 1)"
          },
          {
            "value": 13764705882352940,
            "color": "rgba(216, 79, 84, 1)"
          },
          {
            "value": 13882352941176472,
            "color": "rgba(215, 78, 84, 1)"
          },
          {
            "value": 14000000000000000,
            "color": "rgba(214, 77, 84, 1)"
          },
          {
            "value": 14117647058823530,
            "color": "rgba(213, 76, 84, 1)"
          },
          {
            "value": 14235294117647058,
            "color": "rgba(213, 75, 84, 1)"
          },
          {
            "value": 14352941176470588,
            "color": "rgba(212, 74, 85, 1)"
          },
          {
            "value": 14470588235294118,
            "color": "rgba(211, 72, 85, 1)"
          },
          {
            "value": 14588235294117646,
            "color": "rgba(210, 71, 85, 1)"
          },
          {
            "value": 14705882352941176,
            "color": "rgba(209, 70, 86, 1)"
          },
          {
            "value": 14823529411764706,
            "color": "rgba(208, 69, 86, 1)"
          },
          {
            "value": 14941176470588236,
            "color": "rgba(207, 68, 86, 1)"
          },
          {
            "value": 15058823529411764,
            "color": "rgba(206, 67, 86, 1)"
          },
          {
            "value": 15176470588235294,
            "color": "rgba(205, 66, 87, 1)"
          },
          {
            "value": 15294117647058822,
            "color": "rgba(204, 65, 87, 1)"
          },
          {
            "value": 15411764705882352,
            "color": "rgba(203, 64, 87, 1)"
          },
          {
            "value": 15529411764705884,
            "color": "rgba(202, 63, 88, 1)"
          },
          {
            "value": 15647058823529412,
            "color": "rgba(201, 62, 88, 1)"
          },
          {
            "value": 15764705882352942,
            "color": "rgba(200, 61, 88, 1)"
          },
          {
            "value": 15882352941176470,
            "color": "rgba(199, 61, 89, 1)"
          },
          {
            "value": 16000000000000000,
            "color": "rgba(198, 60, 89, 1)"
          },
          {
            "value": 16117647058823528,
            "color": "rgba(197, 59, 89, 1)"
          },
          {
            "value": 16235294117647058,
            "color": "rgba(196, 58, 90, 1)"
          },
          {
            "value": 16352941176470586,
            "color": "rgba(195, 57, 90, 1)"
          },
          {
            "value": 16470588235294120,
            "color": "rgba(194, 56, 90, 1)"
          },
          {
            "value": 16588235294117648,
            "color": "rgba(193, 55, 91, 1)"
          },
          {
            "value": 16705882352941178,
            "color": "rgba(192, 54, 91, 1)"
          },
          {
            "value": 16823529411764706,
            "color": "rgba(191, 54, 91, 1)"
          },
          {
            "value": 16941176470588236,
            "color": "rgba(190, 53, 92, 1)"
          },
          {
            "value": 17058823529411764,
            "color": "rgba(189, 52, 92, 1)"
          },
          {
            "value": 17176470588235294,
            "color": "rgba(187, 51, 92, 1)"
          },
          {
            "value": 17294117647058822,
            "color": "rgba(186, 50, 93, 1)"
          },
          {
            "value": 17411764705882354,
            "color": "rgba(185, 50, 93, 1)"
          },
          {
            "value": 17529411764705884,
            "color": "rgba(184, 49, 93, 1)"
          },
          {
            "value": 17647058823529412,
            "color": "rgba(183, 48, 94, 1)"
          },
          {
            "value": 17764705882352942,
            "color": "rgba(182, 47, 94, 1)"
          },
          {
            "value": 17882352941176470,
            "color": "rgba(181, 47, 94, 1)"
          },
          {
            "value": 18000000000000000,
            "color": "rgba(179, 46, 95, 1)"
          },
          {
            "value": 18117647058823530,
            "color": "rgba(178, 45, 95, 1)"
          },
          {
            "value": 18235294117647056,
            "color": "rgba(177, 45, 95, 1)"
          },
          {
            "value": 18352941176470588,
            "color": "rgba(176, 44, 95, 1)"
          },
          {
            "value": 18470588235294120,
            "color": "rgba(175, 43, 96, 1)"
          },
          {
            "value": 18588235294117650,
            "color": "rgba(174, 43, 96, 1)"
          },
          {
            "value": 18705882352941176,
            "color": "rgba(172, 42, 96, 1)"
          },
          {
            "value": 18823529411764704,
            "color": "rgba(171, 41, 96, 1)"
          },
          {
            "value": 18941176470588236,
            "color": "rgba(170, 41, 97, 1)"
          },
          {
            "value": 19058823529411764,
            "color": "rgba(169, 40, 97, 1)"
          },
          {
            "value": 19176470588235292,
            "color": "rgba(167, 40, 97, 1)"
          },
          {
            "value": 19294117647058824,
            "color": "rgba(166, 39, 97, 1)"
          },
          {
            "value": 19411764705882350,
            "color": "rgba(165, 38, 98, 1)"
          },
          {
            "value": 19529411764705884,
            "color": "rgba(164, 38, 98, 1)"
          },
          {
            "value": 19647058823529412,
            "color": "rgba(163, 37, 98, 1)"
          },
          {
            "value": 19764705882352940,
            "color": "rgba(161, 37, 98, 1)"
          },
          {
            "value": 19882352941176468,
            "color": "rgba(160, 36, 98, 1)"
          },
          {
            "value": 20000000000000000,
            "color": "rgba(159, 36, 98, 1)"
          },
          {
            "value": 20117647058823530,
            "color": "rgba(158, 35, 99, 1)"
          },
          {
            "value": 20235294117647060,
            "color": "rgba(156, 35, 99, 1)"
          },
          {
            "value": 20352941176470588,
            "color": "rgba(155, 34, 99, 1)"
          },
          {
            "value": 20470588235294120,
            "color": "rgba(154, 34, 99, 1)"
          },
          {
            "value": 20588235294117650,
            "color": "rgba(153, 34, 99, 1)"
          },
          {
            "value": 20705882352941176,
            "color": "rgba(151, 33, 99, 1)"
          },
          {
            "value": 20823529411764704,
            "color": "rgba(150, 33, 99, 1)"
          },
          {
            "value": 20941176470588236,
            "color": "rgba(149, 32, 99, 1)"
          },
          {
            "value": 21058823529411764,
            "color": "rgba(147, 32, 99, 1)"
          },
          {
            "value": 21176470588235296,
            "color": "rgba(146, 31, 99, 1)"
          },
          {
            "value": 21294117647058824,
            "color": "rgba(145, 31, 99, 1)"
          },
          {
            "value": 21411764705882350,
            "color": "rgba(144, 31, 99, 1)"
          },
          {
            "value": 21529411764705884,
            "color": "rgba(142, 30, 99, 1)"
          },
          {
            "value": 21647058823529412,
            "color": "rgba(141, 30, 99, 1)"
          },
          {
            "value": 21764705882352940,
            "color": "rgba(140, 30, 99, 1)"
          },
          {
            "value": 21882352941176468,
            "color": "rgba(138, 29, 99, 1)"
          },
          {
            "value": 22000000000000000,
            "color": "rgba(137, 29, 99, 1)"
          },
          {
            "value": 22117647058823532,
            "color": "rgba(136, 29, 99, 1)"
          },
          {
            "value": 22235294117647060,
            "color": "rgba(134, 29, 99, 1)"
          },
          {
            "value": 22352941176470588,
            "color": "rgba(133, 28, 99, 1)"
          },
          {
            "value": 22470588235294116,
            "color": "rgba(132, 28, 99, 1)"
          },
          {
            "value": 22588235294117650,
            "color": "rgba(130, 28, 99, 1)"
          },
          {
            "value": 22705882352941176,
            "color": "rgba(129, 28, 99, 1)"
          },
          {
            "value": 22823529411764704,
            "color": "rgba(128, 27, 98, 1)"
          },
          {
            "value": 22941176470588230,
            "color": "rgba(126, 27, 98, 1)"
          },
          {
            "value": 23058823529411770,
            "color": "rgba(125, 27, 98, 1)"
          },
          {
            "value": 23176470588235296,
            "color": "rgba(124, 27, 98, 1)"
          },
          {
            "value": 23294117647058824,
            "color": "rgba(122, 27, 98, 1)"
          },
          {
            "value": 23411764705882350,
            "color": "rgba(121, 26, 97, 1)"
          },
          {
            "value": 23529411764705884,
            "color": "rgba(120, 26, 97, 1)"
          },
          {
            "value": 23647058823529412,
            "color": "rgba(118, 26, 97, 1)"
          },
          {
            "value": 23764705882352940,
            "color": "rgba(117, 26, 97, 1)"
          },
          {
            "value": 23882352941176468,
            "color": "rgba(116, 26, 96, 1)"
          },
          {
            "value": 24000000000000000,
            "color": "rgba(114, 26, 96, 1)"
          },
          {
            "value": 24117647058823532,
            "color": "rgba(113, 25, 96, 1)"
          },
          {
            "value": 24235294117647060,
            "color": "rgba(112, 25, 95, 1)"
          },
          {
            "value": 24352941176470588,
            "color": "rgba(110, 25, 95, 1)"
          },
          {
            "value": 24470588235294116,
            "color": "rgba(109, 25, 94, 1)"
          },
          {
            "value": 24588235294117650,
            "color": "rgba(107, 25, 94, 1)"
          },
          {
            "value": 24705882352941176,
            "color": "rgba(106, 25, 94, 1)"
          },
          {
            "value": 24823529411764704,
            "color": "rgba(105, 25, 93, 1)"
          },
          {
            "value": 24941176470588236,
            "color": "rgba(103, 25, 93, 1)"
          },
          {
            "value": 25058823529411764,
            "color": "rgba(102, 24, 92, 1)"
          },
          {
            "value": 25176470588235296,
            "color": "rgba(101, 24, 92, 1)"
          },
          {
            "value": 25294117647058824,
            "color": "rgba(99, 24, 91, 1)"
          },
          {
            "value": 25411764705882350,
            "color": "rgba(98, 24, 91, 1)"
          },
          {
            "value": 25529411764705880,
            "color": "rgba(97, 24, 90, 1)"
          },
          {
            "value": 25647058823529412,
            "color": "rgba(95, 24, 90, 1)"
          },
          {
            "value": 25764705882352940,
            "color": "rgba(94, 24, 89, 1)"
          },
          {
            "value": 25882352941176470,
            "color": "rgba(93, 23, 88, 1)"
          },
          {
            "value": 26000000000000000,
            "color": "rgba(91, 23, 88, 1)"
          },
          {
            "value": 26117647058823530,
            "color": "rgba(90, 23, 87, 1)"
          },
          {
            "value": 26235294117647060,
            "color": "rgba(89, 23, 87, 1)"
          },
          {
            "value": 26352941176470588,
            "color": "rgba(87, 23, 86, 1)"
          },
          {
            "value": 26470588235294116,
            "color": "rgba(86, 23, 85, 1)"
          },
          {
            "value": 26588235294117644,
            "color": "rgba(85, 23, 85, 1)"
          },
          {
            "value": 26705882352941176,
            "color": "rgba(83, 22, 84, 1)"
          },
          {
            "value": 26823529411764708,
            "color": "rgba(82, 22, 83, 1)"
          },
          {
            "value": 26941176470588236,
            "color": "rgba(81, 22, 83, 1)"
          },
          {
            "value": 27058823529411764,
            "color": "rgba(79, 22, 82, 1)"
          },
          {
            "value": 27176470588235296,
            "color": "rgba(78, 22, 81, 1)"
          },
          {
            "value": 27294117647058824,
            "color": "rgba(77, 21, 81, 1)"
          },
          {
            "value": 27411764705882350,
            "color": "rgba(75, 21, 80, 1)"
          },
          {
            "value": 27529411764705880,
            "color": "rgba(74, 21, 79, 1)"
          },
          {
            "value": 27647058823529412,
            "color": "rgba(73, 21, 78, 1)"
          },
          {
            "value": 27764705882352944,
            "color": "rgba(71, 21, 78, 1)"
          },
          {
            "value": 27882352941176470,
            "color": "rgba(70, 20, 77, 1)"
          },
          {
            "value": 28000000000000000,
            "color": "rgba(69, 20, 76, 1)"
          },
          {
            "value": 28117647058823530,
            "color": "rgba(68, 20, 75, 1)"
          },
          {
            "value": 28235294117647060,
            "color": "rgba(66, 20, 75, 1)"
          },
          {
            "value": 28352941176470588,
            "color": "rgba(65, 19, 74, 1)"
          },
          {
            "value": 28470588235294116,
            "color": "rgba(64, 19, 73, 1)"
          },
          {
            "value": 28588235294117644,
            "color": "rgba(62, 19, 72, 1)"
          },
          {
            "value": 28705882352941176,
            "color": "rgba(61, 19, 71, 1)"
          },
          {
            "value": 28823529411764708,
            "color": "rgba(60, 18, 71, 1)"
          },
          {
            "value": 28941176470588236,
            "color": "rgba(59, 18, 70, 1)"
          },
          {
            "value": 29058823529411764,
            "color": "rgba(57, 18, 69, 1)"
          },
          {
            "value": 29176470588235292,
            "color": "rgba(56, 17, 68, 1)"
          },
          {
            "value": 29294117647058824,
            "color": "rgba(55, 17, 67, 1)"
          },
          {
            "value": 29411764705882350,
            "color": "rgba(54, 17, 66, 1)"
          },
          {
            "value": 29529411764705880,
            "color": "rgba(52, 17, 65, 1)"
          },
          {
            "value": 29647058823529412,
            "color": "rgba(51, 16, 65, 1)"
          },
          {
            "value": 29764705882352944,
            "color": "rgba(50, 16, 64, 1)"
          },
          {
            "value": 29882352941176470,
            "color": "rgba(48, 15, 63, 1)"
          },
          {
            "value": 30000000000000000,
            "color": "rgba(47, 15, 62, 1)"
          }
        ]
      }
  },
  HCHO: {
    unit: 'trillion molecules/cm²',
    dimension: 'Tropospheric Vertical Column Density', // Example dimension
    // --- NEW PROPERTY: Specifies the default layer ID from MAP_LAYERS ---
    defaultLayerId: 'HCHO_Hourly',
    // --- ---
    chartColorRamp: 
    {
      "statistics": [
        0,
        30000000000000000,
        5120630034198874,
        42635964221012970
      ],
      "stops": [
        {
          "value": 0,
          "color": "rgba(255, 255, 0, 1)"
        },
        {
          "value": 5120630034198874,
          "color": "rgba(255, 165, 0, 1)"
        },
        {
          "value": 30000000000000000,
          "color": "rgba(255, 0, 0, 1)"
        }
      ]
    }  
  },
  // Example for a different variable
  // O3: {
  //   unit: 'Dobson Units',
  //   dimension: 'Total Column Ozone',
  //   defaultLayerId: 'O3_Daily', // Example
  // }
};

// --- Define Default Starting Variable ---
// The 'variableLabel' to select when the application first loads.
export const DEFAULT_VARIABLE_LABEL = 'NO2'; // Set the desired default


// Template for creating new layer configurations
export const LAYER_TEMPLATE = {
  id: 'unique_layer_id',
  title: 'Layer Title',
  url: 'service_url',
  type: 'FeatureLayer', // Default type, overridden below
  visible: false, // Default visibility to false, will be controlled by context
  opacity: 1,
  // --- Removed renderer and popupTemplate for ImageServer layers ---
  // These are less relevant for ImageServer unless specifically configured
  // renderer: { ... },
  // popupTemplate: { ... }
};

// Active layer configurations
export const MAP_LAYERS = {
  NO2_Hourly: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Hourly',
    title: 'NO2 Hourly',
    url: 'https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2_Troposphere', // Specific field name in the service
    variableLabel: 'NO2', // Link to VARIABLE_DEFINITIONS
    // Unit and Dimension are now derived from VARIABLE_DEFINITIONS['NO2']
    colorMapType: 'Personalized', // Set to Personalized for this layer
    // --- UPDATED ColorMap: Store the Raster Function Arguments ---
    ColorMap: { // This object structure matches the 'rasterFunctionArguments' from your JSON
      colorRamp: {
        type: "multipart",
        colorRamps: [
          {"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[254,237,176,255],"toColor":[253,236,175,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[253,236,175,255],"toColor":[253,234,173,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[253,234,173,255],"toColor":[253,233,172,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[253,233,172,255],"toColor":[253,232,171,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[253,232,171,255],"toColor":[253,230,169,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[253,230,169,255],"toColor":[253,229,168,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[253,229,168,255],"toColor":[253,227,167,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[253,227,167,255],"toColor":[253,226,165,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[253,226,165,255],"toColor":[252,225,164,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[252,225,164,255],"toColor":[252,223,163,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[252,223,163,255],"toColor":[252,222,161,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[252,222,161,255],"toColor":[252,220,160,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[252,220,160,255],"toColor":[252,219,159,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[252,219,159,255],"toColor":[252,218,157,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[252,218,157,255],"toColor":[252,216,156,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[252,216,156,255],"toColor":[251,215,155,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[251,215,155,255],"toColor":[251,213,154,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[251,213,154,255],"toColor":[251,212,152,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[251,212,152,255],"toColor":[251,211,151,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[251,211,151,255],"toColor":[251,209,150,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[251,209,150,255],"toColor":[251,208,148,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[251,208,148,255],"toColor":[251,207,147,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[251,207,147,255],"toColor":[250,205,146,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[250,205,146,255],"toColor":[250,204,145,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[250,204,145,255],"toColor":[250,202,144,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[250,202,144,255],"toColor":[250,201,142,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[250,201,142,255],"toColor":[250,200,141,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[250,200,141,255],"toColor":[250,198,140,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[250,198,140,255],"toColor":[250,197,139,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[250,197,139,255],"toColor":[249,195,138,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[249,195,138,255],"toColor":[249,194,136,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[249,194,136,255],"toColor":[249,193,135,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[249,193,135,255],"toColor":[249,191,134,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[249,191,134,255],"toColor":[249,190,133,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[249,190,133,255],"toColor":[249,189,132,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[249,189,132,255],"toColor":[248,187,131,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[248,187,131,255],"toColor":[248,186,130,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[248,186,130,255],"toColor":[248,184,128,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[248,184,128,255],"toColor":[248,183,127,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[248,183,127,255],"toColor":[248,182,126,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[248,182,126,255],"toColor":[247,180,125,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[247,180,125,255],"toColor":[247,179,124,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[247,179,124,255],"toColor":[247,178,123,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[247,178,123,255],"toColor":[247,176,122,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[247,176,122,255],"toColor":[247,175,121,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[247,175,121,255],"toColor":[246,174,120,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[246,174,120,255],"toColor":[246,172,119,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[246,172,119,255],"toColor":[246,171,118,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[246,171,118,255],"toColor":[246,169,117,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[246,169,117,255],"toColor":[245,168,116,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[245,168,116,255],"toColor":[245,167,115,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[245,167,115,255],"toColor":[245,165,114,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[245,165,114,255],"toColor":[245,164,113,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[245,164,113,255],"toColor":[245,163,112,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[245,163,112,255],"toColor":[244,161,111,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[244,161,111,255],"toColor":[244,160,110,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[244,160,110,255],"toColor":[244,159,109,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[244,159,109,255],"toColor":[244,157,108,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[244,157,108,255],"toColor":[243,156,107,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[243,156,107,255],"toColor":[243,154,106,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[243,154,106,255],"toColor":[243,153,105,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[243,153,105,255],"toColor":[242,152,104,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[242,152,104,255],"toColor":[242,150,104,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[242,150,104,255],"toColor":[242,149,103,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[242,149,103,255],"toColor":[242,148,102,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[242,148,102,255],"toColor":[241,146,101,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[241,146,101,255],"toColor":[241,145,100,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[241,145,100,255],"toColor":[241,143,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[241,143,99,255],"toColor":[240,142,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[240,142,99,255],"toColor":[240,141,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[240,141,98,255],"toColor":[240,139,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[240,139,97,255],"toColor":[239,138,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[239,138,96,255],"toColor":[239,137,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[239,137,96,255],"toColor":[239,135,95,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[239,135,95,255],"toColor":[238,134,94,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[238,134,94,255],"toColor":[238,133,94,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[238,133,94,255],"toColor":[238,131,93,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[238,131,93,255],"toColor":[237,130,92,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[237,130,92,255],"toColor":[237,129,92,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[237,129,92,255],"toColor":[237,127,91,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[237,127,91,255],"toColor":[236,126,90,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[236,126,90,255],"toColor":[236,124,90,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[236,124,90,255],"toColor":[236,123,89,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[236,123,89,255],"toColor":[235,122,89,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[235,122,89,255],"toColor":[235,120,88,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[235,120,88,255],"toColor":[234,119,88,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[234,119,88,255],"toColor":[234,118,87,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[234,118,87,255],"toColor":[233,116,87,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[233,116,87,255],"toColor":[233,115,86,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[233,115,86,255],"toColor":[233,114,86,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[233,114,86,255],"toColor":[232,112,86,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[232,112,86,255],"toColor":[232,111,85,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[232,111,85,255],"toColor":[231,110,85,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[231,110,85,255],"toColor":[231,108,85,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[231,108,85,255],"toColor":[230,107,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[230,107,84,255],"toColor":[230,106,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[230,106,84,255],"toColor":[229,104,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[229,104,84,255],"toColor":[229,103,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[229,103,84,255],"toColor":[228,102,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[228,102,83,255],"toColor":[227,100,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[227,100,83,255],"toColor":[227,99,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[227,99,83,255],"toColor":[226,98,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[226,98,83,255],"toColor":[226,96,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[226,96,83,255],"toColor":[225,95,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[225,95,83,255],"toColor":[224,94,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[224,94,83,255],"toColor":[224,93,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[224,93,83,255],"toColor":[223,91,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[223,91,83,255],"toColor":[223,90,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[223,90,83,255],"toColor":[222,89,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[222,89,83,255],"toColor":[221,88,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[221,88,83,255],"toColor":[220,86,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[220,86,83,255],"toColor":[220,85,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[220,85,83,255],"toColor":[219,84,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[219,84,83,255],"toColor":[218,83,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[218,83,83,255],"toColor":[217,81,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[217,81,83,255],"toColor":[217,80,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[217,80,83,255],"toColor":[216,79,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[216,79,84,255],"toColor":[215,78,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[215,78,84,255],"toColor":[214,77,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[214,77,84,255],"toColor":[213,76,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[213,76,84,255],"toColor":[213,75,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[213,75,84,255],"toColor":[212,74,85,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[212,74,85,255],"toColor":[211,72,85,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[211,72,85,255],"toColor":[210,71,85,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[210,71,85,255],"toColor":[209,70,86,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[209,70,86,255],"toColor":[208,69,86,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[208,69,86,255],"toColor":[207,68,86,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[207,68,86,255],"toColor":[206,67,86,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[206,67,86,255],"toColor":[205,66,87,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[205,66,87,255],"toColor":[204,65,87,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[204,65,87,255],"toColor":[203,64,87,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[203,64,87,255],"toColor":[202,63,88,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[202,63,88,255],"toColor":[201,62,88,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[201,62,88,255],"toColor":[200,61,88,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[200,61,88,255],"toColor":[199,61,89,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[199,61,89,255],"toColor":[198,60,89,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[198,60,89,255],"toColor":[197,59,89,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[197,59,89,255],"toColor":[196,58,90,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[196,58,90,255],"toColor":[195,57,90,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[195,57,90,255],"toColor":[194,56,90,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[194,56,90,255],"toColor":[193,55,91,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[193,55,91,255],"toColor":[192,54,91,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[192,54,91,255],"toColor":[191,54,91,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[191,54,91,255],"toColor":[190,53,92,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[190,53,92,255],"toColor":[189,52,92,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[189,52,92,255],"toColor":[187,51,92,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[187,51,92,255],"toColor":[186,50,93,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[186,50,93,255],"toColor":[185,50,93,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[185,50,93,255],"toColor":[184,49,93,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[184,49,93,255],"toColor":[183,48,94,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[183,48,94,255],"toColor":[182,47,94,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[182,47,94,255],"toColor":[181,47,94,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[181,47,94,255],"toColor":[179,46,95,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[179,46,95,255],"toColor":[178,45,95,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[178,45,95,255],"toColor":[177,45,95,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[177,45,95,255],"toColor":[176,44,95,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[176,44,95,255],"toColor":[175,43,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[175,43,96,255],"toColor":[174,43,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[174,43,96,255],"toColor":[172,42,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[172,42,96,255],"toColor":[171,41,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[171,41,96,255],"toColor":[170,41,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[170,41,97,255],"toColor":[169,40,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[169,40,97,255],"toColor":[167,40,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[167,40,97,255],"toColor":[166,39,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[166,39,97,255],"toColor":[165,38,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[165,38,98,255],"toColor":[164,38,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[164,38,98,255],"toColor":[163,37,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[163,37,98,255],"toColor":[161,37,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[161,37,98,255],"toColor":[160,36,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[160,36,98,255],"toColor":[159,36,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[159,36,98,255],"toColor":[158,35,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[158,35,99,255],"toColor":[156,35,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[156,35,99,255],"toColor":[155,34,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[155,34,99,255],"toColor":[154,34,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[154,34,99,255],"toColor":[153,34,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[153,34,99,255],"toColor":[151,33,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[151,33,99,255],"toColor":[150,33,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[150,33,99,255],"toColor":[149,32,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[149,32,99,255],"toColor":[147,32,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[147,32,99,255],"toColor":[146,31,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[146,31,99,255],"toColor":[145,31,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[145,31,99,255],"toColor":[144,31,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[144,31,99,255],"toColor":[142,30,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[142,30,99,255],"toColor":[141,30,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[141,30,99,255],"toColor":[140,30,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[140,30,99,255],"toColor":[138,29,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[138,29,99,255],"toColor":[137,29,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[137,29,99,255],"toColor":[136,29,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[136,29,99,255],"toColor":[134,29,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[134,29,99,255],"toColor":[133,28,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[133,28,99,255],"toColor":[132,28,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[132,28,99,255],"toColor":[130,28,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[130,28,99,255],"toColor":[129,28,99,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[129,28,99,255],"toColor":[128,27,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[128,27,98,255],"toColor":[126,27,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[126,27,98,255],"toColor":[125,27,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[125,27,98,255],"toColor":[124,27,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[124,27,98,255],"toColor":[122,27,98,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[122,27,98,255],"toColor":[121,26,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[121,26,97,255],"toColor":[120,26,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[120,26,97,255],"toColor":[118,26,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[118,26,97,255],"toColor":[117,26,97,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[117,26,97,255],"toColor":[116,26,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[116,26,96,255],"toColor":[114,26,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[114,26,96,255],"toColor":[113,25,96,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[113,25,96,255],"toColor":[112,25,95,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[112,25,95,255],"toColor":[110,25,95,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[110,25,95,255],"toColor":[109,25,94,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[109,25,94,255],"toColor":[107,25,94,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[107,25,94,255],"toColor":[106,25,94,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[106,25,94,255],"toColor":[105,25,93,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[105,25,93,255],"toColor":[103,25,93,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[103,25,93,255],"toColor":[102,24,92,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[102,24,92,255],"toColor":[101,24,92,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[101,24,92,255],"toColor":[99,24,91,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[99,24,91,255],"toColor":[98,24,91,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[98,24,91,255],"toColor":[97,24,90,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[97,24,90,255],"toColor":[95,24,90,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[95,24,90,255],"toColor":[94,24,89,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[94,24,89,255],"toColor":[93,23,88,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[93,23,88,255],"toColor":[91,23,88,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[91,23,88,255],"toColor":[90,23,87,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[90,23,87,255],"toColor":[89,23,87,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[89,23,87,255],"toColor":[87,23,86,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[87,23,86,255],"toColor":[86,23,85,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[86,23,85,255],"toColor":[85,23,85,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[85,23,85,255],"toColor":[83,22,84,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[83,22,84,255],"toColor":[82,22,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[82,22,83,255],"toColor":[81,22,83,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[81,22,83,255],"toColor":[79,22,82,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[79,22,82,255],"toColor":[78,22,81,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[78,22,81,255],"toColor":[77,21,81,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[77,21,81,255],"toColor":[75,21,80,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[75,21,80,255],"toColor":[74,21,79,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[74,21,79,255],"toColor":[73,21,78,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[73,21,78,255],"toColor":[71,21,78,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[71,21,78,255],"toColor":[70,20,77,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[70,20,77,255],"toColor":[69,20,76,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[69,20,76,255],"toColor":[68,20,75,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[68,20,75,255],"toColor":[66,20,75,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[66,20,75,255],"toColor":[65,19,74,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[65,19,74,255],"toColor":[64,19,73,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[64,19,73,255],"toColor":[62,19,72,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[62,19,72,255],"toColor":[61,19,71,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[61,19,71,255],"toColor":[60,18,71,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[60,18,71,255],"toColor":[59,18,70,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[59,18,70,255],"toColor":[57,18,69,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[57,18,69,255],"toColor":[56,17,68,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[56,17,68,255],"toColor":[55,17,67,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[55,17,67,255],"toColor":[54,17,66,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[54,17,66,255],"toColor":[52,17,65,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[52,17,65,255],"toColor":[51,16,65,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[51,16,65,255],"toColor":[50,16,64,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[50,16,64,255],"toColor":[48,15,63,255]},{"type":"algorithmic","algorithm":"esriHSVAlgorithm","fromColor":[48,15,63,255],"toColor":[47,15,62,255]}
        ]

      },
      Raster: { // This corresponds to the nested "Raster" part of your JSON
        rasterFunctionArguments: {
          StretchType: 5,
          Statistics: [[0, 30000000000000000, 169933132046326.3, 1037511280757571.9]],
          DRA: false,
          UseGamma: true,
          Gamma: [1],
          ComputeGamma: false
        },
        rasterFunction: "Stretch",
        outputPixelType: "U8",
        variableName: "Raster" // This might need adjustment based on service specifics
      }
    },
    // --- ---
  },
  
  NO2_Daily: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Daily',
    title: 'NO2 Daily',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_NO2_L3_V03_Daily_Maximum/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2_Troposphere',
    variableLabel: 'NO2', // Link to VARIABLE_DEFINITIONS
    colorMapType: 'noColorMap',
  },

  NO2_Monthly: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Monthly',
    title: 'NO2 Monthly',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_NO2_L3_V03_Monthly_Mean/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2_Troposphere',
    variableLabel: 'NO2', // Link to VARIABLE_DEFINITIONS
    colorMapType: 'noColorMap',
  },

  HCHO_Hourly: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Hourly',
    title: 'HCHO Hourly',
    url: 'https://gis.earthdata.nasa.gov/image/rest/services/C2930761273-LARC_CLOUD/TEMPO_HCHO_L3_V03_HOURLY_VERTICAL_COLUMN/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO', // Specific field name in the service
    variableLabel: 'HCHO', // Link to VARIABLE_DEFINITIONS
    colorMapType: 'Personalized', // Set to Personalized
    ColorMap: { // Add the provided raster function arguments
        colorRampName: "Yellow to Red", // From the provided JSON
        Raster: {
            rasterFunctionArguments: {
                StretchType: 5,
                // Updated Statistics for HCHO
                Statistics: [[0, 30000000000000000, 5120630034198874, 42635964221012970]],
                DRA: false,
                UseGamma: true,
                Gamma: [1],
                ComputeGamma: false,
                Min: 0, // From the provided JSON
                Max: 255 // From the provided JSON
            },
            rasterFunction: "Stretch",
            outputPixelType: "U8",
            variableName: "Raster"
        }
    },
  },

  HCHO_Daily: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Daily',
    title: 'HCHO Daily',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_HCHO_L3_V03_Daily_Maximum/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO',
    variableLabel: 'HCHO', // Link to VARIABLE_DEFINITIONS
    colorMapType: 'noColorMap',
  },

  HCHO_Monthly: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Monthly',
    title: 'HCHO Monthly',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_HCHO_L3_V03_Monthly_Mean/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO',
    variableLabel: 'HCHO', // Link to VARIABLE_DEFINITIONS
    colorMapType: 'noColorMap',
  }
  // Add other layers here, referencing their variableLabel
}; 