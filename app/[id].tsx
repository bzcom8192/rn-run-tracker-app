import { supabase } from '@/services/supabase';
import { RunData } from '@/types';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RunDetail() {
  const params = useLocalSearchParams<Partial<Record<keyof RunData, string>>>();
  const [runDetail, setRunDetail] = React.useState<RunData | null>(null);

  const fetchRunDetail = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('runs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching run detail:', error);
        return;
      }
      setRunDetail(data as RunData);
    } catch (error) {
      void error;
      console.error('Error fetching run detail:', error);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchRunDetail(params.id);
    }
  }, [params.id]);


  const handlePressSave = async () => {
    if (!runDetail) return;
    if (!runDetail.location || !runDetail.distance) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดกรอกสถานที่และระยะทางก่อนบันทึก');
      return;
    }

    const { data, error } = await supabase.from('runs')
      .update({
        location: runDetail.location,
        distance: runDetail.distance,
        time_of_day: runDetail.time_of_day,
      })
      .eq('id', runDetail.id);

    if (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง');
      console.error('Error updating run data:', error);
    } else {
      Alert.alert('บันทึกข้อมูลสำเร็จ', 'ข้อมูลการวิ่งได้รับการอัปเดตแล้ว', [
        { text: 'ตกลง', onPress: () => router.back() }
      ]);
    }
  };

  const handlePressDelete = async () => {
    if (!runDetail) return;

    Alert.alert(
      'ยืนยันการลบ',
      'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ', style: 'destructive', onPress: async () => {
            const { error } = await supabase.from('runs').delete().eq('id', runDetail.id);
            if (error) {
              Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้ โปรดลองอีกครั้ง');
              console.error('Error deleting run data:', error);
            } else {
              Alert.alert('ลบข้อมูลสำเร็จ', 'ข้อมูลการวิ่งได้รับการลบแล้ว', [
                { text: 'ตกลง', onPress: () => router.back() }
              ]);
            }
          }
        }
      ]
    );
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Image
        source={{ uri: runDetail?.image_url }}
        style={{
          width: '100%',
          height: 300,
        }}
      />
      <View style={{
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
        marginTop: -30,
      }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            fontFamily: "Kanit_600SemiBold",
          }}
        >สถานที่</Text>
        <TextInput
          style={{
            fontSize: 18,
            marginBottom: 20,
            fontFamily: "Kanit_400Regular",
            color: '#2595ff',
            borderBottomWidth: 1,
            borderColor: '#ccc',
            paddingBottom: 5,
          }}
          value={runDetail?.location}
          onChangeText={(text) => setRunDetail(prev => prev ? { ...prev, location: text } : prev)}
        />
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            fontFamily: "Kanit_600SemiBold",
          }}
        >ระยะทาง (กม.)</Text>
        <TextInput
          style={{
            fontSize: 18,
            marginBottom: 20,
            fontFamily: "Kanit_400Regular",
            color: '#2595ff',
            borderBottomWidth: 1,
            borderColor: '#ccc',
            paddingBottom: 5,
          }}
          value={runDetail?.distance.toString()}
          onChangeText={(text) => setRunDetail(prev => prev ? { ...prev, distance: parseFloat(text) || 0 } : prev)}
          keyboardType="numeric"
        />
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: runDetail?.time_of_day === "morning" ? '#2595ff' : '#ccc',
              height: 40,
              paddingHorizontal: 20,
              borderRadius: 20,
              justifyContent: 'center',
              marginRight: 10,
            }}
            onPress={() => setRunDetail(prev => prev ? { ...prev, time_of_day: "morning" } : prev)}
          >
            <Text style={{
              color: runDetail?.time_of_day === "morning" ? "white" : "#555",
              fontFamily: "Kanit_400Regular",
            }}>เช้า</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: runDetail?.time_of_day === "evening" ? '#2595ff' : '#ccc',
              height: 40,
              paddingHorizontal: 20,
              borderRadius: 20,
              justifyContent: 'center',
              marginRight: 10,
            }}
            onPress={() => setRunDetail(prev => prev ? { ...prev, time_of_day: "evening" } : prev)}
          >
            <Text style={{
              color: runDetail?.time_of_day === "evening" ? "white" : "#555",
              fontFamily: "Kanit_400Regular",
            }}>เย็น</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#2595ff',
            height: 50,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
            flexDirection: 'row',
            gap: 10,
          }}
          onPress={handlePressSave}
        >
          <Feather name="save" size={24} color="white" />
          <Text style={{
            color: 'white',
            fontFamily: "Kanit_600SemiBold",
          }}>บันทึกการแก้ไข</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            flexDirection: 'row',
            gap: 10,
          }}
          onPress={handlePressDelete}
        >
          <MaterialIcons name="delete" size={24} color="red" />
          <Text style={{
            color: 'red',
            fontFamily: "Kanit_600SemiBold",
          }}>ลบรายการนี้</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}