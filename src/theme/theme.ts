import { palette } from "./palette";
import { customShadows, shadows } from "./shadws";
import { createTheme } from '@tuval/forms';
import { typography } from "./typography";
import { Typography } from "./overrides/Typography";

const themeOptions = {
    palette,
    shape: { borderRadius: 8 },
    typography,
   /*  shadows, */
    customShadows,
}


export const theme = createTheme(themeOptions);
theme.components = Typography(theme);
//console.log(theme);

