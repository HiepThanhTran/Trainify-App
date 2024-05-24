import { View, Text, ActivityIndicator, Image } from "react-native";
import GlobalStyle from "../../styles/Style";
import { useEffect, useState } from "react";
import APIs, { endPoints } from "../../configs/APIs";
import BulletinStyle from "./BulletinStyle";

const BulletinDetail = ({ route }) => {
    const [bulletindetail, setBulletinDetail] = useState([]);
    const bulletinID = route.params?.bulletinID;

    const loadBulletinDetail = async () => {
        try {
            let res = await APIs.get(endPoints['bulletin-detail'](bulletinID));
            setBulletinDetail(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadBulletinDetail();
    }, [bulletinID]);

    return (
        <View style={GlobalStyle.BackGround}>
            <View style={BulletinStyle.Container}>
                <View key={bulletindetail.id}>
                    <Text>{bulletindetail.title}</Text>
                    <View style={BulletinStyle.BulletinCardImage}>
                        <Image
                            style={BulletinStyle.Image}
                            source={{ uri: bulletindetail.cover }}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default BulletinDetail;