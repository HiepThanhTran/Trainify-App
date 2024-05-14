import * as Font from 'expo-font';

const Fonts = async () => {
    await Font.loadAsync({
        'OpenSansBold': require('./OpenSans-Bold.ttf'),
        'OpenSansSemiBold': require('./OpenSans-SemiBold.ttf'),
        'OpenSansLight': require('./OpenSans-Light.ttf'),
        'OpenSansMedium': require('./OpenSans-Medium.ttf'),
        'OpenSansRegular': require('./OpenSans-Regular.ttf'),
        'OpenSansItalic': require('./OpenSans-Italic.ttf')
    });
};

export default Fonts;