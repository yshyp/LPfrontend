import React, { useState } from 'react';
import { BloodCamp, BloodGroup, BloodRequest, DonorProfile, AppNotification } from './types/blood';
import {
  INITIAL_REQUESTS,
  INITIAL_CAMPS,
  TOP_DONORS,
  INITIAL_NOTIFICATIONS,
  BLOOD_GROUPS,
} from './data/mockData';
import { MobileTopBar } from './screens/mobile/MobileTopBar';
import { MobileIntroScreen } from './screens/mobile/MobileIntroScreen';
import { MobileLoginScreen } from './screens/mobile/MobileLoginScreen';
import { MobileOTPScreen } from './screens/mobile/MobileOTPScreen';
import { MobileLocationScreen } from './screens/mobile/MobileLocationScreen';
import { MobileProfileScreen } from './screens/mobile/MobileProfileScreen';
import { DonorDashboardScreen } from './screens/mobile/DonorDashboardScreen';
import { RequesterDashboardScreen } from './screens/mobile/RequesterDashboardScreen';
import { MobileLeaderboardScreen } from './screens/mobile/MobileLeaderboardScreen';
import { BottomNav } from './components/BottomNav';
import { BloodCampsList } from './components/BloodCampsList';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { EligibilityChecker } from './components/EligibilityChecker';
import { RequestDetailModal } from './components/RequestDetailModal';
import { CreateRequestModal } from './components/CreateRequestModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { ChatModal } from './components/ChatModal';
import { CertificateModal } from './components/CertificateModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import {
  Wifi,
  Battery,
  Signal,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Smartphone
} from 'lucide-react';

type NavigationScreen =
  | 'intro'
  | 'login'
  | 'otp'
  | 'location'
  | 'main';

export default function App() {
  // App Navigation Flow
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>('main');
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [userRole, setUserRole] = useState<'donor' | 'requester'>('donor');
  const [userCity, setUserCity] = useState<string>('Metro City');
  const [contactInput, setContactInput] = useState<string>('+1 (555) 782-9011');

  // Sub-tab toggles
  const [matrixTab, setMatrixTab] = useState<'matrix' | 'eligibility'>('matrix');
  const [profileTab, setProfileTab] = useState<'profile' | 'leaderboard'>('profile');

  // App Data State
  const [requests, setRequests] = useState<BloodRequest[]>(INITIAL_REQUESTS);
  const [camps, setCamps] = useState<BloodCamp[]>(INITIAL_CAMPS);
  const [donors, setDonors] = useState<DonorProfile[]>(TOP_DONORS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [userBloodGroup, setUserBloodGroup] = useState<BloodGroup>('O+');

  // Modals & Sheets
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [chatRequest, setChatRequest] = useState<BloodRequest | null>(null);
  const [certificateDonor, setCertificateDonor] = useState<DonorProfile | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  // In-app Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentDonorProfile = donors.find((d) => d.name.includes('You')) || donors[0];

  // Actions
  const handleConfirmPledge = (requestId: string, units: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              unitsPledged: r.unitsPledged + units,
              donorsResponding: r.donorsResponding + 1,
              status: r.unitsPledged + units >= r.unitsNeeded ? 'Fulfilled' : 'In Progress',
            }
          : r
      )
    );

    setDonors((prev) =>
      prev.map((d) =>
        d.name.includes('You')
          ? {
              ...d,
              totalDonations: d.totalDonations + units,
              livesSaved: d.livesSaved + units * 3,
            }
          : d
      )
    );

    showToast(`Pledge recorded: ${units} unit(s) for patient.`);
  };

  const handleCreateRequest = (
    newReqData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'donorsResponding' | 'unitsPledged' | 'isVerified'>
  ) => {
    const newRequest: BloodRequest = {
      ...newReqData,
      id: `req-${Date.now()}`,
      createdAt: 'Just now',
      status: 'Open',
      donorsResponding: 0,
      unitsPledged: 0,
      isVerified: true,
    };

    setRequests([newRequest, ...requests]);
    setActiveTab('feed');
    showToast('Blood request broadcasted to nearby compatible donors!');
  };

  const handleBroadcastSOS = (data: { bloodGroup: BloodGroup; hospital: string; units: number }) => {
    const sosRequest: BloodRequest = {
      id: `sos-${Date.now()}`,
      patientName: 'Acute Trauma Patient',
      patientAge: 29,
      bloodGroup: data.bloodGroup,
      unitsNeeded: data.units,
      unitsPledged: 0,
      urgency: 'Critical',
      hospitalName: data.hospital,
      hospitalAddress: 'Emergency Trauma Surgical Unit, Level 1',
      city: userCity,
      distanceKm: 1.4,
      contactName: 'Trauma Rapid Response',
      contactPhone: '+1 (555) 911-3829',
      reason: 'ACUTE SURGICAL HEMORRHAGE / EMERGENCY TRANSFUSION',
      requiredBy: 'IMMEDIATELY (< 20 Mins)',
      createdAt: 'Just now',
      status: 'Open',
      donorsResponding: 0,
      isVerified: true,
    };

    setRequests([sosRequest, ...requests]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `🚨 CRITICAL SOS: ${data.bloodGroup} Needed!`,
      message: `${data.units} units required immediately at ${data.hospital}. All compatible donors alert!`,
      type: 'emergency',
      timestamp: 'Just now',
      read: false,
      actionTarget: sosRequest.id,
    };
    setNotifications([newNotif, ...notifications]);

    showToast('🚨 SOS alert broadcasted to compatible donors in 15km perimeter!');
  };

  const handleToggleCampRegister = (campId: string) => {
    setCamps((prev) =>
      prev.map((c) => {
        if (c.id === campId) {
          const isNowRegistered = !c.isRegistered;
          showToast(
            isNowRegistered
              ? 'Donor slot reserved for this blood drive!'
              : 'Camp reservation cancelled.'
          );
          return {
            ...c,
            isRegistered: isNowRegistered,
            registeredDonors: isNowRegistered ? c.registeredDonors + 1 : c.registeredDonors - 1,
          };
        }
        return c;
      })
    );
  };

  const handleAddCamp = (campData: Omit<BloodCamp, 'id' | 'registeredDonors' | 'isRegistered'>) => {
    const newCamp: BloodCamp = {
      ...campData,
      id: `camp-${Date.now()}`,
      registeredDonors: 1,
      isRegistered: true,
    };
    setCamps([newCamp, ...camps]);
    showToast('New blood drive registered and published!');
  };

  const handleShare = (req: BloodRequest) => {
    const shareText = `URGENT BLOOD NEED: ${req.bloodGroup} needed at ${req.hospitalName} (${req.requiredBy}). Please donate if you are eligible!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      showToast('Urgent request copied to share!');
    } else {
      showToast('Request ready to share!');
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setIsNotifDrawerOpen(false);

    if (notif.actionTarget) {
      const matchedReq = requests.find((r) => r.id === notif.actionTarget);
      if (matchedReq) {
        setSelectedRequest(matchedReq);
        return;
      }
      const matchedCamp = camps.find((c) => c.id === notif.actionTarget);
      if (matchedCamp) {
        setActiveTab('camps');
        return;
      }
    }
    setActiveTab('feed');
  };

  // Render current screen content
  const renderScreen = () => {
    switch (currentScreen) {
      case 'intro':
        return (
          <MobileIntroScreen
            onGetStarted={() => setCurrentScreen('login')}
            onLoginDemo={(role) => {
              setUserRole(role);
              setCurrentScreen('main');
            }}
          />
        );

      case 'login':
        return (
          <MobileLoginScreen
            onBack={() => setCurrentScreen('intro')}
            onSendOTP={(contact, role) => {
              setContactInput(contact);
              setUserRole(role);
              setCurrentScreen('otp');
            }}
          />
        );

      case 'otp':
        return (
          <MobileOTPScreen
            contactValue={contactInput}
            onBack={() => setCurrentScreen('login')}
            onVerifySuccess={() => setCurrentScreen('location')}
          />
        );

      case 'location':
        return (
          <MobileLocationScreen
            onEnableLocation={(city) => {
              setUserCity(city);
              setCurrentScreen('main');
              showToast(`Location set to ${city}`);
            }}
            onSkip={() => setCurrentScreen('main')}
          />
        );

      case 'main':
      default:
        return (
          <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Native Mobile Top Bar */}
            <MobileTopBar
              title={
                activeTab === 'feed'
                  ? userRole === 'donor'
                    ? 'Donor Dispatch'
                    : 'Requester Console'
                  : activeTab === 'camps'
                  ? 'Blood Drives'
                  : activeTab === 'compatibility'
                  ? 'Compatibility'
                  : 'Profile & Impact'
              }
              unreadCount={unreadCount}
              onOpenNotifications={() => setIsNotifDrawerOpen(true)}
              onOpenSOS={() => setIsSOSModalOpen(true)}
              userRole={userRole}
              onToggleRole={() => {
                const newRole = userRole === 'donor' ? 'requester' : 'donor';
                setUserRole(newRole);
                showToast(`Switched to ${newRole === 'donor' ? 'Donor Mode' : 'Hospital Seeker Mode'}`);
              }}
            />

            {/* Scrollable Tab Content Body */}
            <div className="flex-1 overflow-y-auto pb-20">
              {activeTab === 'feed' && (
                <div className="p-4 space-y-4">
                  {userRole === 'donor' ? (
                    <DonorDashboardScreen
                      userBloodGroup={userBloodGroup}
                      requests={requests}
                      onSelectRequest={(req) => setSelectedRequest(req)}
                      onOpenChat={(req) => setChatRequest(req)}
                      onShare={handleShare}
                      onOpenSOS={() => setIsSOSModalOpen(true)}
                      onOpenCompatibility={() => {
                        setActiveTab('compatibility');
                        setMatrixTab('matrix');
                      }}
                    />
                  ) : (
                    <RequesterDashboardScreen
                      myRequests={requests}
                      onOpenCreateRequest={() => setIsCreateModalOpen(true)}
                      onOpenSOS={() => setIsSOSModalOpen(true)}
                      onOpenChat={(req) => setChatRequest(req)}
                      onShare={handleShare}
                    />
                  )}
                </div>
              )}

              {activeTab === 'camps' && (
                <div className="p-4 space-y-4">
                  <BloodCampsList
                    camps={camps}
                    onToggleRegister={handleToggleCampRegister}
                    onAddCamp={handleAddCamp}
                  />
                </div>
              )}

              {activeTab === 'compatibility' && (
                <div className="p-4 space-y-4">
                  {/* Segmented Switcher for Matrix vs Eligibility */}
                  <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setMatrixTab('matrix')}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        matrixTab === 'matrix'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Compatibility Matrix
                    </button>
                    <button
                      onClick={() => setMatrixTab('eligibility')}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        matrixTab === 'eligibility'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Eligibility Cooldown
                    </button>
                  </div>

                  {matrixTab === 'matrix' ? (
                    <CompatibilityMatrix
                      initialGroup={userBloodGroup}
                      onSelectGroupForFilter={(group) => {
                        setUserBloodGroup(group);
                        setActiveTab('feed');
                      }}
                    />
                  ) : (
                    <EligibilityChecker onGoToRequests={() => setActiveTab('feed')} />
                  )}
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="p-4 space-y-4">
                  {/* Sub-tab toggle between My Profile and Hall of Fame Leaderboard */}
                  <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setProfileTab('profile')}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        profileTab === 'profile'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => setProfileTab('leaderboard')}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        profileTab === 'leaderboard'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Leaderboard Rankings
                    </button>
                  </div>

                  {profileTab === 'profile' ? (
                    <MobileProfileScreen
                      donor={currentDonorProfile}
                      userRole={userRole}
                      onToggleRole={() => {
                        const newRole = userRole === 'donor' ? 'requester' : 'donor';
                        setUserRole(newRole);
                        showToast(`Switched to ${newRole === 'donor' ? 'Donor Mode' : 'Hospital Seeker Mode'}`);
                      }}
                      onOpenCertificate={() => setCertificateDonor(currentDonorProfile)}
                      onOpenEligibility={() => {
                        setActiveTab('compatibility');
                        setMatrixTab('eligibility');
                      }}
                      onOpenMatrix={() => {
                        setActiveTab('compatibility');
                        setMatrixTab('matrix');
                      }}
                      onChangeBloodGroup={(bg) => setUserBloodGroup(bg)}
                      onSignOut={() => setCurrentScreen('intro')}
                    />
                  ) : (
                    <MobileLeaderboardScreen
                      donors={donors}
                      onOpenCertificate={(d) => setCertificateDonor(d)}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Native Mobile Bottom Navigation Bar */}
            <BottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenCreateRequest={() => setIsCreateModalOpen(true)}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex items-center justify-center p-0 md:p-6 antialiased selection:bg-rose-500 selection:text-white font-sans">
      {/* Mobile Device Frame Container (occupies 100% on phone, sleek phone frame on desktop) */}
      <div className="w-full h-screen md:h-[880px] md:max-w-[420px] bg-slate-950 md:rounded-[52px] md:shadow-2xl md:ring-14 md:ring-slate-800/80 md:border-4 md:border-slate-700/50 flex flex-col relative overflow-hidden">
        {/* Native Mobile Status Bar */}
        <div className="h-11 bg-slate-950 text-white px-7 flex items-center justify-between shrink-0 select-none z-40">
          <span className="text-[12px] font-semibold tracking-tight">9:41</span>
          {/* Dynamic Island pill */}
          <div className="w-24 h-4.5 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-white">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50">
          {renderScreen()}
        </div>

        {/* Native Home Indicator Bar */}
        <div className="h-5 bg-white flex items-center justify-center pb-1 shrink-0 z-40">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>

      {/* Global Native Sheets / Modals */}
      <RequestDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onConfirmPledge={handleConfirmPledge}
        onStartChat={(req) => {
          setSelectedRequest(null);
          setChatRequest(req);
        }}
      />

      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRequest}
      />

      <EmergencySOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onBroadcastSOS={handleBroadcastSOS}
      />

      <ChatModal
        request={chatRequest}
        onClose={() => setChatRequest(null)}
      />

      <CertificateModal
        donor={certificateDonor}
        onClose={() => setCertificateDonor(null)}
        onShare={(text) => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
          }
          showToast('Certificate link copied!');
        }}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          showToast('All notifications marked as read.');
        }}
        onNotificationClick={handleNotificationClick}
      />

      {/* Floating In-App Toast */}
      {toastMessage && (
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs border border-slate-700 whitespace-nowrap animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
