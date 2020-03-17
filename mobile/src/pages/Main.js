import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

function Main({ navigation }) { // essa propriedade vem de forma automática a todas as páginas da aplicação citadas em routes.js
    const [currentRegion, setCurrentRegion] = useState(null);
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync(); // verificar a resposta do usuário

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true, // usar o GPS para obter uma localização mais precisa. GPS PRECISA ESTAR HABILITADO. sem isso, ele busca a localização via sua conexão a internet
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04, // zoom no mapa
                })
            }
        }

        loadInitialPosition();
    }, []);

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]) // TODA A VEZ QUE DEVS FOR ALTERADA

    function setupWebsocket() {
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(latitude, longitude, techs);
    }

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data.devs);
        setupWebsocket();
    }

    function handleRegionChange(region) { // atualizar a localização atual do usuário conforme esta é alterada. a região vem por padrão naquele método
        setCurrentRegion(region)
    }

    if (!currentRegion) { // enquanto currentRegion for nulo
        return null; // o mapa só será mostrado quando for obtida a localização atual do usuário
    }

    return (
        <>
        <MapView 
            onRegionChangeComplete={handleRegionChange} 
            initialRegion={currentRegion} 
            style={styles.map}
        > 
            {devs.map(dev => (
                <Marker 
                    key={dev._id}
                    coordinate={{ 
                        latitude: dev.location.coordinates[1], 
                        longitude: dev.location.coordinates[0] 
                    }} 
                >
                    <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

                    <Callout onPress={() => {
                        // navegação
                        navigation.navigate('Profile', { github_username: dev.github_username }) // enviar para página com parâmetros
                    }}>
                        <View style={styles.callout}>
                            <Text style={styles.devName}>{dev.name}</Text>
                            <Text style={styles.devBio}>{dev.bio}</Text>
                            <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                        </View>
                    </Callout>
                </Marker>
            ))}
        </MapView>
        <View style={styles.searchForm}>
            <TextInput 
                style={styles.searchInput} 
                placeholder="Buscar devs por techs..."
                placeholderTextColor="#999"
                autoCapitalize="words" // primeira letra de cada palavra maiúscula
                autoCorrect={false}
                value={techs}
                onChangeText={text => setTechs(text)} // pode ser só setTechs, tbm
            />

            <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                <MaterialIcons name="my-location" size={20} color="#fff" />
            </TouchableOpacity>

        </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff',
    },

    callout: {
        width: 260
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },

    devBio: {
        color: '#666',
        marginTop: 5
    },

    devTechs: {
        marginTop: 5
    },

    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2 // já do sombra -> android. o de cima é para IOS
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
})

export default Main;