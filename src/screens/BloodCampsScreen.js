import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Modal, TextInput, Platform, Linking } from 'react-native';
import { bloodCampsService } from '../services';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ECGPulseOverlay from '../components/common/ECGPulseOverlay';
import { Ionicons } from '@expo/vector-icons';

const BloodCampsScreen = () => {
  const [camps, setCamps] = useState([]);
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCamps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bloodCampsService.getAll();
      setCamps(data.camps || []);
      setFilteredCamps(data.camps || []);
    } catch (err) {
      setError('Failed to load blood camps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCamps();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setFilteredCamps(camps);
      return;
    }
    const filtered = camps.filter(camp =>
      camp.name.toLowerCase().includes(text.toLowerCase()) ||
      camp.location?.city?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCamps(filtered);
  };

  const openCampDetails = (camp) => {
    setSelectedCamp(camp);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCamp(null);
  };

  const handleRegister = () => {
    // Placeholder for register/join action
    alert('Registration coming soon!');
  };

  const handleShare = (camp) => {
    const message = `Join the Blood Camp: ${camp.name}\nDate: ${new Date(camp.date).toLocaleString()}\nLocation: ${camp.location?.address || ''}, ${camp.location?.city || ''}`;
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(message);
      alert('Camp info copied to clipboard!');
    } else {
      Linking.openURL(`sms:&body=${encodeURIComponent(message)}`);
    }
  };

  const handleOpenMaps = (camp) => {
    if (camp.location?.coordinates) {
      const [lng, lat] = camp.location.coordinates;
      const url = Platform.select({
        ios: `maps:0,0?q=${lat},${lng}`,
        android: `geo:0,0?q=${lat},${lng}`,
        default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      });
      Linking.openURL(url);
    } else {
      alert('No location available');
    }
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonLine} />
      <View style={styles.skeletonLine} />
      <View style={styles.skeletonButton} />
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openCampDetails(item)}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="water" size={24} color="#FF3B30" style={{ marginRight: 8 }} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View style={styles.cardRow}>
          <Ionicons name="calendar" size={18} color="#007AFF" style={{ marginRight: 4 }} />
          <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
        </View>
        <View style={styles.cardRow}>
          <Ionicons name="location" size={18} color="#34C759" style={{ marginRight: 4 }} />
          <Text style={styles.location}>{item.location?.address || 'No address'}, {item.location?.city || ''}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.cardActions}>
          <Button title="Register" onPress={handleRegister} style={styles.actionButton} />
          <Button title="Share" onPress={() => handleShare(item)} variant="secondary" style={styles.actionButton} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blood Camps</Text>
        <Text style={styles.headerSubtitle}>Find and join upcoming blood donation camps near you.</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or city..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      {/* List */}
      {loading ? (
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading blood camps...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <Text style={styles.error}>{error}</Text>
          <Button title="Retry" onPress={fetchCamps} style={{ marginTop: 16 }} />
        </View>
      ) : !filteredCamps.length ? (
        <View style={styles.centered}>
          <Ionicons name="water" size={64} color="#E5E5EA" />
          <Text style={styles.empty}>No blood camps found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCamps}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
        />
      )}
      {/* Camp Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCamp && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedCamp.name}</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={28} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons name="calendar" size={18} color="#007AFF" style={{ marginRight: 4 }} />
                  <Text style={styles.date}>{new Date(selectedCamp.date).toLocaleString()}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons name="location" size={18} color="#34C759" style={{ marginRight: 4 }} />
                  <Text style={styles.location}>{selectedCamp.location?.address || 'No address'}, {selectedCamp.location?.city || ''}</Text>
                </View>
                <Text style={styles.description}>{selectedCamp.description}</Text>
                <View style={styles.modalActions}>
                  <Button title="Register" onPress={handleRegister} style={styles.actionButton} />
                  <Button title="Share" onPress={() => handleShare(selectedCamp)} variant="secondary" style={styles.actionButton} />
                  <Button title="Open in Maps" onPress={() => handleOpenMaps(selectedCamp)} variant="secondary" style={styles.actionButton} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* ECG Pulse Overlay Loader */}
      <ECGPulseOverlay 
        visible={loading}
        text="Loading blood camps..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1C1C1E',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  date: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 8,
  },
  empty: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
  },
  skeletonCard: {
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  skeletonTitle: {
    width: '60%',
    height: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLine: {
    width: '80%',
    height: 14,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonButton: {
    width: 80,
    height: 28,
    backgroundColor: '#F2F2F7',
    borderRadius: 6,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default BloodCampsScreen; 