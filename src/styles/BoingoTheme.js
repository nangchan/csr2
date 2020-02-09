import { createMuiTheme } from '@material-ui/core/styles';

const THEME_COLORS = {
  DEFAULT_WHITE: 'rgba(255, 255, 255)',
  DEFAULT_BLACK: 'rgba(0, 0, 0, 0.87)',

  BOINGO_LIGHTER_RED: '#fa301e',
  BOINGO_LIGHT_RED: '#e13827',
  BOINGO_RED: '#d52b1e',
  BOINGO_DARK_RED: '#b4261e',

  BOINGO_LIGHT_BLUE: '#4ea0e6',
  BOINGO_BLUE: '#337ab7',
  BOINGO_DARK_BLUE: '#346fa3',
};

const BoingoTheme = (isDark) => createMuiTheme({
  palette: {
    type: isDark ? 'dark' : 'light',
    primary: {
      light: THEME_COLORS.BOINGO_LIGHT_BLUE,
      main: THEME_COLORS.BOINGO_BLUE,
      dark: THEME_COLORS.BOINGO_DARK_BLUE,
    },
    secondary: {
      light: isDark ? THEME_COLORS.BOINGO_LIGHT_RED : THEME_COLORS.BOINGO_LIGHTER_RED,
      main: isDark ? THEME_COLORS.BOINGO_RED : THEME_COLORS.BOINGO_LIGHT_RED,
      dark: isDark ? THEME_COLORS.BOINGO_DARK_RED : THEME_COLORS.BOINGO_RED,
    },
    /* defaults: https://material-ui.com/customization/palette/#custom-palette
    primary: {
      light: palette.primary[300],
      main: palette.primary[500],
      dark: palette.primary[700],
      contrastText: getContrastText(palette.primary[500]),
    },
    secondary: {
      light: palette.secondary.A200,
      main: palette.secondary.A400,
      dark: palette.secondary.A700,
      contrastText: getContrastText(palette.secondary.A400),
    },
    error: {
      light: palette.error[300],
      main: palette.error[500],
      dark: palette.error[700],
      contrastText: getContrastText(palette.error[500]),
    },
    */
  },
  overrides: {
    // Style sheet name ⚛️
    MuiFormHelperText: {
      // Name of the rule/variant
      contained: { // override margin of helper text
        marginLeft:0
      },
    },
    MuiFormLabel: {
      root: {
        '&.Mui-focused:not(.Mui-error)': { // override focus theme with default theme if not error
          color: isDark ? 'rgba(255, 255, 255, 0.54)' : 'rgba(0, 0, 0, 0.54)',
        }
      }
    },
    MuiOutlinedInput: { // override focus border-color not error
      root: {
        '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
          borderWidth: '1px'
        }
      },
      input: {
        '&[type=search]': {
          appearance: 'textfield', // fix for Safari rendering search fields
        }
      },
    },
    MuiSelect: {
      select: {
        '&:focus': { // override focus background on select element with default theme
          borderRadius: 4,
        }
      }
    },
    MuiList: {
      padding: {
        paddingTop:0,
        paddingBottom:0,
      }
    },
  },
});

export default BoingoTheme;