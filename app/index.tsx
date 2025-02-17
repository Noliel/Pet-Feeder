import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const App = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || endDate;

    // Prevent selecting an end date earlier than the start date
    if (currentDate < startDate) {
      Alert.alert('Invalid Date', 'End date cannot be earlier than start date!');
      return;
    }

    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ marginBottom: 20 }}>
        <Button title="Select Start Date" onPress={() => setShowStartDatePicker(true)} />
        {showStartDatePicker && (
          <DateTimePicker
            testID="startDatePicker"
            value={startDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onStartDateChange}
          />
        )}
        <Text>{`Start Date: ${startDate.toLocaleDateString()}`}</Text>
      </View>
      <View>
        <Button title="Select End Date" onPress={() => setShowEndDatePicker(true)} />
        {showEndDatePicker && (
          <DateTimePicker
            testID="endDatePicker"
            value={endDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onEndDateChange}
          />
        )}
        <Text>{`End Date: ${endDate.toLocaleDateString()}`}</Text>
      </View>
    </View>
  );
};

export default App;
