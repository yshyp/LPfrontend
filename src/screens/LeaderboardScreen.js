import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import userService from '../services/userService';
import Card from '../components/common/Card';

const BADGES = [
  { min: 10, label: '🥇 Gold' },
  { min: 5, label: '🥈 Silver' },
  { min: 1, label: '🥉 Bronze' },
];

function getBadge(totalDonations) {
  for (const badge of BADGES) {
    if (totalDonations >= badge.min) return badge.label;
  }
  return '';
}

export default function LeaderboardScreen() {
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await userService.getLeaderboard();
        setDonors(data);
      } catch (error) {
        setDonors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const renderItem = ({ item, index }) => (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.rank}>{index + 1}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.bloodGroup}>Blood Group: {item.bloodGroup}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.donations}>{item.totalDonations} donations</Text>
          <Text style={styles.badge}>{getBadge(item.totalDonations)}</Text>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Top Donors Leaderboard</Text>
      <FlatList
        data={donors}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No donors yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    fontSize: 22,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
    color: '#FFD700',
  },
  info: {
    flex: 2,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  bloodGroup: {
    fontSize: 14,
    color: '#888',
  },
  stats: {
    alignItems: 'flex-end',
  },
  donations: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  badge: {
    fontSize: 16,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
}); 