import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import GlobalStyle, { screenHeight, screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';

const Splash = ({ navigation }) => {
   const refLottieView = useRef(LottieView);

   const animations = [
      {
         id: 1,
         title: 'Điểm rèn luyện',
         description: 'Cùng nhau tham gia các hoạt động để tích lũy điểm rèn luyện',
         image: require('../../assets/animations/Study.json'),
      },
      {
         id: 2,
         title: 'Thống kê',
         description: 'Điểm rèn luyện sinh viên sẽ được thống kê một cách rõ ràng ',
         image: require('../../assets/animations/Statistical.json'),
      },
      {
         id: 3,
         title: 'Tư vấn',
         description: 'Đội ngũ chuyên viên nhiệt tình, giải quyết mọi thắc mắc của sinh viên',
         image: require('../../assets/animations/Advise.json'),
      },
   ];

   const handleDone = async () => {
      await AsyncStorage.setItem('splash-done', 'true');
      navigation.reset({
         index: 0,
         routes: [{ name: 'SignIn' }],
      });
   };

   const renderButton = (label) => {
      return (
         <View style={{ padding: 12 }}>
            <Text style={SplashStyle.Button}>{label}</Text>
         </View>
      );
   };

   return (
      <AppIntroSlider
         style={GlobalStyle.BackGround}
         data={animations}
         showSkipButton
         onDone={handleDone}
         renderItem={({ item }) => {
            return (
               <View key={item.id} style={SplashStyle.OnboardingContainer}>
                  {item.image && (
                     <LottieView
                        style={SplashStyle.OnboardingImage}
                        source={item.image}
                        ref={refLottieView}
                        autoPlay
                        loop
                     />
                  )}
                  <Text style={SplashStyle.OnboardingTitle}>{item.title}</Text>
                  <Text style={SplashStyle.OnboardingDescription}>{item.description}</Text>
               </View>
            );
         }}
         activeDotStyle={{ backgroundColor: Theme.PrimaryColor, width: 20 }}
         renderNextButton={() => renderButton('Tiếp tục')}
         renderSkipButton={() => renderButton('Bỏ qua')}
         renderDoneButton={() => renderButton('Hoàn tất')}
      />
   );
};

const SplashStyle = StyleSheet.create({
   OnboardingContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 15,
      paddingTop: screenHeight / 10,
   },
   OnboardingImage: {
      width: screenWidth + 50,
      height: 330,
      resizeMode: 'contain',
   },
   OnboardingTitle: {
      fontSize: 28,
      marginTop: 60,
      fontFamily: Theme.Bold,
   },
   OnboardingDescription: {
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center',
      lineHeight: 30,
      fontFamily: Theme.SemiBold,
   },
   Button: {
      fontWeight: '600',
      fontSize: 16,
      fontFamily: Theme.SemiBold,
   },
});

export default Splash;
