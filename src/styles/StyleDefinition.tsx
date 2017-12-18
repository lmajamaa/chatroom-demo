import { Theme } from 'material-ui/styles';

export default class StyleDefinition {
  static getStyles = (theme: Theme) => ({
    root: {
      width: '100%',
      height: '100%',
      marginTop: 0,
      zIndex: 1,
      overflow: 'hidden' as 'hidden',
    },
    appFrame: {
      position: 'relative' as 'relative',
      display: 'flex',
      width: '100%',
      height: '100%',
    },
    appBar: {
      backgroundColor: '#232323',
      position: 'fixed' as 'fixed',
      left: 0,
      right: 0,
    },
    toolBar: {
      paddingLeft: 10,
      paddingRight: 10
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center' as 'center',
      padding: 15,
    },
    drawerPaper: {
      backgroundColor: '#232323',
      position: 'fixed' as 'fixed',
      height: 'calc(100% - 64px - 64px)',
      marginTop: 64,
      width: 240,
      maxHeight: 800,
    },
    content: {
      position: 'fixed' as 'fixed',
      left: 0,
      right: 0,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      height: 'calc(100% - 56px - 56px)',
      marginTop: 56,
      [theme.breakpoints.up('sm')]: {
        height: 'calc(100% - 64px - 64px)',
        marginTop: 64,
      },
      overflowY: 'auto' as 'auto',
    },
    bottomNavigation: {
      backgroundColor: '#232323',
      height: 'auto',
      zIndex: 2000,
    },
    textField: {
      width: '50%',
      marginLeft: '20%',
    },
    listItem: {
      paddingTop: 0,
      paddingBottom: 5,
    },
  })
}