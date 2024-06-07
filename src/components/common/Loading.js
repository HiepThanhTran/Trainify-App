import { ActivityIndicator, View } from 'react-native';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';

const Loading = ({ children, ...options }) => {
   return (
      <View style={{ ...GlobalStyle.Container, ...{ marginBottom: 16 }, ...options.style }}>
         {children}
         <ActivityIndicator size={options?.size ?? 'large'} color={Theme.PrimaryColor} />
      </View>
   );
};

export default Loading;
