import { useState } from "react";
import { View, Text } from "react-native";

const Activity = ({route}) => {
    const [activity, setActivity] = useState([]);
    
    const bulletinID = route.params?.bulletinID;
    return(
        <View>
            <Text>Activity {bulletinID}</Text>
        </View>
    );
};

export default Activity;