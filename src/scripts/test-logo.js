import fs from 'fs';

// Bull silhouette vector path carefully drawn to match the classic Spanish Toro silhouette from logo_angelini_ok.jpg
// Scaled & centered inside a circle with center (65, 72) and radius 52
const bullPath = `
M 28 42
C 24 35, 18 38, 14 43
C 11 48, 16 52, 19 50
C 22 47, 24 49, 25 54
C 26 62, 28 69, 31 75
C 32 78, 30 83, 31 89
C 32 94, 35 97, 39 96
C 42 95, 43 91, 41 87
C 39 82, 42 77, 46 76
C 48 76, 50 82, 53 87
C 55 90, 58 92, 61 90
C 64 88, 64 83, 62 79
C 60 74, 62 72, 66 73
C 70 74, 73 80, 77 86
C 79 90, 83 91, 86 88
C 88 85, 87 79, 84 75
C 82 71, 84 66, 88 68
C 91 69, 93 75, 96 80
C 98 83, 102 83, 104 79
C 106 75, 104 69, 100 65
C 96 61, 98 56, 103 57
C 107 58, 112 55, 115 50
C 118 45, 114 41, 109 40
C 105 39, 102 42, 98 40
C 93 37, 88 33, 81 33
C 74 33, 68 36, 61 38
C 54 40, 47 38, 41 40
C 36 41, 32 44, 28 42
Z
`;
