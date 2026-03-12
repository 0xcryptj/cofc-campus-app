import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Placeholder data — will be replaced with Supabase data later
const MOCK_POSTS = [
  { id: '1', text: 'Anyone else think the library is freezing cold today?' },
  { id: '2', text: 'Reminder: free pizza at the student center at noon' },
  { id: '3', text: 'The squirrels on the green are getting bolder every semester' },
];

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>The Tea</Text>
      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postText}>{item.text}</Text>
            <Text style={styles.anon}>— Anonymous</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    padding: 20,
    paddingTop: 60,
    color: '#1a1a1a',
  },
  list: {
    padding: 16,
  },
  post: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  postText: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  anon: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },
});
