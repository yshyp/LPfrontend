import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, FlatList, Switch, RefreshControl, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { UserProvider, useUser } from './context/UserContext';
import { useNavigationContainerRef } from '@react-navigation/native';

// Import screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import OTPVerificationScreen from './screens/auth/OTPVerificationScreen';
import IntroScreen from './screens/IntroScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import BloodCampsScreen from './screens/BloodCampsScreen';
import ChatScreen from './screens/ChatScreen';

// Import services
import authService from './services/authService';
import userService from './services/userService';
import requestService from './services/requestService';
import locationService from './services/locationService';
import notificationService from './services/notificationService';

// Import components
import Button from './components/common/Button';
import Input from './components/common/Input';
import Card from './components/common/Card';
import ECGPulseOverlay from './components/common/ECGPulseOverlay';
import ErrorBoundary from './components/common/ErrorBoundary';

const Stack = createNativeStackNavigator();

// Location Permission Screen
function LocationPermissionScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const { user, token } = route.params || {};

  const requestLocationPermission = async () => {
    setLoading(true);
    
    try {
      const hasPermission = await locationService.requestPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'We need your location to find nearby donors and blood requests. Please enable location access in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => locationService.openSettings() }
          ]
        );
        setLoading(false);
        return;
      }

      const coords = await locationService.getCurrentLocation();
      console.log('Location obtained:', coords);

      // Check if we got valid coordinates
      if (!locationService.isValidLocation(coords)) {
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please check your GPS settings and try again.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: () => requestLocationPermission() }
          ]
        );
        setLoading(false);
        return;
      }

      // Update user location in backend
      if (token && user) {
        try {
          await userService.updateLocation(coords.longitude, coords.latitude);
          console.log('Location updated successfully');
        } catch (error) {
          console.error('Failed to update location:', error);
          // Continue anyway, location update is not critical
        }
      }

      // Navigate to appropriate dashboard
      if (user.role === 'DONOR') {
        navigation.replace('DonorDashboard', { user, token });
      } else {
        navigation.replace('RequesterDashboard', { user, token });
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error', 
        'Failed to get your location. Please check your GPS settings and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => requestLocationPermission() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📍 Location Access</Text>
        <Text style={styles.description}>
          LifePulse needs your location to connect you with nearby blood donors and requests.
        </Text>
        
        <Button
          title="Enable Location Access"
          onPress={requestLocationPermission}
          loading={loading}
          style={styles.locationButton}
        />
        
        <Button
          title="Skip for now"
          onPress={() => {
            if (user.role === 'DONOR') {
              navigation.replace('DonorDashboard', { user, token });
            } else {
              navigation.replace('RequesterDashboard', { user, token });
            }
          }}
          variant="secondary"
        />
      </View>
    </View>
  );
}

// Donor Dashboard Screen
function DonorDashboardScreen({ navigation, route }) {
  const { user: contextUser } = useUser(); // Get user from context as fallback
  const { user: routeUser, token } = route.params || {};
  const user = routeUser || contextUser; // Use route user first, fallback to context user
  const [availability, setAvailability] = useState(user?.availability || false);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [eligibility, setEligibility] = useState({ eligible: true, daysLeft: 0 });
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  // Fetch eligibility status
  const fetchEligibility = async () => {
    try {
      if (!user || !user._id) {
        console.warn('User not available for eligibility check');
        return;
      }
      const result = await userService.getEligibility(user._id);
      setEligibility(result);
    } catch (error) {
      console.error('Eligibility fetch error:', error);
    }
  };

  const toggleAvailability = async (value) => {
    setLoading(true);
    try {
      const response = await userService.toggleAvailability();
      setAvailability(response.availability);
      Alert.alert(
        'Success',
        `You are now ${response.availability ? 'available' : 'unavailable'} to donate`
      );
    } catch (error) {
      console.error('Toggle availability error:', error);
      Alert.alert('Error', 'Failed to update availability');
      setAvailability(!value); // Revert the change
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyRequests = async () => {
    setRequestsLoading(true);
    try {
      const coords = await locationService.getCurrentLocation();
      
      // Check if we have valid coordinates
      if (!locationService.isValidLocation(coords)) {
        console.log('Invalid location coordinates, skipping nearby requests fetch');
        setNearbyRequests([]);
        return;
      }

      const response = await requestService.getNearbyRequests(
        coords.longitude,
        coords.latitude,
        20000, // 20km radius
        user?.bloodGroup
      );
      setNearbyRequests(response.requests || []);
    } catch (error) {
      console.error('Fetch requests error:', error);
      // Don't show error to user, just set empty array
      setNearbyRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  const acceptRequest = async (requestId) => {
    if (!eligibility.eligible) {
      Alert.alert('Not Eligible', `You can donate again in ${eligibility.daysLeft} day(s).`);
      return;
    }
    try {
      await requestService.acceptRequest(requestId);
      Alert.alert('Success', 'You have accepted this blood request. The requester will be notified.');
      setAcceptedRequests((prev) => [...prev, requestId]);
      fetchNearbyRequests();
      showPostAcceptOptions(requestId);
    } catch (error) {
      if (error.response?.data?.error === 'You have already accepted this request') {
        setAcceptedRequests((prev) => [...prev, requestId]);
        return;
      }
      console.error('Accept request error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to accept request');
    }
  };

  const showPostAcceptOptions = (requestId) => {
    Alert.alert(
      'Next Steps',
      'What would you like to do?',
      [
        { text: 'Share Contact Details', onPress: () => {/* logic for sharing contact details */} },
        { text: 'Chat', onPress: () => navigation.navigate('Chat', { requestId, user }) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNearbyRequests();
    await fetchEligibility();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNearbyRequests();
    fetchEligibility();
  }, []);

  const renderSkeleton = () => (
    <Card style={styles.requestCard}>
      <View style={{ height: 20, backgroundColor: '#E5E5EA', borderRadius: 4, marginBottom: 8, width: '40%' }} />
      <View style={{ height: 14, backgroundColor: '#E5E5EA', borderRadius: 4, marginBottom: 6, width: '60%' }} />
      <View style={{ height: 14, backgroundColor: '#E5E5EA', borderRadius: 4, marginBottom: 6, width: '80%' }} />
      <View style={{ height: 28, backgroundColor: '#E5E5EA', borderRadius: 6, marginTop: 8, width: 100 }} />
    </Card>
  );

  const renderRequestItem = ({ item }) => {
    const distance = locationService.calculateDistance(
      user?.location?.coordinates?.[1] || 0,
      user?.location?.coordinates?.[0] || 0,
      item.location?.coordinates?.[1] || 0,
      item.location?.coordinates?.[0] || 0
    );
    const isAccepted = acceptedRequests.includes(item._id);
    return (
      <Card style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <Ionicons name="water" size={24} color="#FF3B30" style={{ marginRight: 8 }} />
          <Text style={styles.bloodGroup}>{item.bloodGroup}</Text>
          <View style={[styles.urgencyBadge, styles[`urgency${item.urgency}`]]}>
            <Text style={styles.urgencyText}>{item.urgency}</Text>
          </View>
        </View>
        <Text style={styles.hospitalName}>{item.hospitalName}</Text>
        <Text style={styles.hospitalAddress}>{item.hospitalAddress}</Text>
        <View style={styles.requestDetails}>
          <Text style={styles.detailText}>Units: {item.units}</Text>
          <Text style={styles.detailText}>Distance: {locationService.formatDistance(distance)}</Text>
          <Text style={styles.detailText}>Required by: {new Date(item.requiredBy).toLocaleDateString()}</Text>
        </View>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
        <Button
          title={
            isAccepted
              ? 'Accepted'
              : eligibility.eligible
                ? 'Accept Request'
                : `Not Eligible (${eligibility.daysLeft}d)`
          }
          onPress={() => acceptRequest(item._id)}
          style={styles.acceptButton}
          disabled={isAccepted || !eligibility.eligible}
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Welcome, {user?.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications', { user, token })}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="notifications-outline" size={28} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              authService.logout();
              navigation.replace('Login');
            }}
          >
            <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.availabilitySection}>
        <Text style={styles.sectionTitle}>Your Availability</Text>
        <View style={styles.availabilityRow}>
          <Text style={styles.availabilityText}>
            {availability ? 'Available to donate' : 'Not available'}
          </Text>
          <Switch
            value={availability}
            onValueChange={toggleAvailability}
            disabled={loading}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            thumbColor={availability ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      <View style={styles.eligibilitySection}>
        <Text style={styles.sectionTitle}>Donation Eligibility</Text>
        {eligibility.eligible ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={20} color="green" style={{ marginRight: 6 }} />
            <Text style={{ color: 'green' }}>You are eligible to donate blood.</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="close-circle" size={20} color="red" style={{ marginRight: 6 }} />
            <Text style={{ color: 'red' }}>You can donate again in {eligibility.daysLeft} day(s).</Text>
          </View>
        )}
      </View>



      <View style={styles.requestsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Blood Requests</Text>
          <Button
            title="Refresh"
            onPress={onRefresh}
            variant="secondary"
            style={styles.refreshButton}
          />
        </View>
        {requestsLoading ? (
          <View style={styles.loaderContainer}>
            <Text style={styles.loadingText}>Loading nearby requests...</Text>
          </View>
        ) : (
          <FlatList
            data={nearbyRequests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="water" size={48} color="#E5E5EA" style={{ marginBottom: 8 }} />
                <Text style={styles.emptyText}>No nearby blood requests</Text>
                <Text style={styles.emptySubtext}>Check back later or try refreshing</Text>
              </View>
            }
          />
        )}
      </View>

      <View style={[styles.bottomNav, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Button
          title="Leaderboard"
          onPress={() => navigation.navigate('Leaderboard')}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="View Blood Camps"
          onPress={() => navigation.navigate('BloodCamps')}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
      
      {/* ECG Pulse Overlay Loader */}
      <ECGPulseOverlay 
        visible={requestsLoading}
        text="Loading nearby requests..."
      />
    </View>
  );
}

// Requester Dashboard Screen
function RequesterDashboardScreen({ navigation, route }) {
  const { user: contextUser } = useUser(); // Get user from context as fallback
  const { user: routeUser, token } = route.params || {};
  const user = routeUser || contextUser; // Use route user first, fallback to context user
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    bloodGroup: 'A+',
    units: 1,
    hospitalName: '',
    hospitalAddress: '',
    urgency: 'MEDIUM',
    requiredBy: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: ''
  });
  const [requestsLoading, setRequestsLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  const fetchMyRequests = async () => {
    setRequestsLoading(true);
    try {
      const response = await userService.getMyDonations();
      setMyRequests(response.donations || []);
    } catch (error) {
      console.error('Fetch my requests error:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const createRequest = async () => {
    if (!createForm.hospitalName.trim() || !createForm.hospitalAddress.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const coords = await locationService.getCurrentLocation();
      
      // Check if we have valid coordinates
      if (!locationService.isValidLocation(coords)) {
        Alert.alert(
          'Location Required', 
          'Please enable location access to create a blood request. This helps donors find your request.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => locationService.openSettings() }
          ]
        );
        return;
      }
      
      const requestData = {
        ...createForm,
        longitude: coords.longitude,
        latitude: coords.latitude,
        requiredBy: new Date(createForm.requiredBy).toISOString()
      };

      await requestService.createRequest(requestData);
      
      Alert.alert('Success', 'Blood request created successfully! Nearby donors will be notified.');
      setShowCreateModal(false);
      setCreateForm({
        bloodGroup: 'A+',
        units: 1,
        hospitalName: '',
        hospitalAddress: '',
        urgency: 'MEDIUM',
        requiredBy: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: ''
      });
      fetchMyRequests();
    } catch (error) {
      console.error('Create request error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyRequests();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const renderSkeleton = () => (
    <Card style={styles.requestCard}>
      <View style={{ height: 20, backgroundColor: '#E5E5EA', borderRadius: 4, marginBottom: 8, width: '40%' }} />
      <View style={{ height: 14, backgroundColor: '#E5E5EA', borderRadius: 4, marginBottom: 6, width: '60%' }} />
      <View style={{ height: 14, backgroundColor: '#E5E5EA', borderRadius: 4, marginBottom: 6, width: '80%' }} />
      <View style={{ height: 28, backgroundColor: '#E5E5EA', borderRadius: 6, marginTop: 8, width: 100 }} />
    </Card>
  );

  const renderRequestItem = ({ item }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'PENDING': return '#FFA500';
        case 'ACCEPTED': return '#4CAF50';
        case 'IN_PROGRESS': return '#2196F3';
        case 'COMPLETED': return '#4CAF50';
        case 'CANCELLED': return '#F44336';
        case 'EXPIRED': return '#9E9E9E';
        default: return '#757575';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'PENDING': return '⏳ Pending';
        case 'ACCEPTED': return '✅ Accepted';
        case 'IN_PROGRESS': return '🔄 In Progress';
        case 'COMPLETED': return '✅ Completed';
        case 'CANCELLED': return '❌ Cancelled';
        case 'EXPIRED': return '⏰ Expired';
        default: return status;
      }
    };

    return (
      <Card style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <Ionicons name="water" size={24} color="#FF3B30" style={{ marginRight: 8 }} />
          <Text style={styles.bloodGroup}>{item.bloodGroup}</Text>
          <View style={[styles.urgencyBadge, styles[`urgency${item.urgency}`]]}>
            <Text style={styles.urgencyText}>{item.urgency}</Text>
          </View>
        </View>
        
        <Text style={styles.hospitalName}>{item.hospitalName}</Text>
        <Text style={styles.hospitalAddress}>{item.hospitalAddress}</Text>
        
        <View style={styles.requestDetails}>
          <Text style={styles.detailText}>Units: {item.units}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          <Text style={styles.detailText}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        
        {item.acceptedDonors && item.acceptedDonors.length > 0 && (
          <View style={styles.acceptedDonors}>
            <Text style={styles.acceptedTitle}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={{ marginRight: 4 }} />
              Accepted Donors ({item.acceptedDonors.length}/{item.units}):
            </Text>
            {item.acceptedDonors.map((accepted, index) => (
              <View key={index} style={styles.donorItem}>
                <Text style={styles.donorName}>
                  • {accepted.donor?.name || 'Unknown'} ({accepted.donor?.bloodGroup || 'N/A'})
                </Text>
                <Text style={styles.donorContact}>
                  Contact: {accepted.donor?.phone || accepted.donor?.email || 'Not available'}
                </Text>
                <Text style={styles.donorStatus}>Status: {accepted.status}</Text>
                <Text style={styles.donorDate}>
                  Accepted: {new Date(accepted.acceptedAt).toLocaleDateString()}
                </Text>
                <Button
                  title="Chat"
                  onPress={() => navigation.navigate('Chat', { requestId: item._id, user })}
                  style={{ marginTop: 8, alignSelf: 'flex-start' }}
                />
              </View>
            ))}
          </View>
        )}
        
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Welcome, {user?.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications', { user, token })}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="notifications-outline" size={28} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              authService.logout();
              navigation.replace('Login');
            }}
          >
            <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Button
          title="Create Blood Request"
          onPress={() => setShowCreateModal(true)}
          style={styles.createButton}
        />
      </View>

      <View style={styles.requestsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Blood Requests</Text>
          <Button
            title="Refresh"
            onPress={onRefresh}
            variant="secondary"
            style={styles.refreshButton}
          />
        </View>

        {requestsLoading ? (
          <View style={styles.loaderContainer}>
            <Text style={styles.loaderText}>Loading your requests...</Text>
          </View>
        ) : (
          <FlatList
            data={myRequests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="water" size={48} color="#E5E5EA" style={{ marginBottom: 8 }} />
                <Text style={styles.emptyText}>No blood requests yet</Text>
                <Text style={styles.emptySubtext}>Create your first blood request</Text>
              </View>
            }
          />
        )}
      </View>

      <View style={[styles.bottomNav, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Button
          title="Leaderboard"
          onPress={() => navigation.navigate('Leaderboard')}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="View Blood Camps"
          onPress={() => navigation.navigate('BloodCamps')}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      {/* Create Request Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Blood Request</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Blood Group</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={createForm.bloodGroup}
                  onValueChange={(value) => setCreateForm(prev => ({ ...prev, bloodGroup: value }))}
                  style={styles.picker}
                >
                  {bloodGroups.map(group => (
                    <Picker.Item key={group} label={group} value={group} />
                  ))}
                </Picker>
              </View>
            </View>

            <Input
              label="Units Required"
              value={createForm.units.toString()}
              onChangeText={(value) => setCreateForm(prev => ({ ...prev, units: parseInt(value) || 1 }))}
              placeholder="Number of units"
              keyboardType="numeric"
            />

            <Input
              label="Hospital Name"
              value={createForm.hospitalName}
              onChangeText={(value) => setCreateForm(prev => ({ ...prev, hospitalName: value }))}
              placeholder="Enter hospital name"
            />

            <Input
              label="Hospital Address"
              value={createForm.hospitalAddress}
              onChangeText={(value) => setCreateForm(prev => ({ ...prev, hospitalAddress: value }))}
              placeholder="Enter hospital address"
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Urgency Level</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={createForm.urgency}
                  onValueChange={(value) => setCreateForm(prev => ({ ...prev, urgency: value }))}
                  style={styles.picker}
                >
                  {urgencyLevels.map(level => (
                    <Picker.Item key={level} label={level} value={level} />
                  ))}
                </Picker>
              </View>
            </View>

            <Input
              label="Required By Date"
              value={createForm.requiredBy}
              onChangeText={(value) => setCreateForm(prev => ({ ...prev, requiredBy: value }))}
              placeholder="YYYY-MM-DD"
            />

            <Input
              label="Description (Optional)"
              value={createForm.description}
              onChangeText={(value) => setCreateForm(prev => ({ ...prev, description: value }))}
              placeholder="Additional details about the request"
              multiline
              numberOfLines={3}
            />

            <Button
              title="Create Request"
              onPress={createRequest}
              loading={loading}
              style={styles.createRequestButton}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// Notifications Screen
function NotificationsScreen({ navigation, route }) {
  const { user, token } = route.params;
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Blood Request',
      body: 'Someone needs O+ blood near you',
      timestamp: new Date(),
      read: false,
      type: 'request'
    },
    {
      id: 2,
      title: 'Request Accepted',
      body: 'A donor has accepted your blood request',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      type: 'acceptance'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <Text style={styles.notificationTime}>
          {item.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔔 Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />

      <View style={styles.bottomNav}>
        <Button
          title="Back to Dashboard"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
      
      {/* ECG Pulse Overlay Loader */}
      <ECGPulseOverlay 
        visible={requestsLoading}
        text="Loading your requests..."
      />
    </View>
  );
}

function MainApp() {
  const navigationRef = useNavigationContainerRef();
  const { user } = useUser();

  useEffect(() => {
    // Show Expo Go warning
    notificationService.showExpoGoWarning();
    
    // Initialize notifications
    notificationService.initialize();
    
    // Set up notification listeners
    const subscription = notificationService.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data.type === 'chat_message' && data.requestId && user) {
        navigationRef.navigate('Chat', { requestId: data.requestId, user });
      }
    });
    return () => subscription?.remove();
  }, [user]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
        <Stack.Screen name="DonorDashboard" component={DonorDashboardScreen} />
        <Stack.Screen name="RequesterDashboard" component={RequesterDashboardScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="BloodCamps" component={BloodCampsScreen} options={{ title: 'Blood Camps' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <MainApp />
      </UserProvider>
    </ErrorBoundary>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  locationButton: {
    marginBottom: 16,
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
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
    marginLeft: 40,
  },
  availabilitySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  actionsSection: {
    padding: 16,
  },
  createButton: {
    marginBottom: 16,
  },
  requestsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  requestCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bloodGroup: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgencyLOW: {
    backgroundColor: '#34C759',
  },
  urgencyMEDIUM: {
    backgroundColor: '#FF9500',
  },
  urgencyHIGH: {
    backgroundColor: '#FF3B30',
  },
  urgencyCRITICAL: {
    backgroundColor: '#8E8E93',
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  requestDetails: {
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  acceptButton: {
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  closeButton: {
    fontSize: 24,
    color: '#8E8E93',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  createRequestButton: {
    marginTop: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: '#F0F8FF',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  acceptedDonors: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  acceptedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  donorItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  donorName: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
    marginBottom: 2,
  },
  donorContact: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  donorStatus: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  donorDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  eligibilitySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
    marginLeft: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
  loaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
}); 