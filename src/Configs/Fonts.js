import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

const loadFonts = async () => {
   await Font.loadAsync({
      OpenSansBold: require('../Assets/Fonts/OpenSans-Bold.ttf'),
      OpenSansSemiBold: require('../Assets/Fonts/OpenSans-SemiBold.ttf'),
      OpenSansLight: require('../Assets/Fonts/OpenSans-Light.ttf'),
      OpenSansMedium: require('../Assets/Fonts/OpenSans-Medium.ttf'),
      OpenSansRegular: require('../Assets/Fonts/OpenSans-Regular.ttf'),
      OpenSansItalic: require('../Assets/Fonts/OpenSans-Italic.ttf'),
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
