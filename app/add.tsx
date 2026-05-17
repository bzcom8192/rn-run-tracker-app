import { supabase } from '@/services/supabase';
import Feather from '@expo/vector-icons/Feather';
import * as Base64 from "base64-arraybuffer";
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Add() {
    const [location, setLocation] = useState('')
    const [distance, setDistance] = useState('')
    const [timeOfDay, setTimeOfDay] = useState(0)
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('ไม่ได้รับอนุญาต', 'โปรดอนุญาตให้แอปเข้าถึงรูปภาพของคุณเพื่อเลือกภาพ');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0];
            setImageUri(selectedImage.uri);
            setBase64Image(selectedImage.base64 || null);
        }
    };


    const handlePressSave = async () => {
        if (!location || !distance) {
            Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดกรอกสถานที่และระยะทางก่อนบันทึก');
            return;
        }

        let imageUrl = null;

        if (base64Image) {
            const { data, error } = await supabase.storage.from('run_bk')
                .upload(`run-${Date.now()}.jpg`, Base64.decode(base64Image), {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: 'image/jpeg',
                });

            if (error) {
                Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถอัปโหลดรูปภาพได้ โปรดลองอีกครั้ง');
                console.error('Error uploading image:', error);
                return;
            }

            const { data: publicUrlData } = supabase.storage.from('run_bk').getPublicUrl(data.path);
            imageUrl = publicUrlData.publicUrl;
        }

        const { data, error } = await supabase.
            from('runs')
            .insert({
                location,
                distance: parseFloat(distance),
                time_of_day: timeOfDay === 0 ? 'morning' : 'evening',
                image_url: imageUrl,
            })

        if (error) {
            Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง');
            console.error('Error inserting run data:', error);
        } else {
            Alert.alert('บันทึกข้อมูลสำเร็จ', 'ข้อมูลการวิ่งได้รับการบันทึกแล้ว', [
                { text: 'ตกลง', onPress: () => router.back() }
            ]);
        }
    };


    return (
        <View style={{
            paddingHorizontal: 20,
            paddingTop: 50,
        }}>
            <Text style={{
                fontSize: 18,
                fontFamily: "Kanit_600SemiBold",
                marginBottom: 8,
            }}>สถานที่วิ่ง</Text>
            <TextInput placeholder='เช่น สวนลุมพินี'
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    backgroundColor: '#eee',
                    padding: 10,
                    fontSize: 16,
                    fontFamily: "Kanit_400Regular",
                }}
                onChangeText={setLocation}
            />
            <Text style={{
                fontSize: 18,
                fontFamily: "Kanit_600SemiBold",
                marginBottom: 8,
                marginTop: 20,
            }}>ระยะทาง (กิโลเมตร)</Text>
            <TextInput placeholder='เช่น 5.2'
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    backgroundColor: '#eee',
                    padding: 10,
                    fontSize: 16,
                    fontFamily: "Kanit_400Regular",
                }}
                keyboardType='numeric'
                onChangeText={setDistance}
            />
            <Text style={{
                fontFamily: "Kanit_600SemiBold",
                fontSize: 18,
                marginBottom: 8,
                marginTop: 20,
            }}>ช่วงเวลา</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={{
                    marginTop: 10,
                    height: 40,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: timeOfDay === 0 ? '#2595ff' : '#ccc',
                        height: 40,
                        paddingHorizontal: 20,
                        borderRadius: 20,
                        justifyContent: 'center',
                        marginRight: 10,
                    }}
                    onPress={() => setTimeOfDay(0)}
                >
                    <Text style={{
                        color: timeOfDay === 0 ? "white" : "#555",
                        fontFamily: "Kanit_400Regular",
                    }}>เช้า</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: timeOfDay === 1 ? '#2595ff' : '#ccc',
                        height: 40,
                        paddingHorizontal: 20,
                        borderRadius: 20,
                        justifyContent: 'center',
                        marginRight: 10,
                    }}
                    onPress={() => setTimeOfDay(1)}
                >
                    <Text style={{
                        color: timeOfDay === 1 ? "white" : "#555",
                        fontFamily: "Kanit_400Regular",
                    }}>เย็น</Text>
                </TouchableOpacity>
            </ScrollView>
            <Text
                style={{
                    fontSize: 16,
                    marginTop: 15,
                    fontFamily: 'Kanit_600SemiBold',
                }}
            >รูปภาพสถานที่</Text>
            <TouchableOpacity
                style={{
                    marginTop: 10,
                    minHeight: 120,
                    height: "auto",
                    maxHeight: 240,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={pickImage}
            >
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                    }} />
                ) : (
                    <>
                        <Feather name="camera" size={40} color="#999" />
                        <Text style={{
                            color: '#999',
                            fontFamily: 'Kanit_400Regular',
                        }}>กดเพื่อถ่ายภาพ</Text>
                    </>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    marginTop: 30,
                    backgroundColor: '#2595ff',
                    paddingVertical: 15,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={handlePressSave}
            >
                <Text style={{
                    color: 'white',
                    fontSize: 16,
                    fontFamily: 'Kanit_600SemiBold',
                }}>บันทึกข้อมูล</Text>
            </TouchableOpacity>
        </View >
    )
}