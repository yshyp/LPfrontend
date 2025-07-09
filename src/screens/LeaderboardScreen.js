import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import userService from '../services/userService';
import Card from '../components/common/Card';
import ECGPulseOverlay from '../components/common/ECGPulseOverlay';

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
        <View style={[styles.rankContainer, index < 3 && styles.topRank]}>
          <Text style={[styles.rank, index < 3 && styles.topRankText]}>{index + 1}</Text>
        </View>
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
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      <View style={styles.container}>
        <View style={[styles.header, { marginTop: 40 }]}> {/* Fixed margin to push header down */}
          <Text style={styles.title}>🏆 Top Donors Leaderboard</Text>
          <Text style={styles.subtitle}>Celebrating our lifesaving heroes</Text>
        </View>
        
        <FlatList
          data={donors}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No donors yet</Text>
              <Text style={styles.emptySubtitle}>Be the first to make a difference!</Text>
            </View>
          }
        />
        
        {/* ECG Pulse Overlay Loader */}
        <ECGPulseOverlay 
          visible={loading}
          text="Loading leaderboard..."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingHorizontal: 20,
    // marginTop is set adaptively
    paddingBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1C1C1E',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#8E8E93',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topRank: {
    backgroundColor: '#FFD700',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  topRankText: {
    color: '#1C1C1E',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  bloodGroup: {
    fontSize: 14,
    color: '#8E8E93',
  },
  stats: {
    alignItems: 'flex-end',
  },
  donations: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  badge: {
    fontSize: 16,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
}); 