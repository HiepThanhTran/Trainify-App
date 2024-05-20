import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

const loadFonts = async () => {
    await Font.loadAsync({
        OpenSansBold: require('../assets/fonts/OpenSans-Bold.ttf'),
        OpenSansSemiBold: require('../assets/fonts/OpenSans-SemiBold.ttf'),
        OpenSansLight: require('../assets/fonts/OpenSans-Light.ttf'),
        OpenSansMedium: require('../assets/fonts/OpenSans-Medium.ttf'),
        OpenSansRegular: require('../assets/fonts/OpenSans-Regular.ttf'),
        OpenSansItalic: require('../assets/fonts/OpenSans-Italic.ttf'),
    });
};

const useFonts = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadAsyncFonts = async () => {
            await loadFonts();
            setFontsLoaded(true);
        };

        loadAsyncFonts();
    }, []);

    return fontsLoaded;
};

export default useFonts;
