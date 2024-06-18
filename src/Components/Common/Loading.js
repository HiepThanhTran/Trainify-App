import { ActivityIndicator, View } from 'react-native';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';

const Loading = ({ children, ...options }) => {
   return (
      <View style={{ ...GlobalStyle.Container, ...options.style }}>
         {children}
         <ActivityIndicator size={options?.size ?? 'large'} color={Theme.PrimaryColor} />
      </View>
   );
};

export default Loading;
