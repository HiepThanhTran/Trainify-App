import { View, Text, TextInput, ActivityIndicator, Image, ScrollView } from "react-native";
import HomeStyle from "./Style";
import GlobalStyle from '../../styles/Style'
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import APIs, { endPoints } from "../../configs/APIs";
import { RefreshControl } from "react-native";

const Home = () => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const loadBulletins = async () => {
        try {
            setLoading(true);
            let res = await APIs.get(endPoints['bulletins']);
            setBulletins(res.data.results);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBulletins();
    }, []);

    return (
        <View style={HomeStyle.HomeContainer}>
            <View style={HomeStyle.TopContainer}>
                <Text style={[GlobalStyle.Bold, HomeStyle.Text]}>Bản tin</Text>
                <AntDesign name="message1" size={28} color="#3e9ae4" />
            </View>

            <View style={HomeStyle.Search}>
                <AntDesign name="search1" size={24} color="#3e9ae4" style={{ marginRight: 5 }} />
                <TextInput 
                    style={[GlobalStyle.Regular, HomeStyle.SearchInput]}
                    placeholder="Tìm kiếm bảng tin"
                    placeholderTextColor={'gray'}
                />
            </View>

            <ScrollView style={HomeStyle.BulletinsCardContainer}>
                <RefreshControl onRefresh={() => loadBulletins()}/>
                {bulletins && bulletins.map((c) => (
                    <View key={c.id} style={HomeStyle.BulletinsCard}>
                        <View style={HomeStyle.BulletinsCardImage}>
                            <Image style={HomeStyle.Image} source={{ uri: c.cover }} />
                        </View>
                        <View style={HomeStyle.BulletinsCardDetail}>
                            <Text style={[HomeStyle.Title, GlobalStyle.Bold]}>{c.title}</Text>
                            <Text style={[HomeStyle.Content, GlobalStyle.Regular]} numberOfLines={2} ellipsizeMode="...">{c.content}</Text>
                            <Text style={[HomeStyle.Date, GlobalStyle.Regular]}>Ngày tạo: {formatDate(c.created_date)}</Text>
                        </View>
                    </View>
                ))}
                {loading && <ActivityIndicator size="large" color="#3e9ae4" />}
            </ScrollView>
        </View>
    );
}

export default Home;
