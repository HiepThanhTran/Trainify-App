import { View, Text } from "react-native";

const UpdateAndDeleteActivity = (route) => {
    const actitivyUserCreateID = route?.params?.actitivyUserCreateID;
    return (
        <View>
            <Text>Hoạt động {actitivyUserCreateID}</Text>
        </View>
    )
}

export default UpdateAndDeleteActivity;