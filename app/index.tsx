import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const PetFeederScheduler = () => {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [history, setHistory] = useState([]);
  const [foodWeight, setFoodWeight] = useState('');

  
  useEffect(() => {
    const loadHistory = async () => {
      const storedHistory = await AsyncStorage.getItem('feedingHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    };
    loadHistory();
  }, []);

  
  useEffect(() => {
    AsyncStorage.setItem('feedingHistory', JSON.stringify(history));
  }, [history]);

  const handleTimeChange = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime && foodWeight) {
      const newEntry = { time: selectedTime, weight: foodWeight };
      const newHistory = [...history, newEntry];
      setHistory(newHistory);
      setFoodWeight(''); 
      scheduleNotification(selectedTime);
    } else {
      Alert.alert('Error', 'Please enter the food weight before setting the time.');
    }
  };

  const formatTime = (date) => {
    return moment(date).format('h:mm A');
  };

  const deleteHistoryItem = (index) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const newHistory = history.filter((_, i) => i !== index);
            setHistory(newHistory);
          },
        },
      ],
    );
  };

  const scheduleNotification = (selectedTime) => {
    PushNotification.localNotificationSchedule({
      message: 'Time to feed your pet!',
      date: selectedTime,
      allowWhileIdle: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Pet Feeder</Text>

      
      <TextInput
        style={styles.input}
        placeholder="Enter food weight (grams)"
        keyboardType="numeric"
        value={foodWeight}
        onChangeText={(text) => setFoodWeight(text)}
      />

      
      <Button
        mode="contained"
        onPress={() => setShowPicker(true)}
        style={styles.button}
        icon="clock"
      >
        Set Feeding Time
      </Button>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

      
      <Text style={styles.selectedTime}>
        Selected Time: {formatTime(time)}
      </Text>

      
      <ScrollView style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Feeding History:</Text>
        {history.map((item, index) => (
          <Card key={index} style={styles.historyCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.historyText}>
                {`Feeding ${index + 1}: ${formatTime(item.time)} - ${item.weight}g`}
              </Text>
              <IconButton
                icon="delete"
                onPress={() => deleteHistoryItem(index)}
                color="#ff4444"
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#6200ee',
  },
  selectedTime: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  historyContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  historyCard: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
});

export default PetFeederScheduler;