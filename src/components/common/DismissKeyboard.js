import { Keyboard, TouchableOpacity } from 'react-native';

const DismissKeyboard = ({ children, ...props }) => {
   return (
      <TouchableOpacity
         style={{ ...props?.style, flex: 1 }}
         activeOpacity={1}
         onPress={() => {
            Keyboard.dismiss();
            props.onPress ? props.onPress() : null;
         }}
      >
         {children}
      </TouchableOpacity>
   );
};

export default DismissKeyboard;
