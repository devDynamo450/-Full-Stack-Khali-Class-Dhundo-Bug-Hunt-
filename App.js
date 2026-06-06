/**
 * App.js — Khali Class Dhundo
 * Advantage Fitness-style layout — all CSS fixed:
 *  ✅ CTA button properly self-contained
 *  ✅ Header 3-column layout with correct flex
 *  ✅ Hero gradient via layered views (no invalid backgroundImage prop)
 *  ✅ NavBar underline positioned correctly
 *  ✅ All text, spacing, and alignment polished
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  StyleSheet, SafeAreaView, StatusBar, RefreshControl,
  Animated, TextInput, Platform, Dimensions, ScrollView,
} from 'react-native';

import { fetchAvailableRooms, fetchStats, claimRoom } from './api';
import { COLORS } from './theme';
import RoomCard from './components/RoomCard';
import FilterBar from './components/FilterBar';
import StatsBar from './components/StatsBar';
import ClaimModal from './components/ClaimModal';
import Footer from './components/Footer';

const BLOCKS = ['A-Block','B-Block','AI-Block','C-Block','D-Block','E-Block','Lab Block','Seminar Hall'];
const NAV_ITEMS = ['Home', 'Find Rooms', 'Blocks', 'Stats', 'FAQ', 'Contact'];
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const numCols = isWeb ? (width > 1100 ? 3 : width > 650 ? 2 : 1) : 1;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast, anim }) {
  if (!toast) return null;
  return (
    <Animated.View
      style={[
        styles.toast,
        toast.type === 'error' ? styles.toastError : styles.toastSuccess,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [16,0] }) }],
        },
      ]}
    >
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
}

// ─── Top Utility Bar ──────────────────────────────────────────────────────────
function UtilityBar({ onRefresh }) {
  return (
    <View style={styles.utilityBar}>
      <View style={styles.utilityLeft}>
        <View style={styles.liveDotSmall} />
        <Text style={styles.utilityText}>LIVE CLASSROOM TRACKER</Text>
      </View>
      <View style={styles.utilityRight}>
        <TouchableOpacity onPress={onRefresh} style={styles.utilityBtn}>
          <Text style={styles.utilityBtnText}>↻ REFRESH</Text>
        </TouchableOpacity>
        <Text style={styles.utilityDivider}>|</Text>
        <TouchableOpacity style={styles.utilityBtn}>
          <Text style={styles.utilityBtnText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
function MainHeader() {
  return (
    <View style={styles.mainHeader}>
      {/* LEFT — contact info */}
      <View style={styles.headerLeft}>
        <Text style={styles.headerContactIcon}>📞</Text>
        <View style={styles.headerContactText}>
          <Text style={styles.headerContactLabel}>CAMPUS HELPDESK</Text>
          <Text style={styles.headerContactValue}>+91 120-232-3000</Text>
        </View>
      </View>

      {/* CENTER — logo */}
      <View style={styles.headerCenter}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🏛️</Text>
        </View>
        <View style={styles.logoTextWrap}>
          <Text style={styles.logoTitle}>KHALI CLASS</Text>
          <Text style={styles.logoSub}>DHUNDO</Text>
        </View>
      </View>

      {/* RIGHT — CTA button */}
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>GET IN TOUCH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Nav Bar ──────────────────────────────────────────────────────────────────
function NavBar({ activeNav, onNav }) {
  return (
    <View style={styles.navBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navContent}
      >
        {NAV_ITEMS.map((item) => {
          const active = activeNav === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => onNav(item)}
              style={styles.navItem}
              activeOpacity={0.75}
            >
              <Text style={[styles.navText, active && styles.navTextActive]}>
                {item}
              </Text>
              {active && <View style={styles.navUnderline} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────
function HeroBanner({ count, onBrowse }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration:  800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.heroBanner}>
      {/* Layered background — deep dark red gradient effect */}
      <View style={styles.heroBg1} />
      <View style={styles.heroBg2} />
      <View style={styles.heroBg3} />
      {/* Left-to-right dark scrim (mimics the reference site overlay) */}
      <View style={styles.heroScrim} />

      {/* Decorative accent lines */}
      <View style={styles.heroAccentLine1} />
      <View style={styles.heroAccentLine2} />

      {/* Hero text content */}
      <Animated.View
        style={[
          styles.heroContent,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Tag line */}
        <View style={styles.heroTag}>
          <View style={styles.heroTagDot} />
          <Text style={styles.heroTagText}>GALGOTIAS UNIVERSITY — REAL-TIME</Text>
        </View>

        {/* Main heading */}
        <Text style={styles.heroTitle}>
          FIND YOUR EMPTY{'\n'}CLASSROOM NOW
        </Text>

        {/* Sub heading */}
        <Text style={styles.heroSub}>
          Discover Available Classrooms Across All Campus Blocks Instantly
        </Text>

        {/* Live stat chips */}
        <View style={styles.heroChips}>
          <View style={styles.heroChip}>
            <Text style={styles.heroChipNum}>{count}</Text>
            <Text style={styles.heroChipLabel}>ROOMS FREE</Text>
          </View>
          <View style={[styles.heroChip, styles.heroChipGold]}>
            <Text style={[styles.heroChipNum, { color: COLORS.gold }]}>LIVE</Text>
            <Text style={styles.heroChipLabel}>UPDATED</Text>
          </View>
          <View style={[styles.heroChip, { borderColor: '#444' }]}>
            <Text style={[styles.heroChipNum, { color: '#aaa' }]}>8</Text>
            <Text style={styles.heroChipLabel}>BLOCKS</Text>
          </View>
        </View>

        {/* CTA button */}
        <TouchableOpacity style={styles.heroBtn} onPress={onBrowse} activeOpacity={0.85}>
          <Text style={styles.heroBtnText}>BROWSE ROOMS</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar({ value, onChange }) {
  return (
    <View style={styles.searchOuter}>
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search room number or block…"
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChange}
          clearButtonMode="while-editing"
          accessibilityLabel="Search classrooms"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChange('')}
            accessibilityLabel="Clear search"
            style={styles.clearBtn}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, count }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countBadgeText}>{count}</Text>
      </View>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ search }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>{search ? '🔎' : '😴'}</Text>
      <Text style={styles.emptyTitle}>
        {search ? 'No Results Found' : 'All Rooms Occupied'}
      </Text>
      <Text style={styles.emptySub}>
        {search
          ? `No classrooms matching "${search}"`
          : 'Try a different filter or check back soon!'}
      </Text>
    </View>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [rooms, setRooms]               = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState(null);
  const [selectedCanteen, setSelectedCanteen] = useState('All');
  const [selectedBlock,   setSelectedBlock]   = useState('All');
  const [search, setSearch]             = useState('');
  const [claimingId, setClaimingId]     = useState(null);
  const [claimTarget, setClaimTarget]   = useState(null);
  const [toast, setToast]               = useState(null);
  const [activeNav, setActiveNav]       = useState('Home');
  const toastAnim = useRef(new Animated.Value(0)).current;
  const listRef   = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.delay(2600),
      Animated.timing(toastAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [toastAnim]);

  const loadData = useCallback(async (canteen, block, isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const [roomData, statsData] = await Promise.all([
        fetchAvailableRooms(canteen, block),
        fetchStats(),
      ]);
      setRooms(roomData);
      setStats(statsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(selectedCanteen, selectedBlock); }, [selectedCanteen, selectedBlock]);

  const handleCanteen     = (c) => { setSelectedCanteen(c); setSearch(''); };
  const handleBlock       = (b) => { setSelectedBlock(b); setSearch(''); };
  const handleClaimPress  = (id, number) => setClaimTarget({ id, number });
  const handleClaimCancel = () => setClaimTarget(null);

  const handleClaimConfirm = async (userName) => {
    if (!claimTarget) return;
    const { id, number } = claimTarget;
    setClaimTarget(null);
    setClaimingId(id);
    try {
      await claimRoom(id, userName);
      setRooms((prev) => prev.filter((r) => r._id !== id));
      setStats((prev) => prev ? {
        ...prev,
        totalAvailable: prev.totalAvailable - 1,
        blocks: prev.blocks.map(b =>
          b.canteen === rooms.find(r => r._id === id)?.nearestCanteen
            ? { ...b, available: b.available - 1 }
            : b
        ),
      } : prev);
      showToast(`✅ ${number} claimed successfully!`);
    } catch (e) {
      showToast(`❌ ${e.message}`, 'error');
    } finally {
      setClaimingId(null);
    }
  };

  const displayRooms = search.trim()
    ? rooms.filter(r => r.roomNumber.toLowerCase().includes(search.trim().toLowerCase()))
    : rooms;

  const sectionLabel =
    selectedCanteen !== 'All' ? `Near ${selectedCanteen}` :
    selectedBlock   !== 'All' ? selectedBlock : 'All Available Rooms';

  const scrollToRooms = () => {
    listRef.current?.scrollToOffset?.({ offset: isWeb ? 500 : 380, animated: true });
  };

  const listHeader = (
    <>
      <HeroBanner count={rooms.length} onBrowse={scrollToRooms} />
      <StatsBar stats={stats} />
      <FilterBar
        selectedCanteen={selectedCanteen} onSelectCanteen={handleCanteen}
        blocks={BLOCKS} selectedBlock={selectedBlock} onSelectBlock={handleBlock}
      />
      <SearchBar value={search} onChange={setSearch} />
      <SectionHeader title={sectionLabel} count={displayRooms.length} />
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      <UtilityBar onRefresh={() => loadData(selectedCanteen, selectedBlock, true)} />
      <MainHeader />
      <NavBar activeNav={activeNav} onNav={setActiveNav} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.red} />
          <Text style={styles.loadingText}>Scanning classrooms…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errEmoji}>⚠️</Text>
          <Text style={styles.errTitle}>Can't reach server</Text>
          <Text style={styles.errMsg}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => loadData(selectedCanteen, selectedBlock)}
          >
            <Text style={styles.retryText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={displayRooms}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <RoomCard room={item} claimingId={claimingId} onClaim={handleClaimPress} index={index} />
          )}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={<EmptyState search={search} />}
          contentContainerStyle={styles.list}
          numColumns={numCols}
          key={numCols}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData(selectedCanteen, selectedBlock, true)}
              tintColor={COLORS.red}
              colors={[COLORS.red]}
            />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<Footer />}
        />
      )}

      <ClaimModal
        visible={!!claimTarget}
        roomName={claimTarget?.number}
        onConfirm={handleClaimConfirm}
        onCancel={handleClaimCancel}
      />
      <Toast toast={toast} anim={toastAnim} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.black },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },

  // ── UTILITY BAR ─────────────────────────────────────────────────────────────
  utilityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.red,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  utilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    opacity: 0.9,
  },
  utilityText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  utilityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  utilityBtn: {
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  utilityBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  utilityDivider: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },

  // ── MAIN HEADER ─────────────────────────────────────────────────────────────
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
  },

  // Left column
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerContactIcon: {
    fontSize: 22,
  },
  headerContactText: {
    flexDirection: 'column',
  },
  headerContactLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerContactValue: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Center column — logo
  headerCenter: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 22,
  },
  logoTextWrap: {
    alignItems: 'flex-start',
  },
  logoTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 18,
  },
  logoSub: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 4,
    lineHeight: 15,
  },

  // Right column — CTA button
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  ctaBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 3,
  },
  ctaBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── NAV BAR ─────────────────────────────────────────────────────────────────
  navBar: {
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#2e2e2e',
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 6,
  },
  navItem: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navText: {
    color: '#b0b0b0',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  navTextActive: {
    color: COLORS.red,
    fontWeight: '700',
  },
  navUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: COLORS.red,
    borderRadius: 1,
  },

  // ── HERO BANNER ─────────────────────────────────────────────────────────────
  heroBanner: {
    height: isWeb ? 500 : 380,
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

  // Layered background — simulates the dark cinematic look
  heroBg1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#120000',
  },
  heroBg2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.red,
    opacity: 0.08,
    top: '30%',
    left: '40%',
    borderRadius: 9999,
    transform: [{ scaleX: 2 }],
  },
  heroBg3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a0a0a',
    top: 0,
    bottom: '40%',
  },
  // Left-to-right gradient scrim (layered dark veil)
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },

  // Decorative thin red lines
  heroAccentLine1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.red,
  },
  heroAccentLine2: {
    position: 'absolute',
    top: 3,
    left: 0,
    width: 80,
    height: 1,
    backgroundColor: COLORS.red,
    opacity: 0.5,
  },

  heroContent: {
    paddingHorizontal: 28,
    paddingBottom: isWeb ? 52 : 36,
    paddingTop: 24,
    maxWidth: isWeb ? 620 : '100%',
    zIndex: 2,
  },

  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  heroTagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },
  heroTagText: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  heroTitle: {
    color: '#ffffff',
    fontSize: isWeb ? 46 : 30,
    fontWeight: '900',
    letterSpacing: isWeb ? -1 : -0.5,
    lineHeight: isWeb ? 54 : 38,
    marginBottom: 14,
    textTransform: 'uppercase',
  },

  heroSub: {
    color: '#cccccc',
    fontSize: isWeb ? 16 : 14,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 480,
  },

  heroChips: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  heroChip: {
    borderWidth: 1.5,
    borderColor: COLORS.red,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 3,
    alignItems: 'center',
    backgroundColor: 'rgba(232,25,44,0.10)',
    minWidth: 70,
  },
  heroChipGold: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(240,165,0,0.10)',
  },
  heroChipNum: {
    color: COLORS.red,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  heroChipLabel: {
    color: '#888888',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
  },

  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.red,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 3,
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  heroBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // ── SEARCH BAR ──────────────────────────────────────────────────────────────
  searchOuter: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: COLORS.black,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  searchIcon: {
    fontSize: 15,
    lineHeight: 20,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '400',
    outlineStyle: 'none',   // web: removes blue outline
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  // ── SECTION HEADER ──────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: COLORS.black,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    backgroundColor: COLORS.red,
    borderRadius: 2,
  },
  sectionTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  countBadge: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  countBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  // ── LIST ────────────────────────────────────────────────────────────────────
  list: {
    paddingBottom: 48,
    backgroundColor: COLORS.black,
  },

  // ── LOADING / ERROR ─────────────────────────────────────────────────────────
  loadingText: {
    color: COLORS.textMuted,
    marginTop: 14,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  errEmoji: { fontSize: 42, marginBottom: 14 },
  errTitle: {
    color: COLORS.red,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  errMsg: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 3,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },

  // ── EMPTY STATE ─────────────────────────────────────────────────────────────
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── TOAST ───────────────────────────────────────────────────────────────────
  toast: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    zIndex: 999,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toastSuccess: {
    backgroundColor: '#0e2b0e',
    borderLeftColor: '#22c55e',
  },
  toastError: {
    backgroundColor: '#2b0d0d',
    borderLeftColor: COLORS.red,
  },
  toastText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
